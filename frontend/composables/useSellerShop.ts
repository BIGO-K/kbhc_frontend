import { useWishedStore } from '$/stores/useWishedStore';
import { useBackend } from '$/composables/useBackend';

export const useSellerShop = (sellerId: number) => {
	const { check } = useWishedStore();

	return {
		getBestAndNewGoods: async () => {
			const returnData = await useBackend().command<{ best_goods: Goods[]; new_goods: Goods[] }>(
				`v1/seller-shops/${sellerId}/curation`
			);

			const goodsIds = Object.values(returnData).flat().map(_entry => _entry.id);
			check(goodsIds);

			return returnData;
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

			const goodsIds = data.flatMap(goods => goods.id);
			check(goodsIds);

			return data;
		},
	};
};