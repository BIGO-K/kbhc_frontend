import { useBackend } from '$/composables/useBackend';

export const useComplain = () => {
	return {
		/** 품절취소 신고가능 주문 조회 */
		getSoldoutCancelReportablePaginator: async (page: number = 1, pageSize: number = 10) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<ComplainReportableOrder>;
			}>('v1/my/complains/cancel-by-soldout/reportables', {
				params: {
					page,
					page_size: pageSize,
				},
			});

			return paginator;
		},
		/** 품절취소 신고 결과 조회 */
		getSoldoutCancelReportPaginator: async (page: number = 1, pageSize: number = 10) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<ComplainReportedOrder>;
			}>('v1/my/complains/cancel-by-soldout', {
				params: {
					page,
					page_size: pageSize,
				},
			});

			return paginator;
		},
		/** 품절취소 신고 */
		reportSoldoutCancel: async (orderItemId: number) => {
			await useBackend().command('v1/my/complains/cancel-by-soldout/report', {
				method: 'post',
				data: {
					order_item_id: orderItemId,
				},
			});
		},
		/** 배송지연 신고가능 주문 조회 */
		getDeliveryDelayReportablePaginator: async (page: number = 1, pageSize: number = 10) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<ComplainReportableOrder>;
			}>('v1/my/complains/release-delay/reportables', {
				params: {
					page,
					page_size: pageSize,
				},
			});

			return paginator;
		},
		/** 배송지연 신고 결과 조회 */
		getDeliveryDelayReportPaginator: async (page: number = 1, pageSize: number = 10) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<ComplainReportedOrder>;
			}>('v1/my/complains/release-delay', {
				params: {
					page,
					page_size: pageSize,
				},
			});

			return paginator;
		},
		/** 배송지연 신고 */
		reportDeliveryDelay: async (orderItemId: number) => {
			await useBackend().command('v1/my/complains/release-delay/report', {
				method: 'post',
				data: {
					order_item_id: orderItemId,
				},
			});
		},
	};
};