<template>
	<div
		class="mm_form-select"
		:class="{'S=select-on': $select != null && $select.selectedIndex > 0}"
	>
		<label>
			<select
				ref="$select"
				v-model="selectedValue"
				v-bind="useOverlay ? { hidden: true } : { title: prop.title }"
				:disabled="disabled"
				autocomplete="off"
			>
				<slot></slot>
			</select>

			<template v-if="disabled">
				<span class="text_disabled">{{ selectedLabel }}</span>
			</template>
			<template v-else-if="useOverlay">
				<button
					type="button"
					class="text_selected"
					@click="_e => overlaySelectList(_e)"
				>
					<b>{{ selectedLabel }}</b>
				</button>
			</template>
			<template v-else>
				<b class="text_selected">{{ selectedLabel }}</b>
			</template>

			<i
				class="ico_form-select"
				:class="iconClass || ''"
			></i>
		</label>
	</div>
</template>

<script setup lang='ts' generic="T">
	import { watch, ref, computed, nextTick, defineAsyncComponent } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';

	type SelectableValue = string | number | boolean | T | undefined;

	const prop = withDefaults(defineProps<{
		/** @prop { SelectableValue } @requires - readonny와 같이 사용하면 modelValue 값이 text_readonly에 적용 */
		modelValue: SelectableValue;
		/** @prop { string } @requires - 셀렉트 타이틀 */
		title: string;
		/** @prop { string } `default: undefined` - ico_form-select에 추가할 클래스 */
		iconClass?: string;
		/** @prop { boolean } `default: false` */
		disabled?: boolean;
		/** @prop { boolean } `default: false` */
		useOverlay?: boolean;
		/** @prop { string } `default: undefined` - 값이 있으면 라벨 변경 안됨 */
		fixedLabel?: string;
		/** @prop { boolean } `default: false` - 첫번째 옵션값 오버레이 미노출 여부 */
		needOverlayHideFirstOption?: boolean;
	}>(), {
		iconClass: undefined,
		disabled: false,
		useOverlay: false,
		fixedLabel: undefined,
		needOverlayHideFirstOption: false,
	});

	const emit = defineEmits<{
		'update:modelValue': [value: SelectableValue];
	}>();

	const { openOverlay } = useGlobalPageContext();

	/** 선택값 */
	const selectedValue = computed({
		get: () => prop.modelValue,
		set: _value => emit('update:modelValue', _value),
	});

	const $select = ref<HTMLSelectElement>();
	const selectedLabel = ref('');

	const changeValue = (_$selectedOption: HTMLOptionElement) => {
		selectedValue.value = '_value' in _$selectedOption ? _$selectedOption._value as SelectableValue : _$selectedOption?.value;
	};

	/** 값이 변경된 경우 라벨 변경처리 ( flush: post로는 처리 안됨 ) */
	watch([$select, selectedValue], () => {
		if (prop.fixedLabel != null) {
			selectedLabel.value = prop.fixedLabel;

			return;
		}

		nextTick().then(() => {
			if ($select.value == null) return;

			if ($select.value.selectedIndex === -1 || $select.value.selectedOptions.length === 0) {
				$select.value.selectedIndex = 0;
				changeValue($select.value.selectedOptions[0]);
			}
			/** label 하위에 태그가 들어가는 경우가 있어 첫번째 자식에 텍스트로 처리   */
			selectedLabel.value = $select.value.selectedOptions[0].childNodes[0].textContent ?? $select.value.selectedOptions[0].label ;
		});
	}, {
		immediate: true,
		flush: 'post',
	});

	const overlaySelectList = (_e: MouseEvent) => {
		if ($select.value == null) return;
		let options = Object.values($select.value.options);

		if (prop.needOverlayHideFirstOption) {
			options.shift();
		}

		openOverlay(defineAsyncComponent(() => import('@/component/form/FormSelectOverlay.vue')), {
			props: {
				title: `${prop.title} 선택`,
				defaultValue: selectedValue.value,
				items: options.map(_entry => ({
					value: '_value' in _entry ? _entry._value : _entry.value,
					label: _entry.label,
					html: _entry.innerHTML,
					disabled: _entry.disabled,
				})),
			},
			clickElement: _e.currentTarget,
			onClose: (_selectedVal: string | object) => {
				selectedValue.value = _selectedVal as SelectableValue;
				// const $selectedOption = options.find(_entry => ('_value' in _entry ? _entry._value : _entry.value) === _selectedVal);
				// if ($selectedOption != null) changeValue($selectedOption);
			},
		});
	};
</script>