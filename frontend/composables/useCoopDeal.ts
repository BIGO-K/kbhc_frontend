import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBackend } from '$/composables/useBackend';
import { useRouteQueryCast } from '$/composables/useRouteQueryCast';

type CoopFilterParamForCommand = {
	page: number;
	page_size: number;
	is_end: boolean;
};

export const useCoopDeal = (isEnd: boolean = false) => {
	const router = useRouter();
	const { queryToNumber } = useRouteQueryCast();
	const loadingPages = ref<number[]>([]);
	const initPage = queryToNumber('page', 1);
	const pending = ref<boolean>(true);

	const paramsForCommand = ref<CoopFilterParamForCommand>({
		page: initPage,
		page_size: queryToNumber('page_size', 100),
		is_end: isEnd,
	});
	const goodsListByPage = ref<(CoopDeal | null)[][]>([]);

	const coopDealPaginator = ref<Paginator<CoopDeal>>({
		total: 0,
		per_page: 100,
		current_page: paramsForCommand.value.page,
		data: [],
	});

	const displayedItems = computed<(CoopDeal | null)[]>(() => {
		return goodsListByPage.value.flatMap((itemsInPage) => {
			return itemsInPage;
		});
	});
	/**
	 * 공구상품 리스트 조회
	 * @param option
	*/
	const getCoopDealList = async (option: CoopFilterParamForCommand): Promise<void> => {
		const { paginator } = await useBackend().command<{
			paginator: Paginator<CoopDeal>;
		}>('v1/exhibit/joint-purchases', {
			params: {
				page: option.page,
				page_size: option.page_size,
				is_end: option.is_end,
			},
		});
		goodsListByPage.value[option.page] = paginator.data;
		coopDealPaginator.value = paginator;
	};

	const loadList = async (page: number | number[]) => {
		try {
			const pages = Array.isArray(page) ? page.concat([]) : [page];
			const pagesNeedLoad = pages.filter(page => {
				if (
					loadingPages.value.some(lp => lp === page)
					|| (goodsListByPage.value[page] && goodsListByPage.value[page].some(item => item === null) === false)
				) {
					return false;
				}

				return true;
			});

			if (pagesNeedLoad.length < 1) {
				return;
			}
			pending.value = true;
			loadingPages.value = loadingPages.value.concat(pagesNeedLoad);

			await Promise.all(pagesNeedLoad.map(async page => {
				paramsForCommand.value.page = page;
				await getCoopDealList(paramsForCommand.value);
				// goodsListByPage.value[page] = paginator.data;
			}));
		}
		finally {
			router.replace({
				query: {
					...router.currentRoute.value.query,
					page: paramsForCommand.value.page,
					page_size: paramsForCommand.value.page_size,
				},
			});
			pending.value = false;
		}
	};

	const startContext = async () => {
		await Promise.all([
			loadList([paramsForCommand.value.page - 1, paramsForCommand.value.page].filter(page => page > 0)),
		]);
	};

	/** 페이지를 반영 */
	const applyPage = (page: number) => {
		pending.value = true;
		coopDealPaginator.value.current_page = page;
		paramsForCommand.value.page = page;
		loadList(page);
	};


	return {
		getCoopDealList,
		initPage,
		coopDealPaginator,
		startContext,
		pending,
		displayedItems,
		applyPage,
	};
};