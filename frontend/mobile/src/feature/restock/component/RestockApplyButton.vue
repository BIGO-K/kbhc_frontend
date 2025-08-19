<template>
	<!-- 재입고 알림 -->
	<button
		v-if="true"
		type="button"
		class="mm_btn T=xs btn_restock"
		@click="_e => modalRestockApply(_e)"
	>
		<i class="ico_alarm"></i><b>재입고 알림받기</b>
	</button>
</template>

<script setup lang="ts">
	import { defineAsyncComponent } from 'vue';
	import { useRoute } from 'vue-router';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';

	const props = withDefaults(defineProps<{
		options: GoodsOption[];
		bundleOptions?: BundleGoodsOptions[];
		isBundle?: boolean;
	}>(), {
		options: () => [],
		bundleOptions: () => [],
		isBundle: false,
	});
	const { openModal } = useGlobalPageContext();
	const route = useRoute();
	const modalRestockApply = (_e: MouseEvent) => {
		openModal(defineAsyncComponent(() => import(props.isBundle
			? '@/feature/restock/RestockBundleApply.vue'
			: '@/feature/restock/RestockApply.vue'
		)), {
			clickElement: _e.currentTarget,
			props: {
				goodsId: Number(`${route.params.id}`),
				options: props.isBundle ? props.bundleOptions : props.options,
			},
		});
	};
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