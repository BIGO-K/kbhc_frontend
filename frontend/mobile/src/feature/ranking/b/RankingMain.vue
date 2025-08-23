<template>
	<!-- 아이템 랭킹 -->
	<section class="mm_inner m_ranking-item">
		<h3><b>아이템 랭킹</b></h3>
		<template v-if="rankingItems.length === 0">
			<p class="mm_text-none">
				<i class="ico_text-none"></i>집계된 상품이 없습니다
			</p>
		</template>
		<template v-else>
			<!-- 상품리스트 -->
			<div class="mm_product-list T=card">
				<ol>
					<li
						v-for="item in rankingItems"
						:key="item.id"
					>
						<ranking-rank
							:rank="item.rank"
							:change_type="item.change_type"
							:change_value="item.change_value"
						></ranking-rank>
						<product-item
							class="T=pa"
							:goods="item"
							:usable="{
								keys: ['review_count', 'price', 'badges'],
								isReverse: true,
							}"
						></product-item>
					</li>
				</ol>
			</div>
			<div class="mm_foot">
				<div class="mm_btn_box">
					<div class="mm_inline">
						<mm-link
							class="mm_btn T=xs T=line btn_more"
							:to="{ name: 'RankingProduct' }"
						>
							<b>BEST 아이템 더보기</b><i class="ico_link"></i>
						</mm-link>
					</div>
				</div>
			</div>
		</template>
	</section>

	<!-- 브랜드 랭킹 -->
	<section class="mm_inner m_ranking-brand">
		<h3><b>브랜드 랭킹</b></h3>
		<template v-if="rankingBrands.length === 0">
			<p class="mm_text-none">
				<i class="ico_text-none"></i>집계된 상품이 없습니다
			</p>
		</template>
		<template v-else>
			<div class="m_ranking-brand-list">
				<ol>
					<li
						v-for="(brand, _i) in rankingBrands"
						:key="brand.id"
						:class="{ 'S=brand-on': rankingBrands[activeBrandIndex].id === brand.id }"
					>
						<button
							type="button"
							class="btn_brand"
							@click="rankingBrandActive(_i)"
						>
							<b>{{ brand.name }}</b>
							<ranking-rank
								:rank="brand.rank"
								:change_type="brand.change_type"
								:change_value="brand.change_value"
							></ranking-rank>
						</button>
						<div class="mm_product-list">
							<ol>
								<li
									v-for="item in brand.goods_list.slice(0,3)"
									:key="item.id"
								>
									<div class="mm_product-item">
										<mm-link :to="{ name: 'ProductDetail', params: { id: item.id } }">
											<figure>
												<div class="mm_product-item-image">
													<lazyload
														class="mm_bg-cover image_product"
														:src="item.thumbnail_url"
													></lazyload>
												</div>
												<figcaption>
													<p class="mm_ir-blind">
														{{ item.name }}
													</p>
													<p class="text_price">
														<strong>{{ number(item.base_discounted_price) }}</strong>
													</p>
												</figcaption>
											</figure>
										</mm-link>
									</div>
								</li>
							</ol>
						</div>
					</li>
				</ol>
			</div>
			<div class="mm_foot">
				<div class="mm_btn_box">
					<div class="mm_inline">
						<mm-link
							class="mm_btn T=xs T=line btn_more"
							:to="{ name: 'RankingBrand' }"
						>
							<b>BEST 브랜드 더보기</b><i class="ico_link"></i>
						</mm-link>
					</div>
				</div>
			</div>
		</template>
	</section>

	<!-- 뷰 랭킹 -->
	<section class="mm_inner m_ranking-view">
		<h3><b>View 랭킹</b></h3>
		<template v-if="rankingViews.length === 0">
			<p class="mm_text-none">
				<i class="ico_text-none"></i>집계된 상품이 없습니다
			</p>
		</template>
		<template v-else>
			<!-- 상품리스트 -->
			<div class="mm_product-list T=card">
				<ol>
					<li
						v-for="item in rankingViews"
						:key="item.id"
					>
						<ranking-rank
							:rank="item.rank"
							:change_type="item.change_type"
							:change_value="item.change_value"
						></ranking-rank>
						<product-item
							class="T=pa"
							:goods="item"
							:usable="{
								keys: ['icon', 'is_soldout']
							}"
							:use-wish="false"
						></product-item>
					</li>
				</ol>
			</div>
			<div class="mm_foot">
				<div class="mm_btn_box">
					<div class="mm_inline">
						<mm-link
							class="mm_btn T=xs T=line btn_more"
							:to="{ name: 'RankingView' }"
						>
							<b>BEST VIEW 더보기</b><i class="ico_link"></i>
						</mm-link>
					</div>
				</div>
			</div>
		</template>
	</section>

	<!-- 찜 랭킹 -->
	<section class="mm_inner m_ranking-like">
		<h3><b>찜 랭킹</b></h3>
		<template v-if="rankingWishlists.length === 0">
			<p class="mm_text-none">
				<i class="ico_text-none"></i>집계된 상품이 없습니다
			</p>
		</template>
		<template v-else>
			<!-- 상품리스트 -->
			<div class="mm_product-list">
				<ol>
					<li
						v-for="(item, i) in rankingWishlists"
						:key="item.id"
					>
						<ranking-rank
							:rank="item.rank"
							:change_type="item.change_type"
							:change_value="item.change_value"
						></ranking-rank>
						<product-item
							class="T=pa"
							:goods="item"
							:usable="{
								keys: ['review_count', 'price', 'badges'],
								isReverse: true
							}"
							:use-wish="false"
						></product-item>
						<p class="text_like">
							<i :class="i < 3 ? 'ico_like-fill' : 'ico_like'"></i><span>{{ i < 3 ? item.wish_count : item.wish_count > 999 ? '999+' : item.wish_count }}</span>
						</p>
					</li>
				</ol>
			</div>
			<div class="mm_foot">
				<div class="mm_btn_box">
					<div class="mm_inline">
						<mm-link
							class="mm_btn T=xs T=line btn_more"
							:to="{ name: 'RankingWishlist' }"
						>
							<b>BEST 찜 더보기</b><i class="ico_link"></i>
						</mm-link>
					</div>
				</div>
			</div>
		</template>
	</section>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { useIntervalFn } from '@vueuse/core';
	import { useWishedStore } from '$/stores/useWishedStore';
	import { unique } from '$/utils/array';
	import { useFormatter } from '$/composables/useFormatter';
	import { useRanking } from '$/composables/useRanking';
	import Lazyload from '@/component/Lazyload.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import RankingRank from '@/feature/ranking/component/RankingRank.vue';

	const { number } = useFormatter();
	const { getRankingItem, getRankingBrand } = useRanking();
	const { check } = useWishedStore();

	const rankingItems = ref<ItemRanking['goods_list']>([]);
	const rankingBrands = ref<BrandRanking['brand_list']>([]);
	const rankingViews = ref<ItemRanking['goods_list']>([]);
	const rankingWishlists = ref<ItemRanking['goods_list']>([]);
	const rankingGoodsIds = computed(() => rankingItems.value.concat(rankingWishlists.value).map(goods => goods.id));

	await Promise.allSettled([
		getRankingItem('order', 'D', undefined, 5).then(_data => {
			rankingItems.value = _data.goods_list;
		}),
		getRankingBrand('D', 6).then(_data => {
			rankingBrands.value = _data.brand_list;
		}),
		getRankingItem('view', 'D', undefined, 6).then(_data => {
			rankingViews.value = _data.goods_list;
		}),
		getRankingItem('wish', 'D', undefined, 7).then(_data => {
			rankingWishlists.value = _data.goods_list;
		}),
	]);

	if (rankingGoodsIds.value.length > 0) {
		check(unique(rankingGoodsIds.value));
	}

	const activeBrandIndex = ref(0);

	const rankingBrandInterval = useIntervalFn(() => {
		activeBrandIndex.value = (activeBrandIndex.value === rankingBrands.value.length - 1) ? 0 : activeBrandIndex.value + 1;
	}, 4000);

	const rankingBrandActive = (_i: number) => {
		activeBrandIndex.value = _i;
		rankingBrandInterval.pause();
		rankingBrandInterval.resume();
	};
</script>