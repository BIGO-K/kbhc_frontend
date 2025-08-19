<template>
	<layout-detail>
		<template #page>
			<div
				v-if="goodsDetail"
				class="m_prodetail"
			>
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
						<i class="ico_clock"></i><strong>품절임박</strong>서두르세요!<span>남은수량</span><strong class="text_stock">{{ stockState?.stock }}<sub>개</sub></strong>
					</p>

					<!-- 상품정보 -->
					<div class="m_prodetail-head-product">
						<!-- 상품이미지 -->
						<carousel
							:items="goodsDetail.thumbnail_urls"
							effect="cover"
							:use-pagination="true"
							:is-more-side="true"
							:is-error-remove="true"
						>
							<template #default="{ item: imageUrl }">
								<lazyload
									class="mm_bg-contain"
									:src="imageUrl"
								></lazyload>
								<span class="mm_ir-blind">상품 이미지</span>
							</template>
						</carousel>

						<multiangle-button
							v-if="goodsDetail.degree_360_image_urls.length > 0"
							:degree-image-urls="goodsDetail.degree_360_image_urls"
						></multiangle-button>

						<div class="mm_inner">
							<p
								v-if="shoppingAggregate && shoppingAggregate.total_review_count > 0"
								class="text_star"
							>
								<i
									class="ico_star-fill"
									title="별점"
								></i>
								<span>{{ shoppingAggregate.review_average_star }}</span>
								<button
									type="button"
									class="btn_review"
									@click="toTab = 'review'"
								>
									<b>리뷰 {{ number(shoppingAggregate.total_review_count) }}개 보기</b>
								</button>
							</p>
							<mm-link
								class="btn_brand"
								:to="{ name: 'BrandShop', params: { id: goodsDetail.brand_id } }"
							>
								<b>{{ goodsDetail.brand_name }}</b><i class="ico_link"></i>
							</mm-link>
							<p class="text_product">
								<headline
									v-if="goodsDetail.headline"
									:headline="goodsDetail.headline"
								></headline>
								{{ goodsDetail.name }}
							</p>
							<p
								v-if="promotion"
								class="text_price"
							>
								<span
									v-if="promotion.sale_rate > 0"
									class="text_sale"
								>{{ `${promotion.sale_rate}%` }}</span>
								<strong>{{ number(promotion.base_discounted_price) }}</strong>
								<del v-if="promotion.sale_rate > 0">{{ number(promotion.price) }}</del>
							</p>
						</div>
					</div>
					<div class="mm_inner">
						<!-- 할인정보 -->
						<div class="m_prodetail-head-benefit">
							<div class="m...benefit-coupon">
								<p>오케어몰 고객을 위한 혜택</p>
								<!--
									<a
									v-if="isCouponDownload"
									class="btn_coupon T=coupon-complete"
									><b>쿠폰받기 완료<i class="ico_coupon-complete"></i></b></a>
								-->
								<button
									v-if="promotion?.is_downloadable_coupon || false"
									class="btn_coupon"
									type="button"
									@click="_e => overlayProductDetailCoupon(_e)"
								>
									<b>쿠폰받기<i class="ico_coupon-download"></i></b>
								</button>
							</div>
							<dropdown button-class="mm_flex">
								<template #button>
									<b>최대 할인가</b><b class="text_price"><strong>{{ number(promotion?.max_discounted_price) }}</strong></b>
								</template>
								<template #content>
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

										<timedeal-sale-benefit
											v-if="isTimeDeal && promotion.time_sale_amount > 0"
											:time-sale-amount="promotion.time_sale_amount"
										></timedeal-sale-benefit>

										<dl>
											<dt>회원 혜택가</dt>
											<dd class="text_price">
												<span>{{ number(promotion.max_discounted_price) }}</span>
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
							<template v-if="goodsDetail.delivery_info">
								<dl>
									<dt>배송정보</dt>
									<dd v-if="goodsDetail.delivery_info.is_free_delivery">
										무료배송
									</dd>
									<dd v-else>
										배송비 {{ number(goodsDetail.delivery_info.shipping_price) }}원
										{{ goodsDetail.delivery_info.is_package_delivery ? '' : ' (개별 부과)' }}
									</dd>
									<dd v-if="goodsDetail.delivery_info.is_conditional_free_delivery">
										{{ number(goodsDetail.delivery_info.conditional_free_price) + '원 이상 구매 시 무료배송' }}
									</dd>
									<dd v-if="goodsDetail.delivery_info.extra_shipping_price > 0">
										{{ '도서산간지역 ' + number(goodsDetail.delivery_info.extra_shipping_price) + '원' }}
									</dd>
									<template v-if="goodsDetail.is_custom_made">
										<!-- (D) 주문제작 상품인 경우 노출합니다 -->
										<dd>배송기간 {{ goodsDetail.custom_made_delivery_day }}일</dd>
										<dd>주문 제작 상품 교환/반품 불가합니다</dd>
									</template>
									<template v-if="goodsDetail.is_oversea_delivery">
										<dd>해외배송 상품</dd>
										<dd>배송기간 {{ goodsDetail.oversea_delivery_min }} ~ {{ goodsDetail.oversea_delivery_max }}일</dd>
									</template>
								</dl>

								<arrive-probability
									v-if="goodsDetail.delivery_info.shipping_arrival_probability_list.length > 0"
									:shipping-arrival-probabilities="goodsDetail.delivery_info.shipping_arrival_probability_list"
									:exportable-message="goodsDetail.delivery_info.today_exportable_message"
								></arrive-probability>
							</template>

							<dl v-if="goodsDetail.subscribe">
								<dt>정기결제</dt>
								<dd>회차: {{ goodsDetail.subscribe.nth + 1 }}회</dd>
							</dl>

							<dl v-if="creditCardInstallment">
								<dt>혜택</dt>
								<dd>
									<button
										type="button"
										@click="_e => overlayCardBenefit(_e)"
									>
										<b>{{ creditCardInstallment.title }}</b><i class="ico_tooltip"></i>
									</button>
								</dd>
							</dl>
							<dl v-if="goodsDetail.sale_reserve">
								<dt>예약배송</dt>
								<dd><span>예약판매 기간</span><p>{{ goodsDetail.sale_reserve.sell_start_at + ' ~ ' + goodsDetail.sale_reserve.sell_end_at }}</p></dd>
								<dd><span>예약배송 기간</span><p>{{ goodsDetail.sale_reserve.ship_start_at + ' ~ ' + goodsDetail.sale_reserve.ship_end_at }}</p></dd>
							</dl>
						</div>

						<!-- 판매자샵 더보기 -->
						<mm-link
							class="btn_seller"
							:to="{ name: 'SellerShop', params: { id: goodsDetail.seller_id } }"
						>
							<b>판매자의 다른상품 더보기</b><i class="ico_link"></i>
						</mm-link>

						<!-- 공유하기 -->
						<div class="mm_btn_box">
							<button
								type="button"
								class="mm_btn T=line btn_share"
								@click="shareStore.open(
									$event,
									goodsDetail.name,
									`#${goodsDetail.brand_name}#${goodsDetail.name}`,
									goodsDetail.thumbnail_urls[0],
									route.fullPath,
									`/category/${goodsDetail.category.depth3_category_code}`
								)"
							>
								<i class="ico_share"></i><b>공유하기</b>
							</button>
						</div>
					</div>

					<!-- 추천 아이템 -->
					<section
						v-if="packageGoodsList.length > 0"
						class="m_prodetail-head-recommend"
					>
						<h3 class="m_prodetail-strapline">
							<b>이런 아이템은 어떠세요?</b>
						</h3>
						<div class="mm_scroller T=x">
							<div class="mm_product-list T=card">
								<ul>
									<li
										v-for="item in packageGoodsList"
										:key="item.id"
									>
										<product-item
											class="T=pa"
											:goods="{
												id: item.id,
												name: item.name,
												thumbnail_url: item.thumbnail_url,
												brand_name: item.brand_name,
												base_discounted_price: item.base_discounted_price,
												headline: null
											}"
										></product-item>
									</li>
								</ul>
							</div>
						</div>
					</section>
				</div>

				<!-- 상품상세 탭 -->
				<product-detail-tab
					v-model:to-tab-id="toTab"
					:need-tab-focus-change="needTabFocusChange"
					:data="{
						goodsDetail: goodsDetail,
						information,
						shoppingAggregate,
						reviewWritable: goodsForMe.is_writable_review,
					}"
				></product-detail-tab>

				<div class="m_prodetail-foot">
					<!-- 추천 상품 -->
					<section v-if="advertisementGoodsList.length > 0">
						<h3 class="m_prodetail-strapline">
							<b>광고 추천</b>
						</h3>
						<div class="mm_scroller T=x">
							<div class="mm_product-list T=card">
								<ul>
									<li
										v-for="item in advertisementGoodsList"
										:key="item.id"
									>
										<product-item
											class="T=pa"
											:goods="{
												id: item.id,
												name: item.name,
												thumbnail_url: item.thumbnail_url,
												brand_name: item.brand_name,
												base_discounted_price: item.base_discounted_price,
												is_soldout: item.is_soldout,
												headline: null
											}"
										></product-item>
									</li>
								</ul>
							</div>
						</div>
					</section>

					<!-- 추천 상품 -->
					<section v-if="categoryBestGoodsList.length > 0">
						<h3 class="m_prodetail-strapline">
							<b>이 상품도 좋아하실 것 같아요</b>
						</h3>
						<div class="mm_scroller T=x">
							<div class="mm_product-list T=card">
								<ul>
									<li
										v-for="item in categoryBestGoodsList"
										:key="item.id"
									>
										<product-item
											class="T=pa"
											:goods="{
												id: item.id,
												name: item.name,
												thumbnail_url: item.thumbnail_url,
												brand_name: item.brand_name,
												base_discounted_price: item.base_discounted_price,
												is_soldout: item.is_soldout,
												headline: null
											}"
										></product-item>
									</li>
								</ul>
							</div>
						</div>
					</section>

					<!-- 인기 상품 -->
					<section v-if="brandBestGoodsList.length > 0">
						<h3 class="m_prodetail-strapline">
							<b>이 브랜드의 인기상품</b>
						</h3>
						<div class="mm_scroller T=x">
							<div class="mm_product-list T=card">
								<ul>
									<li
										v-for="item in brandBestGoodsList"
										:key="item.id"
									>
										<product-item
											class="T=pa"
											:goods="{
												id: item.id,
												name: item.name,
												thumbnail_url: item.thumbnail_url,
												brand_name: item.brand_name,
												base_discounted_price: item.base_discounted_price,
												headline: null,
												is_soldout: item.is_soldout
											}"
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
													<td>{{ goodsDetail.id }}</td>
												</tr>
												<tr>
													<th scope="row">
														<b>상품상태</b>
													</th>
													<td>{{ information?.use_state_label }}</td>
												</tr>
												<tr>
													<th scope="row">
														<b>브랜드</b>
													</th>
													<td>{{ goodsDetail.brand_name }}</td>
												</tr>
												<tr>
													<th scope="row">
														<b>원산지</b>
													</th>
													<td>{{ information?.origin_label }}</td>
												</tr>
											</tbody>
										</table>
									</template>
								</dropdown>
							</li>
							<li v-if="information">
								<dropdown tag="dl">
									<template #button>
										<p><b>상품정보고시</b></p>
									</template>
									<template #content>
										<table>
											<tbody>
												<tr
													v-for="mandatory in information.mandatory"
													:key="mandatory.title"
												>
													<th scope="row">
														<b>{{ mandatory.title }}</b>
													</th>
													<td>{{ mandatory.content }}</td>
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
					<toggle
						:is-active="goodsForMe.is_wished"
						class="mm_btn T=light btn_like"
						is-lazy
						@click="_target => overlayMyWishlistProductFolder(_target)"
					>
						<i class="ico_like"></i>
						<b class="mm_ir-blind">찜하기</b>
					</toggle>
					<template v-if="promotion.max_discounted_price < 1">
						<button
							type="button"
							class="mm_btn T=primary"
							disabled
						>
							<b>구매불가</b>
						</button>
					</template>
					<template v-else-if="!stockState.is_soldout">
						<button
							type="button"
							class="mm_btn T=primary"
							@click="(_e) => { isOptionOpen = true; forGift = true; $btnOptionOpenTarget = _e.currentTarget as HTMLElement; }"
						>
							<b>선물하기</b>
						</button>
						<button
							type="button"
							class="mm_btn T=primary"
							@click="(_e) => { isOptionOpen = true; $btnOptionOpenTarget = _e.currentTarget as HTMLElement; }"
						>
							<b>구매하기</b>
						</button>
					</template>
					<template v-else>
						<button
							v-if="stockState.stock > 1"
							type="button"
							class="mm_btn T=primary"
							disabled
						>
							<b>품절</b>
						</button>
						<button
							v-else
							type="button"
							class="mm_btn T=primary"
							@click="modalRestockApply"
						>
							<b>재입고 알림받기</b>
						</button>
					</template>
				</div>
			</div>

			<div
				class="m_product-option"
				:class="{ 'S=option-open': isOptionOpen }"
			>
				<div
					class="m_product-option-dim"
					@click="() => { isOptionOpen = false; forGift = false }"
				></div>
				<div class="m_product-option-inner">
					<button
						ref="$btnOptionClose"
						type="button"
						class="btn_option-close"
						@click="() => { isOptionOpen = false; forGift = false }"
					>
						<b class="mm_ir-blind">옵션선택 닫기</b>
					</button>
					<div
						v-if="goodsDetail.subscribe"
						class="m_product-option-regular"
					>
						<strong>정기결제</strong>
						<p>주문 다음날부터 {{ goodsDetail.subscribe.interval_of_days }}일 간격으로 결제 진행됩니다.</p>
					</div>

					<!-- 옵션 목록 -->
					<!--
						(D) 모든 옵션은 옵션의 순서와 무관하게 우선 선택이 가능합니다(예: 옵션2부터 선택가능)
						(D) 옵션1, 2가 1개의 옵션만 있을 경우 별도의 옵션 선택 동작 없이 옵션이 선택된 상태로 노출되며, 수량 변경만 가능합니다.
						(D) 옵션1 혹은 옵션2만 등록한 단일옵션의 경우 1개의 옵션만 선택하게 됩니다. 이 때 옵션의 'h6' 요소는 옵션1 또는 옵션2의 명칭이 아닌 '옵션' 명칭을 사용합니다.
					-->
					<goods-options
						v-if="!isSingleOption && !stockState.is_soldout"
						:options="options"
						add-option-with-clear
						@add-option="addOption"
					></goods-options>

					<!-- 선택된 옵션 -->
					<div
						v-if="selectedOptions.length > 0"
						class="mm_scroller m_product-option-selected"
					>
						<ul>
							<li
								v-for="selectedOption in selectedOptions"
								:key="selectedOption.code"
							>
								<div class="m...selected-info">
									<p class="text_product">
										{{ goodsDetail.name }}
									</p>
									<p class="text_option">
										{{ selectedOption.name }} {{ selectedOption.option_name === '' ? '' : `/ ${selectedOption.option_name}` }}
									</p>
									<span
										v-if="selectedOption.stock <= 5"
										class="text_stock"
									>남은 수량 {{ selectedOption.stock }}개</span>
								</div>
								<form-stepper
									v-model="selectedOption.buy_amount"
									:max="selectedOption.stock"
									:for-gifticon="goodsDetail.type === GOODS_TYPE.gifticon"
								>
								</form-stepper>
								<p class="text_price">
									<strong>{{ number( (promotion.base_discounted_price + selectedOption.option_price) * selectedOption.buy_amount) }}</strong>
								</p>
								<button
									v-if="!isSingleOption"
									type="button"
									class="btn_option-remove"
									@click="removeSelected(selectedOption)"
								>
									<i class="ico_option-remove"></i><b class="mm_ir-blind">옵션삭제</b>
								</button>
							</li>
						</ul>
					</div>
					<div class="m_product-option-foot">
						<dl>
							<dt>총 상품금액</dt>
							<dd class="text_price">
								<strong class="mm_text-secondary">{{ number(totalSelectedPrice) }}</strong>
							</dd>
						</dl>
						<div class="mm_btn_box">
							<div class="mm_flex T=equal">
								<template v-if="forGift">
									<button
										type="button"
										class="mm_btn T=lg T=primary"
										@click="buy"
									>
										<b>선물하기</b>
									</button>
								</template>
								<template v-else>
									<button
										type="button"
										class="mm_btn T=lg T=primary"
										@click="addCart"
									>
										<b>장바구니</b>
									</button>
									<button
										type="button"
										class="mm_btn T=lg T=primary"
										@click="buy"
									>
										<b>구매하기</b>
									</button>
								</template>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>

		<template
			v-if="isTimeDeal && timeDealInfo"
			#timedeal
		>
			<timedeal-countdown
				:stock="stockState.stock"
				:time-deal-info="timeDealInfo"
			></timedeal-countdown>
		</template>
	</layout-detail>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
	import { onBeforeRouteUpdate } from 'vue-router';
	import { useOrderStore } from '$/stores/useOrderStore';
	import { useRecentViewGoodsStore } from '$/stores/useRecentViewGoodsStore';
	import { useShareStore } from '$/stores/useShareStore';
	import { useWishedStore } from '$/stores/useWishedStore';
	import { useCart } from '$/composables/useCart';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useGoodsAdditional } from '$/composables/useGoodsAdditional';
	import { useGoodsDetail } from '$/composables/useGoodsDetail';
	import { useHead } from '$/composables/useHead';
	import { useTimeDeal } from '$/composables/useTimeDeal';
	import { GOODS_TYPE } from '$/constants/index';
	import LayoutDetail from '@/component/layout/LayoutDetail.vue';
	import Carousel from '@/component/Carousel.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import GoodsOptions from '@/component/GoodsOptions.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import Toggle from '@/component/Toggle.vue';
	import FormStepper from '@/component/form/FormStepper.vue';
	import ArriveProbability from '@/feature/arrive-probability/component/ArriveProbability.vue';
	import Headline from '@/feature/headline/Headline.vue';
	import multiangleButton from '@/feature/multiangle/component/MultiangleButton.vue';
	import TimedealCountdown from '@/feature/timedeal/component/TimedealCountdown.vue';
	import TimedealSaleBenefit from '@/feature/timedeal/component/TimedealSaleBenefit.vue';
	import ProductDetailTab from '@/page/product/detail/component/ProductDetailTab.vue';
	import { productDetailGuard } from '@/router/guard/productDetailGuard';

	const {
		bom,
		loading,
		route,
		router,
		openOverlay,
		openModal,
	} = useGlobalPageContext();

	const forGift = ref<boolean>(false);
	const goodsId = computed(() => (Number(`${route.params.id}`)));

	const {
		goodsDetail,
		options,
		promotion,
		stockState,
		creditCardInstallment,
		getPackageGoodsList,
		getBrandBestGoodsList,
		getCategoryBestGoodsList,
		getAdvertisementGoodsList,
		getDownloadableCoupons,
		saleMemberBenefits,
		refetch,
		me,
	} = await useGoodsDetail(goodsId.value);

	const orderStore = useOrderStore();

	const { number } = useFormatter();
	const shareStore = useShareStore();
	/** 패키지(세트) 상품 */
	const packageGoodsList = ref<PackageGoods[]>([]);
	/** 카테고리 / 브랜드 베스트 상품 */
	const categoryBestGoodsList = ref<BestGoods[]>([]);
	const brandBestGoodsList = ref<BestGoods[]>([]);
	const advertisementGoodsList = ref<BestGoods[]>([]);

	const { getInformation, getReactionAggregate, checkPayMethod } = useGoodsAdditional();

	const [pInformation, pReactionAggregate] = await Promise.all([
		getInformation(goodsId.value),
		getReactionAggregate(goodsId.value),
	]);

	const information = ref<GoodsInformation>(pInformation);
	const shoppingAggregate = ref<GoodsReactionAggregate>(pReactionAggregate);
	const goodsForMe = ref<{ is_wished: boolean; is_writable_review: boolean }>({
		is_wished: false,
		is_writable_review: false,
	});


	useHead({ title: `${goodsDetail.value.name || '상품상세'}` });

	const toTab = ref<string>('');
	const needTabFocusChange = ref<boolean>(true);

	async function fetchAdditionalData() {
		Promise.all([
			getPackageGoodsList(goodsDetail.value.id)
				.then(list => packageGoodsList.value = list),
			getCategoryBestGoodsList(goodsId.value)
				.then(bestGoodsList => categoryBestGoodsList.value = bestGoodsList),
			getBrandBestGoodsList(goodsId.value)
				.then(bestGoodsList => brandBestGoodsList.value = bestGoodsList),
			getAdvertisementGoodsList(goodsId.value)
				.then(goodsList => advertisementGoodsList.value = goodsList),
			me(goodsId.value).then(me => goodsForMe.value = me),
		]);
	}

	/** 카드 무이자 오버레이 */
	const overlayCardBenefit = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/card-benefit/CardBenefit.vue')), {
			props: {
				cardInstallmentInfo: creditCardInstallment,
			},
			clickElement: _e.currentTarget,
		});
	};

	const downloadAbleCoupons = ref<{
		coupons: DownloadableCoupon[];
		fetched: boolean;
	}>({
		coupons: [],
		fetched: false,
	});

	/** 상품 쿠폰 오버레이 */
	const overlayProductDetailCoupon = async (_e: MouseEvent) => {
		if (!downloadAbleCoupons.value.fetched) {
			downloadAbleCoupons.value.coupons = await getDownloadableCoupons(goodsId.value);
			downloadAbleCoupons.value.fetched = true;
		}

		openOverlay(defineAsyncComponent(() => import('@/page/product/detail/coupon/ProductDetailCoupon.vue')), {
			props: {
				coupons: downloadAbleCoupons.value.coupons,
			},
			clickElement: _e.currentTarget,
		});
	};

	const isOptionOpen = ref(false);
	const selectedOptions = ref<SelectedItem[]>([]);
	const $btnOptionClose = ref<HTMLButtonElement>();
	const $btnOptionOpenTarget = ref<HTMLElement>();

	const isSingleOption = computed(() => options.value.length === 1 && options.value[0].sub.length === 1);
	singleOptionAdd();

	function singleOptionAdd() {
		if (isSingleOption.value && !stockState.value.is_soldout) {
			const subOption = options.value[0].sub[0] as GoodsSubOption;
			selectedOptions.value.push({
				name: options.value[0].name,
				code: subOption.code,
				option_name: subOption.name,
				option_price: subOption.extra_amount,
				goods_price: promotion.value.sell_price,
				buy_amount: 1,
				stock: subOption.qty,
			});
		}
	}



	// (접근성) 옵션 창 노출 시 포커스 강제 이동
	// watch(isOptionOpen, (_state) => {
	// 	if (_state) $btnOptionClose.value?.focus();
	// 	else $btnOptionOpenTarget.value?.focus();
	// });

	/** 옵션 추가  */
	function addOption(addOption: GoodsOption, subOption: GoodsSubOption) {
		if (selectedOptions.value.find((option) => option.code === subOption.code)) {
			return bom.alert('이미 존재하는 옵션입니다.');
		}

		selectedOptions.value.push({
			name: addOption.name,
			code: subOption.code,
			option_name: subOption.name.trim() == '-' ? '' : subOption.name,
			option_price: subOption.extra_amount,
			goods_price: promotion.value.sell_price,
			buy_amount: 1,
			stock: subOption.qty,
		});
		// if (!$productOption.value) return;
		// if (!$productOption.value.style.height) $productOption.value.style.height = '77%';
	}

	/** 선택된 옵션 삭제 처리 * */
	function removeSelected(selected: SelectedItem) {
		selectedOptions.value = selectedOptions.value.filter((option) => option.code !== selected.code);
	}
	/** 최종 선택된 가격 */
	const totalSelectedPrice = computed(() => {
		return selectedOptions.value.reduce((sum, selectedOption) =>
			sum + ((promotion.value.base_discounted_price + selectedOption.option_price) * selectedOption.buy_amount), 0
		);
	});

	/** 장바구니 담는 함수 */
	async function addCart() {
		if (selectedOptions.value.length < 1) {
			return bom.alert('상품을 선택해주세요.');
		}

		loading.show();

		if (!checkPayMethod(goodsDetail.value.usable_pay_method_code)) {
			return bom.alert('해당 상품은 스타포인트로만 구매 가능합니다. 회원님은 보유 스타포인트가 없어 구매가 불가합니다.');
		}
		try {
			await useCart().add(selectedOptions.value.map(selected => ({
				goods_id: goodsId.value,
				option_id: selected.code,
				ea: selected.buy_amount,
			})));


			bom.confirm('선택하신 상품을 장바구니에 담았습니다. \n장바구니로 이동하시겠습니까?', flag => {
				if (!flag) {
					return;
				}

				router.push({
					name: 'Cart',
				});


			}, {
				okLabel: '장바구니 가기',
				cancelLabel: '쇼핑 계속하기',
			});
		}
		catch (error) {
			useErrorAlert(error);
		}
		finally {
			loading.hide();
		}
	}

	/** 구매처리 * */
	async function buy() {
		if (selectedOptions.value.length < 1) {
			return bom.alert('선택된 상품이 없습니다.');
		}
		const buyItems: SelectedForOrder[] = selectedOptions.value.map(option => {
			return {
				goods_id: goodsId.value,
				option_id: option.code,
				ea: option.buy_amount,
			};
		});

		/**  타임어택 상품 구매 수량 제한 처리 * */
		if (goodsDetail.value.type === GOODS_TYPE.timedeal && timeDealInfo.value && timeDealInfo.value.max_orderable_count > 0) {
			const sumBuyAmount = selectedOptions.value.reduce(
				(previousValue, currentValue) => previousValue + currentValue.buy_amount,
				0
			);
			if (sumBuyAmount > timeDealInfo.value.max_orderable_count) {
				return bom.alert(`1인당 구매제한 개수는 ${timeDealInfo.value.max_orderable_count}개 입니다.`);
			}
		}

		if (!checkPayMethod(goodsDetail.value.usable_pay_method_code)) {
			return bom.alert('해당 상품은 스타포인트로만 구매 가능합니다. 회원님은 보유 스타포인트가 없어 구매가 불가합니다.');
		}

		loading.show();
		try {
			const orderId = await orderStore.generateOrderId(buyItems, forGift.value);
			router.push({
				name: 'Order',
				params: {
					id: orderId,
				},
			});
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}


	const isSoldout = computed(() => stockState.value.is_soldout ? true : false);
	const isLowStock = computed(() => (stockState.value.stock || 0) < 6 ? true : false);
	const isTimeDeal = computed(() => goodsDetail.value.type === GOODS_TYPE.timedeal);

	const { add: addRecentViewGoods } = useRecentViewGoodsStore();

	const { getInformation: getTimeDealInformation } = useTimeDeal();
	const timeDealInfo = ref<Nullable<TimeDealInformation>>(null);
	if (isTimeDeal.value) {
		timeDealInfo.value = await getTimeDealInformation(goodsId.value);
	}
	const { isWishedGoods, remove } = useWishedStore();

	const overlayMyWishlistProductFolder = async (_target: HTMLElement) => {
		if (goodsForMe.value.is_wished) {
			goodsForMe.value.is_wished = false;
			shoppingAggregate.value.wish_count = shoppingAggregate.value.wish_count - 1;

			return await remove([goodsId.value]);
		}

		openOverlay(defineAsyncComponent(() => import('@/page/mypage/wishlist/product/folder/MyWishlistProductFolder.vue')), {
			props: {
				type: 'add',
				goodsId: goodsId.value,
			},
			clickElement: _target,
			onClose: () => {
				goodsForMe.value.is_wished = isWishedGoods(goodsId.value);
				if (goodsForMe.value.is_wished) {
					shoppingAggregate.value.wish_count = shoppingAggregate.value.wish_count + 1;
				}
			},
		});
	};

	const modalRestockApply = (_e: MouseEvent) => {
		openModal(defineAsyncComponent(() => import('@/feature/restock/RestockApply.vue')), {
			props: {
				goodsId: goodsId.value,
				options: options.value,
			},
			clickElement: _e.currentTarget,
		});
	};


	onBeforeUnmount(() => {
		goodsIdWatcher();
	});

	onBeforeRouteUpdate(async (to, from, next) => {
		await productDetailGuard(to, from, next);
	});

	const goodsIdWatcher = watch(goodsId, async (to) => {
		if (route.name !== 'ProductDetail') {
			return;
		}
		needTabFocusChange.value = false;
		toTab.value = 'info';

		loading.show();
		const scroller = document.querySelector('.mm_scroller');
		try {
			await refetch(to);
			selectedOptions.value = [];
			if (scroller) {
				scroller.scrollTop = 0;
			}


			const [pInformation, pReactionAggregate] = await Promise.all([
				getInformation(goodsId.value),
				getReactionAggregate(goodsId.value),
			]);

			information.value = pInformation;
			shoppingAggregate.value = pReactionAggregate;

			useHead({ title: goodsDetail.value.name });
			/** 단일옵션인경우 추가 처리 */
			singleOptionAdd();

			addRecentViewGoods({
				id: goodsId.value,
				name: goodsDetail.value.name,
				brand_name: goodsDetail.value.brand_name,
				thumbnail_url: goodsDetail.value.thumbnail_urls[0],
				base_discounted_price: promotion.value.base_discounted_price,
				sale_rate: promotion.value.sale_rate,
				is_soldout: stockState.value.is_soldout,
			});
			fetchAdditionalData();
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
			needTabFocusChange.value = true;
		}

	});

	onMounted(() => {
		fetchAdditionalData();

		addRecentViewGoods({
			id: goodsId.value,
			name: goodsDetail.value.name,
			brand_name: goodsDetail.value.brand_name,
			thumbnail_url: goodsDetail.value.thumbnail_urls[0],
			base_discounted_price: promotion.value.base_discounted_price,
			sale_rate: promotion.value.sale_rate,
			is_soldout: stockState.value.is_soldout,
		});
	});
</script>