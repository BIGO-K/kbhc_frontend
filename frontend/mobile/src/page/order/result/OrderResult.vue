<template>
	<layout
		:title="isOrderSuccess ? '주문완료' : '주문실패'"
		layout="popup"
	>
		<div class="m_order-fin">
			<template v-if="isOrderSuccess && orderResult">
				<div class="mm_inner">
					<h3 class="mm_title">
						<i class="ico_success"></i>
						<b v-if="isPresent">{{ orderResult.receive_address.name }}님에게 보내는<br>선물 주문이 완료되었습니다</b>
						<b v-else>주문이 완료되었습니다</b>
					</h3>
					<p>주문번호: {{ orderId }}</p>
					<div class="mm_btn_box">
						<div class="mm_flex T=equal">
							<mm-link
								class="mm_btn T=support"
								:to="{ name: orderResult.gift_info ? 'PresentMySent' : 'MyOrder' }"
							>
								<b>구매내역 보기</b>
							</mm-link>

							<button
								class="mm_btn T=primary"
								type="button"
								@click="closeCurrentWebview"
							>
								<b>쇼핑 홈 가기</b>
							</button>
						</div>
					</div>
				</div>

				<!-- 주문 상품 -->
				<div class="mm_order-item">
					<div
						v-for="pack, packIndex in orderResult.packs"
						:key="`${packIndex}`"
						class="mm_order-item-seller"
					>
						<div class="mm_order...seller-head">
							<p class="text_ship">
								<i class="ico_ship"></i>
								<span v-if="pack.shipping_price === 0">무료배송</span>
								<span
									v-else
									class="text_price"
								>
									<strong>{{ number(pack.shipping_price) }}</strong>
								</span>
							</p>
						</div>
						<div class="mm_product-list T=sm">
							<ul>
								<li
									v-for="item,index in pack.mergedOrderItems"
									:key="index"
								>
									<p class="text_seller">
										<i class="ico_shop"></i>{{ item.seller_name }}
									</p>
									<div class="mm_product-item">
										<a>
											<figure>
												<div class="mm_product-item-image">
													<lazyload
														class="mm_bg-cover image_product"
														:src="item.goods.thumbnail_url"
													></lazyload>
												</div>
												<figcaption>
													<p class="text_brand">{{ item.goods.brand_name }}</p>
													<p class="text_product">{{ item.goods.name }}</p>
													<p class="text_price">
														<del v-if="item.goods.price > item.goods.base_discounted_price"><span>{{ number(item.goods.price) }}</span></del>
														<strong>{{ number(groupItemsSummary[packIndex][index].paidPrice) }}</strong>
													</p>
													<p class="text_option">{{ item.option.name }} / {{ item.ea }}개</p>
												</figcaption>
											</figure>
										</a>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<hr class="mm_line">

				<!-- 배송지 정보 -->
				<template v-if="!isPresent && isAddressNeedShow">
					<section>
						<div class="mm_inner">
							<h4 class="mm_strapline">
								<b>배송지 정보</b>
							</h4>
							<div class="mm_order-info">
								<table>
									<tbody>
										<tr>
											<th scope="row">
												<b>배송지명</b>
											</th>
											<td>{{ orderResult.receive_address.shipping_name }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>받는 사람</b>
											</th>
											<td>{{ orderResult.receive_address.name }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>휴대폰 번호</b>
											</th>
											<td>{{ orderResult.receive_address.phone }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>주소</b>
											</th>
											<td>{{ orderResult.receive_address.zip_code }}<br>{{ orderResult.receive_address.base_address }}  {{ orderResult.receive_address.detail_address }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>배송메모</b>
											</th>
											<td>{{ orderResult.receive_address.message }}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</section>
					<hr class="mm_line">
				</template>

				<template v-if="isSubscription">
					<!-- 정기구독 결제 예정일 -->
					<section>
						<div class="mm_inner">
							<h4 class="mm_strapline">
								<b>정기구독 결제 예정일</b>
							</h4>
							<ol class="m_order-subscription">
								<li
									v-for="subscribe in orderResult.subscription_info"
									:key="subscribe.sequence"
									:class="{ 'T=on' : subscribe.sequence == 2 }"
								>
									<p>{{ subscribe.sequence }}차 주문</p>
									<p>{{ date(subscribe.for_payment_date, 'YYYY-MM-DD') }}</p>
								</li>
							</ol>
						</div>
					</section>
					<hr class="mm_line">
				</template>

				<template v-if="isPresent">
					<!-- 선물 받는분 정보 -->
					<section>
						<div class="mm_inner">
							<h4 class="mm_strapline">
								<b>선물 받는분 정보</b>
							</h4>
							<div class="mm_order-info">
								<table>
									<tbody>
										<tr>
											<th scope="row">
												<b>받는 사람</b>
											</th>
											<td>{{ orderResult.receive_address.name }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>휴대폰 번호</b>
											</th>
											<td>{{ orderResult.receive_address.phone }}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</section>
					<hr class="mm_line">

					<!-- 선물 메시지 -->
					<section
						v-if="orderResult.gift_info && orderResult.gift_info.message"
						class="mm_inner"
					>
						<h4 class="mm_strapline">
							<b>선물 메시지</b>
						</h4>
						<div class="m_present-message">
							<lazyload
								class="image_card mm_bg-cover"
								:src="orderResult.gift_info.background_image_url"
							></lazyload>
							<p class="text_readonly T=teatarea">
								<b>{{ orderResult.gift_info.message }}</b>
							</p>
						</div>
					</section>
					<hr class="mm_line">
				</template>

				<!-- 최종 결제금액 -->
				<section class="mm_costbox">
					<div class="mm_inner">
						<h4 class="mm_strapline">
							<b>최종 결제금액</b>
						</h4>
						<div class="mm_cost">
							<table>
								<tbody>
									<tr>
										<th scope="row">
											<b>총 상품금액</b>
										</th>
										<td>
											<p class="text_price">
												<strong>{{ number(summaryPrice.totalGoodsPrice) }}</strong>
											</p>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<b>총 배송비 금액</b>
										</th>
										<td>
											<p class="text_price">
												+ <strong>{{ number(summaryPrice.shippingPrice) }}</strong>
											</p>
										</td>
									</tr>
									<tr v-if="summaryPrice.memberDiscountedPrice > 0">
										<th scope="row">
											<b>상품 할인</b>
										</th>
										<td>
											<p class="text_price">
												- <strong>{{ number(summaryPrice.memberDiscountedPrice) }}</strong>
											</p>
										</td>
									</tr>
									<tr v-if="summaryPrice.registCouponAmount > 0">
										<th scope="row">
											<b>쿠폰</b>
										</th>
										<td>
											<p class="text_price">
												- <strong>{{ number(summaryPrice.registCouponAmount) }}</strong>
											</p>
										</td>
									</tr>
									<tr v-if="summaryPrice.usedStarPointAmount > 0">
										<th scope="row">
											<b>스타포인트 사용금액</b>
										</th>
										<td>
											<p class="text_point">
												- <strong>{{ number(summaryPrice.usedStarPointAmount) }}</strong><sub>원</sub>
											</p>
										</td>
									</tr>
									<tr v-if="summaryPrice.usedRewardPointAmount > 0">
										<th scope="row">
											<b>리워드포인트 사용금액</b>
										</th>
										<td>
											<p class="text_point">
												- <strong>{{ number(summaryPrice.usedRewardPointAmount) }}</strong><sub>원</sub>
											</p>
										</td>
									</tr>
								</tbody>
								<tfoot>
									<tr>
										<th scope="row">
											<b>최종 결제금액</b>
										</th>
										<td>
											<p class="text_price">
												<strong class="mm_text-variable">{{ number(summaryPrice.paymentPrice) }}</strong>
											</p>
										</td>
									</tr>
								</tfoot>
							</table>
						</div>

						<div class="mm_costbox-unit">
							<table>
								<tbody>
									<tr>
										<th scope="row">
											<b>결제 수단</b>
										</th>
										<td>{{ orderResult.payment_info.label }}</td>
									</tr>
									<template v-if="orderResult.payment_info.eng_label === 'credit_card'">
										<tr>
											<th scope="row">
												<b>카드사</b>
											</th>
											<td>{{ orderResult?.payment_info.card_label }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>카드 번호</b>
											</th>
											<td>{{ orderResult?.payment_info.card_masking_number }}</td>
										</tr>
									</template>
									<tr>
										<th scope="row">
											<b>결제 승인일</b>
										</th>
										<td>{{ date(orderResult.payment_info.approve_at, 'YYYY-MM-DD HH:mm:ss') }}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</section>
			</template>

			<template v-else>
				<div class="mm_inner">
					<p class="mm_text-none T=sm">
						<i class="ico_text-none"></i>결제 승인에 실패했습니다<br>{{ errorMessage }}
					</p>
					<div class="mm_btn_box">
						<div class="mm_flex T=equal">
							<button
								class="mm_btn T=support"
								type="button"
								@click="restartOrderProcess"
							>
								<b>주문서로 가기</b>
							</button>
							<button
								class="mm_btn T=primary"
								type="button"
								@click="closeCurrentWebview"
							>
								<b>쇼핑 홈 가기</b>
							</button>
						</div>
					</div>
				</div>
			</template>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { useRoute } from 'vue-router';
	import { useOrderStore } from '$/stores/useOrderStore';
	import { useAppBridge } from '$/composables/useAppBridge';
	import { useFormatter } from '$/composables/useFormatter';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';

	const route = useRoute();
	const orderId = `${route.params.id}`;
	const orderStore = useOrderStore();
	const { number, date } = useFormatter();

	const orderResult = ref<OrderResult | null>(null);
	const errorMessage = ref<string>('');
	try {
		orderResult.value = await orderStore.getResult(orderId);
	}
	catch (e) {
		errorMessage.value = e.response.data.message;
	}

	const { closeCurrentWebview } = useAppBridge();
	const isOrderSuccess = computed(() => orderResult.value !== null);

	async function restartOrderProcess() {
		return orderStore.moveToOrderPage();
	}

	const isSubscription = ref((orderResult.value?.subscription_info || []).length > 0);
	const isPresent = computed(() => orderResult.value?.gift_info);

	const summaryPrice = computed(() => {
		if (orderResult.value === null) {
			return {
				totalGoodsPrice: 0,
				memberDiscountedPrice: 0,
				registCouponAmount: 0,
				nightSaleAmount: 0,
				immediatelySaleAmount: 0,
				usedStarPointAmount: 0,
				usedRewardPointAmount: 0,
				shippingPrice: 0,
				paymentPrice: 0,
			};
		}

		const total = orderResult.value.packs.map((pack) => {
			return {
				goodsPrice: pack.items.reduce((accumulator, currentValue) => {
					return accumulator + currentValue.goods_sell_price + currentValue.option_extra_amount;
				}, 0),
				memberDiscountedPrice: pack.items.reduce((accumulator, currentValue) => {
					return accumulator + (currentValue.goods_sell_price - currentValue.goods_base_discounted_price);
				}, 0),
				nightSaleAmount: pack.items.reduce((accumulator, currentValue) => {
					return accumulator + (currentValue.night_sale_amount || 0);
				}, 0),
				registCouponAmount: pack.items.reduce((accumulator, currentValue) => {
					return accumulator + currentValue.coupon_amount;
				}, 0),
				immediatelySaleAmount: pack.items.reduce((accumulator, currentValue) => {
					return accumulator + currentValue.immediately_sale_amount;
				}, 0),
				usedStarPointAmount: pack.items.reduce((accumulator, currentValue) => {
					return accumulator + currentValue.used_star_point_amount;
				}, 0),
				usedRewardPointAmount: pack.items.reduce((accumulator, currentValue) => {
					return accumulator + currentValue.used_reward_point_amount;
				}, 0),
			};
		});

		const totalGoodsPrice = total.reduce((acc, cur) => {
			return acc + cur.goodsPrice;
		}, 0);
		const memberDiscountedPrice = total.reduce((acc, cur) => {
			return acc + cur.memberDiscountedPrice;
		}, 0);
		const shippingPrice = orderResult.value.packs.reduce((acc, cur) => {
			return acc + cur.shipping_price;
		}, 0);
		const nightSaleAmount = total.reduce((acc, cur) => {
			return acc + cur.nightSaleAmount;
		}, 0);
		const registCouponAmount = total.reduce((acc, cur) => {
			return acc + cur.registCouponAmount;
		}, 0);
		const immediatelySaleAmount = total.reduce((acc, cur) => {
			return acc + cur.immediatelySaleAmount;
		}, 0);

		const usedStarPointAmount = total.reduce((acc, cur) => {
			return acc + cur.usedStarPointAmount;
		}, 0);
		const usedRewardPointAmount = total.reduce((acc, cur) => {
			return acc + cur.usedRewardPointAmount;
		}, 0);

		return {
			totalGoodsPrice,
			memberDiscountedPrice,
			shippingPrice,
			nightSaleAmount,
			registCouponAmount,
			immediatelySaleAmount,
			usedStarPointAmount,
			usedRewardPointAmount,
			paymentPrice: totalGoodsPrice - memberDiscountedPrice + shippingPrice - nightSaleAmount - registCouponAmount - immediatelySaleAmount - usedStarPointAmount - usedRewardPointAmount,
		};
	});

	const isAddressNeedShow = computed(() => orderResult.value?.receive_address.shipping_name && orderResult.value.receive_address.zip_code);

	const groupItemsSummary = computed<{
		usedPointAmount: number;
		paidPrice: number;
	}[][]>(() => {
		if (orderResult.value === null) {
			return [];
		}

		return orderResult.value.packs.map((pack) => {
			return pack.mergedOrderItems.map((group) => {
				return {
					usedPointAmount: group.list.reduce((accumulator, currentValue) => {
						return accumulator + currentValue.used_point_amount;
					}, 0),
					paidPrice: group.list.reduce((acc, cur) => {
						// group.goodsBaseDiscountedPrice - group.nightSaleAmount - group.registCouponAmount - group.immediatelySaleAmount
						return acc + (
							cur.goods_base_discounted_price
							+ cur.option_extra_amount
							- cur.night_sale_amount
							- cur.coupon_amount
							- cur.immediately_sale_amount);
					}, 0),
				};
			});
		});
	});

	orderStore.orderFinish(orderId, isOrderSuccess.value);
</script>