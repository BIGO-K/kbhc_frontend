<template>
	<layout title="판매자샵">
		<div
			v-if="bestItems.length > 0 || newItems.length > 0"
			class="m_product-seller"
		>
			<!-- BEST ITEM -->
			<section v-if="bestItems.length > 0">
				<h3><b>BEST ITEM</b></h3>
				<div class="mm_scroller T=x">
					<div class="mm_product-list T=card">
						<ul>
							<li
								v-for="item in bestItems"
								:key="item.id"
							>
								<product-item
									class="T=pa"
									:goods="item"
									:usable="{
										keys: ['price', 'review_count'],
										isReverse: true,
									}"
								></product-item>
							</li>
						</ul>
					</div>
				</div>
			</section>

			<!-- NEW IN -->
			<section v-if="newItems.length > 0">
				<h3><b>NEW IN</b></h3>
				<div class="mm_scroller T=x">
					<div class="mm_product-list T=card">
						<ul>
							<li
								v-for="item in newItems"
								:key="item.id"
							>
								<product-item
									class="T=pa"
									:goods="item"
									:usable="{
										keys: ['price', 'review_count'],
										isReverse: true,
									}"
								></product-item>
							</li>
						</ul>
					</div>
				</div>
			</section>
		</div>

		<!-- 상품리스트 -->
		<filter-goods-infinite-list
			:total-count="totalCount"
			:filterable="filterable"
			:goods-list-by-page="goodsListByPage"
			:init-params-for-command="paramsForCommand"
			:fetch-count="fetchCount"
			:fetch-list="fetchList"
		></filter-goods-infinite-list>
	</layout>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useFilterable } from '$/composables/useFilterable';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useSellerShop } from '$/composables/useSellerShop';
	import Layout from '@/component/layout/Layout.vue';
	import FilterGoodsInfiniteList from '@/component/FilterGoodsInfiniteList.vue';
	import ProductItem from '@/component/ProductItem.vue';

	const { route } = useGlobalPageContext();

	const sellerId = Number(route.params.id);
	const {
		getBestAndNewGoods,
		fetchFilterable,
		fetchList,
		fetchCount,
	} = useSellerShop(sellerId);

	// 상품리스트
	const {
		filterable,
		goodsListByPage,
		paramsForCommand,
		totalCount,
		startContext,
	} = useFilterable(fetchFilterable, fetchCount, fetchList);

	const bestItems = ref<Goods[]>([]);
	const newItems = ref<Goods[]>([]);

	await Promise.allSettled([
		getBestAndNewGoods().then(_data => {
			bestItems.value = _data.best_goods;
			newItems.value = _data.new_goods;
		}),
		startContext(),
	]);
</script>