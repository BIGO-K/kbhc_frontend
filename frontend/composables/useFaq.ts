import { useBackend } from '$/composables/useBackend';

export const useFaq = () => {
	const defaultPageSize = 10;

	return {
		/** FAQ 분류 조회 */
		getTypes: async () => {
			const { faq_types } = await useBackend().command<{
				faq_types: FaqType[];
			}>('v1/cs/faq/types');

			return faq_types;
		},
		/** FAQ 리스트 조회 */
		getAll: async (typeId: Nullable<number>, searchWord: string) => {
			const { faqs } = await useBackend().command<{
				faqs: Faq[];
			}>('v1/cs/faq/all', {
				params: {
					type_id: typeId || '',
					search_word: searchWord,
				},
			});

			return faqs;
		},
		/** FAQ 페이지네이터 조회 */
		getPaginator: async (typeId: number, searchWord: string, page: number, pageSize: number = defaultPageSize) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<Faq>;
			}>('v1/cs/faq', {
				params: {
					type_id: typeId,
					search_word: searchWord,
					page: page,
					page_size: pageSize,
				},
			});

			return paginator;
		},
	};
};