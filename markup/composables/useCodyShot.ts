import { useBackend } from '$/composables/useBackend';

export const useCodyShot = () => {
	return {
		/** 카테고리 조회 */
		getCategories: async () => {
			const { cody_shot_categories } = await useBackend().command<{
				cody_shot_categories: {
					id: number;
					name: string;
				}[];
			}>('v1/exhibit/codishots/categories');

			return cody_shot_categories;
		},
		/** 신규등록 리스트 조회(최대 10개) */
		getRecents: async () => {
			const { recent_cody_shots } = await useBackend().command<{
				recent_cody_shots: CodyShot[];
			}>('v1/exhibit/codishots/recents');

			return recent_cody_shots;
		},
		/** 페이지네이터 조회 */
		getPaginator: async (categoryId: Nullable<number>, page: number = 1, pageSize: number = 20) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<CodyShot>;
			}>('v1/exhibit/codishots', {
				params: {
					category_id: categoryId || '',
					page: page,
					page_size: pageSize,
				},
			});

			return paginator;
		},
		/** 상세 조회 */
		getDetail: async (id: number) => {
			const { cody_shot } = await useBackend().command<{
				cody_shot: CodyShotDetail;
			}>(`v1/exhibit/codishots/${id}`);

			return cody_shot;
		},
	};
};