<template>
	<a
		class="btn_gift"
		href="#"
		@click.prevent="overlayGiftInfo"
	>
		<span>GIFT</span><b>구매 고객을 위한 <strong>사은품을 확인해보세요</strong></b><i class="ico_link"></i>
	</a>
</template>

<script setup lang="ts">
	import { defineAsyncComponent } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';

	const { openOverlay } = useGlobalPageContext();

	function overlayGiftInfo() {
		const component = defineAsyncComponent(() => import('@/feature/gift/GiftInfo.vue'));

		return openOverlay(component);
	}
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/mixin';

	/** 상품상세 */
	.m_prodetail-head-info {
		.btn_gift {
			display: block;
			overflow: hidden;
			position: relative;
			margin: 8px 0 24px;
			padding-left: 70px;
			height: 43px;
			border: 1px solid #26282c;
			border-radius: 8px;

			span {
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				padding-left: 13px;
				width: 62px;
				background-color: #26282c;
				@include mixin.font(#eee '1.3rem/4.2rem');

				&::after {
					position: absolute;
					right: 0;
					@include mixin.triangle(#fff, left, 41px, 19px);
					border-bottom: 0;
					content: '';
				}
			}

			b {
				@include mixin.font(#222 '1.3rem/4.2rem');

				strong {
					@include mixin.font(var(--color_text_base) 600);
				}
			}

			.ico_link {
				position: absolute;
				top: 50%;
				right: 7px;
				transform: translateY(-50%);

				&::before {
					width: 14px;
					height: 14px;
				}
			}
		}
	}
</style>