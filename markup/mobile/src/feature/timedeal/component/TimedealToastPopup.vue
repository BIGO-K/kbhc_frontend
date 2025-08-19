<template>
	<!-- 타임특가 -->
	<div
		class="mm_timedeal T=ta"
		:class="{ 'S=on': isPopupOpen }"
	>
		<div class="mm_timedeal-dim"></div>
		<div class="mm_timedeal-content">
			<carousel
				:items="carouselItems"
				:use-count="true"
				:auto-delay="0"
				:is-auto-height="true"
			>
				<template #default="{ item }">
					<mm-link :to="item.link">
						<p
							v-if="item.isAdult"
							class="text_adult"
						>
							<b class="mm_ir-blind">미성년자 구매불가</b><i class="ico_adult"></i>
						</p>
						<figure>
							<lazyload
								class="mui_bg-cover image_banner"
								:src="item.image"
							></lazyload>
							<figcaption :class="{ ['T=text-black']: item.isBlack }">
								<p class="text_state">
									<strong v-if="item.isIng">타임딜 진행중</strong>
									<strong
										v-else
										class="T=timedeal-schedule"
									>타임딜 진행예정</strong>
									<b><span class="text_hour">00</span>:<span class="text_min">00</span>:<span class="text_sec">00</span></b>
								</p>
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
			<div class="mm_timedeal-content-foot">
				<form-check
					v-model="todayClose"
					label="오늘 그만보기"
				></form-check>
				<button
					type="button"
					class="btn_close"
					@click="closeLayer"
				>
					<b>닫기</b>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import Carousel from '@/component/Carousel.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormCheck from '@/component/form/FormCheck.vue';

	const carouselItems = [
		{
			link: '#',
			image: '/image/_sample/main_timedeal_ta_01.png',
			alt: '대체텍스트',
			isAdult: false,
			isBlack: true,
			isIng: true,
			time: 35,
			texts: [
				'24H 타임특가!',
				'게릴라 세일',
				'럭키슈에뜨 50% OFF',
				'자켓/원피스/니트/스커트',
			],
		},
		{
			link: '#',
			image: '/image/_sample/main_timedeal_ta_02.png',
			alt: '대체텍스트',
			isAdult: false,
			isBlack: true,
			isIng: false,
			time: 10,
			texts: [
				'24H 타임특가!',
				'게릴라 세일',
				'럭키슈에뜨 50% OFF',
				'자켓/원피스/니트/스커트',
			],
		},
		{
			link: '#',
			image: '/image/_sample/main_timedeal_ta_03.png',
			alt: '대체텍스트',
			isAdult: false,
			isBlack: false,
			isIng: true,
			time: 216515,
			texts: [
				'24H 타임특가!',
				'게릴라 세일',
				'럭키슈에뜨 50% OFF',
				'자켓/원피스/니트/스커트',
			],
		},
		{
			link: '#',
			image: '/image/_sample/main_timedeal_ta_01.png',
			alt: '대체텍스트',
			isAdult: true,
			isBlack: false,
			isIng: true,
			time: 35,
			texts: [
				'24H 타임특가!',
				'게릴라 세일',
				'럭키슈에뜨 50% OFF',
				'자켓/원피스/니트/스커트',
			],
		},
	];

	const isPopupOpen = ref(true);
	const todayClose = ref(false);

	// 팝업 닫기
	const closeLayer = () => {

		isPopupOpen.value = false;

		// 오늘 그만보기
		if (todayClose.value) {
			//
		}

	};
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/mixin';
	@use '../../../asset/scss/helper/function';
	@use '../../../asset/scss/helper/const';
	@use '../../../asset/scss/helper/var';

	/** 타임특가 (메인) */
	.mm_timedeal#{function.escape('.T=ta')} {
		position: fixed;
		z-index: const.$z_index_popup;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		opacity: 0;

		&#{function.escape('.S=on')} {
			opacity: 1;
		}

		.mm_timedeal-dim {
			width: 100%;
			height: 100%;
			background-color: rgba(#000, 0.78);
		}

		.mm_timedeal-content {
			overflow: hidden;
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			border-radius: 16px 16px 0 0;

			.mm_image-none {
				background-color: rgba(#000, 0.5);
			}

			.mm_carousel {
				&-list {
					height: 256px;
				}

				&-item {
					background-color: transparent;

					a {
						display: block;
					}

					.text_state {
						position: absolute;
						z-index: 3;
						top: -76px;
						left: -5px;

						strong {
							display: inline-block;
							margin-left: 5px;
							padding: 0 8px;
							height: 20px;
							border-radius: 5px;
							background-color: var(--color_sub);
							@include mixin.font(#fff 700 '1.2rem/2rem');

							&#{function.escape('.T=timedeal-schedule')} {
								background-color: #5c5c5c;
							}
						}

						b {
							display: block;
							margin-top: 6px;
							@include mixin.font(600 '1.8rem/3rem');

							span {
								padding: 0 4px;
								@include mixin.font(500 '2.2rem');
							}
						}
					}

					.text_adult {
						position: absolute;
						z-index: 2;
						top: 0;
						right: 0;
						bottom: 0;
						left: 0;
						background-color: #ffe8d8;

						.ico_adult {
							position: absolute;
							top: 50%;
							right: 62px;
							width: 65px;
							height: 65px;
							border-color: #eb5147;
							transform: translateY(-50%);

							&::before {
								@include mixin.font(#eb5147 '3.6rem/5.6rem');
							}
						}

						+ figure {
							figcaption {
								z-index: 2;
								color: #222;
							}
						}
					}

					figure {
						.image_banner {
							width: 100%;
							height: 256px;
						}

						figcaption {
							position: absolute;
							bottom: 33px;
							left: 24px;
							width: 45vw;
							color: #fff;

							&#{function.escape('.T=text-black')} {
								color: #222;
							}

							> [class*='text_banner'] {
								@include mixin.text-ellipsis(1);
							}

							.text_banner1 {
								@include mixin.font(600 '2.3rem/3rem');

								+ .text_banner2 {
									margin-top: 2px;
								}

								+ .text_banner3,
								+ .text_banner4 {
									margin-top: 11px;
								}
							}

							.text_banner2 {
								@include mixin.font(600 '2.3rem/3rem');

								+ .text_banner3,
								+ .text_banner4 {
									margin-top: 11px;
								}
							}

							.text_banner3 {
								@include mixin.font('1.5rem/2.3rem');
							}

							.text_banner4 {
								@include mixin.font('1.5rem/2.3rem');
							}
						}
					}
				}

				&-count {
					position: absolute;
					z-index: 2;
					right: 16px;
					bottom: 16px;
					padding: 0 10px;
					height: 28px;
					border-radius: 14px;
					background-color: rgba(#222, 0.5);
					@include mixin.font(#fff '1.4rem/2.8rem');

					strong {
						font-weight: 600;
					}

					> i {
						margin: 0 4px;
						opacity: 1;
					}

					span {
						opacity: 1;
					}
				}
			}

			&-foot {
				overflow: hidden;
				position: relative;
				height: 53px;
				background-color: #fff;

				.mm_form-check {
					padding: 14px 24px 14px 48px;

					.ico_form-check {
						top: 14px;
						left: 24px;
					}

					.text_label {
						@include mixin.font('1.6rem/2.4rem');
					}
				}

				.btn_close {
					float: right;
					padding: 0 24px;
					@include mixin.font(var(--color_text_base) 600 '1.6rem/5.6rem');
				}
			}
		}
	}
</style>