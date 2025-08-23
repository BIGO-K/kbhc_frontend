<template>
	<div data-mui="b_c=w6Xh7_s1_2">
		<carousel
			:items="carouselItems"
			:use-pagination="true"
			:auto-delay="4"
			:is-block-content="true"
		>
			<template #default="{ item }">
				<mm-link :to="item.link">
					<figure>
						<lazyload
							class="mui_bg-cover image_banner"
							:src="item.image"
						></lazyload>
						<figcaption :class="{ ['T=text-black']: item.isBlack }">
							<template v-if="item.texts.filter(_value => _value != null).length === 0">
								<p class="text_alt">
									{{ item.alt }}
								</p>
							</template>
							<template v-else>
								<p
									v-for="(text, _i) in item.texts"
									:key="text"
									:class="`text_banner${_i + 1}`"
								>
									{{ text }}
								</p>
							</template>
						</figcaption>
					</figure>
				</mm-link>
			</template>
		</carousel>
	</div>
</template>

<script setup lang="ts">
	import Carousel from '@/component/Carousel.vue';
	import Lazyload from '@/component/Lazyload.vue';

	const carouselItems = [
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh7_s1_2_03.jpg',
			alt: '대체텍스트',
			isBlack: true,
			texts: [
				'장건강을 위한',
				'지큐랩 포스트 솔루션',
				'첫구매 30%할인, 재구매 시 20%할인',
			],
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh7_s1_2_01.jpg',
			alt: '대체텍스트',
			isBlack: false,
			texts: [
				'사랑스럽고 웨어러블한',
				'주얼리 컬렉션',
				'뉴시즌 단독 특가 20% 할인',
			],
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh7_s1_2_02.jpg',
			alt: '대체텍스트',
			isBlack: true,
			texts: [
				'지금 가장 사랑받는',
				'캐주얼 웨어',
				'TREND WE PICK',
			],
		},
	];
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
					margin-left: 7px;
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