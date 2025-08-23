import { useBackend } from '$/composables/useBackend';

// XXX 사용 안함?
export const useCategoryShop = () => {
	// const filters = async () => {
	// 	const { filters: filterableResource } = await useBackend().command<{
	// 		filters: CategoryShopGoodsFilterable;
	// 	}>(
	// 		'v1/goods/filters-of-common',
	// 		{
	// 			params: {
	// 				category_code: categoryCode,
	// 			},
	// 		}
	// 	);

	// 	return filterableResource;
	// };

	// const getList = async () => {
	// 	const { paginator: { data } } = await useBackend().command<{
	// 		paginator: SimplePaginator<Goods>;
	// 	}>(
	// 		'v1/goods/common',
	// 		{
	// 			params: {
	// 				...paramsForCommand,
	// 				category_code: categoryCode,
	// 			},
	// 		}
	// 	);

	// 	return data;
	// };

	return {
		// getTotalCountGoods: async () => {
		// 	const { total_count } = await useBackend().command<{
		// 		total_count: number;
		// 	}>(
		// 		'v1/goods/total-count-of-common',
		// 		{
		// 			params: {
		// 				...paramsForCommand,
		// 				category_code: categoryCode,
		// 			},
		// 		}
		// 	);

		// 	return total_count;
		// },
	};
};