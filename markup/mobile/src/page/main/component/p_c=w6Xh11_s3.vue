<template>
	<div data-mui="p_c=w6Xh11_s3">
		<div class="mui_title">
			<h3 class="title_main">
				<b>MD’s Pick 👍</b>
			</h3>
		</div>
		<carousel
			:items="productItems"
			:use-pagination="true"
			:auto-delay="4"
			:group-size="3"
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

	const productItems = useFakeCreator().goods(9);// XXX 상품 임시 생성
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/function';
	@use '../../../asset/scss/helper/mixin';
	@use '../../../asset/scss/helper/const';
	@use '../../../asset/scss/helper/var';

	[data-mui='p_c=w6Xh11_s3'] {
		.mui_carousel {
			&-item {
				padding: 0 24px;

				&-group {
					> .mui_product-item:nth-child(n+2) {
						margin-top: 12px;
					}
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

		.mui_product-item {
			&-image {
				width: 57.49235%;
			}

			figure {
				figcaption {
					position: absolute;
					top: 0;
					right: 0;
					left: 0;
					margin: 0 0 0 57.49235%;
					padding: 3px 15px 0 12px;

					> *:first-child {
						margin-top: 0;
						padding-top: 0;
					}

					.text_sale {
						right: 0;
						margin-top: 8px;
					}

					.text_price {
						margin-top: 7px;
					}

					.mui_product-item-react {
						margin-top: 10px;

						> * {
							margin-right: 6px;
						}
					}

					.mui_tag-list {
						margin-top: 7px;
					}
				}
			}

			// MY찜에추가하기
			.btn_like {
				top: auto;
				right: auto;
				bottom: -2px;
				left: 58.10397%;
				margin-top: 0;
				transform: translate(-100%, 0);
			}
		}
	}
</style>