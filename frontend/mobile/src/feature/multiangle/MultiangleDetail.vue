<template>
	<div
		ref="$element"
		class="m_multiangle"
		@touchstart="view360MouseDown($event)"
	>
		<p class="m_multiangle-note">
			<i class="ico_multiangle-drag"></i>좌우로 움직여 더 자세히 보세요
		</p>
		<div class="m_multiangle-image">
			<template
				v-for="imageUrl, index in degreeImageUrls"
				:key="imageUrl"
			>
				<lazyload
					class="mm_bg-cover image_product"
					:class=" { 'S=on' : selectedImageIndex === index }"
					:src="imageUrl"
					is-force
				></lazyload>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { useEventListener } from '@vueuse/core';
	import Lazyload from '@/component/Lazyload.vue';

	const props = defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
		/** 360도 이미지  */
		degreeImageUrls: string[];
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `360도 보기`,
	});

	const $element = ref<HTMLElement>();
	const touchStarted = ref<boolean>(false);

	const prevTouched = ref<Touch>();
	const dragCount = ref(0);
	const selectedImageIndex = ref(0);
	const degreeImageUrls = computed(() => props.degreeImageUrls);

	function view360MouseDown(event: TouchEvent) {
		prevTouched.value = event.touches[0];
		dragCount.value = 0;
		touchStarted.value = true;
	}

	useEventListener($element, 'touchend', () => {
		touchStarted.value = false;
	});

	useEventListener($element, 'touchmove', (event: TouchEvent) => {
		if (!touchStarted.value || !prevTouched.value || degreeImageUrls.value.length < 1) {
			return;
		}

		const moveX = event.touches[0].screenX - prevTouched.value?.screenX;
		prevTouched.value = event.touches[0];

		moveX > 0 ? dragCount.value++ : dragCount.value--;

		if (Math.abs(dragCount.value) > 1.7 * (32 / degreeImageUrls.value.length)) {
			dragCount.value = 0;
			selectedImageIndex.value = (moveX > 0) ? selectedImageIndex.value + 1 : selectedImageIndex.value - 1;

			if (selectedImageIndex.value >= degreeImageUrls.value.length) {
				selectedImageIndex.value = 0;
			}
			if (selectedImageIndex.value < 0) {
				selectedImageIndex.value = degreeImageUrls.value.length - 1;
			}
		}
	});
</script>

<style lang="scss">
	@use '../../asset/scss/helper/mixin';
	@use '../../asset/scss/helper/function';

	.m_multiangle {
		position: relative;

		&-note {
			padding: 28px 0;
			width: 100%;
			@include mixin.font(#222 600 '1.6rem/2.4rem' center);

			.ico_multiangle-drag {
				display: block;
				margin-bottom: 8px;

				&::before {
					width: 69px;
					height: 56px;
					@include mixin.background(url('../image/content/ico_multiangle_drag.svg') 'center center/cover' no-repeat);
				}
			}
		}

		&-image {
			.image_product {
				display: none;
				padding-top: 100%;
				width: 100%;

				&#{function.escape('.S=on')} {
					display: block;
				}
			}
		}
	}
</style>