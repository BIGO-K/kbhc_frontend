<template>
	<block
		v-slot="{ context }"
		:block="block"
	>
		<carousel
			:active-index="context.get('carouselIndex', 0)"
			:items="banners"
			:auto-delay="4"
			use-pagination
			is-block-content
			@ready="_param => context.set({ carouselIndex: _param.activeIndex })"
			@start="_param => context.set({ carouselIndex: _param.activeIndex })"
		>
			<template #default="{ item }">
				<block-banner :banner="item"></block-banner>
			</template>
		</carousel>
	</block>
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import Carousel from '@/component/Carousel.vue';
	import Block from '@/component/block/BaseBlock.vue';
	import BlockBanner from '@/component/block/BlockBanner.vue';

	const props = defineProps<{ block: Block }>();
	const banners = computed(() => props.block.banner_partition?.banners || []);
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/function';
	@use '../../../asset/scss/helper/mixin';
	@use '../../../asset/scss/helper/const';
	@use '../../../asset/scss/helper/var';

	[data-mui='b_c=w6Xh7_s1_2'] {
		.mui_carousel {
			&-list {
				padding-top: 104.78723%;
			}

			&-pagination {
				bottom: 24px;

				li:nth-child(n+2) {
					margin-left: 6px;
				}

				button {
					width: 6px;
					height: 6px;
					border-radius: 3px;
					background-color: #ccc;
					transition: width const.$time_fast;

					&#{function.escape('.S=on')} {
						width: 20px;
						background-color: #222;
					}
				}
			}
		}

		a {
			display: block;
			position: relative;
		}

		figure {
			.image_banner {
				position: relative;
				padding-top: 104.78723%;
				width: 100%;

				&::before {
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					background-color: rgba(#000, 0.1);
					content: '';
				}
			}

			figcaption {
				position: absolute;
				z-index: 1;
				right: 0;
				bottom: 14.72081%;
				left: 0;
				padding: 0 31px;
				@include mixin.font(#fff 500 '2.7rem/1.4' center);

				&#{function.escape('.T=text-black')} {
					color: #000;
				}

				.text_banner3 {
					margin-top: 10px;
					font-size: 1.7rem;
				}

				.text_alt {
					@include mixin.text_ellipsis(2);
					@include mixin.font(#a3a3a3 '1.4rem/2rem' center);

					@include mixin.context-after(':not(.mui_image-none)', 'figure') {
						display: none;
					}
				}
			}
		}

		// 이미지 에러
		.mui_image-none {
			.uico_none {
				background-color: #f5f5f5;
			}
		}
	}
</style>