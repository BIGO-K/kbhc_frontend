import { ref } from 'vue';
import { usePageContextStore } from '$/stores/usePageContextStore';
import { useWishedStore } from '$/stores/useWishedStore';
import { useBackend } from '$/composables/useBackend';
import { useErrorAlert } from '$/composables/useErrorAlert';

export const useCategoryShop = (initCategoryCode: string) => {
	const categoryCode = ref<string>(initCategoryCode);
	const pageContextStore = usePageContextStore();
	const { check } = useWishedStore();

	const getInfo = async (categoryCode: string, isFirstAccess: boolean = false) => {
		try {
			await useBackend().command<CategoryInformation>(`v1/goods/category-information-of-common`, {
				params: {
					category_code: categoryCode,
				},
			});
		}
		catch (e) {
			useErrorAlert(e, {
				alertCallback: () => {
					if (!isFirstAccess) return;
					pageContextStore.clearErrorWithHistoryBack();
				},
			});
			throw (e);
		}
	};

	return {
		getInfo,
		fetchFilterable: async () => {
			const { filters: filterableResource } = await useBackend().command<{
				filters: CategoryShopGoodsFilterable;
			}>(`v1/goods/filters-of-common`, {
				params: {
					category_code: categoryCode.value,
				},
			});

			return filterableResource;
		},
		fetchCount: async (paramsForCommand: GoodsFilterParamForCommand) => {
			const { total_count } = await useBackend().command<{
				total_count: number;
			}>(
				'v1/goods/total-count-of-common',
				{
					params: {
						...paramsForCommand,
						category_code: categoryCode.value,
					},
				}
			);

			return total_count;
		},
		fetchList: async (paramsForCommand: GoodsFilterParamForCommand) => {
			const { paginator: { data } } = await useBackend().command<{
				paginator: SimplePaginator<Goods>;
			}>(
				`v1/goods/common`,
				{
					params: {
						...paramsForCommand,
						category_code: categoryCode.value,
					},
				}
			);

			const goodsIds = data.flatMap(goods => goods.id);
			check(goodsIds);

			return data;
		},
		changeCategoryCode: (newCategoryCode: string) => {
			categoryCode.value = newCategoryCode;
		},
	};
};