<template>
	<layout-detail>
		<template #page>
			<div class="m_prodetail">
				<!-- 상품상세 상단 -->
				<div class="m_prodetail-head">
					<!-- 상품정보 -->
					<div class="m_prodetail-head-product">
						<!-- 상품이미지 -->
						<carousel
							:items="detailCarouselItems"
							effect="cover"
							:use-pagination="true"
							:is-more-side="true"
							:is-error-remove="true"
						>
							<template #default="{ item }">
								<lazyload
									class="mm_bg-contain"
									:src="item.image"
								></lazyload>
								<span class="mm_ir-blind">{{ item.alt }}</span>
							</template>
						</carousel>

						<!-- 공동구매 진행 상태 -->
						<!-- (D) 진행 중 상태를 제외하고 상태에 따라 클래스를 추가합니다. 목표달성: T=success, 목표 미달성: T=fail -->
						<div class="m...product-coopbuy">
							<p class="mm_flex text_state">
								<strong>진행 중</strong><b>D<span>-</span>30<strong>720<span>:</span>14<span>:</span>38</strong></b>
								<!-- <strong>목표달성</strong><b>D<span>-</span>30<strong>720<span>:</span>14<span>:</span>38</strong></b> -->
							</p>
							<div class="m...product-coopbuy-progress">
								<p>
									목표까지<b><strong>5,852<sub>명</sub></strong><span>/</span>10,000명</b>
								</p>
								<div class="m...progress-bar">
									<b
										style="width: 60%;"
										title="60%"
									>
										<i></i>
									</b>
								</div>
							</div>

							<!-- (D) 공동구매 종료일 다음날 부터는 목표 달성 상태에 맞춰 '.text_state-off' 요소만 노출합니다. -->
							<!--
								<p class="text_state-off">
								목표 달성<span>/</span><strong>1,530</strong>명 참여
								</p>
							-->
							<!--
								<p class="text_state-off">
								목표 미달성<span>/</span><strong>1,530</strong>명 참여
								</p>
							-->
						</div>

						<div class="mm_inner">
							<mm-link
								class="btn_brand"
								:to="{ name: 'BrandShop', params: { id: 123 } }"
							>
								<b>{{ '엠몬스타' }}</b><i class="ico_link"></i>
							</mm-link>
							<p class="text_product">
								<headline
									v-if="goodsDetail.headline"
									:headline="goodsDetail.headline"
								></headline>
								{{ goodsDetail.name }}
							</p>
							<p class="text_price">
								<span class="text_sale">{{ '10%' }}</span><strong>{{ number(235000) }}</strong><del>{{ number(350000) }}</del>
							</p>
						</div>
					</div>
					<div class="mm_inner">
						<!-- 할인정보 -->
						<div class="m_prodetail-head-benefit">
							<div class="m...benefit-coupon">
								<p>O’CARE 쇼핑몰 고객을 위한 혜택</p>
							</div>
							<dropdown button-class="mm_flex">
								<template #button>
									<b>공동구매 할인가</b><b class="text_price"><strong>{{ number(208000) }}</strong></b>
								</template>
								<template #content>
									<div class="m...benefit-detail">
										<h4><b>비회원가</b></h4>
										<dl>
											<dt>정가</dt>
											<dd class="text_price">
												<span>{{ number(353000) }}</span>
											</dd>
										</dl>
										<dl
											v-for="benefit in saleBenefits"
											:key="benefit.title"
										>
											<dt>{{ benefit.title }}</dt>
											<dd class="text_price">
												<span>{{ `- ${number(benefit.price)}` }}</span>
											</dd>
										</dl>
										<dl>
											<dt>판매가</dt>
											<dd class="text_price">
												<span>{{ number(343000) }}</span>
											</dd>
										</dl>
									</div>
									<div class="m...benefit-detail">
										<h4><b>회원가</b></h4>
										<dl
											v-for="benefit in saleMemberBenefits"
											:key="benefit.title"
										>
											<dt>{{ benefit.title }}</dt>
											<dd class="text_price">
												<span>{{ `- ${number(benefit.price)}` }}</span>
											</dd>
										</dl>
										<dl>
											<dt>회원 혜택가</dt>
											<dd class="text_price">
												<span>{{ number(208000) }}</span>
											</dd>
										</dl>
									</div>
									<div class="mm_note">
										<ul>
											<li>현재 최대 할인가의 금액 기준은 할인 혜택이 적용된 금액이며 일부는 회원에게만 적용될 수 있습니다.</li>
											<li>쿠폰 받기 버튼을 누르셔서 쿠폰을 다운로드하셔야 쿠폰 할인이 가능합니다.</li>
											<li>즉시 할인의 경우 주문 시 사용하는 쿠폰 및 적립금에 따라 할인금액이 변경될 수 있습니다.</li>
										</ul>
									</div>
								</template>
							</dropdown>
						</div>

						<!-- 배송정보 및 혜택 -->
						<div class="m_prodetail-head-info">
							<dl>
								<dt>배송정보</dt>
								<dd v-if="deliveryInfo.is_free_delivery">
									무료배송
								</dd>
								<dd v-else>
									{{ '배송비 ' + deliveryInfo.shipping_price + '원' }}
								</dd>
								<dd v-if="deliveryInfo.is_conditional_free_delivery">
									{{ deliveryInfo.conditional_free_price + '원 이상 구매 시 무료배송' }}
								</dd>
								<dd v-if="deliveryInfo.extra_shipping_price > 0">
									{{ '도서산간지역 ' + deliveryInfo.extra_shipping_price + '원' }}
								</dd>
							</dl>
							<dl>
								<dt>혜택</dt>
								<dd>
									<a
										href="#"
										@click.prevent="overlayCardBenefit"
									>
										<b>{{ '50,000원 이상 결제 시 무이자할부' }}</b><i class="ico_tooltip"></i>
									</a>
								</dd>
							</dl>
							<dl>
								<dt>공동구매</dt>
								<dd><span>공동구매 기간</span><p>10.24(화) ~ 11.24(금) 15:00</p></dd>
								<dd><span>목표인원</span><p>10,000명</p></dd>
								<dd><span>쿠폰사용 기간</span><p>2023.11.25 ~ 2023.12.25</p></dd>
							</dl>
						</div>

						<!-- 공유하기 -->
						<div class="mm_btn_box">
							<button
								type="button"
								class="mm_btn T=line btn_share"
								@click="shareStore.open"
							>
								<i class="ico_share"></i><b>공유하기</b>
							</button>
						</div>
					</div>
				</div>

				<!-- 공동구매 진행 단계 -->
				<section class="m_prodetail-coopbuy-process">
					<h3><strong>공동구매</strong><b>진행 단계</b></h3>
					<ol>
						<li>
							<i class="ico_coopbuy-join"></i>
							<dl>
								<dt>참여</dt>
								<dd>'공동구매 참여' 버튼을 클릭합니다.</dd>
							</dl>
						</li>
						<li>
							<i class="ico_coopbuy-goal"></i>
							<dl>
								<dt>달성</dt>
								<dd>설정된 목표 수를 달성하면</dd>
							</dl>
						</li>
						<li>
							<i class="ico_coopbuy-coupon"></i>
							<dl>
								<dt>발급</dt>
								<dd>할인쿠폰이 자동으로 발급됩니다.</dd>
							</dl>
						</li>
						<li>
							<i class="ico_coopbuy-buy"></i>
							<dl>
								<dt>구매</dt>
								<dd>공동구매가로 상품을 구매할 수<br> 있습니다.</dd>
							</dl>
						</li>
					</ol>
				</section>

				<!-- 상품상세 탭 -->
				<div class="m_prodetail-tab">
					<product-info></product-info>
				</div>

				<div class="m_prodetail-foot">
					<div class="m_prodetail-info">
						<ul>
							<li>
								<dropdown tag="dl">
									<template #button>
										<p><b>일반 상품 정보</b></p>
									</template>
									<template #content>
										<table>
											<tbody>
												<tr>
													<th scope="row">
														<b>상품번호</b>
													</th>
													<td>123456</td>
												</tr>
												<tr>
													<th scope="row">
														<b>상품상태</b>
													</th>
													<td>새상품</td>
												</tr>
												<tr>
													<th scope="row">
														<b>브랜드</b>
													</th>
													<td>MMON</td>
												</tr>
												<tr>
													<th scope="row">
														<b>원산지</b>
													</th>
													<td>대한민국</td>
												</tr>
											</tbody>
										</table>
									</template>
								</dropdown>
							</li>
							<li>
								<dropdown tag="dl">
									<template #button>
										<p><b>상품정보고시</b></p>
									</template>
									<template #content>
										<table>
											<tbody>
												<tr>
													<th scope="row">
														<b>소재</b>
													</th>
													<td>겉감 – 나일론78%<br> 폴리에스터22%<br> 배색-나일론100%<br> 안감-폴리에스터 100%</td>
												</tr>
												<tr>
													<th scope="row">
														<b>색상</b>
													</th>
													<td>MUSTARD_150, MELANGE GREY_932, WINE_503</td>
												</tr>
												<tr>
													<th scope="row">
														<b>치수</b>
													</th>
													<td>090, 095, 100, 105, 110</td>
												</tr>
												<tr>
													<th scope="row">
														<b>제조자</b>
													</th>
													<td>㈜네파/㈜네파</td>
												</tr>
												<tr>
													<th scope="row">
														<b>제조국</b>
													</th>
													<td>베트남</td>
												</tr>
												<tr>
													<th scope="row">
														<b>세탁방법<br> 및 취급 시<br> 주의사항</b>
													</th>
													<td>표백제 및 강력 효소 세제는 절대로 사용하지 마십시오. 드라이를 권장합니다. 손세탁을 하 실 경우 30도 이하의 온도에서 드라이 세제 를 이용하여 세탁하여 주시고, 뜨거운 물에 세탁을 하시면 제품에 이상이 생길 수 있으므로 자제하시기 바랍니다</td>
												</tr>
												<tr>
													<th scope="row">
														<b>제조연월</b>
													</th>
													<td>20140801</td>
												</tr>
												<tr>
													<th scope="row">
														<b>품질보증<br> 기준</b>
													</th>
													<td>본 제품은 공정거래위원회 고시 소비자 분쟁해결기준에 의거, 보상받으실 수 있습니다</td>
												</tr>
												<tr>
													<th scope="row">
														<b>A/S책임자<br> 및 연락처</b>
													</th>
													<td>판매자 고객센터 1599-0403</td>
												</tr>
											</tbody>
										</table>
									</template>
								</dropdown>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</template>

		<template #optionButton>
			<div
				class="m_product-option"
				:class="{ 'S=option-open': isOptionOpen }"
			>
				<div
					class="m_product-option-dim"
					@click="isOptionOpen = false"
				></div>
				<div class="m_product-option-inner">
					<button
						type="button"
						class="btn_option-close"
						@click="isOptionOpen = false"
					>
						<b class="mm_ir-blind">옵션선택 닫기</b>
					</button>
					<!-- 옵션 목록 -->
					<!--
						(D) 모든 옵션은 옵션의 순서와 무관하게 우선 선택이 가능합니다(예: 옵션2부터 선택가능)
						(D) 옵션1, 2가 1개의 옵션만 있을 경우 별도의 옵션 선택 동작 없이 옵션이 선택된 상태로 노출되며, 수량 변경만 가능합니다.
						(D) 옵션1 혹은 옵션2만 등록한 단일옵션의 경우 1개의 옵션만 선택하게 됩니다. 이 때 옵션의 'h6' 요소는 옵션1 또는 옵션2의 명칭이 아닌 '옵션' 명칭을 사용합니다.
					-->
					<div class="m_product-option-select">
						<dl>
							<dt>옵션1</dt>
							<dd>
								<form-select v-model="sortOption1">
									<option>옵션명1</option>
								</form-select>
							</dd>
						</dl>
						<dl>
							<dt>옵션2</dt>
							<dd>
								<form-select v-model="sortOption2">
									<option>옵션명2</option>
								</form-select>
							</dd>
						</dl>
					</div>

					<!-- 선택된 옵션 -->
					<div class="mm_scroller m_product-option-selected">
						<ul>
							<li>
								<div class="m...selected-info">
									<p class="text_product">
										시그니처 엠블럼 티셔츠 SIGNATURE EMBLEM T-SHIRT - 5color 프로텍팅내츄럴
									</p>
									<p class="text_option">
										블랙/95
									</p>
								</div>
								<p class="text_price">
									<strong>{{ number(208000) }}</strong>
								</p>
								<button
									type="button"
									class="btn_option-remove"
								>
									<i class="ico_option-remove"></i><b class="mm_ir-blind">옵션삭제</b>
								</button>
							</li>
						</ul>
						<div class="mm_note T=bg">
							<ul>
								<li>공동구매에 참여한 사용자에 한하여 해당 가격으로 구매 가능합니다.</li>
								<li>공동구매 쿠폰은 상품당 한 번만 사용 가능합니다.</li>
							</ul>
						</div>
					</div>
					<div class="m_product-option-foot">
						<dl>
							<dt>총 상품 금액</dt>
							<dd class="text_price">
								<strong class="mm_text-secondary">{{ number(416000) }}</strong>
							</dd>
						</dl>
						<div class="mm_btn_box">
							<div class="mm_flex T=equal">
								<button
									type="button"
									class="mm_btn T=lg T=primary"
								>
									<b>공동구매 참여</b>
								</button>
								<!--
									<button
									type="button"
									class="mm_btn T=lg T=primary"
									>
									<b>공동구매가로 구매</b>
									</button>
								-->
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 하단고정버튼 -->
			<div class="mm_btn_box T=fixed">
				<div class="mm_flex T=equal">
					<button
						type="button"
						class="mm_btn T=primary"
						@click="isOptionOpen = true"
					>
						<b>공동구매 참여</b>
					</button>
					<!--
						<button
						type="button"
						class="mm_btn T=primary"
						@click="isOptionOpen = true"
						>
						<b>공동구매가로 구매</b>
						</button>
					-->
					<!-- <b class="mm_btn T=disabled">공동구매 미달성</b> -->
				</div>
			</div>
		</template>
	</layout-detail>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref } from 'vue';
	import { useShareStore } from '$/stores/useShareStore';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useHead } from '$/composables/useHead';
	import LayoutDetail from '@/component/layout/LayoutDetail.vue';
	import Carousel from '@/component/Carousel.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import Headline from '@/feature/headline/Headline.vue';
	import ProductInfo from '@/page/product/detail/component/ProductDetailInfo.vue';

	const { number } = useFormatter();
	const { openOverlay } = useGlobalPageContext();
	const shareStore = useShareStore();

	// XXX 상품상세 임시 데이터
	const goodsDetail: Partial<GoodsDetail> = {
		headline: '헤드라인',
		name: '찰리브라운 폭신폭신 슬리퍼 3colors(Butter컬러 28일발송) N212UTS906',
	};

	useHead({ title: `${goodsDetail.name} 상품 상세` });

	const detailCarouselItems = [
		{
			image: '/image/_sample/prod_x3_1.png',
			alt: '찰리브라운 폭신폭신 슬리퍼 3colors(Butter컬러 28일발송) N212UTS906',
		},
		{
			image: '/image/_sample/prod_x3_2.png',
			alt: '찰리브라운 폭신폭신 슬리퍼 3colors(Butter컬러 28일발송) N212UTS906',
		},
		{
			image: '/image/_sample/prod_x3_3.png',
			alt: '찰리브라운 폭신폭신 슬리퍼 3colors(Butter컬러 28일발송) N212UTS906',
		},
	];

	const saleBenefits = ref([
		{
			title: '특가할인',
			price: '10,000',
		},
	]);

	const saleMemberBenefits = ref([
		{
			title: '회원할인',
			price: '30,000',
		},
		{
			title: '쿠폰할인',
			price: '1,000',
		},
		{
			title: '즉시할인',
			price: '2,000',
		},
		{
			title: '심야할인',
			price: '2,000',
		},
	]);

	type typeDeliveryInfo = {
		shipping_price: number;
		is_free_delivery: boolean;
		conditional_free_price: number;
		extra_shipping_price: number;
		today_exportable_message: string;
		is_conditional_free_delivery: boolean;
	};

	const deliveryInfo = ref<typeDeliveryInfo>({
		shipping_price: 2500,
		is_free_delivery: false,
		conditional_free_price: 25000,
		extra_shipping_price: 5000,
		today_exportable_message: '2시 이전 주문 시 당일 출고 가능',
		is_conditional_free_delivery: true,
	});

	function overlayCardBenefit() {
		const component = defineAsyncComponent(() => import('@/page/card-benefit/CardBenefit.vue'));

		return openOverlay(component);
	}

	const isOptionOpen = ref(false);

	const sortOption1 = ref('');
	const sortOption2 = ref('');
</script>

<style src="./_coop.scss" lang="scss"></style>