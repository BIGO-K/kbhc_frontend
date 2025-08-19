<template>
	<!-- 배송 도착 확률 -->
	<div class="m...info-ship">
		<toggle
			v-model:is-active="isTooltipActive"
			class="btn_help"
			parent-selector=".m...info-ship"
		>
			<i class="ico_tooltip"></i>
		</toggle>
		<div class="m...info-ship-tooltip">
			<p>최근 배송된 주문건 대상으로 평균 배송일을 예측했습니다. 실제 배송완료일은 예측치와 다를 수 있습니다.</p>
			<button
				type="button"
				class="btn_close"
				@click="isTooltipActive = false"
			>
				<i class="ico_tooltip-close"></i><b class="mm_ir-blind">닫기</b>
			</button>
		</div>
		<dropdown>
			<template #button>
				<i class="ico_ship"></i><strong>5월 19일(화)</strong> 도착 확률<strong>90.1<sub>%</sub></strong>
			</template>
			<template #content>
				<p><span>5월 18일(월) 도착확률</span><strong>27.2<sub>%</sub></strong></p>
				<p><span>5월 19일(화) 도착확률</span><strong>90.1<sub>%</sub></strong></p>
				<p><span>5월 20일(수) 도착확률</span><strong>65.2<sub>%</sub></strong></p>
			</template>
		</dropdown>
		<p class="text_note">
			오후 3시 이전 주문시 당일 출고 가능
		</p>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Toggle from '@/component/Toggle.vue';

	const isTooltipActive = ref(false);
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/mixin';
	@use '../../../asset/scss/helper/function';

	.m_prodetail-head-info {
		#{function.escape('.m...info-ship')} {
			position: relative;
			margin-top: 8px;

			&#{function.escape('.S=toggle-on')} {
				#{function.escape('.m...info-ship-tooltip')} {
					display: block;
				}
			}

			.btn_help {
				position: absolute;
				z-index: 1;
				top: 9px;
				right: 6px;
				padding: 8px;
			}

			#{function.escape('.m...info-ship-tooltip')} {
				display: none;
				position: absolute;
				z-index: 1;
				top: 16px;
				right: 14px;
				left: 0;
				padding: 17px 46px 17px 20px;
				border-radius: 8px;
				background-color: rgba(#000, 0.8);
				@include mixin.font(#f8f8f8 '1.4rem/2rem');

				.btn_close {
					position: absolute;
					top: 0;
					right: 0;
					padding: 12px;
				}
			}

			.mm_dropdown {
				&#{function.escape('.S=on')} {
					.btn_dropdown {
						border-radius: 8px 8px 0 0;
					}
				}

				.btn_dropdown {
					padding: 11px;
					height: 50px;
					border: 1px solid #eee;
					border-radius: 8px;
					background-color: #f8f8f8;
					vertical-align: 0;
					@include mixin.font('/2.6rem' left);

					strong {
						font-weight: 600;

						~ strong {
							margin-left: 10px;
							vertical-align: -1px;
							@include mixin.font(var(--color_sub) '1.6rem');
						}
					}

					.ico_ship {
						margin-right: 8px;
						padding: 6px;
						width: 26px;
						height: 26px;
						border-radius: 100%;
						background-color: #888;

						&::before {
							width: 14px;
							height: 14px;
							background-color: #fff;
						}
					}

					.ico_dropdown {
						right: 45px;

						&::before {
							width: 16px;
							height: 16px;
							background-color: #444;
						}
					}
				}

				&-item-inner {
					margin-top: -1px;
					padding: 21px 17px 18px 19px;
					border: 1px solid #eee;
					border-radius: 0 0 8px 8px;

					p {
						position: relative;
						@include mixin.font(#444 600 '1.4rem');
						@include mixin.clearfix;

						&::before {
							position: absolute;
							top: 50%;
							right: 0;
							left: 0;
							margin-top: -2px;
							border-top: 1px dashed #ccc;
							content: '';
						}

						> * {
							position: relative;
						}

						> span {
							display: inline-block;
							padding-right: 13px;
							background-color: #fff;
						}

						strong {
							float: right;
							padding-left: 11px;
							background-color: #fff;
							font-size: 1.6rem;
						}

						&:only-child,
						&:nth-child(2) {
							color: var(--color_sub);
						}

						+ p {
							margin-top: 12px;
						}
					}
				}
			}

			.text_note {
				margin-top: 5px;
				padding: 0 6px;
				@include mixin.font(#888 '1.3rem/2rem');
			}

			+ dl {
				margin-top: 15px;
			}
		}
	}
</style>