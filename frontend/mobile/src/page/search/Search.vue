<template>
	<layout
		title="검색"
		:hide-title="true"
		layout="popup"
		class="L=search"
	>
		<template #afterTitle>
			<div class="mm_lside">
				<i class="ico_search"><b class="mm_ir-blind">검색</b></i>
			</div>
			<form-text
				v-model="searchKeyword"
				placeholder="검색어를 입력하세요"
				@keyup.prevent="searchAuto"
				@keydown.enter.prevent="searchKeywordEnter"
			></form-text>
		</template>

		<template #default>
			<!-- 상품 및 검색어 -->
			<carousel
				:items="searchCarouselItems"
				class="m_search"
				:use-pagination="true"
				:is-more-side="true"
			>
				<template #default="{ item }">
					<!-- 최근본상품 -->
					<template v-if="item.title === '최근 본 상품'">
						<section class="m_search-list">
							<h3><b>{{ item.title }}</b></h3>
							<div class="mm_scroller">
								<div class="mm_product-list T=sm">
									<ul>
										<li
											v-for="(entry, _i) in (item as SearchProduct).items"
											:key="_i"
										>
											<product-item
												:goods="(entry.goods as OptianalGoods)"
												:usable="{
													keys: ['base_discounted_price', 'is_soldout'],
												}"
												:use-wish="false"
											></product-item>
										</li>
									</ul>
								</div>
							</div>
						</section>
					</template>

					<!-- 최근검색어 -->
					<template v-else-if="item.title === '최근 검색어'">
						<section class="m_search-list">
							<h3><b>{{ item.title }}</b></h3>
							<template v-if="(item as SearchKeyword).items.length < 1">
								<p class="mm_text-none T=sm">
									<i class="ico_text-none"></i>최근 검색내역이 없습니다
								</p>
							</template>
							<template v-else>
								<div class="mm_scroller">
									<ul>
										<li
											v-for="entry in (item as SearchKeyword).items"
											:key="entry.keyword"
										>
											<mm-link
												:to="{ name: 'SearchResult', query: { keyword: entry.keyword } }"
												@click="recentSearchKeywordStore.add(entry.keyword)"
											>
												<b>{{ entry.keyword }}</b>
											</mm-link>
											<button
												type="button"
												class="btn_remove"
												@click="removeSearchedKeyword(entry.keyword)"
											>
												<i class="ico_remove"></i><b class="mm_ir-blind">삭제</b>
											</button>
										</li>
									</ul>
								</div>
								<div class="m...list-foot">
									<button
										type="button"
										class="btn_remove-all"
										@click="clearSearchedKeywords"
									>
										<b>최근 검색어 전체삭제</b><i class="ico_remove-trash"></i>
									</button>
								</div>
							</template>
						</section>
					</template>

					<!-- 인기검색어 -->
					<template v-else>
						<section class="m_search-list">
							<h3><b>{{ item.title }}</b></h3>
							<template v-if="(item as SearchHotKeyword).items.length < 1">
								<p class="mm_text-none T=sm">
									<i class="ico_text-none"></i>인기 검색어가 없습니다
								</p>
							</template>
							<template v-else>
								<div class="mm_scroller">
									<ol>
										<li
											v-for="(entry, _i) in (item as SearchHotKeyword).items"
											:key="_i"
										>
											<mm-link
												:to="{ name: 'SearchResult', query: { keyword: entry.keyword } }"
												@click="recentSearchKeywordStore.add(entry.keyword)"
											>
												<b>{{ entry.keyword }}</b>
												<template v-if="entry.change_type === 'N'">
													<i
														class="ico_rank-new"
														title="신규"
													></i>
												</template>
												<template v-else-if="entry.change_type === 'U'">
													<i
														class="ico_rank-up"
														title="상승"
													></i>
													<b class="text_rank">{{ entry.change_rank }}</b>
												</template>
												<template v-else-if="entry.change_type === 'D'">
													<i
														class="ico_rank-down"
														title="하락"
													></i>
													<b class="text_rank">{{ entry.change_rank }}</b>
												</template>
												<template v-else>
													<i
														class="ico_rank-unchanged"
														title="변동없음"
													></i>
												</template>
											</mm-link>
										</li>
									</ol>
								</div>
								<div class="m...list-foot">
									<p>{{ date(`${(item as SearchHotKeyword).indexedAt}`, 'YYYY.MM.DD HH:mm') }} 기준</p>
								</div>
							</template>
						</section>
					</template>
				</template>
			</carousel>

			<!-- 검색어 자동완성 -->
			<div
				class="mm_full m_search-auto"
				:class="{ 'S=auto-on': searchKeyword.trim().length > 0 }"
			>
				<div class="mm_scroller">
					<template v-if="showAutoComplete">
						<div
							v-if="autoCompleteKeywords.categories.length > 0"
							class="m...auto-category"
						>
							<ul>
								<li
									v-for="category in autoCompleteKeywords.categories"
									:key="category.code"
								>
									<mm-link :to="{ name: 'Category', params: { id: category.code } }">
										<b v-html="strwrap(category.full_path, searchKeyword, `<strong class='mm_text-variable'>`, '</strong>')"></b>
									</mm-link>
								</li>
							</ul>
						</div>

						<div class="m...auto-keyword">
							<ul>
								<li
									v-for="keyword in autoCompleteKeywords.keywords"
									:key="keyword"
								>
									<mm-link
										:to="{ name: 'SearchResult', query: { keyword: keyword } }"
										@click="recentSearchKeywordStore.add(keyword)"
									>
										<b v-html="strwrap(keyword, searchKeyword, `<strong class='mm_text-variable'>`, '</strong>')"></b><i class="ico_link-arrow"></i>
									</mm-link>
								</li>
							</ul>
						</div>
					</template>
					<template v-else>
						<p class="m...auto-none">
							일치하는 검색어가 없습니다<i class="ico_link-arrow"></i>
						</p>
					</template>
				</div>
			</div>
		</template>
	</layout>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { useRecentSearchKeywordStore } from '$/stores/useRecentSearchKeywordStore';
	import { useRecentViewGoodsStore } from '$/stores/useRecentViewGoodsStore';
	import { strwrap } from '$/utils/string';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useHotKeyword } from '$/composables/useHotKeyword';
	import { useSearchEngine } from '$/composables/useSearchEngine';
	import Layout from '@/component/layout/Layout.vue';
	import Carousel from '@/component/Carousel.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import FormText from '@/component/form/FormText.vue';

	type RecentViewGoods = Pick<Goods, 'id' | 'name' | 'thumbnail_url' | 'base_discounted_price' | 'sale_rate'> & Required<Pick<Goods, 'is_soldout' | 'brand_name'>>;
	type RecentViewGoodsRecord = {
		goods: RecentViewGoods;
		recentViewedAt: Date | string;
	};

	type SearchProduct = {
		title: string;
		items: RecentViewGoodsRecord[];
	};

	type SearchKeyword = {
		title: string;
		items: {
			keyword: string;
			recentViewedAt: string;
		}[];
	};

	type SearchHotKeyword = {
		title: string;
		indexedAt: Date;
		items: HotKeywordRecord[];
	};

	const searchCarouselItems = computed<(SearchProduct | SearchKeyword | SearchHotKeyword)[]>(() => {
		return [
			{
				title: '최근 본 상품',
				items: recentViewGoodsRecords,
			} as SearchProduct,
			{
				title: '최근 검색어',
				items: recentSearchedRecord.value,
			} as SearchKeyword,
			{
				title: '인기 검색어',
				indexedAt: hotKeywordContext.indexedAt,
				items: hotKeywordContext.hotKeywordRecords,
			} as SearchHotKeyword,
		];
	});

	const searchKeyword = ref('');
	const showAutoComplete = computed(() => autoCompleteKeywords.value.categories.length > 0 || autoCompleteKeywords.value.keywords.length > 0);
	const autoCompleteKeywords = ref<AutoCompleteKeyword>({
		from: '',
		categories: [],
		brands: [],
		keywords: [],
	});


	const { number, date } = useFormatter();
	const { getAutoComplete } = useSearchEngine();
	const { recordsByRecent: recentViewGoodsRecords } = useRecentViewGoodsStore();
	const recentSearchKeywordStore = useRecentSearchKeywordStore();

	const recentSearchedRecord = computed(() => recentSearchKeywordStore.recordsByRecent);
	const { getContext } = useHotKeyword();
	const { router, bom } = useGlobalPageContext();
	const hotKeywordContext = await getContext();
	/**
	 * 자동완성 검색어 조회
	 * @param event
	*/
	async function searchAuto(event: KeyboardEvent) {
		if (event.key.toLocaleLowerCase() === 'enter') {
			return;
		}
		if (searchKeyword.value.trim().length < 1) { // 공백만 입력 시 일치하는 검색어 X 노출
			autoCompleteKeywords.value = {
				from: '',
				categories: [],
				brands: [],
				keywords: [],
			};

			return;
		}
		if (searchKeyword.value === '' && event.key.toLowerCase() === 'backspace') {
			return;
		}

		if (searchKeyword.value !== '') {
			try {
				autoCompleteKeywords.value = await getAutoComplete(searchKeyword.value);
			}
			catch (e) {
				console.error(e);
			}
		}
	}

	/**
	 * 검색어 입력시 검색 처리
	 * @param event
	*/
	function searchKeywordEnter(event: KeyboardEvent) {
		if (event.isComposing) {
			return;
		}

		if (searchKeyword.value.trim().length < 1) {
			return bom.alert('검색어를 입력하세요');
		}

		(event.target as HTMLElement).blur();
		recentSearchKeywordStore.add(searchKeyword.value.trim());
		router.push({
			name: 'SearchResult',
			query: {
				keyword: searchKeyword.value.trim(),
			},
		});

	}

	const removeSearchedKeyword = (keyword: string) => {
		recentSearchKeywordStore.remove(keyword);
	};

	const clearSearchedKeywords = () => {
		recentSearchKeywordStore.clear();
	};
</script>