import { reactive, ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRouteQuery } from '@vueuse/router';
import { useBackend } from '$/composables/useBackend';
import { useGoodsSorting } from '$/composables/useGoodsSorting';
import { useRouteQueryCast } from '$/composables/useRouteQueryCast';
import { COOP_DEAL_STATUSES } from '$/constants/index';

type CoopFilterParamForCommand = {
	page: number;
	page_size: number;
	sorting: GoodsSort;
};

export const useCoopDealShop = (dealStatus: CoopDealStatus) => {
	const { queryToNumber } = useRouteQueryCast();
	const goodsSorts = useGoodsSorting();
	const router = useRouter();

	/** 기본 소팅 정보 설정 */
	const defaultSorting = dealStatus === COOP_DEAL_STATUSES.upcoming
		? goodsSorts.find(sort => sort.value === 'recent')?.value
		: goodsSorts[0].value;
	const initPage = queryToNumber('page', 1);

	const paramsForCommand = reactive<CoopFilterParamForCommand>({
		page: initPage,
		page_size: queryToNumber('page_size', 100),
		sorting: useRouteQuery('sorting', defaultSorting).value as GoodsSort,
	});
	const banners = ref<Banner[]>([]);
	const loadingPages = ref<number[]>([]);
	const coopDealPaginator = ref<Paginator<CoopDeal>>({
		total: 0,
		per_page: 100,
		current_page: paramsForCommand.page,
		data: [],
	});
	const goodsListByPage = ref<Nullable<CoopDeal>[][]>([]);
	const pending = ref<boolean>(false);
	const displayedItems = computed<Nullable<CoopDeal>[]>(() => goodsListByPage.value.flat());

	// 최초 설정시 이전 페이지 만큼 빈값 넣어준다 - 1부터 시작
	goodsListByPage.value = new Array(paramsForCommand.page + 1).fill([], 1)
		.map(() => new Array(paramsForCommand.page_size).fill(null));

	/**
	 * 공구관 정보 조회: 배너 리스트 및 총 상품 갯수
	 * @param status
	 * @returns
	 */
	const getShopInfo = async () => {
		const { banners: pBanners, total_goods_count } = await useBackend().command<{
			banners: Banner[];
			total_goods_count: number;
		}>('/v1/exhibit/influencer-marketing', { // TODO influencer backend 경로 확인
			params: {
				status: dealStatus,
			},
		});

		coopDealPaginator.value.total = total_goods_count;
		banners.value = pBanners;
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
				paramsForCommand.page = page;
				const paginator = await fetch(paramsForCommand);
				goodsListByPage.value[page] = paginator.data;
			}));
		}
		finally {
			router.replace({
				query: {
					...router.currentRoute.value.query,
					...paramsForCommand,
				},
			});
			pending.value = false;
		}
	};

	const fetch = async (param: CoopFilterParamForCommand) => {
		const { paginator } = await useBackend().command<{
			paginator: SimplePaginator<CoopDeal>;
		}>('/v1/exhibit/influencer-marketing/goods', { // TODO influencer backend 경로 확인
			params: {
				status: dealStatus,
				sorting: param.sorting,
				page: param.page,
				page_size: param.page_size,
			},
		});

		return paginator;
	};

	watch(() => paramsForCommand.sorting, async () => {
		paramsForCommand.page = 1;
		loadingPages.value = [];
		await loadList(1);
	});

	return {
		goodsSorts,
		coopDealPaginator,
		paramsForCommand,
		pending,
		banners,
		goodsListByPage,
		displayedItems,
		initPage,
		startContext: async () => {
			await Promise.all([
				getShopInfo(),
				loadList([paramsForCommand.page - 1, paramsForCommand.page].filter(page => page > 0)),
			]);
		},
		fetch,
		/** 페이지 반영 */
		applyPage: (page: number) => {
			pending.value = true;
			coopDealPaginator.value.current_page = page;
			paramsForCommand.page = page;

			loadList(page);
		},
	};
};