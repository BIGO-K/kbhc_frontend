import { useBackend } from '$/composables/useBackend';

export const useSellerShop = (sellerId: number) => {
	return {
		getBestAndNewGoods: async () => {
			return await useBackend().command<{ best_goods: Goods[]; new_goods: Goods[] }>(
				`v1/seller-shops/${sellerId}/curation`
			);
		},
		getSellerName: async () => {
			return await useBackend().command<{ name: string }>(
				`v1/seller-shops/${sellerId}`
			);
		},
		fetchFilterable: async () => {
			const { filters } = await useBackend().command<{
				filters: SellerShopGoodsFilterable;
			}>(`v1/seller-shops/${sellerId}/filters-of-goods`);

			return filters;
		},
		fetchList: async (paramsForCommand: GoodsFilterParamForCommand) => {
			const { paginator: { data } } = await useBackend().command<{
				paginator: SimplePaginator<Goods>;
			}>(
				`v1/seller-shops/${sellerId}/goods`,
				{
					params: {
						...paramsForCommand,
					},
				}
			);

			return data;
		},
		fetchCount: async (paramsForCommand: GoodsFilterParamForCommand) => {
			const { total_count } = await useBackend().command<{
				total_count: number;
			}>(
				`v1/seller-shops/${sellerId}/total-count-of-goods`,
				{
					params: {
						...paramsForCommand,
					},
				}
			);

			return total_count;
		},
	};
};