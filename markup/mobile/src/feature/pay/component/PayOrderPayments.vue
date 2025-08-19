<template>
	<li>
		<form-radio
			v-model="paymentType"
			name="dev_radio-payselect"
			value="payCard"
			@update:model-value="changePaymentRadio"
		>
			<b class="mm_block">
				<i class="ico_form-radio"></i>
				<span class="text_label">간편 카드결제</span>
			</b>
		</form-radio>
		<div
			v-if="paymentType === 'payCard'"
			class="m_order-payment-card"
		>
			<slider
				:items="payCardItems"
				:use-pagination="true"
				:is-loop="true"
			>
				<template #default="{ item, index }">
					<template v-if="item.number !== 'create'">
						<figure>
							<i class="image_logo">
								<lazyload
									tag="img"
									:src="item.image"
								></lazyload>
							</i>
							<figcaption>
								<p class="text_title">
									카드번호
								</p>
								<p class="text_num">
									<span
										v-for="code in item.number.split('-')"
										:key="code"
									>{{ code }}</span>
								</p>
							</figcaption>
						</figure>
						<button
							type="button"
							class="btn_remove"
						>
							<i class="ico_remove"></i><b class="mm_ir-blind">삭제</b>
						</button>
					</template>
					<template v-else>
						<mm-link
							class="btn_register"
							to="http://"
						>
							<i class="ico_add"></i><b v-html="index === 0 ? '카드 등록 한번으로<br> 간편하게 결제해보세요' : '카드 추가 등록'"></b>
						</mm-link>
					</template>
				</template>

				<template #afterInner>
					<!-- 할부기간 - 카드 등록 선택 시 할부 기간 선택은 비노출합니다. -->
					<form-select v-model="sortInstallment">
						<option>일시불</option>
					</form-select>
				</template>
			</slider>
		</div>
	</li>
	<li>
		<form-radio
			v-model="paymentType"
			name="dev_radio-payselect"
			value="PayAccount"
			@update:model-value="changePaymentRadio"
		>
			<b class="mm_block">
				<i class="ico_form-radio"></i>
				<span class="text_label">간편 계좌결제</span>
			</b>
		</form-radio>
		<div
			v-if="paymentType === 'payAccount'"
			class="m_order-payment-account"
		>
			<slider
				:items="payAccountItems"
				:use-pagination="true"
			>
				<template #default="{ item, index }">
					<template v-if="item.number !== 'create'">
						<figure>
							<i class="image_logo">
								<lazyload
									tag="img"
									:src="item.image"
								></lazyload>
							</i>
							<figcaption>
								<p class="text_num">
									{{ item.number }}
								</p>
							</figcaption>
						</figure>
						<button
							type="button"
							class="btn_remove"
						>
							<i class="ico_remove"></i><b class="mm_ir-blind">삭제</b>
						</button>
					</template>
					<template v-else>
						<mm-link
							class="btn_register"
							to="http://"
						>
							<i class="ico_add"></i><b v-html="index === 0 ? '계좌 등록 한번으로<br> 간편하게 결제해보세요' : '계좌 추가 등록'"></b>
						</mm-link>
					</template>
				</template>
			</slider>
		</div>
	</li>
</template>

