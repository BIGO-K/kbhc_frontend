<template>
	<block
		v-slot="{ context }"
		:block="block"
	>
		<ul>
			<li
				v-for="banner in banners"
				:key="banner.id"
			>
				<block-banner :banner="banner"></block-banner>
				<block-slider
					:init-position="context.banner.get(banner, 'sliderPosition', 0)"
					@change:position="(_position) => context.banner.set(banner, { sliderPosition: _position })"
				>
					<div class="mui_product-list">
						<ul>
							<li
								v-for="goods in banner.goods_group?.goods_list"
								:key="goods.id"
							>
								<product-item
									:goods="goods"
									:usable="{
										keys: ['review_count', 'price'],
										isReverse: true,
									}"
									is-block-content
								></product-item>
							</li>
						</ul>
					</div>
				</block-slider>
			</li>
		</ul>
	</block>
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import ProductItem from '@/component/ProductItem.vue';
	import Block from '@/component/block/BaseBlock.vue';
	import BlockBanner from '@/component/block/BlockBanner.vue';
	import BlockSlider from '@/component/block/BlockSlider.vue';

	const props = defineProps<{ block: Block }>();
	const banners = computed(() => props.block.banner_partition?.banners || []);
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/function';
	@use '../../../asset/scss/helper/mixin';
	@use '../../../asset/scss/helper/const';
	@use '../../../asset/scss/helper/var';

	[data-mui='bp_ns=w6Xh16_s6'] {
		> ul {
			> li {
				&:nth-child(n+2) {
					margin-top: 44px;
				}

				> a {
					display: block;
					position: relative;

					figure {
						.image_banner {
							position: relative;
							padding-top: 45.21276%;
							width: 100%;

							&::before {
								position: absolute;
								top: 0;
								right: 0;
								bottom: 0;
								left: 0;
								background-color: rgba(#000, 0.27);
								content: '';
							}
						}

						figcaption {
							position: absolute;
							z-index: 1;
							top: 50%;
							right: 0;
							left: 0;
							margin-top: 2px;
							padding: 0 20px;
							@include mixin.font(#fff 400 '2.2rem/2.6rem' center);
							transform: translateY(-50%);

							.text_banner1 {
								font-weight: 600;

								+ .text_banner2 {
									margin-top: 10px;
								}
							}

							.text_banner2 {
								@include mixin.font('1.6rem/2rem');
							}

							.text_alt {
								@include mixin.text_ellipsis(2);
								@include mixin.font(#a3a3a3 '1.4rem/2rem');

								@include mixin.context-after(':not(.mui_image-none)', 'figure') {
									display: none;
								}
							}
						}
					}

					// 이미지 에러
					.mui_image-none {
						.uico_none {
							background-color: #f5f5f5;
						}
					}

					+ .mui_scroller {
						margin-top: 24px;
					}
				}
			}
		}

		.mui_product-list {
			> ul {
				display: inline-block;
				padding: 0 24px 4px;
				@include mixin.font('0', nowrap);

				> li {
					display: inline-block;
					width: 152px;
					white-space: normal;

					&:nth-child(n+2) {
						margin-left: 12px;
					}
				}
			}

			.mui_product-item {
				figure {
					figcaption {
						padding: 0 10px 0 4px;

						.text_product {
							margin-top: 2px;
						}

						.text_sale {
							margin-top: 7px;
						}

						.text_price {
							margin-top: 6px;
						}

						.mui_tag-list {
							margin: 9px 0 0 -2px;
						}
					}
				}
			}
		}
	}
</style>