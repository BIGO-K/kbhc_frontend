<template>
	<div class="m_mypresent">
		<div class="mm_inner">
			<!-- 주문목록 정렬 -->
			<div class="m_myorder-sort">
				<form-select
					v-model="filter.month"
				>
					<option
						v-for="month in [1,3,5,12]"
						:key="month"
					>
						{{ month < 12 ? `최근 ${month}개월` : '최근 1년' }}
					</option>
				</form-select>
				<form-select
					v-model="filter.statusCode"
				>
					<option value="review">
						주문상태 전체
					</option>
					<option
						v-for="status in statusCodes"
						:key="status.code"
						:value="status.code"
					>
						{{ status.label }}
					</option>
				</form-select>
			</div>
			<div class="mm_note T=bg">
				<ul>
					<li>선물을 보내 신 내역만 확인하실 수 있습니다.</li>
					<li>보내신 선물의 취소가 가능합니다.</li>
					<li>반품, 교환 신청은 선물을 받으신분만 진행 가능합니다.</li>
				</ul>
			</div>
		</div>

		<!-- 주문목록 -->
		<p
			v-if="normalOrders.length < 1"
			class="mm_text-none"
		>
			<i class="ico_text-none"></i>주문 내역이 없습니다
		</p>
		<div
			v-else
			class="mm_order-list"
		>
			<article
				v-for="order in normalOrders"
				:key="order.order_id"
				class="mm_order-item"
			>
				<h5>
					<b>{{ order.ordered_at }}</b>
					<strong>주문번호<b>{{ order.order_id }}</b></strong>
				</h5>
				<mm-link
					class="btn_detail"
					:to="{ name: 'MyOrderDetail', params: { id: order.order_id } }"
				>
					<b>주문상세</b><i class="ico_link"></i>
				</mm-link>

				<template
					v-for="pack in order.packs"
					:key="pack.shipping_rule_id"
				>
					<div
						v-for="seller in pack.sellers"
						:key="seller.id"
						class="mm_order-item-seller"
					>
						<div class="mm_order...seller-head">
							<h5><i class="ico_shop"></i><b>{{ seller.name }}</b></h5>
							<a
								href="#"
								@click.prevent="overlayMyInquirySellerCreate(order.order_id, seller)"
							>
								<b>판매자 문의하기</b>
								<i class="ico_link"></i>
							</a>
						</div>
						<div class="mm_product-list T=sm">
							<ul>
								<li
									v-for="orderItem in seller.order_items"
									:key="orderItem.id"
								>
									<div class="mm_product-item">
										<mm-link :to="{ name: 'ProductDetail', params: { id: orderItem.goods.id } }">
											<figure>
												<div class="mm_product-item-image">
													<lazyload
														class="mm_bg-cover image_product"
														:src="orderItem.goods.thumbnail_url"
													></lazyload>
												</div>
												<figcaption>
													<p class="text_status">
														{{ orderItem.order_status_label }}
													</p>
													<p class="text_brand">
														{{ orderItem.goods.brand_name }}
													</p>
													<p class="text_product">
														{{ orderItem.goods.name }}
													</p>
													<p class="text_price">
														<strong>{{ number(orderItem.paid_price + orderItem.point_used) }}</strong>
													</p>
													<p class="text_option">
														<!-- {{ `${optionText(orderItem.goods.option_name)} / 1개` }} -->
														{{ `${orderItem.goods.option_name} / 1개` }}
													</p>
												</figcaption>
											</figure>
										</mm-link>
									</div>
									<div
										v-if="orderItem.order_status_label != '구매 확정'"
										class="mm_product-unit"
									>
										<div class="mm_btn_box">
											<div class="mm_flex T=equal">
												<mm-link
													v-if="orderItem.cancelable"
													class="mm_btn T=xs T=line"
													:to="{
														name: 'MyOrderCancelCreate',
														params: { order_id: order.order_id, item_id: orderItem.id }
													}"
												>
													<b>주문취소</b>
												</mm-link>
											</div>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</template>

				<!-- 선물 메시지 -->
				<div class="m_mypresent-message">
					<strong><i class="ico_message"></i>선물 메시지</strong>
					<p>고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다.</p>
				</div>
			</article>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, defineAsyncComponent } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Lazyload from '@/component/Lazyload.vue';
	import FormSelect from '@/component/form/FormSelect.vue';

	const { number } = useFormatter();
	const { openOverlay } = useGlobalPageContext();

	/** 검색 필터 */
	const filter = ref<{
		statusCode: number | null;
		month: number;
	}>({
		statusCode: null,
		month: 1,
	});

	const orders: NormalStepOrder[] = [
		{
			'order_id': '20051411421512334562',
			'ordered_at': '2023.08.23',
			'packs': [
				{
					'shipping_rule_id': 1,
					'paid_shipping_price': 3000,
					'sellers': [
						{
							'id': 1,
							'name': 'M.Mon 엠몬스타',
							'tel': '01095214842',
							'order_items': [
								{
									'id': 374,
									'order_status_label': '결제 완료',
									'cancelable': true,
									'delivery_trackable': false,
									'receipt_confirmable': false,
									'returnable': false,
									'exchangeable': false,
									'purchase_confirmable': false,
									'review_writable': false,
									// 'review_written': false,
									'paid_price': 41800,
									'delivery_tracking_url': 'null',
									'goods': {
										'id': 2,
										'name': '드시온 귀리렌틸콩 곤약밥',
										'brand_name': '마이해빗',
										'thumbnail_url': 'https://img.kbhc.kr/kbhc_mall_shop/develop/goods/00/00/00/00/00/02/1.jpg?',
										'option_name': '(22% 할인) 귀리 렌탈콩 곤약밥 20개입 (+24000원) / -',
										'option_id': 4,
									},
									'earnable_point': 0,
									'point_used': 0,
								},
								{
									'id': 375,
									'order_status_label': '결제 완료',
									'cancelable': true,
									'delivery_trackable': true,
									'receipt_confirmable': true,
									'returnable': false,
									'exchangeable': false,
									'purchase_confirmable': false,
									'review_writable': false,
									// 'review_written': false,
									'paid_price': 41800,
									'delivery_tracking_url': 'asdf',
									'goods': {
										'id': 2,
										'name': '드시온 귀리렌틸콩 곤약밥',
										'brand_name': '마이해빗',
										'thumbnail_url': 'https://img.kbhc.kr/kbhc_mall_shop/develop/goods/00/00/00/00/00/02/1.jpg?',
										'option_name': '(22% 할인) 귀리 렌탈콩 곤약밥 20개입 (+24000원) / -',
										'option_id': 4,
									},
									'earnable_point': 0,
									'point_used': 0,
								},
								{
									'id': 376,
									'order_status_label': '배송 완료',
									'cancelable': true,
									'delivery_trackable': true,
									'receipt_confirmable': false,
									'returnable': true,
									'exchangeable': true,
									'purchase_confirmable': true,
									'review_writable': false,
									// 'review_written': false,
									'paid_price': 41800,
									'delivery_tracking_url': 'asdf',
									'goods': {
										'id': 2,
										'name': '드시온 귀리렌틸콩 곤약밥',
										'brand_name': '마이해빗',
										'thumbnail_url': 'https://img.kbhc.kr/kbhc_mall_shop/develop/goods/00/00/00/00/00/02/1.jpg?',
										'option_name': '(22% 할인) 귀리 렌탈콩 곤약밥 20개입 (+24000원) / -',
										'option_id': 4,
									},
									'earnable_point': 0,
									'point_used': 0,
								},
							],
						},
					],
				},
			],
		},
		{
			'order_id': '20051411421512334562',
			'ordered_at': '2023.08.23',
			'packs': [
				{
					'shipping_rule_id': 11,
					'paid_shipping_price': 3000,
					'sellers': [
						{
							'id': 2,
							'name': 'M.Mon 엠몬스타',
							'tel': '01095214842',
							'order_items': [
								{
									'id': 374,
									'order_status_label': '구매 확정',
									'cancelable': false,
									'delivery_trackable': false,
									'receipt_confirmable': false,
									'returnable': false,
									'exchangeable': false,
									'purchase_confirmable': false,
									'review_writable': false,
									// 'review_written': false,
									'paid_price': 41800,
									'delivery_tracking_url': 'null',
									'goods': {
										'id': 2,
										'name': '드시온 귀리렌틸콩 곤약밥',
										'brand_name': '마이해빗',
										'thumbnail_url': 'https://img.kbhc.kr/kbhc_mall_shop/develop/goods/00/00/00/00/00/02/1.jpg?',
										'option_name': '(22% 할인) 귀리 렌탈콩 곤약밥 20개입 (+24000원) / -',
										'option_id': 4,
									},
									'earnable_point': 0,
									'point_used': 0,
								},
							],
						},
						{
							'id': 3,
							'name': 'M.Mon 엠몬스타',
							'tel': '01095214842',
							'order_items': [
								{
									'id': 376,
									'order_status_label': '구매 확정',
									'cancelable': false,
									'delivery_trackable': true,
									'receipt_confirmable': false,
									'returnable': true,
									'exchangeable': true,
									'purchase_confirmable': true,
									'review_writable': false,
									// 'review_written': false,
									'paid_price': 41800,
									'delivery_tracking_url': 'asdf',
									'goods': {
										'id': 2,
										'name': '드시온 귀리렌틸콩 곤약밥',
										'brand_name': '마이해빗',
										'thumbnail_url': 'https://img.kbhc.kr/kbhc_mall_shop/develop/goods/00/00/00/00/00/02/1.jpg?',
										'option_name': '(22% 할인) 귀리 렌탈콩 곤약밥 20개입 (+24000원) / -',
										'option_id': 4,
									},
									'earnable_point': 0,
									'point_used': 0,
								},
							],
						},
					],
				},
			],
		},
	];
	const normalOrders = ref<NormalStepOrder[]>(orders);
	const statusCodes: OrderState[] = [
		{
			'code': 200,
			'label': '입금 대기',
			'need_review_guide': false,
		},
		{
			'code': 210,
			'label': '결제 완료',
			'need_review_guide': false,
		},
		{
			'code': 230,
			'label': '배송 준비 중',
			'need_review_guide': false,
		},
		{
			'code': 240,
			'label': '배송 중',
			'need_review_guide': true,
		},
		{
			'code': 280,
			'label': '배송 완료',
			'need_review_guide': true,
		},
		{
			'code': 900,
			'label': '구매 확정',
			'need_review_guide': false,
		},
	];

	function overlayMyInquirySellerCreate(orderId: string, seller: QnaSeller) {
		const component = defineAsyncComponent(() => import('@/page/mypage/inquiry/seller/create/MyInquirySellerCreate.vue'));

		return openOverlay(component, {
			props: {
				orderId,
				seller: {
					id: seller.id,
					name: seller.name,
					tel: seller.tel,
				},
			},
		});
	}
</script>