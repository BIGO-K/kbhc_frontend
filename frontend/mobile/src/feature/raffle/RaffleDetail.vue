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
							:items="goodsDetail.thumbnail_urls"
							effect="cover"
							:use-pagination="true"
							:is-more-side="true"
							:is-error-remove="true"
						>
							<template #default="{ item: imageUrl}">
								<lazyload
									class="mm_bg-contain"
									:src="imageUrl"
								></lazyload>
								<span class="mm_ir-blind">{{ '상품 이미지' }}</span>
							</template>
						</carousel>

						<!-- 래플 진행 상태 -->
						<!-- (D) 종료 상태를 제외하고 상태에 따라 클래스를 추가합니다. 진행예정: T=schedule, 진행중: T=proceeding, 종료는 상태 클래스 없습니다. -->
						<div :class="['m...product-raffle', raffleProgressClass]">
							<template v-if="raffle.status == RAFFLE_STATUS.UPCOMING">
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
								<dl>
									<dt>래플 진행 예정</dt><dd>
										{{ date(raffle.entry_start_at, 'MM월 DD일(ddd)') }}
									</dd>
								</dl>
							</template>
							<template v-else-if="raffle.status == RAFFLE_STATUS.ENTRY_START">
								<div class="m...product-raffle-progress">
									<p
										class="text_state"
										:style="`left: ${raffleProgressPercent}%;`"
										:title="`${raffleProgressPercent}%`"
									>
										진행중
									</p>
									<b :style="`width: ${raffleProgressPercent}%;`"><i></i></b>
								</div>
								<dl><dt>래플 종료까지</dt><dd>{{ timer.hour }}<span>:</span>{{ timer.minute }}<span>:</span>{{ timer.second }}</dd></dl>
							</template>
							<template v-else>
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
								<dl><dt>래플 종료</dt><dd>00<span>:</span>00<span>:</span>00</dd></dl>
							</template>
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
									v-if="promotion.sale_rate > 0"
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
								</dl>
							</template>
							<dl v-if="creditCardInstallment">
								<dt>혜택</dt>
								<dd>
									<a
										href="#"
										@click.prevent="overlayCardBenefit"
									>
										<b>50,000원 이상 결제 시 무이자할부</b><i class="ico_tooltip"></i>
									</a>
								</dd>
							</dl>
							<dl>
								<dt>래플</dt>
								<dd>
									<span>응모 기간</span>
									<p>
										{{ date(raffle.entry_start_at, 'YYYY-MM-DD(ddd) HH:mm') }}
										~ {{ date(raffle.entry_end_at, 'YYYY-MM-DD(ddd) HH:mm') }}
									</p>
								</dd>
								<dd>
									<span>당첨자 발표일</span><p>{{ date(raffle.notice_at, 'YYYY-MM-DD(ddd) HH:mm') }}</p>
								</dd>
								<dd>
									<span>당첨자 구매기간</span>
									<p>
										{{ date(raffle.buy_start_at, 'YYYY-MM-DD(ddd) HH:mm') }}
										~ {{ date(raffle.buy_end_at, 'YYYY-MM-DD(ddd) HH:mm') }}
									</p>
								</dd>
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
				<div class="mm_flex T=auto">
					<b
						v-if="raffle.status == RAFFLE_STATUS.BUY_END"
						class="mm_btn T=disabled"
					>래플 종료</b>
					<template v-else-if="raffle.status === RAFFLE_STATUS.BUY_START">
						<button
							v-if="raffleBuyInfo.is_purchasable"
							type="button"
							class="mm_btn T=primary"
							@click="isOptionOpen = true"
						>
							<b>구매하기</b>
						</button>
						<button
							v-else
							type="button"
							class="mm_btn T=primary"
							disabled
						>
							<b>구매불가</b>
						</button>
					</template>
					<template v-else-if="raffle.status === RAFFLE_STATUS.NOTICE_START">
						<button
							type="button"
							class="mm_btn T=primary"
							@click="_e => modalRaffleResult(_e)"
						>
							<b>당첨 결과 확인하기</b>
						</button>
					</template>
					<template v-else>
						<b
							v-if="raffle.status == RAFFLE_STATUS.UPCOMING"
							class="mm_btn T=primary"
						>
							{{ date(raffle.entry_start_at, 'MM.DD (ddd) HH:mm') }} 진행 예정
						</b>
						<template v-else-if="raffle.status == RAFFLE_STATUS.ENTRY_START">
							<button
								v-if="!raffle.is_entry"
								type="button"
								class="mm_btn T=primary"
								@click="_e => overlayEntryRaffle(_e)"
							>
								<b>응모하기</b>
							</button>
							<b
								v-else
								class="mm_btn T=disabled"
							>
								응모 완료
							</b>
						</template>
						<b
							v-else
							class="mm_btn T=primary"
						>
							{{ date(raffle.notice_at, 'MM.DD (ddd) HH:mm') }} 당첨자 발표 예정
						</b>
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
						@click="isOptionOpen = false;"
					>
						<b class="mm_ir-blind">옵션선택 닫기</b>
					</button>
					<goods-options
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
								>
								</form-stepper>
								<p class="text_price">
									<strong>{{ number( (promotion.base_discounted_price + selectedOption.option_price) * selectedOption.buy_amount) }}</strong>
								</p>
								<button
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
								<button
									v-if="raffleBuyInfo.is_purchasable"
									type="button"
									class="mm_btn T=lg T=primary"
									@click="buy"
								>
									<b>구매하기</b>
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
	import { useCountDown } from '$/composables/useCountDown';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useGoodsAdditional } from '$/composables/useGoodsAdditional';
	import { useGoodsDetail } from '$/composables/useGoodsDetail';
	import { useHead } from '$/composables/useHead';
	import { useRaffle } from '$/composables/useRaffle';
	import LayoutDetail from '@/component/layout/LayoutDetail.vue';
	import Carousel from '@/component/Carousel.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import GoodsOptions from '@/component/GoodsOptions.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormStepper from '@/component/form/FormStepper.vue';
	import Headline from '@/feature/headline/Headline.vue';
	import ProductDetailFoot from '@/page/product/detail/component/ProductDetailFoot.vue';
	import ProductInfo from '@/page/product/detail/component/ProductDetailInfo.vue';

	const { number, date } = useFormatter();
	const { openOverlay, route, openModal, bom, loading, router } = useGlobalPageContext();
	const shareStore = useShareStore();

	const raffleId = Number(`${route.params.id}`);
	const { RAFFLE_STATUS, getDetail, prepareEntry, checkPurchaseable } = useRaffle();
	const raffle = ref<RaffleDetail>(await getDetail(raffleId));
	const {
		goodsDetail,
		options,
		promotion,
		creditCardInstallment,
		saleMemberBenefits,
	} = await useGoodsDetail(raffle.value.goods_id);

	useHead({ title: `${goodsDetail.value.name} 상품 상세` });

	const { getInformation } = useGoodsAdditional();
	const information = ref<GoodsInformation>(await getInformation(goodsDetail.value.id));
	const orderStore = useOrderStore();
	const isOptionOpen = ref(false);
	const selectedOptions = ref<SelectedItem[]>([]);

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


	const totalSelectedPrice = computed(() => {
		return selectedOptions.value.reduce((sum, selectedOption) =>
			sum + ((promotion.value.base_discounted_price + selectedOption.option_price) * selectedOption.buy_amount), 0
		);
	});

	const raffleProgressClass = computed(() => {
		if (raffle.value.status == RAFFLE_STATUS.ENTRY_START) {
			return 'T=proceeding';
		}

		if (raffle.value.status == RAFFLE_STATUS.UPCOMING) {
			return 'T=schedule';
		}

		return '';

	});

	const raffleProgressPercent = computed(() => {
		if (raffle.value.status == RAFFLE_STATUS.ENTRY_END) {
			return 100;
		}

		if (raffle.value.status == RAFFLE_STATUS.UPCOMING) {
			return 0;
		}

		const progressed = monsDate().diff(raffle.value.entry_start_at, 'second');
		const total = monsDate(raffle.value.entry_start_at).diff(raffle.value.entry_end_at, 'second');

		return Math.ceil((Math.abs(progressed / total) * 0.985) * 100);
	});


	const overlayCardBenefit = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/card-benefit/CardBenefit.vue')), {
			props: {
				cardInstallmentInfo: creditCardInstallment.value,
			},
			clickElement: _e.currentTarget,
		});
	};

	/** 래플 응모 신청 */
	const overlayEntryRaffle = async (_e: MouseEvent) => {
		try {
			const entryInfo = await prepareEntry(raffle.value.id);

			openOverlay(defineAsyncComponent(() => import('@/feature/raffle/RaffleEntry.vue')), {
				props: {
					entryInfo: entryInfo,
					raffleId: raffle.value.id,
				},
				clickElement: _e.currentTarget,
				onClose: async () => {
					raffle.value = await getDetail(raffle.value.id);
				},
			});
		}
		catch (error) {
			useErrorAlert(error);
		}
	};

	const { timer } = useCountDown(raffle.value.entry_end_at, {
		startDate: raffle.value.entry_start_at,
		dayToHour: true,
	});

	const raffleBuyInfo = ref<{
		is_winner: boolean;
		is_purchasable: boolean;
		max_orderable_count: number;
	}>({
		is_purchasable: false,
		is_winner: false,
		max_orderable_count: 0,
	});

	if (raffle.value.is_confirmed_winner && raffle.value.is_entry) {
		raffleBuyInfo.value = await checkPurchaseable(raffleId);
	}


	const modalRaffleResult = (_e: MouseEvent) => {
		openModal(defineAsyncComponent(() => import('@/feature/raffle/b/RaffleResult.vue')), {
			props: {
				raffle: {
					id: raffleId,
					buy_start_at: raffle.value.buy_start_at,
					buy_end_at: raffle.value.buy_end_at,
					goods: {
						id: raffle.value.goods_id,
						name: goodsDetail.value.name,
						brand_name: goodsDetail.value.brand_name,
						thumbnail_url: goodsDetail.value.thumbnail_urls[0],
					},
					is_winner: raffleBuyInfo.value.is_winner,
					is_bought: false,
				},
			},
			clickElement: _e.currentTarget,
		});
	};

	/** 구매처리 * */
	async function buy() {
		if (selectedOptions.value.length < 1) {
			return bom.alert('선택된 상품이 없습니다.');
		}
		const buyItems: SelectedForOrder[] = selectedOptions.value.map(option => {
			return {
				goods_id: raffle.value.goods_id,
				option_id: option.code,
				ea: option.buy_amount,
			};
		});

		const sumBuyAmount = selectedOptions.value.reduce(
			(previousValue, currentValue) => previousValue + currentValue.buy_amount,
			0
		);

		if (
			raffleBuyInfo.value.max_orderable_count > 0
			&& sumBuyAmount > raffleBuyInfo.value.max_orderable_count
		) {
			return bom.alert(`1인당 구매제한 개수는 ${raffleBuyInfo.value.max_orderable_count}개 입니다.`);
		}

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

<style src="./_raffle.scss" lang="scss"></style>