<template>
	<div class="mm_inner m_select-overlay">
		<ul>
			<li
				v-for="item in prop.items"
				:key="item.label"
			>
				<form-radio
					v-model="selectedVal"
					:name="selectName"
					:value="item.value"
					:checked="item.value === prop.defaultValue"
					:disabled="item.disabled"
				>
					<b class="mm_block">
						<i class="ico_form-radio"></i>
						<span
							class="text_label"
							v-html="item.html"
						></span>
					</b>
				</form-radio>
			</li>
		</ul>
		<div class="mm_foot">
			<div class="mm_btn_box">
				<button
					type="button"
					class="mm_btn T=primary T=lg"
					@click="prop.closer(selectedVal)"
				>
					<b>확인</b>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang='ts' generic="T">
	import { ref } from 'vue';
	import FormRadio from '@/component/form/FormRadio.vue';

	type SelectableValue = string | number | boolean | object | undefined;

	type OptionItems = {
		label: string;
		html: string;
		disabled: boolean;
		value: SelectableValue;
	};

	const prop = defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
		/** @prop { string } - 타이틀 */
		title: string;
		/** @prop { string } - 선택된 라벨 */
		// defaultLabel: string;
		defaultValue: string | number | object | boolean | undefined;
		/** @prop { OptionItems[] } - 옵션 아이템 */
		items: OptionItems[];
	}>();

	defineExpose<OverlayComponentExpose>({
		title: prop.title,
	});

	const selectedVal = ref<SelectableValue | null>(null);
	const selectName = `select_options_${Math.floor(Math.random() * 100000)}`;
</script>