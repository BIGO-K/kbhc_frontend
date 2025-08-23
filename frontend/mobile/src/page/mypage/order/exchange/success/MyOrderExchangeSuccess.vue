<template>
	<layout
		title="교환 신청 완료"
		layout="popup"
	>
		<h3 class="mm_heading m_myclaim-title">
			<i class="ico_success"></i>
			<b>교환 신청이 완료되었습니다</b>
		</h3>

		<!-- 교환 상품 목록 -->
		<div class="mm_order-item">
			<div class="mm_order-item-seller">
				<div class="mm_order...seller-head">
					<p class="text_ship">
						<i class="ico_ship"></i>
						<span :class="{'text_price': exchangeOrderPack.paid_shipping_price > 0}">
							<strong>{{ exchangeOrderPack.paid_shipping_price === 0 ? '무료배송' : number(exchangeOrderPack.paid_shipping_price) }}</strong>
						</span>
					</p>
				</div>
				<div class="mm_product-list T=sm">
					<ul>
						<li
							v-for="orderItem in exchangeOrderPack.order_items"
							:key="orderItem.id"
						>
							<p class="text_seller">
								<i class="ico_shop"></i>{{ orderItem.seller_name }}
							</p>
							<my-order-item :order-item="orderItem"></my-order-item>
							<div class="mm_product-unit">
								<my-exchange-options :order-item="orderItem"></my-exchange-options>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="mm_inner">
			<div class="mm_foot">
				<div class="mm_btn_box">
					<div class="mm_flex T=equal">
						<a
							class="mm_btn T=support"
							href="#"
							@click.prevent="goMain()"
						>
							<b>메인으로 이동</b>
						</a>
						<mm-link
							class="mm_btn T=primary"
							:to="{ name: 'MyOrderExchange' }"
							replace
						>
							<b>교환내역 확인</b>
						</mm-link>
					</div>
				</div>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { useAppBridge } from '$/composables/useAppBridge';
	import { useFormatter } from '$/composables/useFormatter';
	import { useMyOrder } from '$/composables/useMyOrder';
	import Layout from '@/component/layout/Layout.vue';
	import MyExchangeOptions from '@/page/mypage/order/component/MyExchangeOptions.vue';
	import MyOrderItem from '@/page/mypage/order/component/MyOrderItem.vue';

	const props = defineProps<{
		orderId: string;
		exchangeId: string;
	}>();

	const { number } = useFormatter();
	const { getExchangeDetail } = useMyOrder();
	const { goMain } = useAppBridge();
	const exchangeOrderPack = (await getExchangeDetail(props.exchangeId, true)).pack;
</script>