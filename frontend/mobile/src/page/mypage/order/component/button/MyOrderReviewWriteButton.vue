<template>
	<button
		type="button"
		class="mm_btn T=xs T=light"
		@click="overlayMyReviewCreate"
	>
		<b>리뷰 쓰기</b>
	</button>
</template>
<script setup lang="ts">
	import { defineAsyncComponent } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';

	const props = defineProps<{
		orderId: string;
		orderItems: OptionalOrderItem[];
	}>();

	const emit = defineEmits<(e: 'onSuccess') => void>();

	const { openOverlay } = useGlobalPageContext();

	const overlayMyReviewCreate = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/mypage/review/create/MyReviewCreate.vue')), {
			props,
			clickElement: _e.currentTarget,
			onClose: () => { emit('onSuccess'); },
		});
	};
</script>