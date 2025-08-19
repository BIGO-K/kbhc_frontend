<template>
	<div class="m_multiangle">
		<p class="m_multiangle-note">
			<i class="ico_multiangle-drag"></i>좌우로 움직여 더 자세히 보세요
		</p>
		<div class="m_multiangle-image">
			<lazyload
				class="mm_bg-cover image_product S=on"
				src="/image/_sample/360_sample1.png"
			></lazyload>
			<lazyload
				class="mm_bg-cover image_product"
				src="/image/_sample/360_sample2.png"
			></lazyload>
			<lazyload
				class="mm_bg-cover image_product"
				src="/image/_sample/360_sample3.png"
			></lazyload>
			<lazyload
				class="mm_bg-cover image_product"
				src="/image/_sample/360_sample4.png"
			></lazyload>
			<lazyload
				class="mm_bg-cover image_product"
				src="/image/_sample/360_sample5.png"
			></lazyload>
			<lazyload
				class="mm_bg-cover image_product"
				src="/image/_sample/360_sample6.png"
			></lazyload>
			<lazyload
				class="mm_bg-cover image_product"
				src="/image/_sample/360_sample7.png"
			></lazyload>
			<lazyload
				class="mm_bg-cover image_product"
				src="/image/_sample/360_sample8.png"
			></lazyload>
		</div>
	</div>
</template>

<script setup lang="ts">
	import Lazyload from '@/component/Lazyload.vue';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `360도 보기`,
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