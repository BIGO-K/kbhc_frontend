<template>
	<div class="m_product-option-select">
		<!-- (D) 패키지 상품일 경우 -->
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
							:disabled="!option.is_selectable"
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
						:disabled="childBundle1Options1 == undefined"
					>
						<option :value="undefined">
							옵션명2
						</option>
						<option
							v-for="subOption in bundleSelectedOption?.sub"
							:key="`option2_${subOption.name}`"
							:value="subOption"
							:disabled="subOption.qty === 0"
						>
							{{ subOption.name }}
							<template v-if="subOption.qty === 0">
								<small class="text_soldout">품절</small>
							</template>
							<template v-else-if="subOption.qty < 6">
								<small class="text_lowstock">{{ `${subOption.qty}개` }}</small>
							</template>
						</option>
					</form-select>
				</dd>
			</dl>
		</section>
		<section>
			<h6><b>{{ childBundle1Options2.goods_name }}</b></h6>
			<dl>
				<dt>옵션1</dt>
				<dd>
					<form-select
						v-model="bundleChild2SelectedOption"
						title="옵션1"
						need-overlay-hide-first-option
						:use-overlay="true"
					>
						<option :value="undefined">
							옵션명1
						</option>
						<option
							v-for="option in childBundle1Options2.options"
							:key="`option1_${option.name}`"
							:value="option"
							:disabled="!option.is_selectable"
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
						v-model="bundleChild2SelectedSubOption"
						title="옵션2"
						need-overlay-hide-first-option
						:use-overlay="true"
						:disabled="childBundle1Options1 == undefined"
					>
						<option :value="undefined">
							옵션명2
						</option>
						<option
							v-for="subOption in bundleChild2SelectedOption?.sub"
							:key="`option2_${subOption.name}`"
							:value="subOption"
							:disabled="subOption.qty === 0"
						>
							{{ subOption.name }}
							<template v-if="subOption.qty === 0">
								<small class="text_soldout">품절</small>
							</template>
							<template v-else-if="subOption.qty < 6">
								<small class="text_lowstock">{{ `${subOption.qty}개` }}</small>
							</template>
						</option>
					</form-select>
				</dd>
			</dl>
		</section>

		<restock-apply
			v-if="hasSoldoutOptions"
			:options="[]"
			:bundle-options="options"
			is-bundle
		></restock-apply>
	</div>
</template>

<script setup lang='ts'>
	import { computed, ref, watch } from 'vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import RestockApply from '@/feature/restock/component/RestockApplyButton.vue';

	const props = withDefaults(defineProps<{
		bundleGoodsId: number;
		options: BundleGoodsOptions[];
		/** 선택 후 옵션 초기화 처리 필요 여부 */
		addOptionWithClear?: boolean;
	}>(), {
		addOptionWithClear: false,
	});

	const emit = defineEmits<{
		'addOption': [addBundleOptions: SelectedBundle];
	}>();

	const bundleOptions = computed<BundleGoodsOptions[]>(() => props.options);
	const childBundle1Options1 = computed(() => bundleOptions.value[0]);
	const childBundle1Options2 = computed(() => bundleOptions.value[1]);

	/** 부분 품절 옵션 */
	const hasSoldoutOptions = computed(() => {
		return Math.min(...childBundle1Options1.value.options.flatMap(option => option.sub.flatMap(sub => sub.qty))) === 0
			&& Math.min(...childBundle1Options2.value.options.flatMap(option => option.sub.flatMap(sub => sub.qty))) === 0;
	});
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

	/** 상품1 옵션2번 선택되었을때 (상품1, 상품2) 옵션다 체크해서 다 있으면 . 옵션 추가 */
	watch(bundleSelectedSubOption, () => {
		if (!isAllSelectedOption.value) {
			return;
		}
		if (selectedBundleItem.value.goods1 && selectedBundleItem.value.goods2) {
			emit('addOption', selectedBundleItem.value);
			/** 선택옵션 초기화 처리 필요한 경우  */
			if (props.addOptionWithClear) {
				clearAllSelectedOption();
			}
		}
	});

	/** 상품2 옵션2번 선택되었을때 (상품1, 상품2) 옵션다 체크해서 다 있으면 . 옵션 추가 */
	watch(bundleChild2SelectedSubOption, () => {

		if (!isAllSelectedOption.value) {
			return;
		}

		if (selectedBundleItem.value.goods1 && selectedBundleItem.value.goods2) {
			emit('addOption', selectedBundleItem.value);
			/** 선택옵션 초기화 처리 필요한 경우  */
			if (props.addOptionWithClear) {
				clearAllSelectedOption();
			}
		}
	});

	const isAllSelectedOption = computed<boolean>(() => {
		if (
			bundleChild2SelectedOption.value === undefined
			|| bundleChild2SelectedSubOption.value === undefined
			|| bundleSelectedOption.value === undefined
			|| bundleSelectedSubOption.value === undefined
		) {
			return false;
		}

		return true;
	});

	const selectedBundleItem = computed(() => {
		if (
			bundleChild2SelectedOption.value === undefined
			|| bundleChild2SelectedSubOption.value === undefined
			|| bundleSelectedOption.value === undefined
			|| bundleSelectedSubOption.value === undefined
		) {
			return {
				goods1: undefined,
				goods2: undefined,
				goodsLowStock: 0,
			};
		}

		return {
			goods1: {
				goods_id: bundleSelectedOption.value.goods_id,
				goods_name: bundleSelectedOption.value.goods_name,
				option_name: bundleSelectedOption.value.name,
				code: bundleSelectedSubOption.value.code,
				sub_option_name: bundleSelectedSubOption.value.name,
				option_price: bundleSelectedSubOption.value.extra_amount,
				goods_price: bundleSelectedOption.value.goods_base_discounted_price,
				stock: bundleSelectedSubOption.value.qty,
			} as SelectedBundleItem,
			goods2: {
				goods_id: bundleChild2SelectedOption.value.goods_id,
				goods_name: bundleChild2SelectedOption.value.goods_name,
				option_name: bundleChild2SelectedOption.value.name,
				code: bundleChild2SelectedSubOption.value.code,
				sub_option_name: bundleChild2SelectedSubOption.value.name,
				option_price: bundleChild2SelectedSubOption.value.extra_amount,
				goods_price: bundleChild2SelectedOption.value.goods_base_discounted_price,
				stock: bundleChild2SelectedSubOption.value.qty,
			} as SelectedBundleItem,
			buy_amount: 1,
			goods_low_stock: Math.min(bundleSelectedSubOption.value.qty, bundleChild2SelectedSubOption.value.qty),
			key: `${props.bundleGoodsId}_${bundleSelectedSubOption.value.code}_${bundleChild2SelectedSubOption.value.code}`,
		} as SelectedBundle;
	});

	const clearAllSelectedOption = () => {
		bundleSelectedOption.value = undefined;
		bundleSelectedSubOption.value = undefined;
		bundleChild2SelectedOption.value = undefined;
		bundleChild2SelectedSubOption.value = undefined;
	};
</script>