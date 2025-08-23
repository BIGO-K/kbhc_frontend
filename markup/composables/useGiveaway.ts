import { useBackend } from '$/composables/useBackend';

export const useGiveaway = () => {
	return {
		getDetail: async (id: number) => {
			return Object.assign({
				id: id,
			}, await useBackend().command<Omit<Giveaway, 'id'>>(`v1/shopping/giveaways/${id}`));
		},
		getTargetGoodsPaginator: async (id: number, page: number, perPage: number) => {
			const paginator = await useBackend().command<GiveawayTargetGoodsPaginator>(`v1/shopping/giveaways/${id}/on-goods`, {
				params: {
					page: page,
					page_size: perPage,
				},
			});

			return paginator;
		},
	};
};