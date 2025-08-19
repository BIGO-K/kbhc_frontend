<template>
	<div data-mui="bp_ns=w6Xh16_s6">
		<ul>
			<li
				v-for="item in blockItems"
				:key="item.id"
			>
				<mm-link :to="item.banner.link">
					<figure>
						<lazyload
							class="mui_bg-cover image_banner"
							:src="item.banner.image"
						></lazyload>
						<figcaption>
							<template v-if="item.banner.texts.filter(_value => _value != null).length === 0">
								<p class="text_alt">
									{{ item.banner.alt }}
								</p>
							</template>
							<template v-else>
								<p
									v-for="(text, _i) in item.banner.texts"
									:key="text"
									:class="`text_banner${_i + 1}`"
								>
									{{ text }}
								</p>
							</template>
						</figcaption>
					</figure>
				</mm-link>
				<div class="mui_scroller T=x">
					<div class="mui_product-list">
						<ul>
							<li
								v-for="product in item.products"
								:key="product.id"
							>
								<product-item
									:goods="product"
									:usable="{
										keys: ['review_count', 'price'],
										isReverse: true,
									}"
									:is-block-content="true"
								></product-item>
							</li>
						</ul>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	import { useFakeCreator } from '$/composables/useFakeCreator';
	import Lazyload from '@/component/Lazyload.vue';
	import ProductItem from '@/component/ProductItem.vue';

	const productItems = useFakeCreator().goods(4);// XXX 상품 임시 생성

	const blockItems = [
		{
			id: 1,
			banner: {
				link: '#',
				image: '/image/_sample/bp_ns=w6Xh16_s6_01.jpg',
				alt: '대체텍스트',
				texts: [
					'닥터브라이언',
					'하루의 시작을 건강하게 채워보세요.',
				],
			},
			products: productItems,
		},
		{
			id: 2,
			banner: {
				link: '#',
				image: '/image/_sample/bp_ns=w6Xh16_s6_02.jpg',
				alt: '대체텍스트',
				texts: [
					'YOUNGLONG',
					'활력 넘치는 생활을 위한 에너지!',
				],
			},
			products: productItems,
		},
	];
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