import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { AxiosError } from 'axios';
import { useAppBridge } from '$/composables/useAppBridge';
import { useBackend } from '$/composables/useBackend';
import { useErrorAlert } from '$/composables/useErrorAlert';
import { GOODS_TYPE } from '$/constants';



export const productDetailGuard = async (
	to: RouteLocationNormalized,
	from: RouteLocationNormalized,
	next: NavigationGuardNext
) => {
	const { isAppUser } = useAppBridge();
	/** 상품 타입별 가드 추가 */
	const goodsId = Number(`${to.params.id}`);
	try {

		const common = await useBackend().command<{
			joint_purchase_id: Nullable<number>;
			bundle_goods_ids: Nullable<number[]>;
			raffle_id: Nullable<number>;
			type: string;
		}>(`v1/goods/${goodsId}`);

		/** 래플 상품 리다이렉트 */
		if (common.type === GOODS_TYPE.raffle && common.raffle_id) {
			return next({
				name: 'RaffleDetail',
				params: {
					id: common.raffle_id,
				},
			});
		}

		/** 공동구매 상품 리다이렉트 */
		if (common.type === GOODS_TYPE.coop && common.joint_purchase_id) {
			return next({
				name: 'CoopDetail',
				params: {
					id: common.joint_purchase_id,
				},
			});
		}
		if (common.type === GOODS_TYPE.bundle && common.bundle_goods_ids) {
			return next({
				name: 'BundleGoodsDetail',
				params: {
					id: goodsId,
				},
			});
		}

		return next();
	}
	catch (error) {
		const httpCatcher = {
			404: '판매중인 상품이 아닙니다.',
			500: '상품 조회에 실패하였습니다.',
		};

		if (error && isAppUser) {
			if (error instanceof AxiosError && error.response) {
				const message = error.response.status === 404
					? httpCatcher[404]
					: httpCatcher[500];


				return next(`error?message=${(message)}`);
			}

			return next(`error`);
		}

		useErrorAlert(error, {
			httpCatcher: {
				404: '판매중인 상품이 아닙니다.',
				500: '상품 조회에 실패하였습니다.',
			},
		});

		if (from.path === '/') {
			return next('/');
		}
		else {
			return next(false);
		}
	}
};