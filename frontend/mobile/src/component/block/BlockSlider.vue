<template>
	<div
		ref="sliderScroller"
		class="mui_scroller T=x"
		@touchend.passive="emit('change:position', sliderScroller?.scrollLeft || 0)"
	>
		<slot></slot>
	</div>
</template>
<script setup lang="ts">
	import { onMounted, ref } from 'vue';


	const props = withDefaults(defineProps<{ initPosition: number }>(), {
		initPosition: 0,
	});
	const emit = defineEmits<{
		'change:position': [_position: number];
	}>();

	const sliderScroller = ref<HTMLElement | null>(null);

	onMounted(() => {
		let tryCount = 0;
		const setScrollInterval = setInterval(() => {
			tryCount++;
			if (!sliderScroller.value) {
				return;
			}

			if (tryCount > 10) {
				clearInterval(setScrollInterval);

				return;
			}

			sliderScroller.value.scrollLeft = props.initPosition;
		}, 30);
	});
</script>