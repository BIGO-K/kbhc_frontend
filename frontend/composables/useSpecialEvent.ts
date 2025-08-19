import { useBackend } from '$/composables/useBackend';

type ProcessTab = {
	value: ProcessLabel;
	label: string;
};

export const useSpecialEvent = () => {
	const processTabs: ProcessTab[] = [
		{ value: 'all', label: '전체' },
		{ value: 'progress', label: '진행중' },
		{ value: 'end', label: '종료' },
	];

	return {
		processTabs,
		/** [이벤트] paginator 조회 */
		getPaginator: async (
			periodType: ProcessLabel = 'all',
			page: number = 1,
			pageSize: number = 15
		) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<SpecialEvent>;
			}>('v1/exhibit/special-events', {
				params: {
					period_type: periodType,
					page,
					page_size: pageSize,
				},
			});

			return paginator;
		},
		/** [이벤트] 상세조회 */
		getDetail: async (id: number) => {
			const specialEvent = await useBackend().command<SpecialEventDetail>(
				`v1/exhibit/special-events/${id}`
			);
			specialEvent.goods_groups.map(group => group.goods_list = []);

			return specialEvent;
		},
		/** [이벤트] 상품그룹 상품목록 조회 */
		getGoodsGroup: async (eventId: number, groupId: number) => {
			const { group_goods } = await useBackend().command<{
				group_goods: Goods[];
			}>(`v1/exhibit/special-events/${eventId}/group-goods/${groupId}`);

			return group_goods;
		},
		/** [이벤트] 댓글 페이지네이터 조회 */
		getCommentPaginator: async (eventId: number, page: number = 1, pageSize: number = 5) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<SpecialEventComment>;
			}>(`v1/exhibit/special-events/${eventId}/comments`, {
				params: {
					page,
					page_size: pageSize,
				},
				isForce: true,
			});

			return paginator;
		},
		/** [이벤트] 댓글 작성 */
		addComment: async (eventId: number, commentForm: SpecialEventCommentForm) => {
			await useBackend().command(`v1/exhibit/special-events/${eventId}/comments`, {
				method: 'post',
				data: commentForm,
			});
		},
		/** [이벤트] 댓글 수정 */
		updateComment: async (eventId: number, commentId: number, commentForm: PlanningCommentForm) => {
			await useBackend().command(`v1/exhibit/special-events/${eventId}/comments/${commentId}`, {
				method: 'post',
				data: commentForm,
			});
		},
		/** [이벤트] 댓글 삭제 */
		removeComment: async (planningId: number, commentId: number) => {
			await useBackend().command(`v1/exhibit/special-events/${planningId}/comments/${commentId}/destroy`, {
				method: 'post',
			});
		},
	};
};