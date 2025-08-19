import { useBackend } from '$/composables/useBackend';

export const usePlanningEvent = () => {
	return {
		/** [기획전] 상세 조회 */
		getDetail: async (id: number) => {
			const { planning } = await useBackend().command<{
				planning: PlanningEvent;
			}>(`v1/exhibit/planning-events/${id}`);
			planning.groups.map(group => group.goods_list = []);

			return 	planning;
		},
		/** [기획전] 상품그룹 상품목록 조회 */
		getGoodsGroup: async (planningId: number, groupId: number) => {
			const { planning_group_goods } = await useBackend().command<{
				planning_group_goods: Goods[];
			}>(`v1/exhibit/planning-events/${planningId}/group-goods/${groupId}`);

			return planning_group_goods;
		},
		/** [기획전] 댓글 페이지네이터 조회 */
		getCommentPaginator: async (planningId: number, page: number = 1, pageSize: number = 5) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<PlanningComment>;
			}>(`v1/exhibit/planning-events/${planningId}/comments`, {
				params: {
					page: page,
					page_size: pageSize,
				},
				isForce: true,
			});

			return paginator;
		},
		/** [기획전] 댓글 작성 */
		addComment: async (planningId: number, commentForm: PlanningCommentForm) => {
			await useBackend().command(`v1/exhibit/planning-events/${planningId}/comments`, {
				method: 'post',
				data: commentForm,
			});
		},
		/** [기획전] 댓글 수정 */
		updateComment: async (planningId: number, commentId: number, commentForm: PlanningCommentForm) => {
			await useBackend().command(`v1/exhibit/planning-events/${planningId}/comments/${commentId}`, {
				method: 'post',
				data: commentForm,
			});
		},
		/** [기획전] 댓글 삭제 */
		removeComment: async (planningId: number, commentId: number) => {
			await useBackend().command(`v1/exhibit/planning-events/${planningId}/comments/${commentId}/destroy`, {
				method: 'post',
			});
		},
		/**
		 * 최근 본 기획전 추가
		 * 최대 30개 기획전 노출되고 30개 초과 시 오래 된 기획전부터 삭제 됨
		 * 최근 본 기획전에 노출된 지 2주(14일)가 지났을 시, 기획전 자동 삭제
		*/
		addRecentView: async (planningId: number) => {
			await useBackend().command(`v1/shopping/recent-view-planning-events`, {
				method: 'post',
				data: {
					planning_id: planningId,
				},
			});
		},
	};
};