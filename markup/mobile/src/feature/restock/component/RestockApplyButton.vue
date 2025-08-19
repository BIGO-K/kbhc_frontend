<template>
	<!-- 재입고 알림 -->
	<a
		v-if="true"
		class="mm_btn T=xs btn_restock"
		@click.prevent="modalRestockApply"
	>
		<i class="ico_alarm"></i><b>재입고 알림받기</b>
	</a>
</template>

<script setup lang="ts">
	import { defineAsyncComponent } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';

	const { openModal } = useGlobalPageContext();

	function modalRestockApply() {
		const component = defineAsyncComponent(() => import('@/feature/restock/RestockApply.vue'));

		return openModal(component);
	}
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/mixin';

	/** 상품상세(옵션 선택 영역) */
	.m_product-option-select {
		.btn_restock {
			margin-top: 8px;
			padding: 0 12px;
			background-color: #f2f4f6;
			color: var(--color_sub);

			.ico_alarm {
				margin: 8px 4px 0 0;

				&::before {
					width: 16px;
					height: 16px;
					@include mixin.svg(var(--color_sub) url('/image/common/ico_bell.svg'));
				}
			}
		}
	}
</style>