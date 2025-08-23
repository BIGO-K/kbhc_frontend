<template>
	<!-- 카테고리 -->
	<div
		v-category-sticky
		class="m_ranking-category"
		:class="classSticky"
	>
		<div class="m_ranking-category-inner">
			<div class="mm_scroller T=x">
				<!-- (D) 선택된 카테고리에 'S=category-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
				<ul>
					<li>
						<button
							type="button"
							class="mm_btn T=sm T=lighter"
							:class="{ 'S=category-on': selectedCategory === '' }"
							:title="selectedCategory === '' ? '선택됨' : undefined"
							@click="changeCategoryCode()"
						>
							<b>전체</b>
						</button>
					</li>
					<li
						v-for="category in categories"
						:key="category.code"
					>
						<button
							type="button"
							class="mm_btn T=sm T=lighter"
							:class="{ 'S=category-on': selectedCategory === category.code }"
							:title="selectedCategory === category.code ? '선택됨' : undefined"
							@click="changeCategoryCode(category.code)"
						>
							<b>{{ category.name }}</b>
						</button>
					</li>
				</ul>
			</div>
		</div>
	</div>

	<template v-if="rankingItem.goods_list.length === 0">
		<p class="mm_text-none">
			<i class="ico_text-none"></i>집계된 상품이 없습니다
		</p>
	</template>
	<template v-else>
		<!-- 아이템 랭킹 -->
		<div class="mm_inner m_ranking-item">
			<!-- 랭킹 상단 -->
			<div class="m_ranking-head">
				<div class="m_ranking-head-update">
					<p class="text_update">
						<span>{{ rankingItem.target_date }}</span>기준
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
			<div class="mm_product-list T=card">
				<ol>
					<li
						v-for="item in rankingItem.goods_list"
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
								keys: ['brand_name', 'base_discounted_price', 'sale_rate'],
							}"
						></product-item>
					</li>
				</ol>
			</div>
		</div>
	</template>
</template>

<script setup lang="ts">
	import { ref, computed, watch } from 'vue';
	import { useScroll } from '@vueuse/core';
	import { useWishedStore } from '$/stores/useWishedStore';
	import { unique } from '$/utils/array';
	import { useCategories } from '$/composables/useCategories';
	import { useRanking } from '$/composables/useRanking';
	import ProductItem from '@/component/ProductItem.vue';
	import Toggle from '@/component/Toggle.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import RankingRank from '@/feature/ranking/component/RankingRank.vue';

	const { getRankingItem, getRankPeriod } = useRanking();
	const { categories, getAll } = useCategories();
	const { check } = useWishedStore();

	await getAll();

	const isTooltipActive = ref(false);
	const sortDate = ref<RankRange>('D');

	const selectedCategory = ref<string | undefined>('');

	// 랭킹 category sticky
	const $scroller = ref<HTMLElement | null>(null);
	const $category = ref<HTMLElement | null>(null);
	const classSticky = ref('');

	const vCategorySticky = {
		mounted(_$element: HTMLElement) {

			$category.value = _$element;
			$scroller.value = document.querySelector('.mm_page > .mm_scroller') as HTMLElement;

			const smooth = ref(false);
			const behavior = computed(() => smooth.value ? 'smooth' : 'auto');
			const { y } = useScroll($scroller, { behavior });

			watch(y, () => {

				const offsetTop = _$element.getBoundingClientRect().top;

				if (offsetTop + _$element.offsetHeight <= 0) {
					_$element.style.height = getComputedStyle(_$element)['height'];
					classSticky.value = 'S=sticky';
				}
				else {
					_$element.style.height = '';
					classSticky.value = '';
				}

			});
		},
	};

	const rankingItem = ref(await getRankingItem('order', sortDate.value, selectedCategory.value));
	const rankingPeriod = computed(() => getRankPeriod(sortDate.value, rankingItem.value.target_date));
	const goodsIds = computed(() => rankingItem.value.goods_list.map(goods => goods.id));

	if (goodsIds.value.length > 0) {
		check(unique(goodsIds.value));
	}

	/** 카테고리 코드 변경 */
	function changeCategoryCode(categoryCode?: string) {
		selectedCategory.value = categoryCode || '';
		if ($scroller.value) {
			$scroller.value.scrollTop = 0;
		}
	}

	watch([sortDate, selectedCategory], async () => {
		rankingItem.value = await getRankingItem('order', sortDate.value, selectedCategory.value);
		if (goodsIds.value.length > 0) {
			check(unique(goodsIds.value));
		}
	});
</script>