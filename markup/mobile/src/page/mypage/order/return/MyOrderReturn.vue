<template>
	<div class="mm_inner">
		<!-- 주문목록 정렬 -->
		<div class="m_myorder-sort">
			<form-select
				v-model="sortRange"
			>
				<option>최근 1개월</option>
			</form-select>
		</div>
	</div>

	<!-- 주문목록 -->
	<p
		v-if="returnOrders.length < 1"
		class="mm_text-none"
	>
		<i class="ico_text-none"></i>반품 내역이 없습니다
	</p>

	<div
		v-else
		class="mm_order-list"
	>
		<article
			v-for="order in returnOrders"
			:key="order.order_id"
			class="mm_order-item"
		>
			<h5>
				<b>{{ order.ordered_at }}</b>
				<strong>주문번호<b>{{ order.order_id }}</b></strong>
			</h5>
			<mm-link
				class="btn_detail"
				:to="{ name: 'MyOrderDetail', params: { id: 123 } }"
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
							@click.prevent="overlayMyInquirySellerCreate"
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
									<mm-link :to="{ name: 'ProductDetail', params: { id: orderItem.id } }">
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
													{{ `${orderItem.goods.option_name} / 1개` }}
												</p>
											</figcaption>
										</figure>
									</mm-link>
								</div>
								<div class="mm_product-unit">
									<div class="mm_btn_box">
										<div class="mm_flex T=equal">
											<button
												v-if="orderItem.return_cancelable"
												type="button"
												class="mm_btn T=xs T=line"
											>
												<b>반품철회</b>
											</button>
											<mm-link
												v-if="orderItem.return_delivery_trackable"
												class="mm_btn T=xs T=support"
												to="http://"
											>
												<b>반송조회</b>
											</mm-link>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</template>
		</article>
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

	function overlayMyInquirySellerCreate() {
		const component = defineAsyncComponent(() => import('@/page/mypage/inquiry/seller/create/MyInquirySellerCreate.vue'));

		return openOverlay(component);
	}

	const sortRange = ref('');
	const returnOrdersData: ReturnStepOrder[] = [
		{
			'order_id': '20051411421512334562',
			'return_id': '1239829',
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
									'return_target_id': 2221,
									'order_status_label': '반품 신청',
									'return_cancelable': true,
									'return_delivery_trackable': false,
									'return_delivery_tracking_url': '',
									'paid_price': 41800,
									'goods': {
										'id': 2,
										'name': '드시온 귀리렌틸콩 곤약밥',
										'brand_name': '마이해빗',
										'thumbnail_url': 'https://img.kbhc.kr/kbhc_mall_shop/develop/goods/00/00/00/00/00/02/1.jpg?',
										'option_name': '(22% 할인) 귀리 렌탈콩 곤약밥 20개입 (+24000원) / -',
										'option_id': 4,
									},
									'point_used': 0,
								},
							],
						},
					],
				},
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
									'return_target_id': 2221,
									'order_status_label': '반품 신청',
									'return_cancelable': true,
									'return_delivery_trackable': true,
									'return_delivery_tracking_url': '',
									'paid_price': 41800,
									'goods': {
										'id': 2,
										'name': '드시온 귀리렌틸콩 곤약밥',
										'brand_name': '마이해빗',
										'thumbnail_url': 'https://img.kbhc.kr/kbhc_mall_shop/develop/goods/00/00/00/00/00/02/1.jpg?',
										'option_name': '(22% 할인) 귀리 렌탈콩 곤약밥 20개입 (+24000원) / -',
										'option_id': 4,
									},
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
			'return_id': '1239829',
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
									'return_target_id': 2221,
									'order_status_label': '반품 완료',
									'return_cancelable': false,
									'return_delivery_trackable': true,
									'return_delivery_tracking_url': '',
									'paid_price': 41800,
									'goods': {
										'id': 2,
										'name': '드시온 귀리렌틸콩 곤약밥',
										'brand_name': '마이해빗',
										'thumbnail_url': 'https://img.kbhc.kr/kbhc_mall_shop/develop/goods/00/00/00/00/00/02/1.jpg?',
										'option_name': '(22% 할인) 귀리 렌탈콩 곤약밥 20개입 (+24000원) / -',
										'option_id': 4,
									},
									'point_used': 0,
								},
							],
						},
					],
				},
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
									'return_target_id': 2221,
									'order_status_label': '반품 완료',
									'return_cancelable': false,
									'return_delivery_trackable': true,
									'return_delivery_tracking_url': '',
									'paid_price': 41800,
									'goods': {
										'id': 2,
										'name': '드시온 귀리렌틸콩 곤약밥',
										'brand_name': '마이해빗',
										'thumbnail_url': 'https://img.kbhc.kr/kbhc_mall_shop/develop/goods/00/00/00/00/00/02/1.jpg?',
										'option_name': '(22% 할인) 귀리 렌탈콩 곤약밥 20개입 (+24000원) / -',
										'option_id': 4,
									},
									'point_used': 0,
								},
							],
						},
					],
				},
			],
		},
	];

	const returnOrders = ref<ReturnStepOrder[]>(returnOrdersData);
</script>