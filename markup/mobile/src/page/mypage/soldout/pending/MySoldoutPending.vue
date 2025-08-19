<template>
	<div class="m_myclaim">
		<h3>
			<b>신고 가능 주문 수</b><strong class="mm_text-secondary">{{ number(3) }}개</strong>
		</h3>

		<!-- 신고 가능 주문 목록 -->
		<p
			v-if="items.length < 1"
			class="mm_text-none T=sm"
		>
			<i class="ico_text-none"></i>품절취소 신고 가능 주문이 없습니다
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
									<div class="mm_btn_box">
										<div class="mm_flex T=equal">
											<button
												type="button"
												class="mm_btn T=xs T=line"
											>
												<b>품절취소 신고하기</b>
											</button>
										</div>
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
									<div class="mm_btn_box">
										<div class="mm_flex T=equal">
											<button
												type="button"
												class="mm_btn T=xs T=line"
											>
												<b>품절취소 신고하기</b>
											</button>
										</div>
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
									<div class="mm_btn_box">
										<div class="mm_flex T=equal">
											<button
												type="button"
												class="mm_btn T=xs T=line"
											>
												<b>품절취소 신고하기</b>
											</button>
										</div>
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
									<div class="mm_btn_box">
										<div class="mm_flex T=equal">
											<button
												type="button"
												class="mm_btn T=xs T=line"
											>
												<b>품절취소 신고하기</b>
											</button>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</article>

			<pagination></pagination>
		</template>

		<!-- 품절취소 보상정책 안내 -->
		<section class="m_myclaim-info">
			<h6 class="mm_strapline">
				<b>품절취소 보상정책 안내</b>
			</h6>
			<p>재고 부족 등의 이유로 결제 완료일 다음날(1일째) 품절 사실을 안내받은 경우 최저 3% ~ 최고 10%까지 적립금으로 보상해드리는 제도입니다.</p>
			<table>
				<caption>결제 완료일로부터 품절등록일 수 기준</caption>
				<tbody>
					<tr>
						<th scope="row">
							<b>3일 후 안내</b>
						</th>
						<td>{{ '3%' }} (적립금 보상)</td>
					</tr>
				</tbody>
			</table>
			<div class="mm_note">
				<ul>
					<li>단, 오전 10시 이후 주문은 2일째부터 적용</li>
				</ul>
			</div>
		</section>

		<!-- 품절취소 신고 안내 -->
		<div class="mm_inner">
			<div class="mm_note">
				<dropdown
					:is-active="true"
					icon-class="T=sm"
				>
					<template #button>
						<i class="ico_info"></i><b>품절취소 신고 안내</b>
					</template>
					<template #content>
						<ul>
							<li>결제일로부터 30일 이내에 신고하셔야 보상금 지급이 가능합니다.</li>
							<li>해외배송 상품 및 주문제작 상품은 보상제도에서 제외됩니다.</li>
							<li>보상 신청은 결제일로부터 최대 30일 이내에 하셔야 하고, 최대 보상 금액은 2만원 입니다.</li>
							<li>지연일은 영업일 기준으로 토,일,공휴일은 포함하지 않습니다.</li>
							<li>비회원, 해외직배송, 주문 제작, 주문 후 오프라인 매장을 통한 배송 상품, 해당 상품 취소 및 반품 시에는 본 기준에서 제외됩니다.</li>
							<li>무통장 결제의 경우 입금완료일을 기준으로 합니다.</li>
						</ul>
					</template>
				</dropdown>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useFormatter } from '$/composables/useFormatter';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import Pagination from '@/component/Pagination.vue';

	const { number } = useFormatter();

	const items: unknown[] = [''];// 내용없음 확인용 임시 변수
</script>