import { useBackend } from '$/composables/useBackend';

export const useShowcase = () => {
	return {
		/** [쇼케이스] 카테고리 리스트 */
		getCategories: async () => {
			const { sort_list } = await useBackend().command<{
				sort_list: ShowcaseCategory[];
			}>('v1/exhibit/showcases/categories');

			return sort_list;
		},
		/** [쇼케이스] 페이지네이터 조회 */
		getPaginator: async (categoryId: number, page: number = 1, pageSize: number = 12) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<Showcase>;
			}>('v1/exhibit/showcases', {
				params: {
					sort_id: categoryId || '',
					page,
					page_size: pageSize,
				},
			});

			return paginator;
		},
		/** [쇼케이스] 상세 */
		getDetail: async (id: number) => {
			const { showcase_information } = await useBackend().command<{
				showcase_information: ShowcaseDetail;
			}>(`v1/exhibit/showcases/${id}`);

			return showcase_information;
		},
		/**
		 * [쇼케이스] 다른 쇼케이스 리스트 조회
		 * 각 쇼케이스 카테고리별 가장 최근등록된 쇼케이스 1개씩 조회
		 */
		getAnothers: async (showcaseId: number) => {
			const { list_by_sort } = await useBackend().command<{
				list_by_sort: OtherShowcase[];
			}>(`v1/exhibit/showcases/${showcaseId}/others`);

			return list_by_sort;
		},
	};
};