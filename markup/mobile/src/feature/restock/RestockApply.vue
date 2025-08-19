<template>
	<div class="m_product-restock">
		<h6><b>옵션1</b></h6>
		<form-select v-model="sortOption1">
			<option>옵션명1</option>
		</form-select>
		<h6><b>옵션</b></h6>
		<form-select v-model="sortOption2">
			<option>옵션명2</option>
		</form-select>
		<div class="mm_btn_box">
			<button
				type="button"
				class="mm_btn T=primary"
			>
				<b>재입고 알림 신청하기</b>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import FormSelect from '@/component/form/FormSelect.vue';

	defineProps<{
		/** @prop { T } - LayoutModal의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	defineExpose<ModalComponentExpose>({
		title: `재입고 알림 신청`,
	});

	const sortOption1 = ref('');
	const sortOption2 = ref('');
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