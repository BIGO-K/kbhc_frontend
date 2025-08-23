<template>
	<div data-mui="p_c=w6Xh12_s4">
		<div class="mui_title">
			<h3 class="title_main">
				<b>소중한 분들께 마음을 선물하세요! 🎁</b>
			</h3>
		</div>
		<carousel
			:items="productItems"
			:use-pagination="true"
			:auto-delay="4"
			:group-size="4"
			:is-auto-height="true"
			:is-block-content="true"
		>
			<template #default="{ item }">
				<product-item
					:goods="item"
					:is-block-content="true"
				></product-item>
			</template>
		</carousel>
	</div>
</template>

<script setup lang="ts">
	import { useFakeCreator } from '$/composables/useFakeCreator';
	import Carousel from '@/component/Carousel.vue';
	import ProductItem from '@/component/ProductItem.vue';

	const productItems = useFakeCreator().goods(8);// XXX 상품 임시 생성
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/function';
	@use '../../../asset/scss/helper/mixin';
	@use '../../../asset/scss/helper/const';
	@use '../../../asset/scss/helper/var';

	[data-mui='p_c=w6Xh12_s4'] {
		.mui_carousel {
			&-item {
				padding: 0 24px;

				&-group {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					grid-gap: 32px 12px;
				}
			}

			&-pagination {
				bottom: -30px;
				transform: translate(-50%, 100%);

				li:nth-child(n+2) {
					margin-left: 7px;
				}

				button {
					width: 6px;
					height: 6px;
					border-radius: 3px;
					background-color: #ccc;
					transition: width const.$time_fast;

					&#{function.escape('.S=on')} {
						width: 20px;
						background-color: #222;
					}
				}
			}
		}
	}
</style>