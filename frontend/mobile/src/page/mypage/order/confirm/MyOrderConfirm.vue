<template>
	<div class="m_myconfirm">
		<p class="text_notice">
			<i class="ico_notice"></i><br>
			구매 확정 이후로는 <strong>반품 및 교환이 불가하므로<br> 상품을 받으신 후 진행</strong>해주세요
		</p>
		<!-- 구매확정상품 -->
		<div class="mm_order-item">
			<div class="mm_order-item-seller">
				<div class="mm_order...seller-head">
					<h5><i class="ico_shop"></i><b>{{ sellerName }}</b></h5>
				</div>
				<div class="mm_product-list T=sm">
					<ul>
						<li>
							<my-order-item :order-item="orderItem"></my-order-item>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="mm_inner">
			<p
				v-if="orderItem.earnable_point"
				class="text_point"
			>
				구매 확정 시 적립금 <strong>{{ number(orderItem.earnable_point) }}원 적립</strong>
			</p>
			<div class="mm_foot">
				<div class="mm_btn_box">
					<button
						type="button"
						class="mm_btn T=primary"
						@click="confirmOrderPurchase"
					>
						<b>확인</b>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyOrder } from '$/composables/useMyOrder';
	import MyOrderItem from '@/page/mypage/order/component/MyOrderItem.vue';

	const props = defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		sellerName: string;
		orderItem: OptionalOrderItem;
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `구매 확정`,
	});

	const { loading, bom } = useGlobalPageContext();
	const { number } = useFormatter();
	const { confirmPurchase } = useMyOrder();

	async function confirmOrderPurchase() {
		bom.confirm('구매 확정 시 배송완료 처리되며 되돌릴 수 없습니다. 구매 확정을 하시겠습니까?', async (flag) => {
			if (!flag) {
				return;
			}

			loading.show();
			try {
				await confirmPurchase(props.orderItem.id);
				props.closer();
			}
			catch (e) {
				useErrorAlert(e, {
					alertCallback: () => {
						props.closer();
					},
				});
			}
			finally {
				loading.hide();
			}
		});
	}
</script>