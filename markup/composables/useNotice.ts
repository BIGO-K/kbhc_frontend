import { useBackend } from '$/composables/useBackend';

export const useNotice = () => {
	const defaultPageSize = 10;

	return {
		/** 최신 공지 조회 */
		getRecents: async (limit: number = 5) => {
			const { notices } = await useBackend().command<{
				notices: NoticeDetail[];
			}>('v1/cs/notices/recents', {
				params: {
					limit,
				},
			});

			return notices;
		},
		/** 공지 페이지네이터 조회 */
		getPaginator: async (page: number, pageSize: number = defaultPageSize) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<Notice>;
			}>('v1/cs/notices', {
				params: {
					page: page,
					page_size: pageSize,
				},
			});

			return paginator;
		},
		/** 중요공지 조회 */
		getImportants: async () => {
			const { important_notices } = await useBackend().command<{
				important_notices: Notice[];
			}>('v1/cs/notices/importants');

			return important_notices;
		},
		/** 공지 상세 조회 */
		getDetail: async (id: number) => {
			return await useBackend().command<NoticeDetail>(`v1/cs/notices/${id}`);
		},

	};
};