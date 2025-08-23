<template>
	<div
		class="m_cart-option"
		:class="{ 'S=option-soldout' : selectedSubOption?.qty === 0 }"
	>
		<!-- item.option_stock < 1 || item.ea > item.option_stock  -->
		<!--
			모든 옵션은 옵션의 순서와 무관하게 우선 선택이 가능합니다(예: 옵션2부터 선택가능)
			옵션1, 2모두 1개의 옵션만 있을 경우 옵션 선택없이 수량만 선택 가능합니다. 이 때, .m_product-option-select 요소는 삭제하지 않고 하위에 있는 section만 비노출합니다.
		-->
		<!-- v-if="item.option_stock > 1" -->
		<div
			v-if="!isSingleOption"
			class="m_product-option-select"
		>
			<dl>
				<dt>옵션1</dt>
				<dd>
					<form-select
						v-model="selectedOption"
						title="옵션1"
						:use-overlay="true"
						need-overlay-hide-first-option
					>
						<option :value="undefined">
							옵션명1
						</option>
						<option
							v-for="option in options"
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
						v-model="selectedSubOption"
						title="옵션2"
						:use-overlay="true"
						:disabled="selectedOption == undefined"
						need-overlay-hide-first-option
					>
						<option :value="undefined">
							옵션명2
						</option>
						<option
							v-for="subOption in selectedOption?.sub"
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
		</div>
		<div class="m_cart-option-quantity">
			<!-- 단일 옵션인 경우 수량 문구 노출 필요 -->
			<h6
				v-if="isSingleOption"
				class="mm_text-label T=sm"
			>
				<b>수량</b>
			</h6>
			<form-stepper
				v-model="buyAmount"
				:max="(selectedSubOption?.qty || 0)"
				:disabled="selectedOption == undefined || selectedSubOption == undefined"
				:for-gifticon="goodsType === GOODS_TYPE.gifticon"
			>
			</form-stepper>
			<span
				v-if="selectedSubOption && selectedSubOption.qty <= 5"
				class="text_stock"
			>
				구매가능 수량<strong>{{ selectedSubOption?.qty }}개</strong>
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
	import { GOODS_TYPE } from '$/constants';
	import FormSelect from '@/component/form/FormSelect.vue';
	import FormStepper from '@/component/form/FormStepper.vue';

	const props = defineProps<{
		options: GoodsOption[];
		goodsType: GOODS_TYPE;
		modifyContext: CartItemModifyContext;
	}>();

	const emit = defineEmits<{
		'changeOption': [code: number, buyAmount: number, modifyContext: CartItemModifyContext];
		'closeContext': [];
	}>();

	const { bom } = useGlobalPageContext();
	const options = computed(() => props.options);
	const modifyContext = computed(() => props.modifyContext);
	const isSingleOption = computed(() => options.value.length === 1 && options.value[0].sub.length === 1);

	/** 옵션1 선택 항목 */
	const selectedOption = ref<GoodsOption | undefined>(modifyContext.value.legacyOption);
	const selectedSubOption = ref<GoodsSubOption | undefined>(modifyContext.value.legacySubOption);
	const buyAmount = ref<number>(modifyContext.value.buyAmount);
	/** 옵션1 변경 함수 핸들러 */
	watch(selectedOption, () => {
		selectedSubOption.value = undefined;
		buyAmount.value = 1;
	});
	/** 실제 변경시 실행되는 함수 */
	const optionChange = () => {
		if (!selectedOption.value || !selectedSubOption.value) {
			return bom.alert('변경할 옵션을 선택 해주세요.');
		}

		emit('changeOption', selectedSubOption.value.code, buyAmount.value, {
			cartItem: modifyContext.value.cartItem,
			legacyOption: selectedOption.value,
			legacySubOption: selectedSubOption.value,
			buyAmount: buyAmount.value,
			options: options.value,
			isSingleOption: options.value.length === 1 && options.value[0].sub.length === 1,
		});
	};

	const closeContext = () => {
		emit('closeContext');
	};
</script>