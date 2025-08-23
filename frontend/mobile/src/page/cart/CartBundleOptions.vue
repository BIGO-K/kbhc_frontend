<template>
	<div
		class="m_cart-option"
		:class="{ 'S=option-soldout' : lowOptionStock < 1 || buyAmount > lowOptionStock }"
	>
		<div class="m_product-option-select">
			<section>
				<h6><b>{{ bundleOptions1.goods_name }}</b></h6>
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
								v-for="option in bundleOptions1.options"
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
							:disabled="bundleSelectedOption == undefined"
							need-overlay-hide-first-option
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
				<h6><b>{{ bundleOptions2.goods_name }}</b></h6>
				<dl>
					<dt>옵션1</dt>
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
								v-for="option in bundleOptions2.options"
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
							:use-overlay="true"
							need-overlay-hide-first-option
							:disabled="bundleChild2SelectedOption == undefined"
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
		</div>
		<div class="m_cart-option-quantity">
			<!-- 단일 옵션인 경우 수량 문구 노출 필요 -->
			<h6
				v-if="false"
				class="mm_text-label T=sm"
			>
				<b>수량</b>
			</h6>

			<form-stepper
				v-model="buyAmount"
				:max="hasSelectedBundleOptionEmpty ? 1 : lowOptionStock"
			>
			</form-stepper>
			<span
				v-if="lowOptionStock <= 5 && !hasSelectedBundleOptionEmpty"
				class="text_stock"
			>
				구매가능 수량<strong>{{ lowOptionStock }}개</strong>
			</span>
		</div>
		<div class="mm_btn_box">
			<div class="mm_flex T=equal">
				<button
					type="button"
					class="mm_btn T=xs T=light"
					@click="closeContext"
				>
					<b>취소</b>
				</button>
				<button
					type="button"
					class="mm_btn T=xs T=support"
					@click="optionChange"
				>
					<b>변경</b>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang='ts'>
	import { ref, computed, watch } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import FormSelect from '@/component/form/FormSelect.vue';
	import FormStepper from '@/component/form/FormStepper.vue';

	const props = defineProps<{
		modifyBundleContext: BundleCartItemModifyContext;
	}>();

	const emit = defineEmits<{
		'changeOption': [bundleId: number, items: { cart_id: number; option_id: number }[], ea: number];
		'closeContext': [];
	}>();

	const { bom } = useGlobalPageContext();

	const modifyBundleContext = computed(() => props.modifyBundleContext);
	const bundleOptions1 = computed(() => modifyBundleContext.value.child_goods_1.options);
	const bundleOptions2 = computed(() => modifyBundleContext.value.child_goods_2.options);

	/** 패키지 1번 =>  옵션1 선택 항목 */
	const bundleSelectedOption = ref<SelectedBundleOption | undefined>(modifyBundleContext.value.child_goods_1.legacyOption);
	/** 패키지 1번 =>  옵션2 선택 항목 */
	const bundleSelectedSubOption = ref<GoodsSubOption | undefined>(modifyBundleContext.value.child_goods_1.legacySubOption);
	/** 패키지 2번 =>  옵션1 선택 항목 */
	const bundleChild2SelectedOption = ref<SelectedBundleOption | undefined>(modifyBundleContext.value.child_goods_2.legacyOption);
	/** 패키지 2번 =>  옵션2 선택 항목 */
	const bundleChild2SelectedSubOption = ref<GoodsSubOption | undefined>(modifyBundleContext.value.child_goods_2.legacySubOption);

	const buyAmount = ref<number>(modifyBundleContext.value.buyAmount);


	watch(bundleSelectedOption, () => {
		bundleSelectedSubOption.value = undefined;
		buyAmount.value = 1;
	});

	watch(bundleChild2SelectedOption, () => {
		bundleChild2SelectedSubOption.value = undefined;
		buyAmount.value = 1;
	});

	const hasSelectedBundleOptionEmpty = computed<boolean>(() => {
		if (
			bundleChild2SelectedOption.value === undefined
			|| bundleChild2SelectedSubOption.value === undefined
			|| bundleSelectedOption.value === undefined
			|| bundleSelectedSubOption.value === undefined
		) {
			return true;
		}

		return false;
	});

	const lowOptionStock = computed(() => {
		if (!bundleSelectedSubOption.value || !bundleChild2SelectedSubOption.value) {
			return 1;
		}

		return Math.min(bundleSelectedSubOption.value.qty, bundleChild2SelectedSubOption.value.qty);
	});

	const forModifyOptionsWithCartIds = computed(() => {
		if (!bundleSelectedSubOption.value || !bundleChild2SelectedSubOption.value) {
			return [];
		}

		return [
			{
				cart_id: modifyBundleContext.value.child_goods_1.cartItem.cart_id,
				option_id: bundleSelectedSubOption.value.code,
			},
			{
				cart_id: modifyBundleContext.value.child_goods_2.cartItem.cart_id,
				option_id: bundleChild2SelectedSubOption.value.code,
			},
		];
	});
	/** 실제 변경시 실행되는 함수 */
	const optionChange = () => {
		if (hasSelectedBundleOptionEmpty.value || forModifyOptionsWithCartIds.value.length < 1) {
			return bom.alert('변경할 옵션을 선택 해주세요.');
		}

		emit('changeOption', modifyBundleContext.value.bundle_goods_id, forModifyOptionsWithCartIds.value, buyAmount.value);
	};

	const closeContext = () => {
		emit('closeContext');
	};
</script>