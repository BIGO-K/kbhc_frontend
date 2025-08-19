<template>
	<div data-mui="b_c=w6Xh3_s1_6">
		<div class="mui_title">
			<h3 class="title_main">
				<b>건강을 바라는 마음을 준비했어요! 💌</b>
			</h3>
		</div>
		<carousel
			:items="carouselItems"
			:use-pagination="true"
			:auto-delay="4"
			effect="fade"
			:is-block-content="true"
		>
			<template #default="{ item }">
				<mm-link :to="item.link">
					<figure>
						<lazyload
							class="mui_bg-cover image_banner"
							:src="item.image"
						></lazyload>
						<figcaption>
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
			image: '/image/_sample/b_c=w6Xh3_s1_6_01.jpg',
			alt: '대체텍스트',
			texts: [
				'깊고 진한 침향수',
				'하루 한번, 건강을 위한 습관!',
			],
		},
		{
			link: '#',
			image: '/image/_sample/b_c=w6Xh3_s1_6_02.jpg',
			alt: '대체텍스트',
			texts: [
				'당신의 라이프 스타일',
				'매일 찾게 되는 그 아이템',
			],
		},
	];
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/function';
	@use '../../../asset/scss/helper/mixin';
	@use '../../../asset/scss/helper/const';
	@use '../../../asset/scss/helper/var';

	[data-mui='b_c=w6Xh3_s1_6'] {
		.mui_carousel {
			&-list {
				padding-top: 40.95744%;
			}

			&-pagination {
				bottom: -9px;
				transform: translate(-50%, 100%);

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
				padding-top: 40.95744%;
				width: 100%;

				&::before {
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					background-color: rgba(#000, 0.13);
					content: '';
				}
			}

			figcaption {
				position: absolute;
				z-index: 1;
				top: 50%;
				right: 20px;
				left: 20px;
				margin-top: 2px;
				padding: 0 4px;
				@include mixin.font(#fff '2.2rem/1.4');
				transform: translateY(-50%);

				.text_banner1 {
					font-weight: 600;

					+ .text_banner2 {
						margin-top: 4px;
					}
				}

				.text_banner2 {
					font-size: 1.6rem;
				}

				.text_alt {
					@include mixin.text_ellipsis(2);
					@include mixin.font(#a3a3a3 '1.4rem/2rem');

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