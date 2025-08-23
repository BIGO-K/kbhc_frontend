<template>
	<div class="m_myclaim">
		<h3>
			<b>신고 주문 수</b><strong class="mm_text-secondary">{{ number(3) }}개</strong>
		</h3>

		<!-- 신고 주문 목록 -->
		<p
			v-if="items.length < 1"
			class="mm_text-none T=sm"
		>
			<i class="ico_text-none"></i>처리중인 배송지연 주문이 없습니다
		</p>

		<template v-else>
			<article class="mm_order-item">
				<h5>
					<b>{{ '2023.00.00' }}</b>
					<strong>주문번호<b>{{ '2005141142151234562' }}</b></strong>
				</h5>
				<div class="mm_order-item-seller">
					<div class="mm_order...seller-head">
						<h5><i class="ico_shop"></i><b>{{ '엠몬스타' }}</b></h5>
					</div>
					<div class="mm_product-list T=sm">
						<ul>
							<li>
								<div class="mm_product-item">
									<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													src="/image/_sample/prod_x1_1.png"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_status">
													{{ '결제 완료' }}
												</p>
												<p class="text_brand">
													{{ '엠몬스타' }}
												</p>
												<p class="text_product">
													{{ '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140' }}
												</p>
												<p class="text_price">
													<strong>{{ number(54800) }}</strong>
												</p>
												<p class="text_option">
													{{ '베이지 FREE / 1개' }}
												</p>
											</figcaption>
										</figure>
									</mm-link>
								</div>
								<div class="mm_product-unit">
									<div class="mm_product-unit-indent">
										<p class="text_payments">
											결제방식<strong>{{ '신용카드' }}</strong>
										</p>
									</div>
									<div class="mm_product-unit-claim">
										<ul>
											<li><b class="mm_tag T=dark">신고접수</b><p>신고일: {{ '2020.05.18' }}</p></li>
											<li><b class="mm_tag">처리완료</b><p>처리일: {{ '2020.05.18' }}</p></li>
										</ul>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="mm_order-item-seller">
					<div class="mm_order...seller-head">
						<h5><i class="ico_shop"></i><b>{{ '엠몬스타' }}</b></h5>
					</div>
					<div class="mm_product-list T=sm">
						<ul>
							<li>
								<div class="mm_product-item">
									<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													src="/image/_sample/prod_x1_1.png"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_status">
													{{ '결제 완료' }}
												</p>
												<p class="text_brand">
													{{ '엠몬스타' }}
												</p>
												<p class="text_product">
													{{ '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140' }}
												</p>
												<p class="text_price">
													<strong>{{ number(54800) }}</strong>
												</p>
												<p class="text_option">
													{{ '베이지 FREE / 1개' }}
												</p>
											</figcaption>
										</figure>
									</mm-link>
								</div>
								<div class="mm_product-unit">
									<div class="mm_product-unit-indent">
										<p class="text_payments">
											결제방식<strong>{{ '신용카드' }}</strong>
										</p>
									</div>
									<div class="mm_product-unit-claim">
										<ul>
											<li><b class="mm_tag T=dark">신고접수</b><p>신고일: {{ '2020.05.18' }}</p></li>
											<li><b class="mm_tag">처리완료</b><p>처리일: {{ '2020.05.18' }}</p></li>
										</ul>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</article>
			<article class="mm_order-item">
				<h5>
					<b>{{ '2023.00.00' }}</b>
					<strong>주문번호<b>{{ '2005141142151234562' }}</b></strong>
				</h5>
				<div class="mm_order-item-seller">
					<div class="mm_order...seller-head">
						<h5><i class="ico_shop"></i><b>{{ '엠몬스타' }}</b></h5>
					</div>
					<div class="mm_product-list T=sm">
						<ul>
							<li>
								<div class="mm_product-item">
									<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													src="/image/_sample/prod_x1_1.png"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_status">
													{{ '결제 완료' }}
												</p>
												<p class="text_brand">
													{{ '엠몬스타' }}
												</p>
												<p class="text_product">
													{{ '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140' }}
												</p>
												<p class="text_price">
													<strong>{{ number(54800) }}</strong>
												</p>
												<p class="text_option">
													{{ '베이지 FREE / 1개' }}
												</p>
											</figcaption>
										</figure>
									</mm-link>
								</div>
								<div class="mm_product-unit">
									<div class="mm_product-unit-indent">
										<p class="text_payments">
											결제방식<strong>{{ '신용카드' }}</strong>
										</p>
									</div>
									<div class="mm_product-unit-claim">
										<ul>
											<li><b class="mm_tag T=dark">신고접수</b><p>신고일: {{ '2020.05.18' }}</p></li>
											<li><b class="mm_tag T=gray">처리불가</b><p>처리일: {{ '2020.05.18' }}</p></li>
										</ul>
									</div>
								</div>
							</li>
							<li>
								<div class="mm_product-item">
									<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													src="/image/_sample/prod_x1_1.png"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_status">
													{{ '결제 완료' }}
												</p>
												<p class="text_brand">
													{{ '엠몬스타' }}
												</p>
												<p class="text_product">
													{{ "[매긴나잇브릿지]플리츠 디테일 드레스" }}
												</p>
												<p class="text_price">
													<strong>{{ number(54800) }}</strong>
												</p>
												<p class="text_option">
													{{ '베이지 FREE / 1개' }}
												</p>
											</figcaption>
										</figure>
									</mm-link>
								</div>
								<div class="mm_product-unit">
									<div class="mm_product-unit-indent">
										<p class="text_payments">
											결제방식<strong>{{ '신용카드' }}</strong>
										</p>
									</div>
									<div class="mm_product-unit-claim">
										<ul>
											<li><b class="mm_tag T=dark">신고접수</b><p>신고일: {{ '2020.05.18' }}</p></li>
											<li><b class="mm_tag T=gray">처리불가</b><p>처리일: {{ '2020.05.18' }}</p></li>
										</ul>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</article>

			<pagination></pagination>
		</template>

		<!-- 배송지연 신고 처리 순서 -->
		<section class="m_myclaim-info">
			<h6 class="mm_strapline">
				<b>배송지연 신고 처리 순서</b>
			</h6>
			<ol>
				<li>
					<dl>
						<dt>신고접수 상태란?<b class="mm_tag T=dark">신고접수</b></dt>
						<dd>고객님께서 신고 완료한 상태</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>신고처리 상태란?<b class="mm_tag">처리완료</b><b class="mm_tag T=gray">처리불가</b></dt>
						<dd>고객센터에서 확인 후 보상적립금 지급이 처리 불가하거나 처리 완료한 상태</dd>
					</dl>
				</li>
			</ol>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { useFormatter } from '$/composables/useFormatter';
	import Lazyload from '@/component/Lazyload.vue';
	import Pagination from '@/component/Pagination.vue';

	const { number } = useFormatter();

	const items: unknown[] = [''];// 내용없음 확인용 임시 변수
</script>