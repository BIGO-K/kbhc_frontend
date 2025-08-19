import { ref, computed, watch, reactive } from 'vue';
import { LocationQueryRaw } from 'vue-router';
import { useRouteQuery } from '@vueuse/router';
import { defined } from '$/utils/array';
import { useFormatter } from '$/composables/useFormatter';
import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
import { useGoodsSorting } from '$/composables/useGoodsSorting';

export const useFilterableGoodsList = (
	fetchFilterable: () => Promise<GoodsFilterable>,
	fetchCount: (paramForCommand: GoodsFilterParamForCommand) => Promise<number>,
	fetchList: (paramForCommand: GoodsFilterParamForCommand) => Promise<Goods[]>
) => {
	const { router } = useGlobalPageContext();
	const sorts = useGoodsSorting();

	const defaultSort = sorts[0];

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
	});

    /** 구성요소(데이터/상태) 선언 */
	const paginator = ref<Paginator<Goods>>({
		current_page: 1,
		// per_page: 100,
		per_page: 30,
		total: 0,
		data: [],
	});
	const goodsList = ref<Goods[]>([]);
	const sorting = ref(defaultSort);
	const pending = ref(true);
	const goodsListByPage = ref<Nullable<Goods>[][]>([]);
	const loadingPages = ref<number[]>([]);

	/** 구성요소(호출자) 선언 */
	const loadCount = async () => {
		paginator.value.total = await fetchCount(paramsForCommand.value);
	};
	const loadList = async (page: number | number[]) => {
		try {
			const pages = Array.isArray(page) ? page.concat([]) : [page];
			const pagesNeedLoad = pages.filter(page => !(
				loadingPages.value.some(lp => lp === page)
				|| (goodsListByPage.value[page] && goodsListByPage.value[page].some(item => item === null) === false)
			));
			if (pagesNeedLoad.length < 1) return;

			pending.value = true;
			loadingPages.value = loadingPages.value.concat(pagesNeedLoad);

			await Promise.all(pagesNeedLoad.map(async page => {
				paramsForCommand.value.page = page;
				goodsListByPage.value[page] = await fetchList(paramsForCommand.value);
			}));
		}
		finally {
			// goodsList.value = list;
			router.replace({
				query: {
					...router.currentRoute.value.query,
					...Object.fromEntries(Object.entries(paramsForCommand.value).map(_entry => {
						if (typeof _entry[1] === 'boolean') _entry[1] = _entry[1].toString();

						return _entry;
					})) as LocationQueryRaw,
				},
			});
			pending.value = false;
		}

		// fetchList(paramsForCommand.value)
		// 	.then(list => {
		// 		goodsList.value = list;
		// 		router.replace({
		// 			query: {
		// 				...router.currentRoute.value.query,
		// 				...paramsForCommand.value
		// 			}
		// 		});
		// 		// navigateTo({
		// 		// 	query: {
		// 		// 		...useRoute().query,
		// 		// 		...paramsForCommand.value
		// 		// 	}
		// 		// }, {
		// 		// 	replace: true,
		// 		// });
		// 	})
		// 	.finally(() => {
		// 		pending.value = false;
		// 	});
	};

	/** 변화감지 */
	watch(sorting, (newSorting) => {
		paramsForCommand.value.sorting = newSorting.value;
		paramsForCommand.value.page = 1;
		paginator.value.current_page = 1;
		loadList(paramsForCommand.value.page);
	});

	/** `선택상태` 정의 -> 사용자의 필터 선택요소를 처리 */
	const selected = reactive<GoodsFilterSelected>({
		categories: [],
		brands: [],
		price_ranges: [],
		review_rates: [],
		benefits: [],
		colors: [],
		fit_sizes: [],
		shoes_sizes: [],
	});

    /** 선택상태 - 카테고리 유틸성 */
	const isChildrenCategoryAllSelected = (parentCategory: CategoryForFilter) => {
		const childrenCodes = parentCategory.child_categories.map(c => c.code);

		return childrenCodes.every(childCode => selected.categories.some(c => c.code === childCode));
	};

    /** 선택상태 - 가격범위 유틸성 */
	const { number } = useFormatter();
	const textPriceRange = (priceRange: PriceRangeForFilter) => {
		const fromText = priceRange.min % 10000 === 0 ? `${priceRange.min / 10000}만원 ` : `${number(priceRange.min)}원 `;
		const toText = priceRange.max % 10000 === 0 ? ` ${priceRange.max / 10000}만원` : ` ${number(priceRange.max)}원`;

		return `${priceRange.min === 0 ? '' : fromText}~${priceRange.max === 0 ? '' : toText}`;
	};

    /** 선택상태에 따른 태그 처리 */
	const selectedTags = computed(() => {
		let tags: SelectedTag[] = [];

        // 카테고리 처리
		if (filterable.value.categories?.length) {
			const flatCategory2 = filterable.value.categories.flatMap(c1 => c1.child_categories);
			const selectedCategoryCodes = selected.categories.map(c3 => c3.code);
			const category2HasSelectedChild = flatCategory2.filter(c2 => c2.child_categories.some(c3 => selectedCategoryCodes.includes(c3.code)));
			const categoryHasSelectedChild2Codes = category2HasSelectedChild.map(c2 => c2.code);
			const category1HasSelectedChild = filterable.value.categories.filter(c1 => c1.child_categories.some(c2 => categoryHasSelectedChild2Codes.includes(c2.code)));

			for (const c1 of category1HasSelectedChild) {
				for (const c2 of c1.child_categories) {
					if (!categoryHasSelectedChild2Codes.includes(c2.code)) return;

					if (isChildrenCategoryAllSelected(c2)) {
						const childCodes = c2.child_categories.map(c3 => c3.code);
						tags.push({
							remove: () => {
								selected.categories = selected.categories.filter(c => !childCodes.includes(c.code));
							},
							label: `${c2.full_label} > 전체`,
						});

						return;
					}

					for (const c3 of c2.child_categories) {
						if (!selectedCategoryCodes.includes(c3.code)) return;

						tags.push({
							remove: () => {
								selected.categories = selected.categories.filter(c => c.code !== c3.code);
							},
							label: c3.full_label,
						});
					}
				}
			}
		}

		tags = tags.concat(
			selected.brands.map(b => ({
				remove: () => {
					selected.brands = selected.brands.filter(l => l.id !== b.id);
				},
				label: b.name,
			}))
		);

		tags = tags.concat(
			selected.price_ranges.map(p => ({
				remove: () => {
					selected.price_ranges = selected.price_ranges.filter(l => l.min !== p.min && l.max !== p.max);
				},
				label: textPriceRange(p),
			}))
		);

		tags = tags.concat(
			selected.review_rates.map(r => ({
				code: 'review_rate',
				remove: () => {
					selected.review_rates = selected.review_rates.filter(l => l.value !== r.value);
				},
				label: r.label,
			}))
		);

		tags = tags.concat(
			selected.benefits.map(b => ({
				remove: () => {
					selected.benefits = selected.benefits.filter(l => l.value !== b.value);
				},
				label: b.label,
			}))
		);

		tags = tags.concat(
			selected.colors.map(c => ({
				remove: () => {
					selected.colors = selected.colors.filter(l => l.id !== c.id);
				},
				label: c.label,
			}))
		);

		tags = tags.concat(
			selected.fit_sizes.map(f => ({
				remove: () => {
					selected.fit_sizes = selected.fit_sizes.filter(l => l.id !== f.id);
				},
				label: f.label,
			}))
		);

		tags = tags.concat(
			selected.shoes_sizes.map(s => ({
				remove: () => {
					selected.shoes_sizes = selected.shoes_sizes.filter(l => l.id !== s.id);
				},
				label: s.label,
			}))
		);

		return tags;
	});

    /** 실제 데이터 조회시 사용할 파라미터 구조체 */
	const paramsForCommand = ref<GoodsFilterParamForCommand>({
		category_codes: useRouteQuery('category_codes', []).value,
		brand_ids: useRouteQuery('brand_ids', []).value,
		fit_sizes: useRouteQuery('fit_sizes', []).value,
		shoes_sizes: useRouteQuery('shoes_sizes', []).value,
		colors: useRouteQuery('colors', []).value,
		max_price: useRouteQuery('max_price', '').value,
		min_price: useRouteQuery('min_price', '').value,
		review_stars: useRouteQuery('review_stars', []).value,
		only_free_delivery: useRouteQuery('only_free_delivery', 'false').value,
		only_sale: useRouteQuery('only_sale', 'false').value,
		except_soldout: useRouteQuery('except_soldout', 'false').value,
		page: parseInt(useRouteQuery('page', '1').value),
		page_size: paginator.value.per_page,
		sorting: useRouteQuery('sorting', sorting.value.value).value,
	});

    /**
     * `선택가능범위(filterable) 처리`
     * -> 간접제공되는 `선택상태`는 선택가능범위에 영향을 받을 수 있는 구조
     *    ex) 쿼리의 brand_ids를 브랜드명을 포함한 brand 객체로 변환 필요 등
     */
	const flatCategories = ref<CategoryForFilter[]>([]);
	filterable.value.categories?.forEach(c1 => {
		c1.child_categories.forEach(c2 => {
			flatCategories.value = flatCategories.value.concat(c2.child_categories);
		});
	});
	selected.categories = paramsForCommand.value.category_codes
		.map(categoryCode => flatCategories.value.find(category => category.code === categoryCode))
		.filter(defined);

	selected.brands = paramsForCommand.value.brand_ids
		.map(brandId => filterable.value.brands?.find(brand => brand.id.toString() === brandId))
		.filter(defined);

	selected.fit_sizes = paramsForCommand.value.fit_sizes
		.map(fitSizeId => filterable.value.fit_sizes?.find(fitSize => fitSize.id.toString() === fitSizeId))
		.filter(defined);

	selected.shoes_sizes = paramsForCommand.value.shoes_sizes
		.map(shoesSizeId => filterable.value.shoes_sizes?.find(shoesSize => shoesSize.id.toString() === shoesSizeId))
		.filter(defined);

	selected.colors = paramsForCommand.value.colors
		.map(colorId => filterable.value.colors?.find(color => color.id.toString() === colorId))
		.filter(defined);

	if (paramsForCommand.value.min_price || paramsForCommand.value.max_price) {
		selected.price_ranges = [{
			min: paramsForCommand.value.min_price ? parseInt(paramsForCommand.value.min_price) : 0,
			max: paramsForCommand.value.max_price ? parseInt(paramsForCommand.value.max_price) : 0,
		}];
	}

	selected.review_rates = paramsForCommand.value.review_stars
		.map(reviewStar => filterable.value.review_rates?.find(reviewRate => reviewRate.value.toString() === reviewStar))
		.filter(defined);

	selected.benefits = filterable.value.benefits?.filter(benefit => (
		paramsForCommand.value.only_free_delivery === 'true' && benefit.value === 'only_free_delivery'
            || paramsForCommand.value.only_sale === 'true' && benefit.value === 'only_sale'
            || paramsForCommand.value.except_soldout === 'true' && benefit.value === 'except_soldout'
	)) || [];

	paginator.value.current_page = paramsForCommand.value.page;
	sorting.value = sorts.find(s => s.value === paramsForCommand.value.sorting) || defaultSort;

    /** `선택상태`를 데이터 조회에 사용할 파라미터로 적용 */
	const setSelectedToParamsForCommand = () => {
		paramsForCommand.value.category_codes = selected.categories.map(c => c.code);
		paramsForCommand.value.brand_ids = selected.brands.map(b => b.id.toString());
		paramsForCommand.value.fit_sizes = selected.fit_sizes.map(f => f.id.toString());
		paramsForCommand.value.shoes_sizes = selected.shoes_sizes.map(s => s.id.toString());
		paramsForCommand.value.colors = selected.colors.map(c => c.id.toString());
		if (selected.price_ranges.length > 0) {
			paramsForCommand.value.min_price = selected.price_ranges[0].min.toString();
			paramsForCommand.value.max_price = selected.price_ranges[0].max.toString();
		}
		else {
			paramsForCommand.value.min_price = '';
			paramsForCommand.value.max_price = '';
		}
		paramsForCommand.value.review_stars = selected.review_rates.map(r => r.value.toString());
		paramsForCommand.value.only_free_delivery = selected.benefits.some(b => b.value == 'only_free_delivery') ? 'true' : 'false';
		paramsForCommand.value.only_sale = selected.benefits.some(b => b.value == 'only_sale') ? 'true' : 'false';
		paramsForCommand.value.except_soldout = selected.benefits.some(b => b.value == 'except_soldout') ? 'true' : 'false';
	};

	/** 카운트, 목록 조회 */
	if (paginator.value.current_page > 1) {
		for (let page = 1; page <= paginator.value.current_page; page++) {
			goodsListByPage.value[page] = [];
			for (let itemIndex = 0; itemIndex < paginator.value.per_page; itemIndex++) {
				goodsListByPage.value[page][itemIndex] = null;
			}
		}
	}

	return {
		filterable,
		goodsList,
		paginator,
		pending,
		sorts,
		sorting,
		selected,
		selectedTags,
		goodsListByPage,
		textPriceRange,
		isChildrenCategoryAllSelected,
		/** `선택상태` 초기화 */
		resetSelected: () => {
			selected.categories = [];
			selected.brands = [];
			selected.price_ranges = [];
			selected.review_rates = [];
			selected.benefits = [];
			selected.colors = [];
			selected.fit_sizes = [];
			selected.shoes_sizes = [];
		},
		/** `선택상태`를 컨텍스트에 반영 */
		applySelected: () => {
			// selected -> paramsForCommand
			paramsForCommand.value.page = 1;
			paginator.value.current_page = 1;
			setSelectedToParamsForCommand();

			loadList(paramsForCommand.value.page);
			loadCount();
		},
		/** 페이지 반영 */
		applyPage: (page: number) => {
			paginator.value.current_page = page;
			paramsForCommand.value.page = page;
			loadList(page);
		},
		toggleChildrenCategory: (parentCategory?: CategoryForFilter) => {
			if (!parentCategory) return;

			const childrenCodes = parentCategory.child_categories.map(c => c.code);
			const filterdCategories = selected.categories.filter(selectedCategory => !childrenCodes.includes(selectedCategory.code));

			selected.categories = isChildrenCategoryAllSelected(parentCategory)
				? filterdCategories
				: filterdCategories.concat(parentCategory.child_categories);
		},
		/** use 호출시점 최초 활성화 함수 */
		startContext: async () => {
			const filterableResource = await fetchFilterable();

			// 서버에서 제공받는 필터 컨텍스트 처리
			filterable.value.categories = filterableResource.categories;
			filterable.value.brands = filterableResource.brands;
			filterable.value.fit_sizes = filterableResource.fit_sizes;
			filterable.value.shoes_sizes = filterableResource.shoes_sizes;
			filterable.value.colors = filterableResource.colors;

			await Promise.all([
				loadCount(),
				loadList([
					paginator.value.current_page - 1,
					paginator.value.current_page,
				].filter(page => page > 0)),
			]);
		},
	};
};