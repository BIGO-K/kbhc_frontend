<template>
	<label class="mm_form-radio">
		<input
			v-bind="{ ...attrs }"
			type="radio"
			:checked="isChecked"
			@change="onChange"
		>
		<!-- 라디오 하위에 들어가는 항목 정의 -->
		<slot></slot>
	</label>
</template>

<script setup lang="ts">
	import { computed, toRefs, useAttrs } from 'vue';
	type SelectableValue = Nullable<string | number | boolean | object>;

	defineOptions({
		inheritAttrs: false,
	});

	const prop = withDefaults(defineProps<{
		modelValue?: SelectableValue;
		value?: SelectableValue;
	}>(), {
		modelValue: false,
		value: false,
	});

	const emit = defineEmits<{
		'update:modelValue': [value: SelectableValue];
	}>();

	const { modelValue } = toRefs(prop);
	const attrs = useAttrs();

	const isChecked = computed(() => modelValue.value === prop.value);

	function onChange() {
		emit('update:modelValue', prop.value);
	}
</script>