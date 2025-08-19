<template>
	<!-- 타임특가 -->
	<div
		v-if="isPopupOpen && timeDealBanners.length > 0"
		class="mm_timedeal T=ta S=on"
	>
		<div class="mm_timedeal-dim"></div>
		<div class="mm_timedeal-content">
			<carousel
				:items="timeDealBanners"
				:use-count="true"
				:auto-delay="0"
				:is-auto-height="true"
			>
				<template #default="{ item }">
					<time-deal-banner :item="item"></time-deal-banner>
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
	import { usePopupStore } from '$/stores/usePopupStore';
	import { useTimeDeal } from '$/composables/useTimeDeal';
	import Carousel from '@/component/Carousel.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import TimeDealBanner from '@/feature/timedeal/component/TimedealBanner.vue';

	const { hide, isHide } = usePopupStore();
	const popupKey = 'TIMEDEAL_POPUP';
	const timeDealBanners = ref<TimeDealBanner[]>([]);

	try {
		const { banners } = await useTimeDeal().getList();
		timeDealBanners.value = banners;
	}
	catch (e) {
		//
	}

	const todayClose = ref(isHide(popupKey));
	const isPopupOpen = ref(!todayClose.value);

	// 팝업 닫기
	const closeLayer = () => {
		isPopupOpen.value = false;
		// 오늘 그만보기
		if (todayClose.value) {
			hide(popupKey);
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

							.text_alt {
								padding-top: 79px;
								@include mixin.text_ellipsis(2);
								@include mixin.font(#a3a3a3 '1.4rem/2rem');

								@include mixin.context-after(':not(.mm_image-none)', 'figure') {
									display: none;
								}
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