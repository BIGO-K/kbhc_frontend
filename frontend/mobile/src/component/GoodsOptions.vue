<template>
	<div class="m_product-option-select">
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
						:label="subOption.name"
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
		<restock-apply-button
			v-if="isPartialSoldout"
			:options="options"
		></restock-apply-button>
	</div>
</template>

<script setup lang='ts'>
	import { ref, computed, watch } from 'vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import RestockApplyButton from '@/feature/restock/component/RestockApplyButton.vue';

	const props = withDefaults(defineProps<{
		options: GoodsOption[];
		/** 선택 후 옵션 초기화 처리 필요 여부 */
		addOptionWithClear?: boolean;
	}>(), {
		addOptionWithClear: false,
	});

	const emit = defineEmits<{
		'addOption': [option: GoodsOption, subOption: GoodsSubOption];
	}>();

	const options = computed(() => props.options);

	/** 부분 품절 옵션 */
	const isPartialSoldoutOptions = computed(() => {
		return options.value.map(option => {
			return {
				name: option.name,
				is_selectable: true,
				sub: option.sub.filter(sub => sub.qty < 1),
			};
		}).filter(option => option.sub.length >= 1);
	});

	/** 부분 품절 여부 */
	const isPartialSoldout = computed(() => isPartialSoldoutOptions.value.length > 0);
	/** 옵션1 선택 항목 */
	const selectedOption = ref<GoodsOption | undefined>(undefined);
	const selectedSubOption = ref<GoodsSubOption | undefined>(undefined);

	/** 옵션1 변경되엇을때 처리 */
	watch(selectedOption, (to, from) => {
		if (to !== from) {
			selectedSubOption.value = undefined;
		}
	});

	/** 옵션2 변경되었을때 처리 */
	watch(selectedSubOption, (to) => {
		if (!selectedOption.value || !to) {
			return;
		}

		emit('addOption', selectedOption.value, to);
		/** 선택옵션 초기화 처리 필요한 경우  */
		if (props.addOptionWithClear) {
			selectedOption.value = undefined;
			selectedSubOption.value = undefined;
		}
	});
</script>