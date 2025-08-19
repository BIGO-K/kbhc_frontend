<template>
	<block
		v-slot="{ context }"
		:block="block"
	>
		<carousel
			:active-index="context.get('carouselIndex', 0)"
			:items="banners"
			:auto-delay="0"
			:group-size="8"
			is-auto-height
			is-block-content
			@ready="_param => {
				context.set({ carouselIndex: _param.activeIndex });
				carouselIndex = _param.realIndex
			}"
			@start="_param => {
				context.set({ carouselIndex: _param.activeIndex });
				carouselIndex = _param.realIndex
			}"
		>
			<template #default="{ item }">
				<block-banner :banner="item"></block-banner>
			</template>

			<template
				v-if="banners.length > 8"
				#afterInner
			>
				<div class="mui_carousel-progress">
					<div
						class="mui_carousel-progress-bar"
						:style="{ width: barWidth + '%', transform: `translateX(${100 * carouselIndex}%)` }"
					></div>
				</div>
			</template>
		</carousel>
	</block>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import Carousel from '@/component/Carousel.vue';
	import Block from '@/component/block/BaseBlock.vue';
	import BlockBanner from '@/component/block/BlockBanner.vue';

	const props = defineProps<{ block: Block }>();
	const banners = computed(() => props.block.banner_partition?.banners || []);
	const barWidth = 100 / Math.ceil(banners.value.length / 8);
	const carouselIndex = ref<number>(0);
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/function';
	@use '../../../asset/scss/helper/mixin';
	@use '../../../asset/scss/helper/const';
	@use '../../../asset/scss/helper/var';

	[data-mui='b_c=w6Xh5_s8'] {
		margin: -46px 0;

		.mui_carousel {
			padding: 0 20px;

			&-item {
				text-align: center;

				&-group {
					display: inline-block;
					margin: -19px 0 0 -20px;
					font-size: 0;

					> a {
						display: inline-block;
						margin: 19px 0 0 20px;
						width: 64px;
					}
				}
			}

			&-progress {
				overflow: hidden;
				position: relative;
				margin: 0 auto;
				padding-top: 29px;
				width: 60px;
				border-radius: 3px;

				&::before {
					position: absolute;
					right: 0;
					bottom: 0;
					left: 0;
					height: 6px;
					background-color: #eee;
					content: '';
				}

				&-bar {
					position: absolute;
					bottom: 0;
					left: 0;
					width: 50%;
					height: 6px;
					border-radius: 3px;
					background-color: #444;
					transition: transform const.$time_fast;
				}
			}
		}

		figure {
			.image_banner {
				position: relative;
				padding-top: 100%;
				width: 100%;
				border-radius: 100%;
			}

			figcaption {
				padding: 9px 0 1px;
				@include mixin.font(#222 '1.5rem' center, normal);

				.text_alt {
					@include mixin.text_ellipsis(2);
					@include mixin.font(#a3a3a3 '1.4rem/2rem');

					@include mixin.context-after(':not(.mui_image-none)', 'figure') {
						display: none;
					}
				}
			}
		}
	}
</style>