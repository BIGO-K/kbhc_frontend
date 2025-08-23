<template>
	<layout
		:title="`${searchedKeyword} 검색 결과`"
		:hide-title="true"
		layout="popup"
		class="L=search"
	>
		<template #afterTitle>
			<div class="mm_lside">
				<i class="ico_search"><b class="mm_ir-blind">검색</b></i>
			</div>
			<form-text
				v-model="searchedKeyword"
				placeholder="검색어를 입력하세요"
				@keyup.prevent="searchAuto"
			></form-text>
		</template>

		<template #default>
			<template v-if="autoKeywordShow">
				<!-- 검색어 자동완성 -->
				<div
					class="mm_full m_search-auto"
					:class="{ 'S=auto-on': searchedKeyword.trim().length > 0 }"
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
											<b v-html="strwrap(category.full_path, searchedKeyword, `<strong class='mm_text-variable'>`, '</strong>')"></b>
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
										<a
											href="#"
											@click.prevent="changeKeyword(keyword)"
										>
											<b v-html="strwrap(keyword, searchedKeyword, `<strong class='mm_text-variable'>`, '</strong>')"></b><i class="ico_link-arrow"></i>
										</a>
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
			<template v-else>
				<div class="m_search-result">
					<template v-if="totalCount < 1">
						<!-- 결과없음 -->
						<p class="mm_text-none">
							<i class="ico_text-none"></i>검색 결과가 없습니다
						</p>
						<div class="mm_note T=bg">
							<ul>
								<li>정확한 검색어를 입력하셨는지 확인해 주세요.</li>
								<li>다른 검색어를 입력해 주세요.</li>
								<li>노출이 제한된 상품일 수 있습니다.</li>
							</ul>
						</div>

						<!-- 인기 검색어 -->
						<template v-if="!isChangedSearchKeyword">
							<div class="mm_inner">
								<section
									v-if="hotKeywordContext"
									class="m_search-list"
								>
									<h3><b>인기 검색어</b></h3>
									<template v-if="hotKeywordContext.hotKeywordRecords.length < 1">
										<p class="mm_text-none T=sm">
											<i class="ico_text-none"></i>인기 검색어가 없습니다
										</p>
									</template>
									<template v-else>
										<div class="mm_scroller">
											<ol>
												<li
													v-for="(entry, index) in hotKeywordContext.hotKeywordRecords"
													:key="index"
												>
													<mm-link
														:to="{ name: 'SearchResult', query: { keyword: entry.keyword } }"
														@click.prevent="changeKeyword(entry.keyword)"
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
											<p>{{ date(`${hotKeywordContext.indexedAt}`, 'YYYY.MM.DD HH:mm') }} 기준</p>
										</div>
									</template>
								</section>
							</div>

							<!-- best 아이템 -->
							<section
								v-if="bestGoods.length > 0"
								class="m...result-best"
							>
								<h3><b>BEST 아이템</b></h3>
								<div class="mm_scroller T=x">
									<div class="mm_product-list T=card">
										<ul>
											<li
												v-for="bestGood in bestGoods"
												:key="bestGood.id"
											>
												<product-item
													class="T=pa"
													:goods="bestGood"
												></product-item>
											</li>
										</ul>
									</div>
								</div>
							</section>
						</template>
					</template>

					<template v-else>
						<!-- 검색어 변환 -->
						<div
							v-if="correctInfo.is_corrected && correctInfo.origin_keyword"
							class="m...result-offer"
						>
							<p><strong>{{ correctInfo.corrected_keyword }}</strong>(으)로 자동 변환된<br> 검색 결과입니다</p>
							<a
								href="#"
								@click.prevent="changeKeyword(correctInfo.origin_keyword, true)"
							>
								<strong class="mm_text-variable">'{{ correctInfo.origin_keyword }}'</strong><b>검색 결과 보기</b><i class="ico_link"></i>
							</a>
						</div>

						<!-- 연관 검색어 -->
						<div
							v-if="relationKeywords.length > 0"
							class="m...result-keyword"
						>
							<div class="mm_scroller T=x">
								<ul>
									<li
										v-for="relatedKeyword in relationKeywords"
										:key="relatedKeyword"
									>
										<button
											class="mm_btn T=sm T=lighter"
											type="button"
											@click="changeKeyword(relatedKeyword)"
										>
											<b>{{ relatedKeyword }}</b>
										</button>
									</li>
								</ul>
							</div>
						</div>

						<!-- 브랜드샵 -->
						<!-- (D) 브랜드명 검색 시 노출되는 버튼입니다. -->
						<template v-if="relatedBrand">
							<mm-link
								class="btn_brandshop"
								:to="{ name: 'BrandShop', params: { id: relatedBrand.id } }"
							>
								<strong>{{ relatedBrand.name }}</strong><b>브랜드샵 가기<i class="ico_link"></i></b>
							</mm-link>
						</template>

						<filter-goods-infinite-list
							:key="searchedKeyword"
							:total-count="totalCount"
							:filterable="filterable"
							:goods-list-by-page="goodsListByPage"
							:init-params-for-command="paramsForCommand"
							:is-general-goods="false"
							:fetch-list="fetchList"
						>
						</filter-goods-infinite-list>
					</template>
				</div>
			</template>
		</template>
	</layout>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { useRecentSearchKeywordStore } from '$/stores/useRecentSearchKeywordStore';
	import { strwrap } from '$/utils/string';
	import { useFormatter } from '$/composables/useFormatter';
	import { useHotKeyword } from '$/composables/useHotKeyword';
	import { useRouteQueryCast } from '$/composables/useRouteQueryCast';
	import { useSearchEngine } from '$/composables/useSearchEngine';
	import { useSearchFilterable } from '$/composables/useSearchFilterable';
	import Layout from '@/component/layout/Layout.vue';
	import FilterGoodsInfiniteList from '@/component/FilterGoodsInfiniteList.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import FormText from '@/component/form/FormText.vue';

	const { queryToString } = useRouteQueryCast();
	const autoKeywordShow = ref<boolean>(false);
	const searchedKeyword = ref<string>(queryToString('keyword', ''));
	const isChangedSearchKeyword = ref<boolean>(false);
	const { add: addSearchKeyword } = useRecentSearchKeywordStore();
	const { fetchList, getAutoComplete } = useSearchEngine();
	const { getContext } = useHotKeyword();
	const {
		startContext,
		bestGoods,
		filterable,
		goodsListByPage,
		paramsForCommand,
		totalCount,
		correctInfo,
		relationKeywords,
		relatedBrand,
		search,
	} = useSearchFilterable(fetchList);
	const { date } = useFormatter();

	await startContext();
	const hotKeywordContext = totalCount.value < 1 ? await getContext() : null;

	// /**
	//  * 검색어 입력 페이지로 이동
	//  */
	// function toSearchReady() {
	// 	router.replace({
	// 		name: 'Search',
	// 		query: {
	// 			keyword: searchedKeyword.value,
	// 		},
	// 	});
	// }

	async function changeKeyword(keyword: string, doNotCorrect = false) {
		isChangedSearchKeyword.value = true;
		addSearchKeyword(keyword);
		paramsForCommand.value.keyword = keyword;

		await search(keyword, doNotCorrect);
		searchedKeyword.value = keyword;
		autoKeywordShow.value = false;
	}

	const showAutoComplete = computed(() => autoCompleteKeywords.value.categories.length > 0 || autoCompleteKeywords.value.keywords.length > 0);
	const autoCompleteKeywords = ref<AutoCompleteKeyword>({
		from: '',
		categories: [],
		brands: [],
		keywords: [],
	});

	/**
	 * 자동완성 검색어 조회
	 * @param event
	*/
	async function searchAuto(event: KeyboardEvent) {
		if (event.key.toLocaleLowerCase() === 'enter') {
			changeKeyword(searchedKeyword.value);

			return;
		}

		autoKeywordShow.value = true;
		if (searchedKeyword.value.trim().length < 1) {
			// 공백만 입력 시 일치하는 검색어 X 노출
			autoKeywordShow.value = false;
			autoCompleteKeywords.value = {
				from: '',
				categories: [],
				brands: [],
				keywords: [],
			};

			return;
		}
		if (searchedKeyword.value === '' && event.key.toLowerCase() === 'backspace') {
			return;
		}

		if (searchedKeyword.value !== '') {
			try {
				autoCompleteKeywords.value = await getAutoComplete(searchedKeyword.value);
			}
			catch (e) {
				autoCompleteKeywords.value = {
					from: '',
					categories: [],
					brands: [],
					keywords: [],
				};
				// console.error(e);
			}
		}
	}
</script>