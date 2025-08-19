import { useEventListener } from '@vueuse/core';
<template>
	<iframe
		:src="prop.src"
	></iframe>
</template>

<script setup lang="ts">
	const prop = defineProps<{
		title: string;
		src: string;
		layout: 'none';
		closer: CloseHandler<void>;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: prop.title,
		isFull: true,
	});

	// const receiveMessage = (e) => {
	// 	// 내부 로직
	// 	console.log(e);
	// 	if (e.data && e.data.close) {
	// 		prop.closer();
	// 	}
	// };
	// useEventListener('message', receiveMessage, false);
</script>