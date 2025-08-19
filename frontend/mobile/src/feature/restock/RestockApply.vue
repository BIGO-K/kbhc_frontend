<template>
	<div class="m_product-restock">
		<h6><b>옵션1</b></h6>
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
				v-for="option in soldOutOptions"
				:key="`option1_${option.name}`"
				:value="option"
			>
				{{ option.name }}
			</option>
		</form-select>
		<h6><b>옵션</b></h6>
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
				:key="`option1_${subOption.name}`"
				:value="subOption"
			>
				{{ subOption.name }}
			</option>
		</form-select>
		<div class="mm_btn_box">
			<button
				type="button"
				class="mm_btn T=primary"
				@click="apply"
			>
				<b>재입고 알림 신청하기</b>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref, watch } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useGoodsAdditional } from '$/composables/useGoodsAdditional';
	import FormSelect from '@/component/form/FormSelect.vue';

	const props = withDefaults(defineProps<{
		goodsId: number;
		options: GoodsOption[];
		/** @prop { T } - LayoutModal의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>(), {
		options: () => [],
	});

	defineExpose<ModalComponentExpose>({
		title: `재입고 알림 신청`,
	});

	const { bom, loading } = useGlobalPageContext();
	const { applyRestockNotify } = useGoodsAdditional();
	const options = computed(() => props.options);
	const soldOutOptions = computed(() => {
		return options.value.map(option => ({
			name: option.name,
			sub: option.sub.filter(sub => sub.qty < 1),
			is_selectable: option.is_selectable,
			extra_amount: option.extra_amount,
		})).filter(option => option.sub.length > 0);
	});

	const selectedOption = ref<GoodsOption | undefined>(undefined);
	const selectedSubOption = ref<GoodsSubOption | undefined>(undefined);

	watch(selectedOption, (to) => {
		selectedSubOption.value = undefined;
	});

	const selectedOptionCode = computed<number | null>(() => {
		if (selectedSubOption.value) {
			return selectedSubOption.value.code;
		}

		return null;
	});

	/**
	 * 재입고 알림 신청
	*/
	async function apply() {
		if (selectedOptionCode.value === null) {
			return bom.alert('상품을 선택 해주세요.');
		}
		loading.show();
		try {
			await applyRestockNotify(props.goodsId, selectedOptionCode.value);
			bom.alert('재입고 알림 신청이 완료 되었습니다.', () => {
				props.closer();
			});
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}
</script>

<style lang="scss">
	@use '../../asset/scss/helper/mixin';
	@use '../../asset/scss/helper/var';

	/** 재입고 알림 신청 */
	.m_product-restock {
		text-align: left;

		h6 {
			padding-bottom: 4px;
			@include mixin.font(#333 '1.4rem/2rem');
		}

		.mm_form-select {
			+ h6 {
				margin-top: 24px;
			}
		}

		.mm_btn_box {
			margin-top: 24px;

			.mm_btn {
				height: 46px;
				@include mixin.font(700 '1.4rem/4.6rem' [var.$font_family_kb]);
			}
		}
	}
</style>