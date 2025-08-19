<template>
	<div data-mui="b_c=w6Xh5_s8">
		<carousel
			:items="carouselItems"
			:auto-delay="0"
			:group-size="8"
			:is-auto-height="true"
			:is-block-content="true"
			@start="carouselProgress"
		>
			<template #default="{ item }">
				<mm-link :to="item.link">
					<figure>
						<lazyload
							class="mui_bg-cover image_banner"
							:src="item.image"
						></lazyload>
						<figcaption>
							<template v-if="item.text === null">
								<p class="text_alt">
									{{ item.alt }}
								</p>
							</template>
							<template v-else>
								<p class="text_banner1">
									{{ item.text }}
								</p>
							</template>
						</figcaption>
					</figure>
				</mm-link>
			</template>

			<template
				v-if="carouselItems.length > 8"
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
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import Carousel from '@/component/Carousel.vue';
	import Lazyload from '@/component/Lazyload.vue';

	const carouselItems = [
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh5_s8_01.jpg',
			alt: '대체텍스트',
			text: '포인트관',
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh5_s8_02.jpg',
			alt: '대체텍스트',
			text: '프리미엄',
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh5_s8_03.jpg',
			alt: '대체텍스트',
			text: '건강기능',
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh5_s8_04.jpg',
			alt: '대체텍스트',
			text: '건강식품',
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh5_s8_05.jpg',
			alt: '대체텍스트',
			text: '운동식품',
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh5_s8_06.jpg',
			alt: '대체텍스트',
			text: '해외직구',
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh5_s8_07.jpg',
			alt: '대체텍스트',
			text: '건강기기',
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh5_s8_08.jpg',
			alt: '대체텍스트',
			text: '식단관리',
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh5_s8_06.jpg',
			alt: '대체텍스트',
			text: '해외직구',
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh5_s8_07.jpg',
			alt: '대체텍스트',
			text: '건강기기',
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh5_s8_08.jpg',
			alt: '대체텍스트',
			text: '식단관리',
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh5_s8_01.jpg',
			alt: '대체텍스트',
			text: '포인트관',
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh5_s8_02.jpg',
			alt: '대체텍스트',
			text: '프리미엄',
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh5_s8_03.jpg',
			alt: '대체텍스트',
			text: '건강기능',
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh5_s8_04.jpg',
			alt: '대체텍스트',
			text: '건강식품',
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh5_s8_05.jpg',
			alt: '대체텍스트',
			text: '운동식품',
		},
	];

	const barWidth = 100 / Math.ceil(carouselItems.length / 8);
	const carouselIndex = ref<number>(0);

	type EmitBaseParameter = {
		activeIndex: number;
		realIndex: number;
		isBack?: boolean;
	};

	const carouselProgress = (_e: EmitBaseParameter) => {
		carouselIndex.value = _e.realIndex;
	};
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
					margin-left: -20px;
					font-size: 0;

					> a {
						display: inline-block;
						margin-left: 20px;
						width: 64px;

						&:nth-child(n+5) {
							margin-top: 19px;
						}
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