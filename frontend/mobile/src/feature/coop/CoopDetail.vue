<template>
	<layout-detail>
		<template #page>
			<div
				v-if="goodsDetail && coopDealDetail"
				class="m_prodetail"
			>
				<!-- 상품상세 상단 -->
				<div class="m_prodetail-head">
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

						<!-- 공동구매 진행 상태 -->
						<!-- (D) 진행 중 상태를 제외하고 상태에 따라 클래스를 추가합니다. 목표달성: T=success, 목표 미달성: T=fail -->
						<div class="m...product-coopbuy">
							<template v-if="isCoopDealEnd">
								<!-- (D) 공동구매 종료일 다음날 부터는 목표 달성 상태에 맞춰 '.text_state-off' 요소만 노출합니다. -->
								<p
									v-if="coopDealDetail.target_achieve_rate >= 100"
									class="text_state-off"
								>
									목표 달성<span>/</span><strong>{{ number(coopDealDetail.participant_count) }}</strong>명 참여
								</p>
								<p
									v-else
									class="text_state-off"
								>
									목표 미달성<span>/</span><strong>{{ number(coopDealDetail.participant_count) }}</strong>명 참여
								</p>
							</template>
							<template v-else>
								<p class="mm_flex text_state">
									<strong> {{ coopDealDetail.target_achieve_rate >= 100 ? '목표달성' : '진행중' }} </strong>
									<coop-timer :target_at="coopDealDetail.end_at"></coop-timer>
								</p>
								<div class="m...product-coopbuy-progress">
									<p>
										목표까지<b><strong>{{ number( coopDealDetail.participant_count ) }}<sub>명</sub></strong><span>/</span>{{ number(coopDealDetail.target_count) }}명</b>
									</p>
									<div class="m...progress-bar">
										<b
											:style="`width: ${coopDealDetail.target_achieve_rate}%;`"
											:title="`${coopDealDetail.target_achieve_rate}%`"
										>
											<i></i>
										</b>
									</div>
								</div>
							</template>
						</div>

						<div class="mm_inner">
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
							<p class="text_price">
								<span
									v-if="coopDealDetail.joint_purchase_sale_rate > 0"
									class="text_sale"
								>{{ `${coopDealDetail.joint_purchase_sale_rate}%` }}</span>
								<strong>{{ number(promotion.base_discounted_price - coopDealDetail.joint_purchase_amount ) }}</strong>
								<del>{{ number(promotion.price) }}</del>
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
									<b>공동구매 할인가</b><b class="text_price"><strong>{{ number(promotion.base_discounted_price - coopDealDetail.joint_purchase_amount) }}</strong></b>
								</template>
								<template #content>
									<div class="m...benefit-detail">
										<h4><b>회원가</b></h4>
										<dl>
											<dt>공동구매 쿠폰 할인</dt>
											<dd class="text_price">
												<span>{{ `- ${number(coopDealDetail.joint_purchase_amount)}` }}</span>
											</dd>
										</dl>
										<dl>
											<dt>회원 혜택가</dt>
											<dd class="text_price">
												<span>{{ number(promotion.base_discounted_price - coopDealDetail.joint_purchase_amount) }}</span>
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
								<dd v-if="goodsDetail.delivery_info?.is_free_delivery">
									무료배송
								</dd>
								<dd v-else>
									배송비 {{ number(goodsDetail.delivery_info?.shipping_price) || '-' }}원
									{{ goodsDetail.delivery_info?.is_package_delivery ? '' : ' (개별 부과)' }}
								</dd>
								<dd v-if="goodsDetail.delivery_info?.is_conditional_free_delivery">
									{{ number(goodsDetail.delivery_info?.conditional_free_price) + '원 이상 구매 시 무료배송' }}
								</dd>
								<dd v-if="(goodsDetail.delivery_info?.extra_shipping_price || 0) > 0">
									{{ '도서산간지역 ' + number(goodsDetail.delivery_info?.extra_shipping_price) + '원' }}
								</dd>
							</dl>
							<dl v-if="creditCardInstallment">
								<dt>혜택</dt>
								<dd>
									<button
										type="button"
										@click="_e => overlayCardBenefit(_e)"
									>
										<b>50,000원 이상 결제 시 무이자할부</b><i class="ico_tooltip"></i>
									</button>
								</dd>
							</dl>
							<dl>
								<dt>공동구매</dt>
								<dd><span>공동구매 기간</span><p>{{ date(coopDealDetail.start_at, 'MM.DD(ddd) HH:mm') }} ~ {{ date(coopDealDetail.end_at, 'MM.DD(ddd) HH:mm') }} </p></dd>
								<dd><span>목표인원</span><p>{{ number(coopDealDetail.target_count) }}명</p></dd>
								<dd><span>쿠폰사용 기간</span><p>{{ coopDealDetail.expiration_date_message }}</p></dd>
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
					<product-info
						:goods-provider="goodsDetail.provider"
						:goods-id="goodsDetail.id"
						:information="information"
					></product-info>
				</div>

				<product-detail-foot
					:goods-detail="goodsDetail"
					:information="information"
				></product-detail-foot>
			</div>
		</template>

		<template #optionButton>
			<!-- 하단고정버튼 -->
			<div class="mm_btn_box T=fixed">
				<div class="mm_flex T=equal">
					<button
						v-if="!isCoopDealEnd"
						type="button"
						class="mm_btn T=primary"
						@click="isOptionOpen = true"
					>
						<b>공동구매 참여</b>
					</button>
					<template v-else>
						<button
							v-if="coopDealDetail.target_achieve_rate >= 100"
							type="button"
							class="mm_btn T=primary"
							@click="isOptionOpen = true"
						>
							<b>공동구매가로 구매</b>
						</button>

						<b
							v-else
							class="mm_btn T=disabled"
						>공동구매 미달성</b>
					</template>
				</div>
			</div>

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
					<goods-options
						:options="options"
						add-option-with-clear
						@add-option="addOption"
					></goods-options>

					<!-- 선택된 옵션 -->
					<div class="mm_scroller m_product-option-selected">
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
								</div>
								<button
									type="button"
									class="btn_option-remove"
									@click="removeSelected(selectedOption)"
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
								<strong class="mm_text-secondary">{{ number(totalSelectedPrice) }}</strong>
							</dd>
						</dl>
						<div class="mm_btn_box">
							<div class="mm_flex T=equal">
								<button
									v-if="!isCoopDealEnd"
									type="button"
									class="mm_btn T=lg T=primary"
									@click="coopApply"
								>
									<b>공동구매 참여</b>
								</button>
								<button
									v-if="isCoopDealEnd && coopDealDetail.target_achieve_rate >= 100"
									type="button"
									class="mm_btn T=lg T=primary"
									@click="buy"
								>
									<b>공동구매가로 구매</b>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>
	</layout-detail>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref, computed } from 'vue';
	import { useOrderStore } from '$/stores/useOrderStore';
	import { useShareStore } from '$/stores/useShareStore';
	import monsDate from '$/utils/date';
	import { useCoopDetail } from '$/composables/useCoopDetail';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useGoodsAdditional } from '$/composables/useGoodsAdditional';
	import { useHead } from '$/composables/useHead';
	import LayoutDetail from '@/component/layout/LayoutDetail.vue';
	import Carousel from '@/component/Carousel.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import GoodsOptions from '@/component/GoodsOptions.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import CoopTimer from '@/feature/coop/component/CoopTimer.vue';
	import Headline from '@/feature/headline/Headline.vue';
	import ProductDetailFoot from '@/page/product/detail/component/ProductDetailFoot.vue';
	import ProductInfo from '@/page/product/detail/component/ProductDetailInfo.vue';

	const { number, date } = useFormatter();
	const { openOverlay, route, router, bom, loading } = useGlobalPageContext();

	const orderStore = useOrderStore();
	const shareStore = useShareStore();
	const coopId = Number(`${route.params.id}`);
	const {
		coopDealDetail,
		goodsDetail,
		options,
		promotion,
		apply,
		creditCardInstallment,
	} = await useCoopDetail(coopId);

	useHead({ title: `${goodsDetail.value.name}` });

	const isCoopDealEnd = computed(() => monsDate().isAfter(coopDealDetail.end_at));
	const { getInformation } = useGoodsAdditional();
	const information = await getInformation(goodsDetail.value.id);


	const selectedOptions = ref<SelectedItem[]>([]);

	const modifyContext = ref<SelectedItem>({
		name: '',
		option_name: '',
		code: 0,
		stock: 0,
		buy_amount: 1,
		option_price: 0,
		goods_price: 0,
	});

	const totalSelectedPrice = computed(() => {
		return selectedOptions.value.reduce((sum, selectedOption) =>
			sum + ((promotion.value.base_discounted_price + selectedOption.option_price) * selectedOption.buy_amount), 0
		);
	});

	const overlayCardBenefit = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/card-benefit/CardBenefit.vue')), {
			props: {
				cardInstallmentInfo: creditCardInstallment.value,
			},
			clickElement: _e.currentTarget,
		});
	};

	const isOptionOpen = ref(false);
	function addOption(addOption: GoodsOption, subOption: GoodsSubOption) {
		if (selectedOptions.value.find((option) => option.code === subOption.code)) {
			return bom.alert('이미 존재하는 옵션입니다.');
		}

		if (selectedOptions.value.length >= 1) {
			return bom.alert('공동구매는 한개만 구매/신청 가능합니다.');
		}

		modifyContext.value = {
			name: addOption.name,
			code: subOption.code,
			option_name: subOption.name.trim() == '-' ? '' : subOption.name,
			option_price: subOption.extra_amount,
			goods_price: promotion.value.sell_price,
			buy_amount: 1,
			stock: subOption.qty,

		};

		selectedOptions.value.push(modifyContext.value);
		// if (!$productOption.value) return;
		// if (!$productOption.value.style.height) $productOption.value.style.height = '77%';
	}

	/** 선택된 옵션 삭제 처리 * */
	function removeSelected(selected: SelectedItem) {
		selectedOptions.value = selectedOptions.value.filter((option) => option.code !== selected.code);
	}

	/** 공동구매 신청 */
	async function coopApply() {
		if (selectedOptions.value.length < 1) {
			return bom.alert('상품을 선택해주세요.');
		}

		if (selectedOptions.value.length > 1) {
			return bom.alert('공동구매는 한개의 상품만 신청 가능합니다.');
		}

		loading.show();
		try {
			await apply(selectedOptions.value[0].code);

			return bom.alert('공동구매 신청이 완료되었습니다.');
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}

	async function buy() {
		if (selectedOptions.value.length < 1) {
			return bom.alert('상품을 선택해주세요.');
		}

		if (selectedOptions.value.length > 1 || selectedOptions.value[0].buy_amount > 1) {
			return bom.alert('공동구매 상품은 1개만 구매할 수 있습니다.');
		}

		const buyItems = selectedOptions.value.map(option => {
			return {
				goods_id: coopDealDetail.goods_id,
				option_id: option.code,
				ea: option.buy_amount,
			};
		});

		loading.show();
		try {
			const orderId = await orderStore.generateOrderId(buyItems);

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
</script>

<style src="./_coop.scss" lang="scss"></style>