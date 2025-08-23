import { ref } from 'vue';
import { useRouteQuery } from '@vueuse/router';
import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
import { useGoodsSorting } from '$/composables/useGoodsSorting';
import { useRouteQueryCast } from '$/composables/useRouteQueryCast';

export const useSearchFilterable = (
	fetchList: (paramForCommand: GoodsFilterParamForCommand) => Promise<SearchedResult>
) => {
	const { router } = useGlobalPageContext();
	const sorts = useGoodsSorting();
	const { queryToArray } = useRouteQueryCast();

	const initializePage = parseInt(useRouteQuery('page', '1').value);

	const correctInfo = ref<KeywordCorrectInfo>({
		is_corrected: false,
		corrected_keyword: null,
		origin_keyword: null,
	});
	const relationKeywords = ref<RelatedKeywords>([]);
	const relatedBrand = ref<Nullable<SearchResultBrand>>(null);
	const bestGoods = ref<Goods[]>([]);

    /** `선택가능범위` 구조 정의 */
	const filterable = ref<GoodsFilterable>({
		categories: [],
		brands: [],
		price_ranges: [
			{
				min: 0,
				max: 50000,
			},
			{
				min: 50000,
				max: 100000,
			},
			{
				min: 100000,
				max: 500000,
			},
			{
				min: 500000,
				max: 1000000,
			},
			{
				min: 1000000,
				max: 0,
			},
		],
		review_rates: [
			{
				value: 5,
				label: '5.0',
			},
			{
				value: 4,
				label: '4.0',
			},
			{
				value: 3,
				label: '3.0',
			},
			{
				value: 2,
				label: '2.0',
			},
			{
				value: 1,
				label: '1.0',
			},
		],
		benefits: [
			{
				value: 'only_free_delivery',
				label: '무료배송',
				selected: false,
			},
			{
				value: 'only_sale',
				label: '할인상품',
				selected: false,
			},
			{
				value: 'except_soldout',
				label: '품절제외',
				selected: false,
			},
		],
		colors: [],
		fit_sizes: [],
		shoes_sizes: [],
	} as GoodsFilterable);

	/** 실제 데이터 조회시 사용할 파라미터 구조체 */
	const paramsForCommand = ref<GoodsFilterParamForCommand>({
		category_codes: queryToArray('category_codes', []),
		brand_ids: queryToArray('brand_ids', []),
		fit_sizes: queryToArray('fit_sizes', []),
		shoes_sizes: queryToArray('shoes_sizes', []),
		colors: queryToArray('colors', []),
		max_price: useRouteQuery('max_price', '').value,
		min_price: useRouteQuery('min_price', '').value,
		review_stars: useRouteQuery('review_stars', []).value,
		only_free_delivery: useRouteQuery('only_free_delivery', 'false').value,
		only_sale: useRouteQuery('only_sale', 'false').value,
		except_soldout: useRouteQuery('except_soldout', 'false').value,
		page: initializePage,
		page_size: 50,
		sorting: useRouteQuery('sorting', sorts[0].value).value,
		keyword: useRouteQuery('keyword', '').value,
		do_not_correct: false,
	});
	const totalCount = ref<number>(0);
	const goodsListByPage = ref<Nullable<Goods>[][]>([]);

	// 최초 설정시 이전 페이지 만큼 빈값 넣어준다 - 1부터 시작
	goodsListByPage.value = new Array(paramsForCommand.value.page + 1).fill([], 1)
		.map(() => new Array(paramsForCommand.value.page_size).fill(null));

	const loadList = async (page: number | number[]) => {
		try {
			const pages = Array.isArray(page) ? page.concat([]) : [page];
			const pagesNeedLoad = pages.filter(page => !(goodsListByPage.value[page] && goodsListByPage.value[page].some(item => item === null) === false));
			if (pagesNeedLoad.length < 1) return;

			await Promise.all(pagesNeedLoad.map(async page => {
				paramsForCommand.value.page = page;

				const searchResult = await fetchList(paramsForCommand.value);
				filterable.value.categories = searchResult.filters.categories;
				filterable.value.brands = searchResult.filters.brands;
				filterable.value.fit_sizes = searchResult.filters.fit_sizes;
				filterable.value.shoes_sizes = searchResult.filters.shoes_sizes;
				filterable.value.colors = searchResult.filters.colors;
				totalCount.value = searchResult.paginator.total;
				goodsListByPage.value[page] = searchResult.paginator.data;
				bestGoods.value = searchResult.best_goods;
				correctInfo.value = {
					corrected_keyword: searchResult.corrected_keyword,
					is_corrected: searchResult.is_corrected,
					origin_keyword: searchResult.origin_keyword,
				};
				relationKeywords.value = searchResult.related_keywords;
				relatedBrand.value = searchResult.brand;
			}));
		}
		catch (e) {
			//
		}
		finally {
			paramsForCommand.value.page = initializePage;
		}
	};

	return {
		filterable,
		paramsForCommand,
		totalCount,
		goodsListByPage,
		bestGoods,
		correctInfo,
		relationKeywords,
		relatedBrand,
		startContext: async () => {
			await Promise.all([
				loadList([paramsForCommand.value.page, paramsForCommand.value.page - 1].filter(page => page > 0)),
			]);
		},
		search: async (keyword: string, doNotCorrect = false) => {
			paramsForCommand.value.keyword = keyword;
			paramsForCommand.value.do_not_correct = doNotCorrect;
			goodsListByPage.value = [];
			// pending.value = true;
			try {
				await loadList(1);
			}
			catch (e) {
				//
			}
			finally {
				router.replace({
					query: {
						keyword: keyword,
					},
				});
			}
		},
	};
};