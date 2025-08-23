<template>
	<label
		class="mm_form-radio"
		:class="{ 'T=disabled': prop.selectedDisabled }"
	>
		<input
			v-if="!prop.disabled"
			v-bind="{ ...attrs }"
			type="radio"
			:checked="isChecked"
			@change="onChange"
		>
		<slot></slot>
	</label>
</template>

<script setup lang="ts">
	import { computed, useAttrs } from 'vue';

	type SelectableValue = Nullable<string | number | boolean | object>;

	defineOptions({
		inheritAttrs: false,
	});

	const prop = withDefaults(defineProps<{
		modelValue?: SelectableValue;
		value?: SelectableValue;
		disabled?: boolean;
		selectedDisabled?: boolean;
	}>(), {
		modelValue: false,
		value: false,
		disabled: false,
		selectedDisabled: false,
	});

	const emit = defineEmits<{
		'update:modelValue': [value: SelectableValue];
	}>();

	const attrs = useAttrs();
	const isChecked = computed(() => prop.modelValue === prop.value);

	const onChange = () => {
		emit('update:modelValue', prop.value);
	};

	if (attrs.checked) onChange();
</script>