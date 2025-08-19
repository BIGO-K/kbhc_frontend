<template>
	<product-review-content></product-review-content>
</template>

<script setup lang="ts">
	import ProductReviewContent from '@/page/product/review/component/ProductReviewContent.vue';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `베스트 리뷰`,
		isFull: true,
	});
</script>

