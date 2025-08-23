import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import { usePageContextStore } from '$/stores/usePageContextStore';
import { defined } from '$/utils/array';
import { uuid } from '$/utils/string';
import { useBackend } from '$/composables/useBackend';
import { useCart } from '$/composables/useCart';
import { useErrorAlert } from '$/composables/useErrorAlert';
import { useGlobalPageContext } from '$/composables/useGlobalPageContext';

export const useOrderStore = defineStore('order', () => {
	const router = useRouter();
	const pageContextStore = usePageContextStore();
	const { bom, loading } = useGlobalPageContext();
	const orderBeforePage = ref<string | null>(null);

	const temporarySelected = ref<{
		is_for_gift: boolean;
		selected: SelectedForOrder[];
	}[]>([]);
	const processes = ref<OrderProcess[]>([]);

	/** 가주문 생성 */
	const generateOrderId = async (selected: SelectedForOrder[], for_gift: boolean = false) => {
		orderBeforePage.value = `${location.origin}${router.currentRoute.value.fullPath}`;
		temporarySelected.value = [{
			is_for_gift: for_gift,
			selected: selected,
		}];
		const { order_id } = await useBackend().command<{
			order_id: string;
		}>('v1/orders', {
			method: 'post',
			data: {
				goods_options: selected,
				for_gift: for_gift,
			},
		});

		processes.value = processes.value
			.filter(process => process.order_id !== order_id)
			.concat({ order_id, selected });

		return order_id;
	};

	const startOrder = async () => {
		const currentOrderItem = temporarySelected.value[0];
		const tempOrderId = await generateOrderId(currentOrderItem.selected, currentOrderItem.is_for_gift);
		router.replace({
			name: 'Order',
			params: {
				id: tempOrderId,
			},
		});
	};

	return {
		temporarySelected,
		processes,
		generateOrderId,
		orderBeforePage,
		/** 주문서 조회 */
		getSheet: async (orderId: string): Promise<OrderSheet> => {
			try {
				const sheet = await useBackend().command<OrderSheet>(`v1/orders/${orderId}`);
				sheet.packs = sheet.packs.map(pack => {
					pack.items = pack.items.map(packItem => {
						packItem.uuid = uuid();
						packItem.goods = {
							id: packItem.goods_id,
							bundle_goods_id: packItem.bundle_goods_id,
							price: packItem.goods_list_price,
							headline: packItem.goods_headline,
							brand_name: packItem.brand_name,
							name: packItem.goods_name,
							thumbnail_url: packItem.goods_thumbnail_url,
							base_discounted_price: packItem.goods_base_discounted_price,
							sell_price: packItem.goods_sell_price,
						};

						packItem.option = {
							id: packItem.option_id,
							name: packItem.option_name.replace('/', ''),
							extra_amount: packItem.option_extra_amount,
						};

						return packItem;
					});

					const groupedItems = pack.items.reduce((grouped: Record<string, OrderSheetPackItem[]>, orderItem) => {
						const key = `${orderId}_${uuid()}_${orderItem.seller_id}_${orderItem.goods.id}_${orderItem.option_id}`;
						if (!grouped[key]) grouped[key] = [];
						grouped[key].push(orderItem);

						return grouped;
					}, {});

					pack.mergedOrderItems = Object.entries(groupedItems).map(([key, orderItems]) => ({
						key,
						seller_name: orderItems[0].seller_name,
						usable_coupon_regists: [...orderItems[0].usable_coupon_regists],
						goods: orderItems[0].goods,
						option: orderItems[0].option,
						ea: orderItems.length,
						list: orderItems,
					}));

					return pack;
				});

				return sheet;
			}
			catch (e) {
				useErrorAlert(e, {
					httpCatcher: {
						500: '주문서 생성에 실패 하였습니다.\n 재시도 부탁드립니다.',
					},
					alertCallback: () => {
						pageContextStore.clearErrorWithHistoryBack();
					},
				});
				throw (e);
			}

		},
		getResult: async (orderId: string) => {
			const sheet = await useBackend().command<OrderResult>(`v1/orders/${orderId}/result`);
			sheet.packs = sheet.packs.map(pack => {
				const packUuid = uuid();

				pack.items = pack.items.map(packItem => {
					packItem.uuid = uuid();
					packItem.goods = {
						bundle_goods_id: null,
						id: packItem.goods_id,
						headline: packItem.goods_headline,
						brand_name: packItem.brand_name,
						name: packItem.goods_name,
						thumbnail_url: packItem.goods_thumbnail_url,
						price: packItem.goods_list_price,
						sell_price: packItem.goods_sell_price,
						base_discounted_price: packItem.goods_base_discounted_price,
					};

					packItem.option = {
						id: packItem.option_id,
						name: packItem.option_name.replace('/', ''),
						extra_amount: packItem.option_extra_amount,
					};

					return packItem;
				});

				const groupedItems = pack.items.reduce((grouped: Record<string, OrderSheetPackItem[]>, orderItem) => {
					const key = `${orderId}_${packUuid}_${orderItem.goods.id}_${orderItem.option_id}`;
					if (!grouped[key]) {
						grouped[key] = [orderItem];
					}
					else {
						grouped[key].push(orderItem);
					}

					return grouped;
				}, {});

				pack.mergedOrderItems = Object.entries(groupedItems).map(([key, orderItems]) => {
					return {
						key,
						seller_name: orderItems[0].seller_name,
						goods: orderItems[0].goods,
						option: orderItems[0].option,
						ea: orderItems.length,
						list: orderItems,
					};
				});

				return pack;
			});

			return sheet;
		},
		getPayingUrl: async (orderId: string, form: OrderPrePareForm, redirectUrl?: string): Promise<string> => {
			const { paying_url } = await useBackend().command<{
				paying_url: string;
			}>(`v1/orders/payments/${orderId}/prepare`, {
				method: 'post',
				data: {
					orderer_info: form.orderer_info,
					receive_address: form.receive_address,
					payment_info: form.payment_info,
					packs: form.packs,
					refund_account: form.refund_account,
					giveaways: form.giveaways,
					my_pay_virtual_id: null,
					fe_redirect_url: redirectUrl,
					gift_info: form.gift_info,
				},
			});

			return paying_url;
		},
		moveToOrderPage: () => {
			loading.show();

			try {
				if (temporarySelected.value.length < 1) {
					return bom.alert('주문정보가 없습니다.\n 메인으로 이동됩니다', () => {
						router.replace({
							name: 'Main',
						});
					});
				}

				startOrder();
			}
			catch (e) {
				// console.log(e);
			}
			finally {
				loading.hide();
			}
		},
		orderFinish: async (orderId: string, isSuccess: boolean) => {
			if (isSuccess && processes.value.length > 0) {
				const currentOrder = processes.value.find(process => process.order_id === orderId);

				if (!currentOrder) {
					return;
				}

				const cartIds = currentOrder.selected.filter(selected => selected.cart_id !== undefined).map(item => item.cart_id).filter(defined);
				if (cartIds.length > 0) {
					const cart = useCart();
					cart.removeByIds(cartIds);
				}
			}

			processes.value = processes.value.filter(processes => processes.order_id !== orderId);
		},
	};
}, {
	persist: {
		storage: sessionStorage,
	},
});