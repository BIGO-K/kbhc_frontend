<template>
	<layout
		title="취소 완료"
		layout="popup"
	>
		<div class="m_myclaim-cancel-success">
			<h3 class="mm_heading m_myclaim-title">
				<i class="ico_success"></i>
				<b>{{ containApplyStatus ? '주문 취소 신청이' : '주문 취소가' }} 완료되었습니다</b>
			</h3>

			<!-- 취소 상품 목록 -->
			<div
				v-if="canceledOrderPacks.length"
				class="mm_order-item"
			>
				<form-check
					v-model="checkedAll"
					:disabled="orderItemIds.length < 1"
					label="전체선택"
				></form-check>
				<div
					v-for="pack in canceledOrderPacks"
					:key="pack.shipping_rule_id"
					class="mm_order-item-seller"
				>
					<div class="mm_order...seller-head">
						<p class="text_ship">
							<i class="ico_ship"></i>
							<span :class="{'text_price': pack.paid_shipping_price > 0}">
								<strong>{{ pack.paid_shipping_price === 0 ? '무료배송' : number(pack.paid_shipping_price) }}</strong>
							</span>
						</p>
					</div>
					<div class="mm_product-list T=sm">
						<ul>
							<li
								v-for="orderItem in pack.order_items"
								:key="orderItem.id"
							>
								<form-check
									v-if="orderItem.items.length"
									v-model="selected"
									:disabled="orderItem.goods.is_soldout"
									:value="orderItem.id"
									label="상품 선택"
									label-on-blind
								></form-check>
								<p class="text_seller">
									<i class="ico_shop"></i>{{ orderItem.seller_name }}
								</p>
								<my-order-item :order-item="orderItem"></my-order-item>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="mm_inner">
				<div class="mm_note T=bg">
					<ul>
						<li>노출되는 가격 및 옵션은 현재와 다를 수 있습니다.</li>
						<li>품절 등 장바구니에 담을 수 없는 상품은 체크하실 수 없습니다.</li>
						<li>취소 수량과 별개로 장바구니에는 1개의 수량만 담깁니다.</li>
					</ul>
				</div>
			</div>
			<div
				ref="$btnFooter"
				class="m_myclaim-foot"
				:class="classStickyOff"
			>
				<div class="mm_btn_box">
					<div class="mm_flex T=equal">
						<mm-link
							class="mm_btn T=support"
							:to="{ name: 'MyOrderCancel' }"
							replace
						>
							<b>취소내역 확인</b>
						</mm-link>
						<button
							type="button"
							class="mm_btn T=primary"
							@click="addToCart"
						>
							<b>장바구니 담기</b>
						</button>
					</div>
				</div>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted, watch } from 'vue';
	import { useScroll } from '@vueuse/core';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyOrder } from '$/composables/useMyOrder';
	import { usePageScroller } from '$/composables/usePageScroller';
	import Layout from '@/component/layout/Layout.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import MyOrderItem from '@/page/mypage/order/component/MyOrderItem.vue';

	const props = defineProps<{
		orderId: string;
		cancelIds: string[];
	}>();

	const { number } = useFormatter();
	const { bom, loading, router } = useGlobalPageContext();
	const { getCancelDetail, addCart } = useMyOrder();
	const { getScroller } = usePageScroller();

	const canceledOrderPacks = ref<CancelOrderDetailSet['packs']>([]);
	/** 취소 신청 포함 여부 */
	const containApplyStatus = ref(false);
	// 상품ID_옵션ID 리스트
	const orderItemIds = computed<number[]>(() => {
		const itemIds: number[] = [];
		canceledOrderPacks.value.forEach(pack => {
			pack.order_items.forEach(set => {
				if (!set.goods.is_soldout) {
					itemIds.push(set.id);
				}
			});
		});

		return itemIds;
	});
	const selected = ref<number[]>([]);
	const checkedAll = computed({
		get: () => orderItemIds.value.length > 0 && orderItemIds.value.length == selected.value.length,
		set: (val: boolean) => selected.value = val ? orderItemIds.value : [],
	});

	const $scroller = ref<HTMLElement | null>();
	const $btnFooter = ref<HTMLElement | null>(null);
	const { y } = useScroll($scroller, { behavior: 'auto' });
	const classStickyOff = ref('');


	/** 장바구니 담기 */
	async function addToCart() {
		if (selected.value.length < 1) {
			return bom.alert('상품을 선택해주세요.');
		}

		loading.show();
		try {
			await addCart(selected.value);

			bom.confirm(
				'선택하신 상품을 장바구니에 담았습니다.\n장바구니로 이동하시겠습니까?',
				(flag: boolean) => {
					if (flag) {
						router.replace({
							name: 'Cart',
						});
					}
				},
				{
					okLabel: '장바구니 가기',
					cancelLabel: '쇼핑 계속하기',
				}
			);
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {

			loading.hide();
		}
	}

	props.cancelIds.forEach(async (cancelId) => {
		const cancelDetail = await getCancelDetail(cancelId, true);
		canceledOrderPacks.value = canceledOrderPacks.value.concat(cancelDetail.packs);
		containApplyStatus.value = containApplyStatus.value || cancelDetail.is_contain_apply_status;
	});

	watch(y, () => {
		if (!$btnFooter.value) return;

		const btnFooterPositionTop = $btnFooter.value.getBoundingClientRect().top || 0;
		if (window.innerHeight - (btnFooterPositionTop + $btnFooter.value.offsetHeight) >= 0) classStickyOff.value = 'S=sticky-off';
		else classStickyOff.value = '';

	});

	onMounted(() => {
		$scroller.value = getScroller() as HTMLElement;
	});
</script>