<template>
	<div class="m_product-restock">
		<section>
			<h6><b>{{ childBundle1Options1.goods_name }}</b></h6>
			<dl>
				<dt>옵션1</dt>
				<dd>
					<form-select
						v-model="bundleSelectedOption"
						title="옵션1"
						:use-overlay="true"
						need-overlay-hide-first-option
					>
						<option :value="undefined">
							옵션명1
						</option>
						<option
							v-for="option in childBundle1Options1.options"
							:key="`option1_${option.name}`"
							:value="option"
						>
							{{ option.name }}
							<template v-if="!option.is_selectable">
								<small class="text_soldout">품절</small>
							</template>
						</option>
					</form-select>
				</dd>
			</dl>
			<dl>
				<dt>옵션2</dt>
				<dd>
					<form-select
						v-model="bundleSelectedSubOption"
						title="옵션2"
						:use-overlay="true"
						need-overlay-hide-first-option
					>
						<option :value="undefined">
							옵션명2
						</option>
						<option
							v-for="subOption in bundleSelectedOption?.sub"
							:key="`option2_${subOption.name}`"
							:value="subOption"
							:disabled="subOption.qty !== 0"
						>
							{{ subOption.name }}
						</option>
					</form-select>
				</dd>
			</dl>
		</section>
		<section>
			<h6><b>{{ childBundle1Options2.goods_name }}</b></h6>
			<dl>
				<dt>옵션2</dt>
				<dd>
					<form-select
						v-model="bundleChild2SelectedOption"
						title="옵션1"
						:use-overlay="true"
						need-overlay-hide-first-option
					>
						<option :value="undefined">
							옵션명1
						</option>
						<option
							v-for="option in childBundle1Options2.options"
							:key="`option1_${option.name}`"
							:value="option"
						>
							{{ option.name }}
						</option>
					</form-select>
				</dd>
			</dl>
			<dl>
				<dt>옵션2</dt>
				<dd>
					<form-select
						v-model="bundleChild2SelectedSubOption"
						title="옵션2"
						:use-overlay="true"
						need-overlay-hide-first-option
					>
						<option :value="undefined">
							옵션명2
						</option>
						<option
							v-for="subOption in bundleChild2SelectedOption?.sub"
							:key="`option2_${subOption.name}`"
							:value="subOption"
							:disabled="subOption.qty !== 0"
						>
							{{ subOption.name }}
						</option>
					</form-select>
				</dd>
			</dl>
		</section>
		<div class="mm_btn_box">
			<button
				type="button"
				class="mm_btn T=primary"
				@click="apply"
			>
				<b>재입고 알림 신청하기</b>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref, watch } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useGoodsAdditional } from '$/composables/useGoodsAdditional';
	import FormSelect from '@/component/form/FormSelect.vue';

	const props = withDefaults(defineProps<{
		goodsId: number;
		options: BundleGoodsOptions[];
		/** @prop { T } - LayoutModal의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>(), {
		options: () => [],
	});

	defineExpose<ModalComponentExpose>({
		title: `재입고 알림 신청`,
	});

	const bundleOptions = computed<BundleGoodsOptions[]>(() => props.options);

	const childBundle1Options1 = computed(() => bundleOptions.value[0]);
	const childBundle1Options2 = computed(() => bundleOptions.value[1]);

	const { bom, loading } = useGlobalPageContext();
	const { applyRestockNotifyBundle } = useGoodsAdditional();

	/** 패키지 1번 =>  옵션1 선택 항목 */
	const bundleSelectedOption = ref<SelectedBundleOption | undefined>(undefined);
	/** 패키지 1번 =>  옵션2 선택 항목 */
	const bundleSelectedSubOption = ref<GoodsSubOption | undefined>(undefined);
	/** 패키지 2번 =>  옵션1 선택 항목 */
	const bundleChild2SelectedOption = ref<SelectedBundleOption | undefined>(undefined);
	/** 패키지 2번 =>  옵션2 선택 항목 */
	const bundleChild2SelectedSubOption = ref<GoodsSubOption | undefined>(undefined);

	watch(bundleSelectedOption, () => {
		bundleSelectedSubOption.value = undefined;
	});

	watch(bundleChild2SelectedOption, () => {
		bundleChild2SelectedSubOption.value = undefined;
	});


	const selectedOptionCodes = computed<number[] | null>(() => {
		if (bundleChild2SelectedSubOption.value && bundleSelectedSubOption.value) {
			return [bundleSelectedSubOption.value.code, bundleChild2SelectedSubOption.value.code];
		}

		return null;
	});

	/**
	 * 재입고 알림 신청
	*/
	async function apply() {
		if (selectedOptionCodes.value === null) {
			return bom.alert('상품을 선택 해주세요.');
		}
		loading.show();
		try {
			await applyRestockNotifyBundle(props.goodsId, selectedOptionCodes.value);
			bom.alert('재입고 알림 신청이 완료 되었습니다.', () => {
				props.closer();
			});
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}
</script>

<style lang="scss">
	@use '../../asset/scss/helper/mixin';
	@use '../../asset/scss/helper/var';

	/** 재입고 알림 신청 */
	.m_product-restock {
		text-align: left;

		h6 {
			padding-bottom: 4px;
			@include mixin.font(#333 '1.4rem/2rem');
		}

		.mm_form-select {
			+ h6 {
				margin-top: 24px;
			}
		}

		.mm_btn_box {
			margin-top: 24px;

			.mm_btn {
				height: 46px;
				@include mixin.font(700 '1.4rem/4.6rem' [var.$font_family_kb]);
			}
		}

		// 패키지
		section {
			padding-top: 1px;

			h6 {
				padding-bottom: 14px;
				@include mixin.font(#222 600 '2rem/2.8rem');
			}

			dl {
				dt {
					padding-bottom: 4px;
					@include mixin.font(#333 '1.4rem/2rem');
				}

				+ dl {
					margin-top: 16px;
				}
			}

			+ section {
				margin-top: 18px;
				padding-top: 18px;
				border-top: 1px solid #eee;
			}
		}
	}
</style>