<script setup lang="ts">
	import { ref, watch } from 'vue';
	import Lazyload from '@/component/Lazyload.vue';
	import Slider from '@/component/Slider.vue';
	import FormRadio from '@/component/form/FormRadio.vue';
	import FormSelect from '@/component/form/FormSelect.vue';

	const prop = withDefaults(defineProps<{
		modelValue: string;
	}>(), {
		modelValue: '',
	});

	const emit = defineEmits<{
		'update:model-value': [_value: string];
	}>();

	const payCardItems = ref([
		{
			image: '/image/_sample/pay_card_logo_1.png',
			number: '****-****-0421-1628',
		},
		{
			image: '/image/_sample/pay_card_logo_2.png',
			number: '****-****-1234-5678',
		},
		{
			image: '/image/_sample/pay_card_logo_1.png',
			number: '****-****-0421-1628',
		},
		{
			// 등록버튼 노출용도 빈 객체
			image: null,
			number: 'create',
		},
	]);

	const payAccountItems = ref([
		{
			image: '/image/_sample/pay_bank_logo_1.png',
			number: '123456***',
		},
		{
			image: '/image/_sample/pay_bank_logo_1.png',
			number: '987654***',
		},
		{
			image: '/image/_sample/pay_bank_logo_1.png',
			number: '246809***',
		},
		{
			// 등록버튼 노출용도 빈 객체
			image: null,
			number: 'create',
		},
	]);

	const changePaymentRadio = () => {
		emit('update:model-value', paymentType.value);
	};

	const paymentType = ref(prop.modelValue);
	const sortInstallment = ref('');

	watch(() => prop.modelValue, () => {
		paymentType.value = prop.modelValue;
	});
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/mixin';
	@use '../../../asset/scss/helper/function';
	@use '../../../asset/scss/helper/const';

	.m_order-payment {
		.mm_dropdown-item {
			.mm_dropdown-item-inner {
				> ul {
					margin: -20px 0;

					> li {
						position: relative;

						&:nth-child(n+2) {
							border-top: 1px solid #e6e6e6;
						}

						> .mm_form-radio {
							padding: 20px 14px 20px 38px;

							.ico_form-radio {
								top: 20px;
								left: 14px;
							}
						}
					}
				}
			}
		}

		// 자체페이(카드/계좌) 슬라이더
		.mm_slider {
			margin: 3px auto 0;

			&-inner {
				padding: 0 18.08510vw;
			}

			&-item {
				position: relative;
				padding: 7px;
				width: 63.82978vw;
				opacity: 0.3;

				&#{function.escape('.S=on')} {
					opacity: 1;

					> figure {
						box-shadow: 0 3px 6px 0 rgba(#000, 0.1);
					}

					> figure,
					> a {
						border-color: #101010;
						background-color: #fff;

						+ .btn_remove {
							display: block;
						}
					}
				}

				figure {
					position: relative;
					padding: 0 19px;
					height: 100%;
					border: 1px solid #888;
					border-radius: 8px;
					background-color: #f5f5f5;

					.image_logo {
						margin-top: 19px;
						height: 18px;

						> img {
							width: auto;
							height: 100%;
						}
					}

					.mm_image-none {
						&::before {
							@include mixin.font(#101010 700 '1.5rem');
							content: attr(data-ir);
						}

						.ico_none {
							display: none;
						}
					}

					figcaption {
						position: absolute;
						bottom: 14px;

						.text_num {
							@include mixin.font('1.5rem/1.8rem');

							span {
								margin-right: 7px;
							}
						}
					}
				}

				.btn_remove {
					display: none;
					position: absolute;
					top: 7px;
					right: 7px;
					padding: 12px;

					.ico_remove::before {
						width: 12px;
						height: 12px;
						background-color: #888;
					}
				}
			}

			&-pagination {
				position: relative;
				bottom: 0;
				text-align: center;

				li:nth-child(n+2) {
					margin-left: 6px;
				}

				.btn_slider-page {
					margin: 14px 0 7px;
					width: 7px;
					height: 7px;
					transition: opacity const.$time_fast;

					&#{function.escape('.S=on')} {
						margin-top: 13px;
						width: 9px;
						height: 9px;
					}
				}
			}
		}

		// 간편 카드결제
		.m_order-payment-card {
			padding-bottom: 29px;

			.mm_slider {
				&-item {
					height: 154px;

					figcaption {
						.text_title {
							padding-bottom: 5px;
							@include mixin.font(#5c5c5c 600 '1.3rem');
						}
					}

					// 카드등록
					.btn_register {
						padding-top: 41px;
						height: 100%;
						border: 1px dashed #cdcdcd;
						border-radius: 8px;
						background-color: #fff;
						text-align: center;

						.ico_add {
							width: 34px;
							height: 34px;
							border-radius: 100%;
							background-color: #f5f5f5;

							&::before {
								margin-top: 10px;
								width: 14px;
								height: 14px;
								background-color: #b8b8b9;
							}
						}

						b {
							display: block;
							margin-top: 9px;
							padding: 0 10px;
							@include mixin.font('1.3rem/1.8rem');
						}
					}
				}

				.mm_form-select {
					margin: 11px auto 7px;
					width: 226px;
				}
			}
		}

		// 간편 계좌결제
		.m_order-payment-account {
			padding-bottom: 29px;

			.mm_slider {
				&-item {
					height: 97px;

					figure {
						.image_logo {
							height: 17px;
						}

						figcaption {
							bottom: 20px;
						}
					}

					// 카드등록
					.btn_register {
						padding: 24px 15px 0;
						height: 100%;
						border: 1px dashed #cdcdcd;
						border-radius: 8px;
						background-color: #fff;

						.ico_add {
							margin-right: 12px;
							width: 34px;
							height: 34px;
							border-radius: 100%;
							background-color: #f5f5f5;
							text-align: center;

							&::before {
								margin-top: 10px;
								width: 14px;
								height: 14px;
								background-color: #b8b8b9;
							}
						}

						b {
							@include mixin.font('1.3rem/3.4rem' left);
						}
					}

					&:only-child {
						.btn_register {
							> b {
								line-height: 1.8rem;
							}
						}
					}
				}
			}
		}

		// 다른 결제수단
		.mm_syncer-payment-method {
			[class*='mm_syncer-method'] {
				margin-bottom: 0;
			}
		}
	}
</style>