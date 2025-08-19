import { useBackend } from '$/composables/useBackend';

export const useGoodsAdditional = () => {
	return {
		/**
		 * [상품상세] 옵션 조회
		 * @param goodsId
		 */
		getOptions: async (goodsId: number): Promise<GoodsOption[]> => {
			const { options } = await useBackend().command<{
				options: GoodsOption[];
			}>(`v1/goods/${goodsId}/options`);

			return options.map(option => {
				let isOptionSelectable = false;
				const subOptions: GoodsSubOption[] = option.sub.map(subOption => {
					if (subOption.qty > 0) isOptionSelectable = true;

					return {
						code: subOption.code,
						name: subOption.name.trim(),
						qty: subOption.qty,
						is_selectable: subOption.qty > 0,
						extra_amount: subOption.extra_amount,
						extra_amount_by_marketing: subOption.extra_amount_by_marketing,
					};
				});

				return {
					name: option.name.trim(),
					is_selectable: isOptionSelectable,
					extra_amount: 0,
					sub: subOptions,
				};
			});
		},
		/** 상세설명정보 조회 */
		getInformation: async (goodsId: number) => await useBackend().command<GoodsInformation>(`v1/goods/${goodsId}/information`),
		/**
		 * [상품: 쿠폰] 다운로드
		 * @param couponIds
		*/
		downloadCoupon: async (couponIds: number[]) => {
			await useBackend().command('v1/promotions/extra-coupons/download', {
				method: 'post',
				data: {
					coupon_ids: couponIds,
				},
			});
		},
		/**
		 * [상품상세] 재입고알림 신청
		 * @param goodsId
		 * @param optionId
		 */
		applyRestockNotify: async (goodsId: number, optionId: number) => {
			await useBackend().command(`v1/goods/${goodsId}/option/${optionId}/in-stock-notification`, {
				method: 'post',
			});
		},
	};
};