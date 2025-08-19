<template>
	<div class="m_review-write">
		<div class="m_review-write-product">
			<div class="m...product-point S=point-on">
				<p><i class="ico_review-photo"></i>포토 리뷰 등록 시 최대<b><strong>{{ number(myReviewPointSetting.photoReviewPoint) }}원</strong></b>적립!</p>
				<div class="m...product-point-inner">
					<dl><dt>텍스트 리뷰</dt><dd><strong>{{ number(myReviewPointSetting.textReviewPoint) }}</strong><sub>원</sub></dd></dl>
					<dl><dt>포토 리뷰</dt><dd><strong>{{ number(myReviewPointSetting.photoReviewPoint) }}</strong><sub>원</sub></dd></dl>
				</div>
			</div>
			<div class="mm_product-select">
				<form-select
					v-if="reviewableOrderItems.length > 0"
					v-model.number="form.option_id"
					title="상품"
					use-overlay
					fixed-label="상품을 선택하세요"
					need-overlay-hide-first-option
				>
					<option :value="null">
						상품을 선택하세요
					</option>
					<option
						v-for="item in reviewableOrderItems"
						:key="item.option_id"
						:value="item.option_id"
					>
						<b class="m...overlay-product">
							<i
								class="mm_bg-cover image_product"
								:style="`background-image:url(${item.goods.thumbnail_url})`"
							></i>
							<span class="text_product">
								{{ item.goods.name }}
							</span>
							<span class="text_option">
								{{ optionText(item.option_name) }}
							</span>
						</b>
					</option>
				</form-select>

				<!-- 선택된 상품 -->
				<div
					v-if="selectedOrderItem"
					class="mm_scroller"
				>
					<div class="mm_product-list T=xs">
						<ul>
							<li>
								<div class="mm_product-item">
									<a>
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													:src="selectedOrderItem.goods.thumbnail_url"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_product">{{ selectedOrderItem.goods.name }}</p>
												<p class="text_option">{{ optionText(selectedOrderItem.option_name) }}</p>
											</figcaption>
										</figure>
									</a>
									<button
										v-if="orderItems.length > 0"
										type="button"
										class="btn_remove"
										@click="form.option_id = null"
									>
										<i class="ico_remove T=sm"></i><b class="mm_ir-blind">삭제하기</b>
									</button>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<my-review-input
			v-model:rate="form.rate"
			v-model:contents="form.contents"
			v-model:selected-review-templates="form.selected_review_templates"
			v-model:images="form.images"
			v-model:height="form.height"
			v-model:weight="form.weight"
			v-model:shoes-size="form.shoes_size"
			v-bind="{
				useReviewTemplate,
				reviewTemplates,
				usePersonalization: isUsePersonalization
			}"
		></my-review-input>

		<div class="mm_inner">
			<div class="mm_foot">
				<div class="mm_btn_box">
					<button
						type="button"
						class="mm_btn T=primary"
						:disabled="!registrable"
						@click="store"
					>
						<b>등록하기</b>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref, watch, onMounted } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useForm } from '$/composables/useForm';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useReview } from '$/composables/useReview';
	import Lazyload from '@/component/Lazyload.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import MyReviewInput from '@/page/mypage/review/component/MyReviewInput.vue';

	type OptionalReviewableOrderItem = Optional<ReviewableOrderItem, 'option_id' | 'goods' | 'ea' | 'option_name'>;

	const props = withDefaults(defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		orderId: string;
		orderItem?: Nullable<ReviewableOrderItem>;
		orderItems?: NormalStepOrderItem[];
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>(), {
		orderItem: null,
		orderItems: () => [],
	});

	defineExpose<OverlayComponentExpose>({
		title: `리뷰 쓰기`,
	});

	const { bom, loading } = useGlobalPageContext();
	const { optionText, number } = useFormatter();
	const {
		myReviewPointSetting,
		useReviewTemplate,
		usePersonalization: isUsePersonalization,
		add,
		getReviewTemplates,
	} = useReview();

	const { form, validate } = useForm<ReviewStoreForm>(
		{
			order_id: props.orderId,
			option_id: props.orderItem?.option_id || null,
			rate: null,
			contents: '',
			height: null,
			weight: null,
			shoes_size: null,
			selected_review_templates: [],
			images: [],
			ea: props.orderItem?.ea || 0,
		},
		{
			rule: {
				'order_id(주문상품)': ['required'],
				'option_id(주문상품)': ['required'],
				'rate(별점)': ['required'],
				'height(키)': ['number'],
				'weight(몸무게)': ['number'],
				'contents(내용)': ['required', 'minLength:10', 'maxLength:2000', 'blank', 'noRepeat'],
			},
			message: {
				'order_id.required': ':param(을/를) 선택해주세요.',
				'option_id.required': ':param(을/를) 선택해주세요.',
				'rate.required': ':param(을/를) 선택해주세요.',
			},
		}
	);

	const selectedOrderItem = ref<OptionalReviewableOrderItem | null>(props.orderItem);
	const reviewTemplates = ref<ReviewTemplate[]>([]);

	const reviewableOrderItems = computed<OptionalReviewableOrderItem[]>(() => {
		const mapped: OptionalReviewableOrderItem[] = props.orderItems.filter(item => item.review_writable).map(item => {
			return {
				option_id: item.goods.option_id,
				goods: item.goods,
				option_name: item.goods.option_name,
				ea: 1,
			};
		});

		const grouped = (mapped).reduce((
			accumulator: Record<number, OptionalReviewableOrderItem>,
			current: OptionalReviewableOrderItem
		) => {
			const key = current.option_id;
			if (!accumulator[key]) {
				accumulator[key] = current;
			}
			else {
				accumulator[key].ea++;
			}

			return accumulator;
		}, {} as Record<number, OptionalReviewableOrderItem>);

		return Object.values(grouped);
	});

	const registrable = computed(() => {
		return form.value.order_id
			&& form.value.option_id
			&& form.value.rate
			&& form.value.contents;
	});

	async function store() {
		loading.show();
		try {
			await validate();
			await add(form.value);
			bom.alert('리뷰가 등록되었습니다.', props.closer);
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}

	async function getTemplates() {
		if (!useReviewTemplate || !selectedOrderItem.value) {
			return;
		}

		try {
			reviewTemplates.value = await getReviewTemplates(selectedOrderItem.value.goods.bundle_goods_id ?? selectedOrderItem.value.goods.id);
		}
		catch (e) {
			//
		}
	}

	/** 주문상품 선택 처리 */
	watch(() => form.value.option_id, async (newOptionId) => {
		if (!newOptionId) {
			selectedOrderItem.value = null;
			form.value.ea = 0;

			return;
		}
		selectedOrderItem.value = reviewableOrderItems.value.find(reviewable => reviewable.option_id == newOptionId) || null;
		form.value.ea = selectedOrderItem.value?.ea || 0;
		getTemplates();
	});

	onMounted(getTemplates);
</script>