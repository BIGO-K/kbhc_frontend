<template>
	<div
		class="mm_form-select"
		:class="{'S=select-on': $select != null && $select.selectedIndex > 0}"
	>
		<label>
			<select
				ref="$select"
				:value="modelValue"
				:disabled="disabled"
				autocomplete="off"
				@change="onChange"
			>
				<slot></slot>
			</select>
			<template v-if="disabled">
				<span class="text_disabled">{{ selectedLabel }}</span>
			</template>
			<template v-else>
				<b class="text_selected">{{ selectedLabel }}</b>
			</template>
			<i
				class="ico_form-select"
				:class="prop.iconClass"
			></i>
		</label>
	</div>
</template>

<script setup lang='ts' generic="T">
	import { watch, ref } from 'vue';

	type SelectableValue = string | number | boolean | T | undefined;

	const prop = withDefaults(defineProps<{
		/** @prop { SelectableValue } @requires - readonny와 같이 사용하면 modelValue 값이 text_readonly에 적용 */
		modelValue: SelectableValue;
		/** @prop { string } `default: undefined` - ico_form-select에 추가할 클래스 */
		iconClass?: string;
		/** @prop { boolean } `default: false` */
		disabled?: boolean;
	}>(), {
		iconClass: undefined,
		disabled: false,
	});

	const emit = defineEmits<{
		'update:modelValue': [value: SelectableValue];
	}>();

	const $select = ref<HTMLSelectElement>();
	const selectedLabel = ref('');

	const onChange = () => {
		if ($select.value == null) return;

		const selectedOptionElement = $select.value.selectedOptions[0];
		const value = (selectedOptionElement && '_value' in selectedOptionElement)
			? selectedOptionElement._value as SelectableValue
			: $select.value.value;

		return emit('update:modelValue', value);
	};

	watch([() => prop.modelValue, $select], () => {
		if ($select.value == null) return;

		// 선택된 값이 없으면 옵션 0번으로 적용
		if ($select.value.selectedIndex === -1) {
			$select.value.selectedIndex = 0;
			selectedLabel.value = $select.value.selectedOptions[0].label;

			return onChange();
		}
		selectedLabel.value = $select.value.selectedOptions[0].label;
	}, {
		immediate: true,
		flush: 'post',
	});
</script>