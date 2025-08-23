import { useAuthStore } from '$/stores/useAuthStore';
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
		/** 패키지 상품 옵션 조회 */
		getBundleOptions: async (bundleGoodsId: number): Promise<BundleGoodsOptions[]> => {
			const { bundle_options } = await useBackend().command<{
				bundle_options: BundleGoodsOptions[];
			}>(`v1/goods/bundle/${bundleGoodsId}/options`);

			return bundle_options.map(bundle => {
				const options = bundle.options.map(option => {
					let isOptionSelectable = false;
					const subOptions: GoodsSubOption[] = option.sub.map(subOption => {
						if (subOption.qty > 0) isOptionSelectable = true;

						return {
							code: subOption.code,
							name: subOption.name.trim(),
							qty: subOption.qty,
							is_selectable: subOption.qty > 0,
							extra_amount: subOption.extra_amount,
						};
					});

					return {
						goods_id: bundle.goods_id,
						goods_name: bundle.goods_name,
						goods_base_discounted_price: bundle.goods_base_discounted_price,
						name: option.name.trim(),
						is_selectable: isOptionSelectable,
						extra_amount: 0,
						sub: subOptions,
					};
				});


				return {
					goods_id: bundle.goods_id,
					goods_name: bundle.goods_name,
					goods_base_discounted_price: bundle.goods_base_discounted_price,
					options: options,
				};
			});
		},
		/** 상세설명정보 조회 */
		getInformation: async (goodsId: number) => await useBackend().command<GoodsInformation>(`v1/goods/${goodsId}/information`),
		/** [상품상세] 리뷰/문의/좋아요 집계 */
		getReactionAggregate: async (goodsId: number) => await useBackend().command<GoodsReactionAggregate>(`v1/goods/${goodsId}/aggregate`),
		/** [상품상세] 리뷰/문의/좋아요 집계 */
		getBundleReactionAggregate: async (bundleGoodsId: number) => await useBackend().command<GoodsReactionAggregate>(`v1/goods/bundle/${bundleGoodsId}/aggregate`),
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
		/** 패키지상품상세 재입고 알림 */
		applyRestockNotifyBundle: async (bundleId: number, optionIds: number[]) => {
			if (optionIds.length < 2) {
				return;
			}

			await useBackend().command(`v1/goods/bundle/${bundleId}/in-stock-notification`, {
				method: 'post',
				data: {
					option_ids: optionIds,
				},
			});
		},
		checkPayMethod: (usablePayMethodCode: number) => {
			const { memberUsableStartPoint } = useAuthStore();

			if (usablePayMethodCode === 2 && !memberUsableStartPoint) {
				return false;
			}

			return true;
		},
	};
};