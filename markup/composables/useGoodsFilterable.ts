import { ref, reactive, computed, watch } from 'vue';
import * as Hangul from 'hangul-js';
import { defined } from '$/utils/array';
import { useFormatter } from '$/composables/useFormatter';

type BrandFilterCharGroup = string & '전체' | 'ㄱ' | 'ㄴ' | 'ㄷ' | 'ㄹ' | 'ㅁ' | 'ㅂ' | 'ㅅ' | 'ㅇ' | 'ㅈ' | 'ㅊ' | 'ㅋ' | 'ㅌ' | 'ㅍ' | 'ㅎ' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' | 'ABC' | '123';

const brandFilterCharGroups = {
	pc: [
		'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
		'123',
		'전체',
	] as BrandFilterCharGroup[],
	mobile: [
		'전체',
		'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
		'ABC',
		'123',
	] as BrandFilterCharGroup[],
};

export const useGoodsFilterable = (filterable: GoodsFilterable, initParamsForCommand: GoodsFilterParamForCommand) => {
	const { number } = useFormatter();

	const paramsForCommand = ref<GoodsFilterParamForCommand>(initParamsForCommand);

	/** 카테고리 */
	const activeCategory1 = ref<CategoryForFilter>();
	const activeCategory2 = ref<CategoryForFilter>();
	const selectableCategoriesDepth1 = computed(() => filterable.categories || []);

	/** 브랜드 */
	const brandCharGroup = ref<Nullable<BrandFilterCharGroup>>('전체');
	const brandKeyword = ref('');
	const selectableBrands = computed(() => {
		const brands = filterable.brands ?? [];

		if (brandCharGroup.value) {
			if (brandCharGroup.value === '전체') return brands;
			else if (brandCharGroup.value.match('[ㄱ-ㅎ]')) return brands.filter(b => brandCharGroup.value === Hangul.d(b.name)[0]);
			else {
				const regex = brandCharGroup.value === 'ABC'
					? '[a-zA-Z]'
					: brandCharGroup.value === '123'
						? '[^a-zA-Zㄱ-ㅎ가-힣]'
						: brandCharGroup.value;// [A-Z]

				return brands.filter(b => b.name.match(new RegExp(regex)));
			}
		}

		if (brandKeyword.value) {
			const searcher = new Hangul.Searcher(brandKeyword.value);

			return brands.filter(b => b.name.replace(/\s/g, '').toLowerCase().match(new RegExp(brandKeyword.value.toLowerCase()))
				|| searcher.search(b.name) !== -1);
		}

		return brands;
	});

	watch(brandKeyword, (n) => {
		if (n) {
			brandCharGroup.value = null;
		}
		else {
			brandCharGroup.value = '전체';
		}
	});

	/** 가격범위 */
	const selectablePriceRanges = computed(() => filterable.price_ranges || []);
    /** 별점 */
	const selectableReviewRates = computed(() => filterable.review_rates || []);
	/** 혜택 */
	const selectableBenefits = computed(() => filterable.benefits || []);
    /** 색상 */
	const selectableColors = computed(() => filterable.colors || []);
    /** FIT */
	const selectableFitSizes = computed(() => filterable.fit_sizes || []);
    /** 신발 사이즈 */
	const selectableShoesSizes = computed(() => filterable.shoes_sizes || []);

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

	const howManyCount = (parentCategory: CategoryForFilter) => {
		const childrenCodes = parentCategory.child_categories.map(c => c.code);

		return childrenCodes.reduce((acc, cur) => {
			return acc + (selectedCategoryCodes2.value.includes(cur) ? 1 : 0);
		}, 0);
	};

    /**
     *
     * `선택가능범위(filterable) 처리`
     * -> 간접제공되는 `선택상태`는 선택가능범위에 영향을 받을 수 있는 구조
     *    ex) 쿼리의 brand_ids를 브랜드명을 포함한 brand 객체로 변환 필요 등
     */
	const flatCategories = ref<CategoryForFilter[]>([]);
	filterable.categories?.forEach(c1 => {
		c1.child_categories.forEach(c2 => {
			flatCategories.value = flatCategories.value.concat(c2.child_categories);
		});
	});
	selected.categories = paramsForCommand.value.category_codes
		.map(categoryCode => flatCategories.value.find(category => category.code === categoryCode))
		.filter(defined);

	selected.brands = paramsForCommand.value.brand_ids
		.map(brandId => filterable.brands?.find(brand => brand.id.toString() === brandId))
		.filter(defined);

	selected.fit_sizes = paramsForCommand.value.fit_sizes
		.map(fitSizeId => filterable.fit_sizes?.find(fitSize => fitSize.id.toString() === fitSizeId))
		.filter(defined);

	selected.shoes_sizes = paramsForCommand.value.shoes_sizes
		.map(shoesSizeId => filterable.shoes_sizes?.find(shoesSize => shoesSize.id.toString() === shoesSizeId))
		.filter(defined);

	selected.colors = paramsForCommand.value.colors
		.map(colorId => filterable.colors?.find(color => color.id.toString() === colorId))
		.filter(defined);

	if (paramsForCommand.value.min_price || paramsForCommand.value.max_price) {
		selected.price_ranges = [{
			min: paramsForCommand.value.min_price ? parseInt(paramsForCommand.value.min_price) : 0,
			max: paramsForCommand.value.max_price ? parseInt(paramsForCommand.value.max_price) : 0,
		}];
	}

	selected.review_rates = paramsForCommand.value.review_stars
		.map(reviewStar => filterable.review_rates?.find(reviewRate => reviewRate.value.toString() === reviewStar))
		.filter(defined);

	selected.benefits = filterable.benefits?.filter(benefit => (
		paramsForCommand.value.only_free_delivery === 'true' && benefit.value === 'only_free_delivery'
            || paramsForCommand.value.only_sale === 'true' && benefit.value === 'only_sale'
            || paramsForCommand.value.except_soldout === 'true' && benefit.value === 'except_soldout'
	)) || [];

	const selectedCategoryCodes2 = computed(() => selected.categories.map(c3 => c3.code));
	const selectedCategoriesCount = computed(() => {
		return filterable.categories?.reduce(
			(acc, depth1) => {
				acc[depth1.code] = {
					// cur
					isDepth2All: depth1.child_categories.map(child => isChildrenCategoryAllSelected(child)).find(r => !r) === undefined ? true : false,
					depth3SelectedCount: depth1.child_categories.reduce((acc, depth2) => {
						return acc + (isChildrenCategoryAllSelected(depth2) ? depth2.child_categories.length : howManyCount(depth2));
					}, 0),
				};

				return acc;
			},
			{} as Record<string, { isDepth2All: boolean; depth3SelectedCount: number }>
		);
	});

	return {
		activeCategory1,
		activeCategory2,
		brandKeyword,
		selectableCategoriesDepth1,
		selectablePriceRanges,
		selectableReviewRates,
		selectableBenefits,
		selectableColors,
		selectableFitSizes,
		selectableShoesSizes,
		selected,
		brandCharGroup,
		brandFilterCharGroups,
		selectableBrands,
		selectedCategoriesCount,
		/** 선택상태 - 카테고리 유틸성 */
		isChildrenCategoryAllSelected,
		toggleChildrenCategory: (parentCategory?: CategoryForFilter) => {
			if (!parentCategory) return;

			const childrenCodes = parentCategory.child_categories.map(c => c.code);
			const filteredCategories = selected.categories.filter(selectedCategory => !childrenCodes.includes(selectedCategory.code));

			selected.categories = isChildrenCategoryAllSelected(parentCategory)
				? filteredCategories
				: filteredCategories.concat(parentCategory.child_categories);
		},
		/** 선택상태 - 가격범위 유틸성 */
		textPriceRange: (priceRange: PriceRangeForFilter) => {
			const fromText = priceRange.min % 10000 === 0 ? `${priceRange.min / 10000}만원 ` : `${number(priceRange.min)}원 `;
			const toText = priceRange.max % 10000 === 0 ? ` ${priceRange.max / 10000}만원` : ` ${number(priceRange.max)}원`;

			return `${priceRange.min === 0 ? '' : fromText}~${priceRange.max === 0 ? '' : toText}`;
		},
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
	};
};