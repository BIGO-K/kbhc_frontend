import { useBackend } from '$/composables/useBackend';

export const useJointPurchase = () => {
	return {
		/** 공동구매 페이지네이터 조회 */
		getPaginator: async (page: number = 1, pageSize: number = 6, isEnd: boolean = false) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<JointPurchase>;
			}>('v1/exhibit/joint-purchases', {
				params: {
					page,
					page_size: pageSize,
					is_end: isEnd,
				},
			});

			return paginator;
		},
		/** 공동구매 상세 조회 */
		getDetail: async (id: number) => {
			const jointPurchase = await useBackend().command<Omit<JointPurchaseDetail, 'id'>>(`v1/exhibit/joint-purchases/${id}`);

			return {
				id,
				...jointPurchase,
			};
		},
		/** 공동구매 신청 */
		apply: async (jointPurchaseId: number, optionId: number) => {
			await useBackend().command(`v1/exhibit/joint-purchases/${jointPurchaseId}/apply`, {
				method: 'post',
				data: {
					option_id: optionId,
					ea: 1,
				},
			});
		},
	};
};