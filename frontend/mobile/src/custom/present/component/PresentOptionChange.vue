<template>
	<div class="mm_product-unit-indent">
		<toggle
			v-model:is-active="toggleOn"
			class="mm_btn T=xs T=line btn_option-change"
			parent-selector=".mm_product-unit"
		>
			<b>옵션 변경</b><i class="ico_toggle"></i>
		</toggle>
	</div>
	<div
		v-if="toggleOn && options.length"
		class="m_present-option"
	>
		<div class="m_product-option-select">
			<dl>
				<dt>옵션1</dt>
				<dd>
					<form-select
						v-model="selectedOption"
						title="옵션1"
						need-overlay-hide-first-option
						use-overlay
					>
						<option :value="null">
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
						need-overlay-hide-first-option
						use-overlay
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
		<div class="mm_btn_box">
			<div class="mm_flex T=equal">
				<button
					type="button"
					class="mm_btn T=xs T=light"
					@click="toggleOn = false"
				>
					<b>취소</b>
				</button>
				<button
					type="button"
					class="mm_btn T=xs T=support"
					@click="changeOption"
				>
					<b>변경</b>
				</button>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
	import { ref, watch, computed } from 'vue';
	import { useGoodsAdditional } from '$/composables/useGoodsAdditional';
	import Toggle from '@/component/Toggle.vue';
	import FormSelect from '@/component/form/FormSelect.vue';

	const props = defineProps<{
		goodsId: number;
		optionId: number;
	}>();

	const emit = defineEmits<(e: 'change', optionId: number, optionName: string) => void>();

	const { getOptions } = useGoodsAdditional();

	const toggleOn = ref(false);
	const options = ref<GoodsOption[]>([]);
	const selectedOption = ref<GoodsOption | null>();
	const selectedSubOption = ref<GoodsSubOption | null>();
	const selectedOptionName = computed(() => `${selectedOption.value?.name} / ${selectedSubOption.value?.name}`);

	function changeOption() {
		if (!selectedSubOption.value) return;
		emit('change', selectedSubOption.value.code, selectedOptionName.value);
		toggleOn.value = false;
	}

	watch(toggleOn, async (to) => {
		if (!to) {
			selectedOption.value = null;
			selectedSubOption.value = null;

			return;
		}
		if (options.value.length) return;
		try {
			options.value = await getOptions(props.goodsId);
		}
		catch (e) {
			//
		}
	});

	watch(selectedOption, () => selectedSubOption.value = null);
</script>