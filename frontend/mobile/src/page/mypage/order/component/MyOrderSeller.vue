<template>
	<div
		class="mm_order-item-seller"
	>
		<div class="mm_order...seller-head">
			<h5><i class="ico_shop"></i><b>{{ seller.name }}</b></h5>
			<button
				type="button"
				@click="_e => overlayMyInquirySellerCreate(_e, orderId, seller)"
			>
				<b>판매자 문의하기</b><i class="ico_link"></i>
			</button>
		</div>
		<div class="mm_product-list T=sm">
			<ul>
				<li
					v-for="orderItem in seller.order_items"
					:key="orderItem.id"
				>
					<my-order-item :order-item="orderItem"></my-order-item>
					<div
						v-if="isShowItemUnit(orderItem)"
						class="mm_product-unit"
					>
						<p
							v-if="orderItem.exchanged_option_name"
							class="text_changed"
						>
							<strong class="mm_text-variable">변경된 옵션</strong>
							<span>{{ `${optionText(orderItem.exchanged_option_name)} / 1개` }}</span>
						</p>
						<!-- 변경 옵션 존재하는경우엔 버튼이 존재할때만 .mm_btn_box 영역 노출 -->
						<div
							v-if="isShowButtonBox(orderItem)"
							class="mm_btn_box"
						>
							<div class="mm_flex T=equal">
								<mm-link
									v-if="orderItem.cancelable"
									class="mm_btn T=xs T=line"
									:to="{
										name: 'MyOrderCancelCreate',
										params: { order_id: orderId, item_id: orderItem.id }
									}"
								>
									<b>주문취소</b>
								</mm-link>
								<my-order-receipt-confirm-button
									v-if="orderItem.receipt_confirmable"
									:order-item-id="orderItem.id"
									@on-success="emit('refresh')"
								></my-order-receipt-confirm-button>
								<mm-link
									v-if="orderItem.exchangeable"
									class="mm_btn T=xs T=line"
									:to="{
										name: 'MyOrderExchangeCreate',
										params: { order_id: orderId, item_id: orderItem.id }
									}"
								>
									<b>교환신청</b>
								</mm-link>
								<mm-link
									v-if="orderItem.returnable"
									class="mm_btn T=xs T=line"
									:to="{
										name: 'MyOrderReturnCreate',
										params: { order_id: orderId, item_id: orderItem.id }
									}"
								>
									<b>반품신청</b>
								</mm-link>
								<!-- 바우처 -->

								<template v-if="orderItem.voucher_code">
									<my-order-voucher-code-button
										v-if="
											showVoucherCode
												&& !orderItem.is_intangible_product_expired
												&& !orderItem.is_intangible_product_used
										"
										:voucher-code="orderItem.voucher_code"
									></my-order-voucher-code-button>
									<button
										v-else-if="showVoucherRefund && (orderItem.review_writable || orderItem.review_wrote)"
										type="button"
										class="mm_btn T=xs T=line"
										@click="modalOrderVoucherDetail"
									>
										<b>반품 정보</b>
									</button>
								</template>
								<button
									v-if="orderItem.delivery_trackable && orderItem.delivery_tracking_url"
									class="mm_btn T=xs T=support"
									type="button"
									@click="_e => overlayDeliveryTracking(_e, orderItem.delivery_tracking_url || '')"
								>
									<b>배송조회</b>
								</button>
								<my-order-purchase-confirm-button
									v-if="orderItem.purchase_confirmable"
									v-bind="{
										sellerName: seller.name,
										orderItem,
									}"
									@on-success="emit('refresh')"
								></my-order-purchase-confirm-button>
								<my-order-review-write-button
									v-if="orderItem.review_writable"
									v-bind="{
										orderId,
										orderItems: seller.order_items,
									}"
									@on-success="emit('refresh')"
								></my-order-review-write-button>
								<mm-link
									v-if="orderItem.review_wrote"
									class="mm_btn T=xs T=light"
									:to="{ name: 'MyReviewCompleted' }"
								>
									<b>작성한 리뷰 보기</b>
								</mm-link>
								<my-order-return-cancel-button
									v-if="orderItem.return_cancelable && (orderItem.return_id || returnId) && orderItem.return_target_id"
									v-bind="{
										returnId: orderItem.return_id || returnId,
										returnTargetId: orderItem.return_target_id
									}"
									@on-success="emit('refresh')"
								></my-order-return-cancel-button>
								<mm-link
									v-if="orderItem.to_return_switchable && (orderItem.exchange_id || exchangeId) && orderItem.exchange_target_id"
									class="mm_btn T=xs T=line"
									:to="{
										name: 'MyOrderToReturnCreate',
										params: {
											exchange_id: orderItem.exchange_id || exchangeId,
											exchange_target_id: orderItem.exchange_target_id,
										}
									}"
								>
									<b>반품전환</b>
								</mm-link>
								<my-order-exchange-cancel-button
									v-if="orderItem.exchange_cancelable && (orderItem.exchange_id || exchangeId) && orderItem.exchange_target_id"
									v-bind="{
										exchangeId: orderItem.exchange_id || exchangeId,
										exchangeTargetId: orderItem.exchange_target_id
									}"
									@on-success="emit('refresh')"
								></my-order-exchange-cancel-button>
								<a
									v-if="orderItem.return_delivery_trackable && orderItem.return_delivery_tracking_url"
									class="mm_btn T=xs T=support"
									href="#"
									@click.prevent="_e => overlayDeliveryTracking(_e, orderItem.return_delivery_tracking_url || '')"
								>
									<b>반송조회</b>
								</a>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script setup lang="ts">
	import { defineAsyncComponent } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import MyOrderItem from '@/page/mypage/order/component/MyOrderItem.vue';
	import MyOrderExchangeCancelButton from '@/page/mypage/order/component/button/MyOrderExchangeCancelButton.vue';
	import MyOrderPurchaseConfirmButton from '@/page/mypage/order/component/button/MyOrderPurchaseConfirmButton.vue';
	import MyOrderReceiptConfirmButton from '@/page/mypage/order/component/button/MyOrderReceiptConfirmButton.vue';
	import MyOrderReturnCancelButton from '@/page/mypage/order/component/button/MyOrderReturnCancelButton.vue';
	import MyOrderReviewWriteButton from '@/page/mypage/order/component/button/MyOrderReviewWriteButton.vue';
	import MyOrderVoucherCodeButton from '@/page/mypage/order/component/button/MyOrderVoucherCodeButton.vue';

	const props = withDefaults(defineProps<{
		orderId: string;
		seller: OrderSellerPack<OptionalOrderItem>['sellers'][number];
		returnId?: string;
		exchangeId?: string;
		/** 바우처 코드 버튼 영역 노출여부 */
		showVoucherCode?: boolean;
		/**
		 * 바우처 반품정보 버튼 영역 노출여부
		 * 패키지상품 >> 배송완료,구매확정 바우처의 경우 노출
		 */
		showVoucherRefund?: boolean;
	}>(), {
		showVoucherCode: false,
		showVoucherRefund: false,
		returnId: '',
		exchangeId: '',
	});

	const emit = defineEmits<(e: 'refresh') => void>();

	const { openOverlay, openModal } = useGlobalPageContext();
	const { optionText } = useFormatter();

	const isShowButtonBox = (orderItem: OptionalOrderItem) => {
		if (!orderItem.exchanged_option_name) return true;

		const hasExchangeStepButton = orderItem.to_return_switchable || orderItem.exchange_cancelable || orderItem.return_delivery_trackable;

		return orderItem.exchanged_option_name && hasExchangeStepButton;
	};

	const isShowItemUnit = (orderItem: OptionalOrderItem) => {
		return orderItem.cancelable
			|| orderItem.receipt_confirmable
			|| orderItem.exchangeable
			|| orderItem.returnable
			||
			(
				orderItem.voucher_code
				&& (
					(props.showVoucherCode && !orderItem.is_intangible_product_expired && !orderItem.is_intangible_product_used)
					|| (props.showVoucherRefund && (orderItem.is_intangible_product_expired || orderItem.is_intangible_product_used))
				)
			)
			|| (orderItem.delivery_tracking_url && orderItem.delivery_trackable)
			|| orderItem.purchase_confirmable
			|| orderItem.review_writable
			|| orderItem.review_wrote
			|| orderItem.return_cancelable
			|| orderItem.to_return_switchable
			|| (orderItem.return_delivery_tracking_url && orderItem.return_delivery_trackable)
			|| orderItem.exchange_cancelable
			|| orderItem.exchanged_option_name;
	};

	const overlayMyInquirySellerCreate = (_e: MouseEvent, orderId: string, seller: QnaSeller) => {
		openOverlay(defineAsyncComponent(() => import('@/page/mypage/inquiry/seller/create/MyInquirySellerCreate.vue')), {
			props: {
				orderId,
				seller: {
					id: seller.id,
					name: seller.name,
					tel: seller.tel,
				},
			},
			clickElement: _e.currentTarget,
		});
	};

	/** 배송추적 overlay OPEN */
	const overlayDeliveryTracking = (_e: MouseEvent, trackingUrl: string) => {
		openOverlay(defineAsyncComponent(() => import('@/component/ExternalOverlay.vue')), {
			props: {
				title: '배송추적',
				src: trackingUrl,
			},
			clickElement: _e.currentTarget,
		});
	};

	const modalOrderVoucherDetail = (_e: MouseEvent) => {
		openModal(defineAsyncComponent(() => import('@/page/mypage/order/voucher/detail/OrderVoucherDetail.vue')), {
			props: {
				sellerName: props.seller.name,
				sellerTel: props.seller.tel,
			},
			clickElement: _e.currentTarget,
		});
	};
</script>