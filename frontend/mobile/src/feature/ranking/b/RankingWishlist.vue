<template>
	<template v-if="rankingWishlist.goods_list.length === 0">
		<p class="mm_text-none">
			<i class="ico_text-none"></i>집계된 상품이 없습니다
		</p>
	</template>
	<template v-else>
		<!-- VIEW 랭킹 -->
		<div class="mm_inner m_ranking-like">
			<!-- 랭킹 상단 -->
			<div class="m_ranking-head">
				<div class="m_ranking-head-update">
					<p class="text_update">
						<span>{{ rankingWishlist.target_date }}</span>기준
					</p>
					<toggle
						v-model:is-active="isTooltipActive"
						class="btn_help"
						parent-selector=".m_ranking-head-update"
					>
						<i class="ico_tooltip-notice"></i>
					</toggle>
					<div class="m...update-tooltip">
						<p>전일 기준으로 랭킹 산정(매일 0시 기준, 일 1회 집계)산정기간: {{ rankingPeriod }}</p>
						<button
							type="button"
							class="btn_close"
							@click="isTooltipActive = false"
						>
							<i class="ico_tooltip-close"></i><b class="mm_ir-blind">닫기</b>
						</button>
					</div>
				</div>
				<form-select
					v-model="sortDate"
					title="조회"
					:use-overlay="true"
				>
					<option value="D">
						일간
					</option>
					<option value="W">
						주간
					</option>
					<option value="M">
						월간
					</option>
				</form-select>
			</div>

			<!-- 상품리스트 -->
			<div class="mm_product-list">
				<ol>
					<li
						v-for="(item, i) in rankingWishlist.goods_list"
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
		</div>
	</template>
</template>

<script setup lang="ts">
	import { ref, watch } from 'vue';
	import { useRanking } from '$/composables/useRanking';
	import ProductItem from '@/component/ProductItem.vue';
	import Toggle from '@/component/Toggle.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import RankingRank from '@/feature/ranking/component/RankingRank.vue';

	const { getRankingItem, getRankPeriod } = useRanking();

	const isTooltipActive = ref(false);
	const sortDate = ref<RankRange>('D');
	const rankingWishlist = ref(await getRankingItem('wish', sortDate.value));
	const rankingPeriod = ref(await getRankPeriod(sortDate.value, rankingWishlist.value.target_date));

	watch(sortDate, async () => {
		rankingWishlist.value = await getRankingItem('wish', sortDate.value);
		rankingPeriod.value = await getRankPeriod(sortDate.value, rankingWishlist.value.target_date);
	});
</script>