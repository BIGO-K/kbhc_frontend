<template>
	<div class="m_review-photo">
		<ul>
			<li
				v-for="photoReview in photoReviewPaginator.data"
				:key="photoReview.id"
			>
				<button
					type="button"
					@click="_e => overlayProductReviewDetail(_e, photoReview.id)"
				>
					<lazyload
						tag="img"
						class="mm_bg-cover image_review"
						:src="photoReview.image_url"
					></lazyload>
					<b class="mm_ir-blind">{{ photoReview.writer_masking_id }}님의 포토리뷰</b>
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useReview } from '$/composables/useReview';
	import Lazyload from '@/component/Lazyload.vue';

	const props = defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
		goodsId: number;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `포토리뷰`,
	});

	const { openOverlay } = useGlobalPageContext();
	const { getPhotoReviewPaginator } = useReview();

	const photoReviewPaginator = ref<Paginator<PhotoReview>>(await getPhotoReviewPaginator(props.goodsId, 1));

	const overlayProductReviewDetail = (_e: MouseEvent, id: number) => {
		openOverlay(defineAsyncComponent(() => import('@/page/product/review/detail/ProductReviewDetail.vue')), {
			props: {
				id,
				total: photoReviewPaginator.value.total,
			},
			clickElement: _e.currentTarget,
		});
	};
</script>