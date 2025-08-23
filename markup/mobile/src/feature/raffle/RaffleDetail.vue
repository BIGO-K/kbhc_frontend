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

						<!-- 래플 진행 상태 -->
						<!-- (D) 종료 상태를 제외하고 상태에 따라 클래스를 추가합니다. 진행예정: T=schedule, 진행중: T=proceeding, 종료는 상태 클래스 없습니다. -->
						<div class="m...product-raffle T=proceeding">
							<div class="m...product-raffle-progress">
								<p
									class="text_state"
									style="left: 20%;"
									title="20%"
								>
									진행중
								</p>
								<b style="width: 20%;"><i></i></b>
							</div>
							<!--
								<div class="m...product-raffle-progress">
								<p
								class="text_state"
								style="left: 100%;"
								title="100%"
								>
								종료
								</p>
								<b style="width: 100%;"><i></i></b>
								</div>
							-->
							<!--
								<div class="m...product-raffle-progress">
								<p
								class="text_state"
								style="left: 0%;"
								title="0%"
								>
								진행예정
								</p>
								<b style="width: 0%;"><i></i></b>
								</div>
							-->
							<dl><dt>래플 종료까지</dt><dd>72<span>:</span>18<span>:</span>40</dd></dl>
							<!-- <dl><dt>래플 종료</dt><dd>00<span>:</span>00<span>:</span>00</dd></dl> -->
							<!-- <dl><dt>래플 진행 예정</dt><dd>11월 30일(목)</dd></dl> -->
							<mm-link
								class="mm_btn T=xs T=line"
								:to="{ name: 'Raffle' }"
							>
								<b>Raffle 더보기</b><i class="ico_link"></i>
							</mm-link>
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
									<b>최대 할인가</b><b class="text_price"><strong>{{ number(208000) }}</strong></b>
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
								<dt>래플</dt>
								<dd><span>응모 기간</span><p>2023.11.25 ~ 2023.12.25</p></dd>
								<dd><span>당첨자 발표일</span><p>2023.11.25 ~ 2023.12.25</p></dd>
								<dd><span>당첨자 구매기간</span><p>10.24(화) ~ 11.24(금) 15:00</p></dd>
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
			<!-- 하단고정버튼 -->
			<div class="mm_btn_box T=fixed">
				<div class="mm_flex T=auto">
					<button
						type="button"
						class="mm_btn T=primary"
					>
						<b>응모하기</b>
					</button>
					<!-- <b class="mm_btn T=primary">11.30 (목) 17:00 진행 예정</b> -->
					<!-- <b class="mm_btn T=primary">11.30 (목) 17:00 당첨자 발표 예정</b> -->
					<!-- <b class="mm_btn T=disabled">응모 완료</b> -->
					<!-- <b class="mm_btn T=disabled">구매 완료</b> -->
					<!-- <b class="mm_btn T=disabled">래플 종료</b> -->
					<!--
						<button
						type="button"
						class="mm_btn T=primary"
						>
						<b>구매하기</b>
						</button>
					-->
					<!--
						<button
						type="button"
						class="mm_btn T=primary"
						>
						<b>당첨 결과 확인하기</b>
						</button>
					-->
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
</script>

<style src="./_raffle.scss" lang="scss"></style>