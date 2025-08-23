<template>
	<a
		class="btn_multiangle-view"
		href="#"
		@click.prevent="overlayMultiangleDetail"
	>
		<i class="ico_multiangle"></i><b class="mm_ir-blind">360도 뷰</b>
	</a>
</template>

<script setup lang="ts">
	import { defineAsyncComponent } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';

	const { openOverlay } = useGlobalPageContext();

	function overlayMultiangleDetail() {
		const component = defineAsyncComponent(() => import('@/feature/multiangle/MultiangleDetail.vue'));

		return openOverlay(component);
	}
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/mixin';
	@use '../../../asset/scss/helper/const';

	/** 상품상세 */
	.m_prodetail-head-product {
		> .btn_multiangle-view {
			position: absolute;
			z-index: const.$z_index_floating;
			top: -16px;
			right: 26px;
			margin-top: calc(97.33333% + 28px);
			width: 54px;
			height: 54px;
			border-radius: 54px;
			background-color: #222;
			box-shadow: 0 3px 3px rgba(#000, 0.16);
			text-align: center;
			transform: translateY(-100%);

			.ico_multiangle {
				margin-top: 9px;

				&::before {
					width: 36px;
					height: 36px;
					@include mixin.svg(#fff url('../image/content/ico_product_multiangle.svg'));
				}
			}
		}
	}
</style>