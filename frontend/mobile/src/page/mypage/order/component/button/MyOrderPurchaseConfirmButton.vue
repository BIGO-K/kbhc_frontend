<template>
	<button
		type="button"
		class="mm_btn T=xs T=primary"
		@click="_e => overlayMyOrderConfirm(_e)"
	>
		<b>구매확정</b>
	</button>
</template>
<script setup lang="ts">
	import { defineAsyncComponent } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';

	const props = defineProps<{
		sellerName: string;
		orderItem: OptionalOrderItem;
	}>();

	const emit = defineEmits<(e: 'onSuccess') => void>();

	const { openOverlay } = useGlobalPageContext();

	const overlayMyOrderConfirm = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/mypage/order/confirm/MyOrderConfirm.vue')), {
			props,
			clickElement: _e.currentTarget,
			onClose: () => { emit('onSuccess'); },
		});
	};
</script>