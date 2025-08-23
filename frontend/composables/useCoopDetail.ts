import { useBackend } from '$/composables/useBackend';
import { useGoodsDetail } from '$/composables/useGoodsDetail';

/** 공동구매 상세용 컴포저블 */
export const useCoopDetail = async (coopDealId: number) => {

	const getDetail = async () => {
		return await useBackend().command<CoopDealDetail>(`v1/exhibit/joint-purchases/${coopDealId}`);
	};

	const coopDealDetail = await getDetail();

	if (!coopDealDetail || !coopDealDetail.goods_id) {
		// 에러처리
	}

	const {
		goodsDetail,
		options,
		promotion,
		stockState,
		shoppingAggregate,
		creditCardInstallment,
	} = await useGoodsDetail(coopDealDetail.goods_id);

	return {
		coopDealDetail,
		goodsDetail,
		options,
		promotion,
		stockState,
		shoppingAggregate,
		creditCardInstallment,
		apply: async (optionId: number) => {
			await useBackend().command(`v1/exhibit/joint-purchases/${coopDealId}/apply`, {
				method: 'post',
				data: {
					option_id: optionId,
					ea: 1,
				},
			});
		},
	};
};