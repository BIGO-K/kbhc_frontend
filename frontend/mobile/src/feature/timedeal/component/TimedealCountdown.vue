<template>
	<div
		ref="$timeDeal"
		class="m_prodetail-timedeal"
		:class="{ 'S=toggle-on': timeDealOff }"
	>
		<button
			type="button"
			class="btn_timedeal"
			@click="timeDealBarToggle"
		>
			<i class="ico_timedeal-clock"></i><b class="mm_ir-blind">타임특가</b>
		</button>
		<div class="mm_flex">
			<p class="text_time">
				<strong>{{ timer.hour }}<span>:</span>{{ timer.minute }}<span>:</span>{{ timer.second }}</strong>남음
			</p>
			<p class="mm_flex-equal text_stock">
				남은수량<strong>{{ number(stock) }}</strong>
			</p>
			<button
				type="button"
				class="btn_close"
				@click="timeDealBarToggle"
			>
				<i class="ico_timedeal-close"></i><b class="mm_ir-blind">닫기</b>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { useAnimation } from '$/composables/useAnimation';
	import { useCountDown } from '$/composables/useCountDown';
	import { useFormatter } from '$/composables/useFormatter';

	const prop = defineProps<{
		stock: number;
		timeDealInfo: TimeDealInformation;
	}>();
	const animation = useAnimation();
	const { number } = useFormatter();
	// 타임딜 타이머
	// 남은시간 단위별 숫자값
	const stock = computed(() => prop.stock);
	const timeDeal = computed(() => prop.timeDealInfo);

	const { timer } = useCountDown(timeDeal.value.sell_end_at, {
		startDate: timeDeal.value.sell_start_at,
		dayToHour: true,
	});


	// 타임딜 토글
	const $timeDeal = ref<HTMLElement | undefined>(undefined);
	const timeDealOff = ref(false);
	function timeDealBarToggle() {

		timeDealOff.value = !timeDealOff.value;

		if (!$timeDeal.value) return;

		const $btnTimedeal = $timeDeal.value.querySelector('.btn_timedeal');

		if (!$btnTimedeal) {
			return;
		}

		if (timeDealOff.value) {
			animation.to($timeDeal.value, { width: 46, duration: 0.2 });
			animation.to($btnTimedeal, { x: -7, duration: 0.2 });
		}
		else {
			animation.to($timeDeal.value, { width: window.outerWidth - 48, duration: 0.2 });
			animation.to($btnTimedeal, { x: 0, duration: 0.2 });
		}

	}
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/mixin';
	@use '../../../asset/scss/helper/function';
	@use '../../../asset/scss/helper/const';
	@use '../../../asset/scss/helper/var';

	.m_prodetail-timedeal {
		position: fixed;
		z-index: const.$z_index_floating;
		right: 24px;
		bottom: var.$lowbtn_height_base + 74px;// lowbtn 높이값 + padding
		width: calc(100% - 48px);
		border: 1px solid var(--color_sub);
		border-radius: 46px;
		background-color: var(--color_sub);
		@include mixin.font(#fff '/4.6rem');

		.btn_timedeal {
			position: absolute;
			z-index: 1;
			top: 0;
			left: 2px;
			width: 46px;
			height: 44px;
			border-radius: 100%;
			pointer-events: none;

			.ico_timedeal-clock {
				margin-top: 13px;

				&::before {
					width: 18px;
					height: 18px;
					@include mixin.svg(#fff url('/image/common/ico_clock.svg'));
				}
			}
		}

		&#{function.escape('.S=toggle-on')} {
			background-color: #fff;

			.btn_timedeal {
				left: 6px;
				pointer-events: auto;

				.ico_timedeal-clock::before {
					background-color: var(--color_sub);
				}
			}
		}

		> .mm_flex {
			overflow: hidden;
			height: 44px;

			> p {
				@include mixin.font('1.4rem/4.4rem');
			}

			.text_time {
				margin: 0 4px 0 43px;

				strong {
					display: inline-block;
					margin: 1px 2px -1px 0;
					@include mixin.font(600 '1.8rem');

					span {
						padding: 0 2px;
						@include mixin.font(400 '1.4rem');
					}
				}
			}

			.text_stock {
				margin-right: -3px;
				text-align: right;

				strong {
					margin-left: 8px;
					vertical-align: 0;
				}
			}

			.btn_close {
				width: 44px;
				height: 46px;

				.ico_timedeal-close {
					margin: 15px 1px 0 0;

					&::before {
						width: 14px;
						height: 14px;
						@include mixin.svg(#222 url('/image/common/ico_close_large.svg'));
					}
				}
			}
		}

		~ .btn_topmost {
			#{function.escape('.L=lowbtn')} & {
				bottom: calc(var.$lowbtn_height_base + 74px + 54px);
			}

			~ .btn_prodetail-recent {
				bottom: calc(var.$lowbtn_height_base + 74px + 108px);
			}
		}
	}
</style>