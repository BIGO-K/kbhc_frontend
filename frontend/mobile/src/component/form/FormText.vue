<template>
	<div :class="containerClasses">
		<template v-if="type === 'password'">
			<button
				type="button"
				class="btn_text-pw"
				:style="buttonStyle"
				@click="togglePasswordVisible()"
			>
				<i :class="isPasswordVisible ? 'ico_pw-show' : 'ico_pw-hide'"></i>
				<b class="mm_ir-blind">비밀번호 보기</b>
			</button>
		</template>

		<button
			v-if="modelValue != prop.default"
			type="button"
			class="btn_text-clear"
			:style="buttonStyle"
			@click="clear"
		>
			<i class="ico_form-clear"></i><b class="mm_ir-blind">지우기</b>
		</button>

		<label>
			<input
				v-bind="$attrs"
				ref="element"
				:type="typeForDisplay"
				:inputmode="inputMode === 'number' ? 'numeric' : 'text'"
				:autocomplete="typeForDisplay === 'password' ? 'new-password' : 'off'"
				class="textfield"
				:readonly="readonly"
				:maxlength="maxLength > 0 ? maxLength : ''"
				:value="modelValue"
				@input="onInput"
			>
			<i class="bg_text"></i>
			<span
				v-if="!readonly"
				class="text_placeholder"
				:class="{ 'mm_ir-blind': labelOnBlind }"
			>
				{{ placeholder }}
			</span>
		</label>
		<slot name="button"></slot>
		<p
			v-if="showValidState"
			ref="validStateContainer"
			:class="validAlertClasses"
		>
			{{ valid?.message }}
		</p>
	</div>
</template>

<script setup lang="ts">
	import { useAttrs, ref, computed } from 'vue';
	import { useToggle, useElementBounding } from '@vueuse/core';

	defineOptions({
		inheritAttrs: false,
	});

	const prop = withDefaults(defineProps<{
		modelValue?: Nullable<string | number>;
		default?: string | number;
		max?: number;
		type?: FormInputType;
		inputMode?: FormInputType;
		placeholder?: string;
		regexp?: RegExp;
		valid?: FormValid;
		labelOnBlind?: boolean;
	}>(), {
		modelValue: '',
		default: undefined,
		max: undefined,
		inputMode: 'text',
		type: 'text',
		placeholder: '',
		regexp: undefined,
		valid: undefined,
		labelOnBlind: false,
	});

	const emit = defineEmits<{
		'update:modelValue': [value: string | number];
	}>();

	const attrs = useAttrs();
	const element = ref<HTMLInputElement>();
	const containerClasses = computed(() => {
		const classes: string[] = ['mm_form-text'];

		if (prop.modelValue !== '' && prop.modelValue != null && !readonly.value) {
			classes.push('S=text-on');
		}

		if (typeof attrs.class === 'string') {
			if (attrs.class.includes('T=short')) {
				classes.push('T=short');
			}
			if (attrs.class.includes('T=lg')) {
				classes.push('T=lg');
			}
		}

		classes.push(validStateClasses.value.join(' '));

		return classes;
	});

	const readonly = computed(() => {
		return attrs.readonly !== undefined
			&& attrs.readonly !== 'false'
			&& attrs.readonly !== false;
	});

	const maxLength = computed(() => Number(attrs.maxlength ?? 0));

	/** 노출용 인풋 유형 */
	const typeForDisplay = computed(() => {
		if (prop.type !== 'password') {
			return prop.type;
		}

		return isPasswordVisible.value ? 'text' : prop.type;
	});
	const isPasswordVisible = ref(false);
	const togglePasswordVisible = useToggle(isPasswordVisible);

	/** 유효성 관련 */
	const validStateContainer = ref<HTMLElement>();
	const showValidState = computed(() => prop.valid?.show === true);
	const validStateClasses = computed(() => {
		if (!showValidState.value || !prop.valid) {
			return [];
		}

		return prop.valid.type === 'alert'
			? ['S=text-alert']
			: [`S=text-valid-${prop.valid.state}`];
	});
	const validAlertClasses = computed(() => {
		if (!showValidState.value || !prop.valid) {
			return [];
		}

		return prop.valid.type === 'alert'
			? ['text_alert']
			: [`text_valid`, `S=valid-${prop.valid.state}`];
	});

	/** 유호성 메세지 가변높이 처리 */
	const { height: validStateContainerHeight } = useElementBounding(validStateContainer);
	const buttonStyle = computed(() => {
		if (showValidState.value !== true) {
			return {};
		}

		return {
			marginTop: `-${validStateContainerHeight.value / 2}px`,
		};
	});

	const defaultValue = computed(() => {
		if (prop.default !== undefined) {
			return prop.default;
		}

		return '';
	});

	/** 인풋 이벤트 처리 */
	function onInput(e: Event) {
		let newValue: string | number = (e.target as HTMLInputElement).value;
		if (prop.regexp) {
			newValue = (newValue.match(new RegExp(prop.regexp, 'g')) || []).join('');
		}
		if (newValue === '') {
			newValue = defaultValue.value;
		}
		/** 숫자 입력형인 경우 0으로 시작된 경우를 위해 처리 */
		if (prop.inputMode === 'number' && prop.type !== 'tel') {
			newValue = Number(newValue);
		}

		if (
			typeof prop.max === 'number'
			&& Number(newValue) > prop.max
		) {
			newValue = prop.max;
		}

		emit('update:modelValue', newValue);

		if (element.value) {
			element.value.value = `${newValue}`;
		}
	}

	function clear() {
		emit('update:modelValue', defaultValue.value);
	}
</script>