<template>
	<div :class="containerClasses">
		<button
			type="button"
			class="btn_text-clear"
			@click="clear"
		>
			<i class="ico_form-clear"></i><b class="mm_ir-blind">지우기</b>
		</button>
		<label>
			<textarea
				ref="element"
				v-bind="$attrs"
				:value="modelValue"
				class="textfield"
				autocomplete="off"
				@input="onInput"
				@keyup="textareaResize"
				@blur="textareaResize"
			></textarea>
			<i class="bg_text"></i>
			<span
				class="text_placeholder"
				v-html="placeholder"
			></span>
		</label>
		<template v-if="byte > 0">
			<b class="text_byte">
				<strong>{{ modelValue.length }}</strong>/{{ byte }}
			</b>
		</template>
	</div>
</template>

<script setup lang='ts'>
	import { computed, ref } from 'vue';
	type ResizeOption = {
		min: number;
		max: number;
	};

	defineOptions({
		inheritAttrs: false,
	});

	const prop = withDefaults(defineProps<{
		modelValue?: string;
		placeholder?: string;
		resize?: ResizeOption;
		byte?: number;
	}>(), {
		modelValue: '',
		placeholder: '',
		resize: () => ({ min: 0, max: 0 }),
		byte: 0,
	});

	const emit = defineEmits<{
		'update:modelValue': [value: string];
	}>();

	const element = ref<HTMLTextAreaElement>();
	const containerClasses = computed(() => {
		const classes: string[] = ['mm_form-textarea'];

		if (prop.modelValue) {
			classes.push('S=text-on');
		}

		if (prop.byte > 0) {
			classes.push('S=byte');
		}

		return classes;
	});
	// 입력값 라인 수
	const textLineNumber = computed(() => {
		let lineNumber = prop.modelValue.split('\n').length;
		lineNumber = prop.resize.min > lineNumber ? prop.resize.min : lineNumber;
		lineNumber = prop.resize.max < lineNumber ? prop.resize.max : lineNumber;

		return lineNumber;
	});

	/** 인풋 이벤트 처리 */
	function onInput(e: Event) {
		let newValue = (e.target as HTMLInputElement).value;

		emit('update:modelValue', newValue);

		if (!element.value) {
			return;
		}
		element.value.value = newValue;
	}

	/** 리사이징 */
	function textareaResize() {
		if (!element.value) {
			return;
		}
		if (prop.resize.min === 0 || prop.resize.max === 0) {
			return;
		}

		const computedStyle = getComputedStyle(element.value);
		const verticalPadding = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom); // top, bottom padding 값
		const lineHeight = parseFloat(computedStyle.lineHeight); // 줄간격

		element.value.style.height = `${verticalPadding + (lineHeight * textLineNumber.value)}px`;
	}

	function clear() {
		emit('update:modelValue', '');
	}
</script>