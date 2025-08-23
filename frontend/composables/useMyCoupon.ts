import monsDate from '$/utils/date';
import { useBackend } from '$/composables/useBackend';

export const useMyCoupon = () => {
    // 사용범위 라벨
	const applyRangeLabel: Record<CouponRegistDetail['coupon']['apply_range_type'], string> = {
		all: '모든 상품',
		seller: '특정 판매자 상품',
		goods: '특정 상품',
		category: '특정 카테고리 상품',
		brand: '특정 브랜드 상품',
	};

    /**
     * 쿠폰 사용 범위 문자열
     * @param coupon
     * @returns
     */
	const getApplyRangeDescription = (coupon: RegistedCoupon) => {
		return `${applyRangeLabel[coupon.apply_range_type]} 사용가능` || '사용불가';
	};

    /**
     * 쿠폰 남은기간 문자열
     * @param expireAt
     * @returns
     */
	const getRemainTimeText = (expireAt: string) => {
		const now = monsDate().toDate();
		const duration = monsDate(expireAt).duration(now);

		if (duration.days > 0) {
			return `${monsDate(expireAt).diff(now, 'day')}일 남음`;
		}
		else if (duration.hours > 0) {
			return `${duration.hours}시간 남음`;
		}
		else if (duration.minutes > 0) {
			return `${duration.minutes}분 남음`;
		}
		else if (duration.seconds > 0) {
			return '만료 임박';
		}
		else {
			return '만료';
		}
	};

	return {
		/** 쿠폰 발급내역 페이지네이터 조회 */
		getRegistPaginator: async (page: number = 1, pageSize: number = 20): Promise<Paginator<CouponRegistDetail>> => {
			const { paginator: { data, ...paginatorData } } = await useBackend().command<{
				paginator: Paginator<CouponRegist>;
			}>('v1/my/extra-coupons', {
				params: {
					page,
					page_size: pageSize,
				},
			});

			const couponRegistList = data.map(regist => {
				const { coupon, ...couponRegist } = regist;

				return {
					...couponRegist,
					coupon: {
						...coupon,
						apply_range_description: getApplyRangeDescription(coupon),
					},
					remain_time_text: getRemainTimeText(couponRegist.expire_at),
				};
			});

			return {
				...paginatorData,
				data: couponRegistList,
			};
		},
		/** 발급된 쿠폰정보 조회 */
		getMyCoupon: async (couponId: number) => {
			return await useBackend().command<RegistedCoupon>(`v1/promotions/extra-coupons/${couponId}`);
		},
		/**
		 * 쿠폰 등록
		 * @param publishCode 쿠폰 인증번호
		 */
		addMyCoupon: async (publishCode: string) => {
			await useBackend().command('v1/my/regist-paper-coupon', {
				method: 'post',
				data: {
					publish_code: publishCode,
				},
			});
		},
		/** 금월 등급쿠폰별 발급횟수 조회 */
		getGradeCouponRegistCounts: async () => {
			const { grade_coupon_registed_counts } = await useBackend().command<{
				grade_coupon_registed_counts: {
					grade_coupon_id: number;
					coupon_regist_count: number;
				}[];
			}>('v1/my/grades/coupon-regist-state');

			return grade_coupon_registed_counts;
		},
		/** 등급쿠폰 발급 */
		addGradeCoupon: async (couponId: number) => {
			await useBackend().command('v1/my/grades/regist-coupon', {
				method: 'post',
				data: {
					coupon_id: couponId,
				},
			});
		},
		/** 쿠폰 사용가능 상품 조회 */
		getUsableGoodsPaginator: async (couponId: number, page: number = 1, pageSize: number = 7) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<CouponUsableGoods>;
			}>(`v1/promotions/extra-coupons/${couponId}/usable-goods`, {
				params: {
					page,
					page_size: pageSize,
				},
			});

			return paginator;
		},
		/** 쿠폰 사용가능 브랜드 조회 */
		getUsableBrandPaginator: async (couponId: number, page: number = 1, pageSize: number = 8) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<CouponUsableBrand>;
			}>(`v1/promotions/extra-coupons/${couponId}/usable-brands`, {
				params: {
					page,
					page_size: pageSize,
				},
			});

			return paginator;
		},
	};
};