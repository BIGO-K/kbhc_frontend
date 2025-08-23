import { useBackend } from '$/composables/useBackend';

export const useSearchEngine = () => {
	return {
		getAutoComplete: async (keyword: string): Promise<AutoCompleteKeyword> => {
			const { auto_completed } = await useBackend().command<{ auto_completed: AutoCompleteKeyword }>(
				'v1/search-engine/auto-complete', {
					params: {
						keyword: keyword,
					},
				});

			return auto_completed;
		},
		fetchList: async (paramsForCommand: GoodsFilterParamForCommand): Promise<SearchedResult> => {
			const searchResult = await useBackend().command<SearchedResult>(
				`/v1/search-engine/search`,
				{
					params: {
						...paramsForCommand,
					},
				}
			);

			// const goodsIds = data.flatMap(goods => goods.id);
			// check(goodsIds);
			return searchResult;
		},
	};
};