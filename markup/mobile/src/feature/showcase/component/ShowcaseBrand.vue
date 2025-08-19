<template>
	<section class="m_brand-showcase">
		<h4><b>SHOWCASE</b></h4>
		<carousel
			:items="brandCarouselItems"
			effect="cover"
			:use-count="true"
			:auto-delay="4"
			:is-more-side="true"
		>
			<template #default="{ item }">
				<mm-link :to="item.link">
					<figure>
						<lazyload
							class="mm_bg-cover image_banner"
							:src="item.image"
						></lazyload>
						<figcaption>
							<p class="text_title">
								{{ item.title }}
							</p>
							<p
								v-for="text in item.texts"
								:key="text"
								class="text_main"
							>
								{{ text }}
							</p>
						</figcaption>
					</figure>
				</mm-link>
			</template>
		</carousel>
	</section>
</template>

<script setup lang="ts">
	import Carousel from '@/component/Carousel.vue';
	import Lazyload from '@/component/Lazyload.vue';

	const brandCarouselItems = [
		{
			image: '/image/_sample/prod_x3_1.png',
			title: 'BrandNAME 엠몬스타',
			texts: [
				'세심한 미니멀룩으로',
				'오롯한 나의 취향을 담다',
			],
			link: '/showcase/111',
		},
		{
			image: '/image/_sample/prod_x3_4.png',
			title: '엠몬스타',
			texts: [
				'익숙한 곳을 떠나 지친 마음을 되돌며',
				'다시, 또 새로운 시작을 함께 할 휴식',
			],
			link: '/showcase/222',
		},
		{
			image: '/image/_sample/prod_x3_1.png',
			title: '브랜드',
			texts: [
				'세심한 미니멀룩으로',
				'오롯한 나의 취향을 담다',
			],
			link: '/showcase/333',
		},
		{
			image: '/image/_sample/prod_x3_2.png',
			title: 'BrandNAME',
			texts: [
				'익숙한 곳을 떠나 지친 마음을 되돌며',
				'다시, 또 새로운 시작을 함께 할 휴식',
			],
			link: '/showcase/444',
		},
	];
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/mixin';
	@use '../../../asset/scss/helper/function';
	@use '../../../asset/scss/helper/const';

	.m_brand-showcase {
		padding: 0 18px;

		h4 {
			padding: 0 0 20px 6px;
			@include mixin.font(#222 600 '2rem');
		}

		.mm_carousel {
			margin-right: -18px;

			&-inner {
				padding-right: 6.4vw;
			}

			&-list {
				box-sizing: content-box;
				padding-top: 98.19819%;
				height: 97px;
			}

			&-item {
				padding-left: 6px;
				background-color: transparent;

				&#{function.escape('.S=on')} {
					figcaption {
						opacity: 1;
					}
				}

				&#{function.escape('.S=prev')} {
					figcaption {
						opacity: 0;
					}
				}

				&#{function.escape('.S=next')} {
					figcaption {
						opacity: 1;
						transition-delay: const.$time_fast;
					}
				}

				.image_banner {
					position: relative;
					padding-top: 100%;
					width: 100%;
					border-radius: 8px;
				}

				figcaption {
					padding-top: 16px;
					@include mixin.font(#444 '1.5rem/2.4rem');
					opacity: 0;
					transition: opacity const.$time_base;

					> * {
						@include mixin.text-ellipsis(1);
					}

					.text_title {
						@include mixin.font(#222 600 '2rem/2.8rem');

						+ .text_main {
							margin-top: 8px;
						}
					}

					.text_main {
						padding-right: 50px;

						+ .text_main {
							margin-top: 3px;
						}
					}
				}
			}

			&-count {
				right: 23px;
				bottom: -4px;
				padding: 0 12px;
				width: auto;
				height: 22px;
				border: 1px solid #eee;
				border-radius: 11px;
				background-color: #f8f8f8;
				font-size: 0;

				> * {
					@include mixin.font(#888 '1.4rem/2rem');
				}

				.text_carousel-index {
					color: #222;
				}

				> i {
					margin: 0 2px;
					opacity: 1;
					font-size: 1.3rem;
				}

				.text_carousel-total {
					opacity: 1;
				}
			}
		}

		+ .m_brand-curation {
			margin-top: 64px;
		}
	}
</style>