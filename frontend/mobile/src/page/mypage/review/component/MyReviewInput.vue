<template>
	<!-- 별점 -->
	<review-star-score v-model:rate="rate"></review-star-score>

	<review-template-satisfy-setting
		v-if="useReviewTemplate && reviewTemplates.length && selectedReviewTemplates"
		v-model:selected-review-templates="selectedReviewTemplates"
		:review-templates="reviewTemplates"
	></review-template-satisfy-setting>

	<div class="mm_inner">
		<review-template-body
			v-if="usePersonalization"
			v-model:height="height"
			v-model:weight="weight"
			v-model:shoes-size="shoesSize"
		></review-template-body>

		<h6 class="mm_text-label">
			<b>리뷰 내용</b>
		</h6>
		<form-textarea
			v-model="contents"
			:byte="2000"
			placeholder="최소 10자 이상 입력하세요"
		></form-textarea>
		<form-image
			v-model="images"
			:urls="imageUrls"
			need-block
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
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import FormImage from '@/component/form/FormImage.vue';
	import FormTextarea from '@/component/form/FormTextarea.vue';
	import ReviewTemplateBody from '@/feature/review-template/component/ReviewTemplateBody.vue';
	import ReviewTemplateSatisfySetting from '@/feature/review-template/component/ReviewTemplateSatisfySetting.vue';
	import ReviewStarScore from '@/page/mypage/review/component/MyReviewStarScore.vue';

	const props = withDefaults(defineProps<{
		rate?: Nullable<number>;
		contents?: string;
		selectedReviewTemplates?: MyReviewDetail['selected_templates'];
		images?: Nullable<File | Blob>[];
		height?: Nullable<number>;
		weight?: Nullable<number>;
		shoesSize?: Nullable<number>;
		imageUrls?: string[];
		reviewTemplates: ReviewTemplate[];
		useReviewTemplate?: boolean;
		usePersonalization?: boolean;
	}>(), {
		rate: 0,
		contents: '',
		images: () => [],
		imageUrls: () => [],
		height: null,
		weight: null,
		shoesSize: null,
		selectedReviewTemplates: () => [],
		reviewTemplates: () => [],
		useReviewTemplate: false,
		usePersonalization: false,
	});

	const emit = defineEmits<{
		(e: 'update:rate', value: number): void;
		(e: 'update:contents', value: string): void;
		(e: 'update:images', value: Nullable<File | Blob>[]): void;
		(e: 'update:selectedReviewTemplates', value: MyReviewDetail['selected_templates']): void;
		(e: 'update:height', value: Nullable<number>): void;
		(e: 'update:weight', value: Nullable<number>): void;
		(e: 'update:shoesSize', value: Nullable<number>): void;
	}>();


	/** 문의 제목 */
	const rate = computed({
		get: () => props.rate,
		set: (value) => emit('update:rate', value || 0),
	});

	/** 문의 내용 */
	const contents = computed({
		get: () => props.contents,
		set: (value) => emit('update:contents', value),
	});

	/** 문의 이미지 */
	const images = computed({
		get: () => props.images,
		set: (value) => emit('update:images', value),
	});

	const height = computed({
		get: () => props.height,
		set: (value) => emit('update:height', value || null),
	});

	const weight = computed({
		get: () => props.weight,
		set: (value) => emit('update:weight', value || null),
	});

	const shoesSize = computed({
		get: () => props.shoesSize,
		set: (value) => emit('update:shoesSize', value || null),
	});

	const selectedReviewTemplates = computed({
		get: () => props.selectedReviewTemplates,
		set: (value) => emit('update:selectedReviewTemplates', value),
	});
</script>