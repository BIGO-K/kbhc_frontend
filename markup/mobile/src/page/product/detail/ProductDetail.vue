<template>
	<layout-detail>
		<template #page>
			<div class="m_prodetail">
				<!-- 상품상세 상단 -->
				<div class="m_prodetail-head">
					<p
						v-if="isSoldout"
						class="m_prodetail-head-soldout"
					>
						품절
					</p>
					<p
						v-else-if="isLowStock"
						class="m_prodetail-head-stock"
					>
						<i class="ico_clock"></i><strong>품절임박</strong>서두르세요!<span>남은수량</span><strong class="text_stock">{{ '1' }}<sub>개</sub></strong>
					</p>

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

						<multiangle-button v-if="useMultiangle"></multiangle-button>

						<div class="mm_inner">
							<p class="text_star">
								<i
									class="ico_star-fill"
									title="별점"
								></i>
								<span>{{ '4.5' }}</span>
								<button
									type="button"
									class="btn_review"
								>
									<b>리뷰 {{ '828' }}개 보기</b>
								</button>
							</p>
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
								<a
									v-if="isCouponDownload"
									class="btn_coupon T=coupon-complete"
								><b>쿠폰받기 완료<i class="ico_coupon-complete"></i></b></a>
								<a
									v-else
									class="btn_coupon"
									href="#"
									@click.prevent="overlayProductDetailCoupon"
								>
									<b>쿠폰받기<i class="ico_coupon-download"></i></b>
								</a>
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

										<timedeal-sale-benefit v-if="useTimedeal && isTimedealCoupon"></timedeal-sale-benefit>

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

							<arrive-probability v-if="useArriveProbability"></arrive-probability>

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
							<dl v-if="saleReservation.sell_start_at != null && saleReservation.ship_start_at != null">
								<dt>예약배송</dt>
								<dd><span>예약판매 기간</span><p>{{ saleReservation.sell_start_at + ' ~ ' + saleReservation.sell_end_at }}</p></dd>
								<dd><span>예약배송 기간</span><p>{{ saleReservation.ship_start_at + ' ~ ' + saleReservation.ship_end_at }}</p></dd>
							</dl>

							<gift-info-button v-if="useGift"></gift-info-button>
						</div>

						<!-- 판매자샵 더보기 -->
						<mm-link
							class="btn_seller"
							:to="{ name: 'SellerShop', params: { id: 123 } }"
						>
							<b>판매자의 다른상품 더보기</b><i class="ico_link"></i>
						</mm-link>

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

					<!-- 추천 아이템 -->
					<section class="m_prodetail-head-recommend">
						<h3 class="m_prodetail-strapline">
							<b>이런 아이템은 어떠세요?</b>
						</h3>
						<div class="mm_scroller T=x">
							<div class="mm_product-list T=card">
								<ul>
									<li
										v-for="item in productItems"
										:key="item.id"
									>
										<product-item
											class="T=pa"
											:goods="item"
										></product-item>
									</li>
								</ul>
							</div>
						</div>
					</section>
				</div>

				<!-- 상품상세 탭 -->
				<div class="m_prodetail-tab">
					<tab-component :tab-items="tabItems"></tab-component>
				</div>

				<div class="m_prodetail-foot">
					<!-- 추천 상품 -->
					<section>
						<h3 class="m_prodetail-strapline">
							<b>이 상품도 좋아하실 것 같아요</b>
						</h3>
						<div class="mm_scroller T=x">
							<div class="mm_product-list T=card">
								<ul>
									<li
										v-for="item in productItems"
										:key="item.id"
									>
										<product-item
											class="T=pa"
											:goods="item"
										></product-item>
									</li>
								</ul>
							</div>
						</div>
					</section>

					<!-- 인기 상품 -->
					<section>
						<h3 class="m_prodetail-strapline">
							<b>이 브랜드의 인기상품</b>
						</h3>
						<div class="mm_scroller T=x">
							<div class="mm_product-list T=card">
								<ul>
									<li
										v-for="item in productItems"
										:key="item.id"
									>
										<product-item
											class="T=pa"
											:goods="item"
										></product-item>
									</li>
								</ul>
							</div>
						</div>
					</section>
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
					<!-- (D) 정기결제 상품일 경우 노출됩니다. -->
					<div class="m_product-option-regular">
						<strong>정기결제</strong>
						<p>주문 다음날부터 10일 간격으로 결제 진행됩니다.</p>
					</div>
					<!--
						(D) 패키지 상품일 경우에만 mm_scroller로 묶어줍니다. 일반 상품일 경우엔 mm_scroller없이 'm_product-option-select', 'mm_scroller m_product-option-selected' 태그를 노출합니다.
						패키지 상품일 때만 옵션 창 영역을 전부 스크롤 영역으로 잡기 위함입니다.
						일반 상품의 경우 선택된 옵션 영역만 스크롤 영역이 됩니다.
					-->
					<div class="mm_scroller">
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
							<!-- (D) 패키지 상품일 경우 -->
							<section>
								<h6><b>상품 A</b></h6>
								<dl>
									<dt>옵션1</dt>
									<dd>
										<form-select v-model="sortOption3">
											<option>옵션명1</option>
										</form-select>
									</dd>
								</dl>
								<dl>
									<dt>옵션2</dt>
									<dd>
										<form-select v-model="sortOption4">
											<option>옵션명2</option>
										</form-select>
									</dd>
								</dl>
							</section>

							<restock-apply v-if="isSoldout"></restock-apply>
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
										<span
											v-if="isLowStock"
											class="text_stock"
										>남은 수량 5개</span>
									</div>
									<form-stepper
										v-model="optionStepper1"
										:max="99"
									>
									</form-stepper>
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
								<!-- (D) 패키지 상품일 경우 -->
								<li>
									<div class="m...selected-info">
										<strong class="text_product">
											시그니처 엠블럼 티셔츠 SIGNATURE EMBLEM T-SHIRT - 5color 프로텍팅내츄럴
										</strong>
										<p class="text_option">
											블랙/95
										</p>
										<span
											v-if="isLowStock"
											class="text_stock"
										>남은 수량 5개</span>
									</div>
									<div class="m...selected-info">
										<strong class="text_product">
											시그니처 엠블럼 티셔츠 SIGNATURE EMBLEM T-SHIRT - 5color 프로텍팅내츄럴
										</strong>
										<p class="text_option">
											블랙/95
										</p>
										<span
											v-if="isLowStock"
											class="text_stock"
										>남은 수량 5개</span>
									</div>
									<form-stepper
										v-model="optionStepper2"
										:max="99"
									>
									</form-stepper>
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
						</div>
					</div>
					<div class="m_product-option-foot">
						<dl>
							<dt>총 상품금액</dt>
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
									<b>장바구니</b>
								</button>
								<button
									type="button"
									class="mm_btn T=lg T=primary"
								>
									<b>구매하기</b>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 하단고정버튼 -->
			<div class="mm_btn_box T=fixed">
				<div class="mm_flex T=auto">
					<toggle
						:is-active="isWished"
						class="mm_btn T=light btn_like"
					>
						<i class="ico_like"></i>
						<b class="mm_ir-blind">찜하기</b>
					</toggle>
					<template v-if="!isSoldout">
						<button
							type="button"
							class="mm_btn T=primary"
							@click="isOptionOpen = true"
						>
							<b>선물하기</b>
						</button>
						<button
							type="button"
							class="mm_btn T=primary"
							@click="isOptionOpen = true"
						>
							<b>구매하기</b>
						</button>
					</template>

					<restock-apply-bottom v-if="isSoldout"></restock-apply-bottom>

					<!-- <b class="mm_btn T=disabled">품절</b> -->
				</div>
			</div>
		</template>

		<template
			v-if="useTimedeal"
			#timedeal
		>
			<timedeal-countdown></timedeal-countdown>
		</template>
	</layout-detail>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref, computed } from 'vue';
	import { useShareStore } from '$/stores/useShareStore';
	import { useFakeCreator } from '$/composables/useFakeCreator';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useHead } from '$/composables/useHead';
	import LayoutDetail from '@/component/layout/LayoutDetail.vue';
	import Carousel from '@/component/Carousel.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import TabComponent from '@/component/TabComponent.vue';
	import Toggle from '@/component/Toggle.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import FormStepper from '@/component/form/FormStepper.vue';
	import ArriveProbability from '@/feature/arrive-probability/component/ArriveProbability.vue';
	import giftInfoButton from '@/feature/gift/component/GiftInfoButton.vue';
	import Headline from '@/feature/headline/Headline.vue';
	import multiangleButton from '@/feature/multiangle/component/MultiangleButton.vue';
	import RestockApplyBottom from '@/feature/restock/component/RestockApplyBottomButton.vue';
	import RestockApply from '@/feature/restock/component/RestockApplyButton.vue';
	import TimedealCountdown from '@/feature/timedeal/component/TimedealCountdown.vue';
	import TimedealSaleBenefit from '@/feature/timedeal/component/TimedealSaleBenefit.vue';

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

	type typeSaleReservation = {
		sell_start_at: Nullable<string>;
		sell_end_at: Nullable<string>;
		ship_start_at: Nullable<string>;
		ship_end_at: Nullable<string>;
	};

	const saleReservation = ref<typeSaleReservation>({
		sell_start_at: '0000-00-00',
		sell_end_at: '1111-11-11',
		ship_start_at: '2222-22-22',
		ship_end_at: '3333-33-33',
	});

	// XXX 상품 임시
	const productItems = useFakeCreator().goods(7);

	function overlayCardBenefit() {
		const component = defineAsyncComponent(() => import('@/page/card-benefit/CardBenefit.vue'));

		return openOverlay(component);
	}

	function overlayProductDetailCoupon() {
		const component = defineAsyncComponent(() => import('@/page/product/detail/coupon/ProductDetailCoupon.vue'));

		return openOverlay(component);
	}

	const tabItems = [
		{
			id: 'info',
			tab: '상세정보',
			component: defineAsyncComponent(() => import(`@/page/product/detail/component/ProductDetailInfo.vue`)),
		},
		{
			id: 'review',
			tab: `<span>리뷰</span><small>${999}</small>`,
			isTabHTML: true,
			component: defineAsyncComponent(() => import(`@/page/product/detail/component/ProductDetailReview.vue`)),
		},
		{
			id: 'qna',
			tab: `<span>상품 Q&A</span><small>${999}</small>`,
			isTabHTML: true,
			component: defineAsyncComponent(() => import(`@/page/product/detail/component/ProductDetailQna.vue`)),
		},
		{
			id: 'seller',
			tab: '판매자 정보',
			component: defineAsyncComponent(() => import(`@/page/product/detail/component/ProductDetailSeller.vue`)),
		},
	];

	const isWished = ref(false);
	const isOptionOpen = ref(false);

	const sortOption1 = ref('');
	const sortOption2 = ref('');
	const sortOption3 = ref('');
	const sortOption4 = ref('');
	const optionStepper1 = ref(1);
	const optionStepper2 = ref(1);

	const isSoldout = computed(() => Math.floor(Math.random() * 2) == 0 ? true : false);
	const isLowStock = computed(() => Math.floor(Math.random() * 2) == 0 ? true : false);
	const isCouponDownload = computed(() => Math.floor(Math.random() * 2) == 0 ? true : false);

	const useArriveProbability = computed(() => Math.floor(Math.random() * 2) == 0 ? true : false);

	const useGift = computed(() => Math.floor(Math.random() * 2) == 0 ? true : false);

	const useMultiangle = computed(() => Math.floor(Math.random() * 2) == 0 ? true : false);

	const useTimedeal = computed(() => Math.floor(Math.random() * 2) == 0 ? true : false);
	const isTimedealCoupon = computed(() => Math.floor(Math.random() * 2) == 0 ? true : false);
</script>