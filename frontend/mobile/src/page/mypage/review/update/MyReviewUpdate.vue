<template>
	<div class="m_review-write">
		<!-- 상품정보 : 자동노출 -->
		<div class="m_review-write-product">
			<div class="m...product-point S=point-on">
				<p><i class="ico_review-photo"></i>포토 리뷰 등록 시 최대<b><strong>{{ number(myReviewPointSetting.photoReviewPoint) }}원</strong></b>적립!</p>
				<div class="m...product-point-inner">
					<dl><dt>텍스트 리뷰</dt><dd><strong>{{ number(myReviewPointSetting.textReviewPoint) }}원</strong></dd></dl>
					<dl><dt>포토 리뷰</dt><dd><strong>{{ number(myReviewPointSetting.photoReviewPoint) }}원</strong></dd></dl>
				</div>
			</div>
			<div class="mm_product-item T=single-sm">
				<figure>
					<div class="mm_product-item-image">
						<lazyload
							class="mm_bg-cover image_product"
							:src="originReview.order_item.goods.thumbnail_url"
						></lazyload>
					</div>
					<figcaption>
						<p class="text_product">
							{{ originReview.order_item.goods.name }}
						</p>
						<p class="text_option">
							{{ `${optionText(originReview.order_item.option_name)} / ${originReview.order_item.ea}개` }}
						</p>
					</figcaption>
				</figure>
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
				usePersonalization,
				imageUrls
			}"
		></my-review-input>

		<div class="mm_inner">
			<div class="mm_foot">
				<div class="mm_btn_box">
					<button
						type="button"
						class="mm_btn T=primary"
						@click="updateReview"
					>
						<b>수정하기</b>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useForm } from '$/composables/useForm';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useReview } from '$/composables/useReview';
	import Lazyload from '@/component/Lazyload.vue';
	import MyReviewInput from '@/page/mypage/review/component/MyReviewInput.vue';

	const props = defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		originReview: MyReview;
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `리뷰 쓰기`,
	});

	const { number, optionText } = useFormatter();
	const { loading, bom } = useGlobalPageContext();
	const { myReviewPointSetting, useReviewTemplate, usePersonalization, update, getMyReviewDetail } = useReview();
	const { form, validate } = useForm<ReviewUpdateForm>(
		{
			rate: props.originReview.rate,
			contents: props.originReview.contents,
			height: null,
			weight: null,
			shoes_size: null,
			selected_review_templates: [],
			images: [],
			ea: props.originReview.order_item.ea,
		},
		{
			rule: {
				'rate(별점)': ['required'],
				'height(키)': ['number'],
				'weight(몸무게)': ['number'],
				'contents(내용)': ['required', 'minLength:10', 'maxLength:2000', 'blank', 'noRepeat'],
			},
		}
	);

	const reviewTemplates = ref<ReviewTemplate[]>([]);
	const imageUrls = ref<string[]>([]);

	async function updateReview() {
		loading.show();
		try {
			await validate();
			await update(props.originReview.id, form.value);
			bom.alert('리뷰가 수정되었습니다.', props.closer);
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}

	await (async () => {
		const review = await getMyReviewDetail(props.originReview.id);
		form.value.height = review.height;
		form.value.weight = review.weight;
		form.value.shoes_size = review.shoes_size;
		imageUrls.value = review.image_urls;
		review.selected_templates.forEach((selected, index) => {
			form.value.selected_review_templates[index] = {
				...selected,
			};
		});
		reviewTemplates.value = review.templates;
	})();
</script>
