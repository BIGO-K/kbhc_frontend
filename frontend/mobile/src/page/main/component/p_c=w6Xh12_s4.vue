<template>
	<block
		v-slot="{ context }"
		:block="block"
	>
		<carousel
			:active-index="context.get('carouselIndex', 0)"
			:items="goodsList"
			use-pagination
			:auto-delay="4"
			:group-size="4"
			is-auto-height
			is-block-content
			@ready="_param => context.set({ carouselIndex: _param.activeIndex })"
			@start="_param => context.set({ carouselIndex: _param.activeIndex })"
		>
			<template #default="{ item }">
				<product-item
					:goods="item"
					is-block-content
				></product-item>
			</template>
		</carousel>
	</block>
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import Carousel from '@/component/Carousel.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import Block from '@/component/block/BaseBlock.vue';

	const props = defineProps<{ block: Block }>();
	const goodsList = computed(() => props.block.goods_group?.goods_list || []);
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
					margin-left: 6px;
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