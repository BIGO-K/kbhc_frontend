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
						<i class="ico_clock"></i><strong>품절임박</strong>서두르세요!<span>남은수량</span><strong class="text_stock">{{ bundleLowStock }}<sub>개</sub></strong>
					</p>

					<!-- 상품정보 -->
					<div class="m_prodetail-head-product">
						<!-- 상품이미지 -->
						<carousel
							:items="bundleGoodsDetail.bundle.thumbnail_urls"
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
								<span class="mm_ir-blind">상품 썸네일 이미지</span>
							</template>
						</carousel>

						<multiangle-button
							v-if="bundleGoodsDetail.bundle.degree_360_image_urls.length > 0"
							:degree-image-urls="bundleGoodsDetail.bundle.degree_360_image_urls"
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
									@click="toTabId = 'review'"
								>
									<b>리뷰 {{ number(shoppingAggregate.total_review_count) }}개 보기</b>
								</button>
							</p>

							<p class="text_product">
								{{ bundleGoodsDetail.bundle.name }}
							</p>
							<p class="text_price">
								<span
									v-if="promotion.sale_rate"
									class="text_sale"
								>{{ promotion.sale_rate }}%</span>
								<strong>{{ number(promotion.base_discounted_price) }}</strong>
								<del v-if="promotion.sale_rate > 0">{{ number(promotion.price) }}</del>
							</p>
						</div>
					</div>
					<div class="mm_inner">
						<!-- 할인정보 -->
						<div class="m_prodetail-head-benefit">
							<div class="m...benefit-coupon">
								<p>O’CARE 쇼핑몰 고객을 위한 혜택</p>
								<button
									class="btn_coupon"
									type="button"
									@click="_e => overlayProductDetailCoupon(_e)"
								>
									<b>쿠폰받기<i class="ico_coupon-download"></i></b>
								</button>
							</div>
							<dropdown button-class="mm_flex">
								<template #button>
									<b>최대 할인가</b><b class="text_price"><strong>{{ number(promotion.max_discounted_price) }}</strong></b>
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
							<dl>
								<dt>배송정보</dt>
								<dd>무료배송</dd>
							</dl>
							<dl v-if="creditCardInstallment">
								<dt>혜택</dt>
								<dd>
									<a
										href="#"
										@click.prevent="_e => overlayCardBenefit(_e)"
									>
										<b>{{ creditCardInstallment.title }}</b><i class="ico_tooltip"></i>
									</a>
								</dd>
							</dl>
							<!--
								<dl v-if="saleReservation.sell_start_at != null && saleReservation.ship_start_at != null">
								<dt>예약배송</dt>
								<dd><span>예약판매 기간</span><p>{{ saleReservation.sell_start_at + ' ~ ' + saleReservation.sell_end_at }}</p></dd>
								<dd><span>예약배송 기간</span><p>{{ saleReservation.ship_start_at + ' ~ ' + saleReservation.ship_end_at }}</p></dd>
								</dl>
							-->
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
				<div
					ref="$tab"
					class="m_prodetail-tab"
				>
					<div
						class="m_prodetail-tab"
					>
						<div class="mm_tab_menu">
							<ul class="mm_flex T=equal">
								<li
									v-for="(tab, _index) in tabs"
									:key="tab.id"
								>
									<a
										class="btn_tab"
										:class="{ 'S=tab-on': _index === currentTabIndex }"
										active-class="S=tab-on"
										:href="`#${tab.id}`"
										@click.prevent="toTabId = tab.id"
									>
										<template v-if="tab.useCount">
											<span>{{ tab.name }}</span>
											<small>{{ tab.getCount() }}</small>
										</template>
										<template v-else>
											<b>{{ tab.name }}</b>
										</template>
									</a>
								</li>
							</ul>
						</div>
						<template v-if="currentTab">
							<component
								:is="currentTab.component"
								v-bind="currentTab.getProps()"
							></component>
						</template>
					</div>
				</div>

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
												is_soldout: item.is_soldout,
												headline: null
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
										<template
											v-for="bundleGoods in bundleGoodsDetail.goods"
											:key="bundleGoods.id"
										>
											<h5><b>{{ bundleGoods.name }}</b></h5>
											<table>
												<tbody>
													<tr>
														<th scope="row">
															<b>상품번호</b>
														</th>
														<td>{{ bundleGoods.id }}</td>
													</tr>
													<tr>
														<th scope="row">
															<b>상품상태</b>
														</th>
														<td>{{ bundleGoods.use_state_label }}</td>
													</tr>
													<tr>
														<th scope="row">
															<b>브랜드</b>
														</th>
														<td>{{ bundleGoods.brand_name }}</td>
													</tr>
													<tr>
														<th scope="row">
															<b>원산지</b>
														</th>
														<td>{{ bundleGoods.origin_label }}</td>
													</tr>
												</tbody>
											</table>
										</template>
									</template>
								</dropdown>
							</li>
							<li>
								<dropdown tag="dl">
									<template #button>
										<p><b>상품정보고시</b></p>
									</template>
									<template #content>
										<template
											v-for="bundleGoods in bundleGoodsDetail.goods"
											:key="bundleGoods.id"
										>
											<h5><b>{{ bundleGoods.name }}</b></h5>
											<table>
												<tbody>
													<tr
														v-for="mandatory in bundleGoods.mandatory"
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
				<template v-if="!stockState.is_soldout">
					<div class="mm_flex T=auto">
						<button
							type="button"
							class="mm_btn T=primary btn_like"
						>
							<i class="ico_like"></i>
							<b class="mm_ir-blind">찜하기</b>
						</button>
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
					</div>
				</template>
				<template v-else>
					<button
						v-if="bundleMaxStock > 1"
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
						<bundle-options
							:bundle-goods-id="bundleGoodsId"
							:options="options"
							add-option-with-clear
							@add-option="addOption"
						></bundle-options>

						<!-- 선택된 옵션 -->
						<div class="mm_scroller m_product-option-selected">
							<ul>
								<!-- (D) 패키지 상품일 경우 -->
								<li
									v-for="selectedOption in selectedOptions"
									:key="selectedOption.key"
								>
									<div class="m...selected-info">
										<strong class="text_product">
											{{ selectedOption.goods1.goods_name }}
										</strong>
										<p class="text_option">
											{{ selectedOption.goods1.option_name }}/ {{ selectedOption.goods1.sub_option_name }}
										</p>
										<span
											v-if="selectedOption.goods1.stock < 6"
											class="text_stock"
										>남은 수량 {{ selectedOption.goods1.stock }}개</span>
									</div>
									<div class="m...selected-info">
										<strong class="text_product">
											{{ selectedOption.goods2.goods_name }}
										</strong>
										<p class="text_option">
											{{ selectedOption.goods2.option_name }}/ {{ selectedOption.goods2.sub_option_name }}
										</p>
										<span
											v-if="selectedOption.goods2.stock < 6"
											class="text_stock"
										>남은 수량 {{ selectedOption.goods2.stock }}개</span>
									</div>
									<form-stepper
										v-model="selectedOption.buy_amount"
										:max="selectedOption.goods_low_stock"
									>
									</form-stepper>
									<p class="text_price">
										<strong>{{ number(
											(selectedOption.goods2.option_price + selectedOption.goods2.goods_price + selectedOption.goods1.option_price + selectedOption.goods1.goods_price) * selectedOption.buy_amount
										) }}</strong>
									</p>
									<button
										type="button"
										class="btn_option-remove"
										@click="removeSelectedOption(selectedOption)"
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
	</layout-detail>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref, computed, onMounted, watch } from 'vue';
	import { useOrderStore } from '$/stores/useOrderStore';
	import { useRecentViewGoodsStore } from '$/stores/useRecentViewGoodsStore';
	import { useShareStore } from '$/stores/useShareStore';
	import { useBundleGoodsDetail } from '$/composables/useBundleGoodsDetail';
	import { useCart } from '$/composables/useCart';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useGoodsAdditional } from '$/composables/useGoodsAdditional';
	import { useHead } from '$/composables/useHead';
	import { usePageScroller } from '$/composables/usePageScroller';
	import LayoutDetail from '@/component/layout/LayoutDetail.vue';
	import Carousel from '@/component/Carousel.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import FormStepper from '@/component/form/FormStepper.vue';
	import multiangleButton from '@/feature/multiangle/component/MultiangleButton.vue';
	import BundleOptions from '@/custom/bundle/component/BundleOptions.vue';

	const { bom, loading, route, router, openOverlay, openModal } = useGlobalPageContext();
	const bundleGoodsId = computed(() => (Number(`${route.params.id}`)));
	const { add: addRecentViewGoods } = useRecentViewGoodsStore();
	const orderStore = useOrderStore();
	const {
		bundleGoodsDetail,
		stockState,
		promotion,
		saleMemberBenefits,
		getDownloadableCoupons,
		getInformation,
		creditCardInstallment,
		options,
		getBrandBestGoodsList,
		getCategoryBestGoodsList,
		getAdvertisementGoodsList,
		me,
	} = await useBundleGoodsDetail(bundleGoodsId.value);
	const { number } = useFormatter();
	const { scrollTo } = usePageScroller();
	const shareStore = useShareStore();
	const goodsForMe = ref<{ is_wished: boolean; is_writable_review: boolean }>({
		is_wished: false,
		is_writable_review: false,
	});
	useHead({ title: `${bundleGoodsDetail.value.bundle.name} 상품 상세` });

	const overlayCardBenefit = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/card-benefit/CardBenefit.vue')), {
			props: {
				cardInstallmentInfo: creditCardInstallment.value,
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
			downloadAbleCoupons.value.coupons = await getDownloadableCoupons();
			downloadAbleCoupons.value.fetched = true;

		}

		openOverlay(defineAsyncComponent(() => import('@/page/product/detail/coupon/ProductDetailCoupon.vue')), {
			props: {
				coupons: downloadAbleCoupons.value.coupons,
				isAutoPublish: true,
			},
			clickElement: _e.currentTarget,
		});
	};

	const toTabId = ref<string>('');
	const currentTabIndex = ref(0);
	const currentTab = computed(() => {
		const tab = tabs[currentTabIndex.value];

		return tab?.id == 'info' && !information.value ? null : tab;
	});

	const $tab = ref<HTMLElement>();
	const tabs = [
		{
			id: 'info',
			name: '상세정보',
			useCount: false,
			component: defineAsyncComponent(() => import(`@/custom/bundle/component/BundleDetailInfo.vue`)),
			getProps: () => {
				return {
					bundleId: bundleGoodsId.value,
					information: information.value,
				};
			},
			getCount: () => 0,
		},
		{
			id: 'review',
			name: `리뷰`,
			useCount: true,
			component: defineAsyncComponent(() => import(`@/page/product/detail/component/ProductDetailReview.vue`)),
			getProps: () => {
				return {
					goodsId: bundleGoodsId.value,
					shoppingAggregate: shoppingAggregate.value,
					reviewWritable: false,
				};
			},
			getCount: () => shoppingAggregate.value.total_review_count,
		},
		{

			id: 'qna',
			name: `상품 Q&A`,
			useCount: true,
			component: defineAsyncComponent(() => import(`@/page/product/detail/component/ProductDetailQna.vue`)),
			getProps: () => {
				return {
					goodsId: bundleGoodsId.value,
					bundleChildGoods: bundleGoodsDetail.value.goods,
				};
			},
			getCount: () => shoppingAggregate.value.total_qna_count,
		},
		{
			id: 'seller',
			name: '판매자 정보',
			useCount: false,
			component: defineAsyncComponent(() => import(`@/custom/bundle/component/BundleDetailSeller.vue`)),
			getProps: () => {
				return {
					bundleChildeGoods: bundleGoodsDetail.value.goods,
				};
			},
			getCount: () => 0,
		},
	];


	const isOptionOpen = ref(false);
	const $btnOptionOpenTarget = ref<HTMLElement>();
	const $btnOptionClose = ref<HTMLButtonElement>();
	const selectedOptions = ref<SelectedBundle[]>([]);
	const forGift = ref<boolean>(false);

	// (접근성) 옵션 창 노출 시 포커스 강제 이동
	// watch(isOptionOpen, (_state) => {
	// 	if (_state) $btnOptionClose.value?.focus();
	// 	else $btnOptionOpenTarget.value?.focus();
	// });

	/** 옵션 추가 처리  */
	function addOption(addOption: SelectedBundle) {
		if (selectedOptions.value.find((option) => option.key === addOption.key)) {
			return bom.alert('이미 존재하는 옵션입니다.');
		}
		selectedOptions.value.push(addOption);

		// if (!$productOption.value) return;
		// if (!$productOption.value.style.height) $productOption.value.style.height = '77%';
	}

	/** 옵션 삭제 */
	function removeSelectedOption(option: SelectedBundle) {
		selectedOptions.value = selectedOptions.value.filter(selected => selected.key !== option.key);
	}

	const totalSelectedPrice = computed(() => {
		return selectedOptions.value.reduce((sum, selectedOption) =>
			sum + ((selectedOption.goods1.goods_price + selectedOption.goods1.option_price + selectedOption.goods2.goods_price + selectedOption.goods2.option_price) * selectedOption.buy_amount), 0
		);
	});

	/** 장바구니 담는 함수 */
	async function addCart() {
		if (selectedOptions.value.length < 1) {
			return bom.alert('상품을 선택해주세요.');
		}

		loading.show();
		try {
			await useCart().addBundle(selectedOptions.value.map(selected => ({
				bundle_goods_id: bundleGoodsId.value,
				option_ids: [selected.goods1.code, selected.goods2.code],
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

	const isSoldout = computed(() => stockState.value.is_soldout ? true : false);
	const bundleLowStock = computed(() => Math.min(...stockState.value.stock));
	const bundleMaxStock = computed(() => Math.max(...stockState.value.stock));
	const isLowStock = computed(() => bundleLowStock.value < 6 ? true : false);

	// pReactionAggregate
	const { getBundleReactionAggregate } = useGoodsAdditional();
	const [pInformation, pReactionAggregate] = await Promise.all([
		getInformation(),
		getBundleReactionAggregate(bundleGoodsId.value),
	]);

	const shoppingAggregate = ref<GoodsReactionAggregate>(pReactionAggregate);
	const information = ref<BundleGoodsInformation>(pInformation);
	/** 카테고리 / 브랜드 베스트 상품 */
	const categoryBestGoodsList = ref<BestGoods[]>([]);
	const brandBestGoodsList = ref<BestGoods[]>([]);
	const advertisementGoodsList = ref<BestGoods[]>([]);

	async function fetchAdditionalData() {
		Promise.all([
			getCategoryBestGoodsList(bundleGoodsId.value)
				.then(bestGoodsList => categoryBestGoodsList.value = bestGoodsList),
			getBrandBestGoodsList(bundleGoodsId.value)
				.then(bestGoodsList => brandBestGoodsList.value = bestGoodsList),
			getAdvertisementGoodsList(bundleGoodsId.value)
				.then(goodsList => advertisementGoodsList.value = goodsList),
			me().then(me => goodsForMe.value = me),
		]);
	}

	/** 구매처리 * */
	async function buy() {
		if (selectedOptions.value.length < 1) {
			return bom.alert('선택된 상품이 없습니다.');
		}

		const buyItems: SelectedForOrder[] = selectedOptions.value.flatMap(selected => {
			return [
				{
					bundle_uuid: selected.key,
					bundle_goods_id: bundleGoodsId.value,
					goods_id: selected.goods1.goods_id,
					option_id: selected.goods1.code,
					ea: selected.buy_amount,
				},
				{
					bundle_uuid: selected.key,
					bundle_goods_id: bundleGoodsId.value,
					goods_id: selected.goods2.goods_id,
					option_id: selected.goods2.code,
					ea: selected.buy_amount,
				},
			];
		});

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

	const modalRestockApply = (_e: MouseEvent) => {
		openModal(defineAsyncComponent(() => import('@/feature/restock/RestockApply.vue')), {
			props: {
				goodsId: bundleGoodsId.value,
				options: options.value,
			},
			clickElement: _e.currentTarget,
		});
	};

	if (toTabId.value && toTabId.value != 'info') {
		currentTabIndex.value = tabs.findIndex(tab => tab.id == toTabId.value) || 0;
	}

	onMounted(() => {
		fetchAdditionalData();
		addRecentViewGoods({
			id: bundleGoodsId.value,
			name: bundleGoodsDetail.value.bundle.name,
			brand_name: '',
			thumbnail_url: bundleGoodsDetail.value.bundle.thumbnail_urls[0],
			base_discounted_price: promotion.value.base_discounted_price,
			sale_rate: promotion.value.sale_rate,
			is_soldout: stockState.value.is_soldout,
		});
	});

	watch(toTabId, (_toTabId) => {
		if (!_toTabId) return;

		const toTabIndex = tabs.findIndex(tab => tab.id == _toTabId);

		// 탭 변경처리
		if (toTabIndex < 0) return;
		currentTabIndex.value = toTabIndex;
		toTabId.value = '';

		// 탭 상단으로 스크롤 처리
		if (!$tab.value) return;
		scrollTo($tab.value, { margin: 0 });
	});
</script>