<template>
	<layout
		title="주문완료"
		layout="popup"
	>
		<div class="m_order-fin">
			<template v-if="orderResult === 'success'">
				<div class="mm_inner">
					<h3 class="mm_title">
						<i class="ico_success"></i>
						<b v-if="isPresent">{{ '홍길동' }}님에게 보내는<br>선물 주문이 완료되었습니다</b>
						<b v-else>주문이 완료되었습니다</b>
					</h3>
					<p>주문번호: {{ '2005141142151234562' }}</p>
					<div
						v-if="testOrderResult.payment_info.eng_label === 'virtual_account'"
						class="m...fin-deposit"
					>
						<p class="text_deadline">
							입금기한: {{ '2022.06.05' }}<span>{{ '23:59:59' }}</span>까지
						</p>
						<p>입금계좌: {{ '국민은행 12234567984123' }}</p>
					</div>
					<div class="mm_btn_box">
						<div class="mm_flex T=equal">
							<mm-link
								class="mm_btn T=support"
								:to="{ name: 'MyOrder' }"
							>
								<b>구매내역 보기</b>
							</mm-link>
							<mm-link
								class="mm_btn T=primary"
								:to="{ name: 'Main' }"
							>
								<b>쇼핑 홈 가기</b>
							</mm-link>
						</div>
					</div>
				</div>

				<!-- 주문 상품 -->
				<div class="mm_order-item">
					<div
						v-for="pack, packIndex in testOrderResult.packs"
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
													<p class="text_price"><del><span>{{ number(item.goods.base_discounted_price) }}</span></del><strong>{{ number(item.goods.sell_price) }}</strong></p>
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
				<template v-if="!isPresent">
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
											<td>{{ testOrderResult.receive_address.shipping_name }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>받는 사람</b>
											</th>
											<td>{{ testOrderResult.receive_address.name }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>휴대폰 번호</b>
											</th>
											<td>{{ testOrderResult.receive_address.phone }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>주소</b>
											</th>
											<td>{{ testOrderResult.receive_address.zip_code }}<br>{{ testOrderResult.receive_address.base_address }}  {{ testOrderResult.receive_address.detail_address }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>배송메모</b>
											</th>
											<td>{{ testOrderResult.receive_address.message }}</td>
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
								<li class="T=on">
									<p>2차 주문</p>
									<p>2023-09-25</p>
								</li>
								<li>
									<p>3차 주문</p>
									<p>2023-10-25</p>
								</li>
								<li>
									<p>4차 주문</p>
									<p>2023-11-25</p>
								</li>
								<li>
									<p>5차 주문</p>
									<p>2023-12-25</p>
								</li>
								<li>
									<p>6차 주문</p>
									<p>2024-01-25</p>
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
											<td>{{ '홍길동' }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>휴대폰 번호</b>
											</th>
											<td>{{ '010-0000-0000' }}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</section>
					<hr class="mm_line">

					<!-- 선물 메시지 -->
					<section class="mm_inner">
						<h4 class="mm_strapline">
							<b>선물 메시지</b>
						</h4>
						<div class="m_present-message">
							<lazyload
								class="image_card mm_bg-cover"
								:src="`/image/content/present_card_1.png`"
							></lazyload>
							<p class="text_readonly T=teatarea">
								<b>{{ '고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다.' }}</b>
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
												<strong>{{ number(210000) }}</strong>
											</p>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<b>총 배송비 금액</b>
										</th>
										<td>
											<p class="text_price">
												+ <strong>{{ number(2500) }}</strong>
											</p>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<b>상품 할인</b>
										</th>
										<td>
											<p class="text_price">
												- <strong>{{ number(6200) }}</strong>
											</p>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<b>쿠폰</b>
										</th>
										<td>
											<p class="text_price">
												- <strong>{{ number(8540) }}</strong>
											</p>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<b>스타포인트 사용금액</b>
										</th>
										<td>
											<p class="text_point">
												- <strong>{{ number(2000) }}</strong><sub>원</sub>
											</p>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<b>리워드포인트 사용금액</b>
										</th>
										<td>
											<p class="text_point">
												- <strong>{{ number(2000) }}</strong><sub>원</sub>
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
												<strong class="mm_text-variable">{{ number(201510) }}</strong>
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
										<td>{{ testOrderResult.payment_info.label }}</td>
									</tr>
									<template v-if="testOrderResult.payment_info.eng_label === 'virtual_account' || testOrderResult.payment_info.eng_label === 'escrow'">
										<tr>
											<th scope="row">
												<b>이체은행</b>
											</th>
											<td>{{ testOrderResult.payment_info.bank_label }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>예금주</b>
											</th>
											<td>{{ '엠몬스타' }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>계좌번호</b>
											</th>
											<td>{{ testOrderResult.payment_info.bank_account_number }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>입금기한</b>
											</th>
											<td>{{ testOrderResult.payment_info.bank_input_expire_date }}</td>
										</tr>
									</template>
									<template v-else>
										<tr>
											<th scope="row">
												<b>카드사</b>
											</th>
											<td>{{ testOrderResult?.payment_info.card_label }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>카드 번호</b>
											</th>
											<td>{{ testOrderResult?.payment_info.card_masking_number }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>결제 승인일</b>
											</th>
											<td>{{ testOrderResult.payment_info.approve_at }}</td>
										</tr>
									</template>
								</tbody>
							</table>
						</div>
					</div>
				</section>
			</template>

			<template v-else>
				<div class="mm_inner">
					<p class="mm_text-none T=sm">
						<i class="ico_text-none"></i>결제 승인에 실패했습니다<br>카드 잔액이 부족합니다
					</p>
					<div class="mm_btn_box">
						<div class="mm_flex T=equal">
							<mm-link
								class="mm_btn T=support"
								:to="{ name: 'Order' }"
							>
								<b>주문서로 가기</b>
							</mm-link>
							<mm-link
								class="mm_btn T=primary"
								:to="{ name: 'Main' }"
							>
								<b>쇼핑 홈 가기</b>
							</mm-link>
						</div>
					</div>
				</div>
			</template>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';

	const { number } = useFormatter();

	const orderResult = 'success';
	const isSubscription = ref(Math.floor(Math.random() * 2) == 0 ? true : false);
	const isPresent = ref(Math.floor(Math.random() * 2) == 0 ? true : false);

	const testOrderResult = ref<OrderResult>({
		packs: [
			{
				shipping_price: 2500,
				mergedOrderItems: [
					{
						key: '1',
						seller_name: '엠몬스타',
						goods: {
							brand_name: 'M.Mon 엠몬스타',
							name: '플리츠 디테일 드레스_MJM1OP3140',
							thumbnail_url: `/image/_sample/prod_x1_${Math.floor(Math.random() * 4) + 1}.png`,
							base_discounted_price: 118800,
							sell_price: 54800,
						},
						option: {
							name: '네이비',
						},
						ea: 1,
					},
					{
						key: '2',
						seller_name: '엠몬스타0',
						goods: {
							brand_name: 'M.Mon 엠몬스타',
							name: '플리츠 디테일 드레스_MJM1OP3140',
							thumbnail_url: `/image/_sample/prod_x1_${Math.floor(Math.random() * 4) + 1}.png`,
							base_discounted_price: 118800,
							sell_price: 54800,
						},
						option: {
							name: '네이비',
						},
						ea: 2,
					},
				],
			},
			{
				shipping_price: 0,
				mergedOrderItems: [
					{
						key: '1',
						seller_name: '엠몬스타',
						goods: {
							brand_name: 'M.Mon 엠몬스타',
							name: '플리츠 디테일 드레스_MJM1OP3140',
							thumbnail_url: `/image/_sample/prod_x1_${Math.floor(Math.random() * 4) + 1}.png`,
							base_discounted_price: 118800,
							sell_price: 54800,
						},
						option: {
							name: '네이비',
						},
						ea: 1,
					},
				],
			},
		],
		receive_address: {
			shipping_name: '나의 자취방',
			base_address: '서울 서초구 명달로 17길 32',
			detail_address: '트라움하우스 2차 아파트 301호',
			zip_code: 39392,
			name: '홍길동',
			phone: '010-1234-2839',
			message: '문옆 소화전이요',
		},
		payment_info: {
			label: '신용/체크카드',
			eng_label: 'credit_card',
			card_label: '신한카드',
			card_masking_number: '911*-****-****-****',
			approve_at: '2020.06.04 12:30:12',
			bank_label: '농협은행',
			bank_account_number: '125*-****-****-****',
			bank_input_expire_date: '2026-01-25 12:56:34',
		},
	} as unknown as OrderResult);
</script>