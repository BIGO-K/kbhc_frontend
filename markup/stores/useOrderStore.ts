import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import { useAuthStore } from '$/stores/useAuthStore';
import { uuid } from '$/utils/string';
import { useBackend } from '$/composables/useBackend';
import { useGlobalPageContext } from '$/composables/useGlobalPageContext';

export const useOrderStore = defineStore('order', () => {
	const authStore = useAuthStore();
	const router = useRouter();
	const { bom, loading } = useGlobalPageContext();

	const temporarySelected = ref<SelectedForOrder[]>([]);
	const processes = ref<OrderProcess[]>([]);

	/** 가주문 생성 */
	const generateOrderId = async (selected: SelectedForOrder[]) => {
		temporarySelected.value = selected;
		const { order_id } = await useBackend().command<{
			order_id: string;
		}>('v1/orders', {
			method: 'post',
			data: {
				goods_options: selected,
			},
		});

		processes.value = processes.value
			.filter(process => process.order_id !== order_id)
			.concat({ order_id, selected });

		return order_id;
	};

	const startOrder = async () => {
		if (!authStore.member) {
			authStore.guest = null;
			authStore.guestToken = null;
		}
		const tempOrderId = await generateOrderId(temporarySelected.value);
		router.replace({
			name: authStore.member ? 'Order' : 'OrderGuest',
			params: {
				id: tempOrderId,
			},
		});
	};

	return {
		temporarySelected,
		processes,
		generateOrderId,
		/** 주문서 조회 */
		getSheet: async (orderId: string): Promise<OrderSheet> => {
			const sheet = await useBackend().command<OrderSheet>(`v1/orders/${orderId}`);
			sheet.packs = sheet.packs.map(pack => {
				pack.items = pack.items.map(packItem => {
					packItem.uuid = uuid();

					// XXX 타입 오류로 base_discounted_price, sell_price 추가 - 검증 후 삭제
					packItem.goods = {
						id: packItem.goods_id,
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
		},
		getResult: async (orderId: string) => {
			const sheet = await useBackend().command<OrderResult>(`v1/orders/${orderId}/result`);
			sheet.packs = sheet.packs.map(pack => {
				const packUuid = uuid();

				pack.items = pack.items.map(packItem => {
					packItem.uuid = uuid();

					packItem.goods = {
						id: packItem.goods_id,
						headline: packItem.goods_headline,
						brand_name: packItem.brand_name,
						name: packItem.goods_name,
						thumbnail_url: packItem.goods_thumbnail_url,
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
				console.log(e);
			}
			finally {
				loading.hide();
			}
		},
	};
}, {
	persist: {
		storage: sessionStorage,
	},
});