<template>
	<div class="m_review-write m_experience-write">
		<div class="m_review-write-product">
			<div class="mm_product-select">
				<form-select
					v-model="selectedProduct"
					title="상품"
					use-overlay
					fixed-label="상품을 선택하세요"
				>
					<option :value="null">
						상품을 선택하세요
					</option>
					<template
						v-for="goods in reviewableGoods"
						:key="goods.id"
					>
						<option
							v-for="option in goods.option_list"
							:key="option.id"
							:value="`${goods.id}_${option.id}`"
						>
							<b class="m...overlay-product">
								<i
									class="mm_bg-cover image_product"
									:style="`background-image:url(${goods.thumbnail_url})`"
								></i>
								<span class="text_product">
									{{ goods.name }}
								</span>
								<span
									v-if="option.name"
									class="text_option"
								>
									{{ optionText(option.name) }}
								</span>
							</b>
						</option>
					</template>
				</form-select>

				<!-- 선택된 상품 -->
				<div
					v-if="selected && selectedOption"
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
													:key="selected.thumbnail_url"
													class="mm_bg-cover image_product"
													:src="selected.thumbnail_url"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_product">{{ selected.name }}</p>
												<p class="text_option">{{ optionText(selectedOption.name) }}</p>
											</figcaption>
										</figure>
									</a>
									<button
										type="button"
										class="btn_remove"
										@click="selectedProduct = null;"
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

		<!-- 별점 -->
		<review-star-score v-model:rate="form.rate"></review-star-score>

		<review-template-satisfy-setting
			v-if="useReviewTemplate && reviewTemplates.length && form.selected_review_templates"
			v-model:selected-review-templates="form.selected_review_templates"
			:review-templates="reviewTemplates"
		></review-template-satisfy-setting>

		<div class="mm_inner">
			<review-template-body
				v-if="isUsePersonalization"
				v-model:height="form.height"
				v-model:weight="form.weight"
				v-model:shoes-size="form.shoes_size"
			></review-template-body>

			<h6 class="mm_text-label">
				<b>체험단 후기 제목</b>
			</h6>
			<form-text
				v-model="form.title"
				maxlength="40"
				placeholder="띄어쓰기 포함 최대 40자까지 입력 가능합니다."
			></form-text>
			<h6 class="mm_text-label">
				<b>리뷰 내용</b>
			</h6>
			<form-textarea
				v-model="form.contents"
				:byte="2000"
				placeholder="최소 10자 이상 입력하세요"
			></form-textarea>
			<form-image
				v-model="form.images"
				:max="10"
			></form-image>
			<div class="mm_note T=bg">
				<ul>
					<li>사진은 jpg, png 파일로 10개까지 업로드 가능합니다.</li>
					<li>첫번째 등록한 사진이 리뷰 대표 이미지로 설정됩니다.</li>
					<li>입력하신 리뷰 위에 등록한 이미지가 노출됩니다.</li>
					<li>동일한 문자 또는 자음/모음은 4회 이상 연속 입력할 수 없습니다.</li>
					<li>소중한 고객님의 개인 정보 보호를 위해 주민번호, 전화번호 등 개 인 정보는 절대 입력하지 않도록 주의해주세요.</li>
					<li>저작권 침해/음란/욕설/비방 글, 개인 정보 유출(전화번호, 주민 번호, 이름, 아이디 등), 판매/광고/홍보성 글을 등록한 경우 임의 로 삭제될 수 있습니다.</li>
				</ul>
			</div>
			<div class="mm_foot">
				<div class="mm_btn_box">
					<button
						type="button"
						class="mm_btn T=primary"
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
	import { ref, watch } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useExperienceReview } from '$/composables/useExperienceReview';
	import { useForm } from '$/composables/useForm';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useReview } from '$/composables/useReview';
	import Lazyload from '@/component/Lazyload.vue';
	import FormImage from '@/component/form/FormImage.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import FormText from '@/component/form/FormText.vue';
	import FormTextarea from '@/component/form/FormTextarea.vue';
	import ReviewTemplateBody from '@/feature/review-template/component/ReviewTemplateBody.vue';
	import ReviewTemplateSatisfySetting from '@/feature/review-template/component/ReviewTemplateSatisfySetting.vue';
	import ReviewStarScore from '@/page/mypage/review/component/MyReviewStarScore.vue';

	const props = defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	const selectedProduct = ref<string | null>(null);

	defineExpose<OverlayComponentExpose>({
		title: `체험단 후기 쓰기`,
	});

	const { bom, loading } = useGlobalPageContext();
	const { optionText } = useFormatter();
	const {
		getReviewableGoods,
		add,
	} = useExperienceReview();

	const {
		useReviewTemplate,
		usePersonalization: isUsePersonalization,
		getReviewTemplates,
	} = useReview();

	/** 리뷰 가능 상품 */
	const reviewableGoods = await getReviewableGoods();
	const selected = ref<ExperienceReviewableGoods | null>();
	const selectedOption = ref<ExperienceReviewableGoods['option_list'][number] | null>();

	/** 리뷰 템플릿 */
	const reviewTemplates = ref<ReviewTemplate[]>([]);

	/** 리뷰 작성 FORM */
	const { form, validate } = useForm<ExperienceReviewForm>(
		{
			goods_id: null,
			option_id: null,
			rate: null,
			title: '',
			contents: '',
			height: null,
			weight: null,
			shoes_size: null,
			selected_review_templates: [],
			images: [],
		},
		{
			rule: {
				'goods_id(상품)': ['required'],
				'option_id(상품)': ['required'],
				'rate(평점)': ['required'],
				'title(제목)': ['required', 'maxLength:40'],
				'height(키)': ['number'],
				'weight(몸무게)': ['number'],
				'contents(체험단 내용)': ['required', 'minLength:10', 'maxLength:2000', 'blank', 'noRepeat'],
			},
			message: {
				'goods_id.required': ':param(을/를) 선택해주세요.',
				'option_id.required': ':param(을/를) 선택해주세요.',
				'rate.required': ':param(을/를) 선택해주세요.',
			},
		}
	);

	async function store() {
		try {
			await validate();
		}
		catch (e) {
			useErrorAlert(e);

			return;
		}

		bom.confirm('작성하신 체험단 후기는\n관리자 확인을 통해 최종\n반영됩니다.', async (flag) => {
			if (!flag) {
				return;
			}

			loading.show();
			try {
				await add(form.value);
				bom.alert('체험단 후기가 등록되었습니다.', props.closer);
			}
			catch (e) {
				useErrorAlert(e);
			}
			finally {
				loading.hide();
			}
		});

	}

	watch(selectedProduct, async (newSelected) => {
		if (!newSelected) {
			form.value.goods_id = null;
			form.value.option_id = null;
			selected.value = null;
			selectedOption.value = null;
			reviewTemplates.value = [];

			return;
		}

		const [selectedGoodsId, selectedOptionId] = newSelected.split('_');
		selected.value = reviewableGoods.find(goods => goods.id == Number(selectedGoodsId)) || null;
		selectedOption.value = selected.value?.option_list.find(option => option.id == Number(selectedOptionId)) || null;
		form.value.goods_id = selected.value?.id || null;
		form.value.option_id = selectedOption.value?.id || null;

		if (selected.value && selectedOption.value && useReviewTemplate) {
			reviewTemplates.value = await getReviewTemplates(selected.value.id);
		}
		else {
			reviewTemplates.value = [];
		}
	});
</script>

<style src="./_experience.scss" lang="scss"></style>