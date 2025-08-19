import { ref } from 'vue';
import { useWishedStore } from '$/stores/useWishedStore';
import { useBackend } from '$/composables/useBackend';
import { useCardInstallment } from '$/composables/useCardInstallment';
import { useErrorAlert } from '$/composables/useErrorAlert';
import { useGoodsAdditional } from '$/composables/useGoodsAdditional';

/** 상품상세 컴포저블 */
export const useGoodsDetail = async (goodsId: number) => {
	const { add: addWishedGoods } = useWishedStore();
	const { getOptions } = useGoodsAdditional();

	const goodsDetail = ref<GoodsDetail>();
	const options = ref<GoodsOption[]>();
	const promotion = ref<GoodsPromotion>();
	const stockState = ref<GoodsStockState>();
	const shoppingAggregate = ref<GoodsReactionAggregate>();
	const creditCardInstallment = ref<CardInstallment | undefined>();

	/** [상품상세] 기본 구성요소 조회 */
	const getBasicInfo = async (goodsId: number) => {
		const { goods, joint_purchase, raffle } = await useBackend().command<{
			goods: GoodsDetail;
			joint_purchase: Nullable<{ id: number }>;
			raffle: Nullable<{ id: number }>;
		}>(`v1/goods/${goodsId}`);

		goods.id = goodsId;
		goods.image_url = goods.thumbnail_urls[0];
		goods.joint_purchase_id = joint_purchase?.id;
		goods.raffle_id = raffle?.id;

		return goods;
	};

	/** [상품상세] 프로모션 정보 조회 */
	const getPromotion = async (goodsId: number) => {
		return await useBackend().command<GoodsPromotion>(`v1/goods/${goodsId}/promotions`);
	};

    /** [상품상세] 수량 조회 */
	const getStock = async (goodsId: number) => {
		return await useBackend().command<GoodsStockState>(`v1/goods/${goodsId}/stock`);
	};

    /** [상품상세] 리뷰/문의/좋아요 집계 */
	const getReactionAggregate = async (goodsId: number) => {
		return await useBackend().command<GoodsReactionAggregate>(`v1/goods/${goodsId}/aggregate`);
	};

	/** 초기 로딩요소 */
	const refetch = async (goodsId: number) => {
		const [
			pGoodsDetail,
			pOptions,
			pPromotion,
			pStock,
			pReactionAggregate,
			pCreditCardInstallment,
		] = await Promise
			.all([
				getBasicInfo(goodsId),
				getOptions(goodsId),
				getPromotion(goodsId),
				getStock(goodsId),
				getReactionAggregate(goodsId),
				useCardInstallment().get(),
			])
			.catch(e => {
				// 에러 처리
				useErrorAlert(e, {
					httpCatcher: {
						404: '상품이 존재하지 않습니다.',
					},
					alertCallback: () => {
						//
					},
				});
				throw (e);
			});

		goodsDetail.value = pGoodsDetail;
		options.value = pOptions;
		promotion.value = pPromotion;
		stockState.value = pStock;
		shoppingAggregate.value = pReactionAggregate;
		creditCardInstallment.value = pCreditCardInstallment;
	};

	await refetch(goodsId);

	return {
		goodsDetail,
		options,
		promotion,
		stockState,
		shoppingAggregate,
		creditCardInstallment,
		refetch,
		/** [상품상세] 기본 구성요소 조회 */
		getBasicInfo,
		/** [상품상세] 리뷰/문의/좋아요 집계 */
		getReactionAggregate,
		/** [상품상세] 세트상품 조회 */
		getPackageGoodsList: async (goodsId: number): Promise<PackageGoods[]> => {
			const { goods_packages } = await useBackend().command<{
				goods_packages: Nullable<(PackageGoods & { goods_id: number })[]>;
			}>(`v1/goods/${goodsId}/packages`);

			return (goods_packages || [])?.map(packageGood => ({
				...packageGood,
				id: packageGood.goods_id,
			}));
		},
		/** [상품상세] 브랜드 베스트 상품 리스트 조회 */
		getBrandBestGoodsList: async (goodsId: number) => {
			const { brand_best_goods } = await useBackend().command<{
				brand_best_goods: BestGoods[];
			}>(`v1/goods/${goodsId}/best-of-brand`);

			return brand_best_goods.filter(goods => goods.id !== goodsId);
		},
		/** [상품상세] 대표카테고리 베스트 상품 리스트 조회 */
		getCategoryBestGoodsList: async (goodsId: number) => {
			const { category_best_goods } = await useBackend().command<{
				category_best_goods: BestGoods[];
			}>(`v1/goods/${goodsId}/best-of-category`);

			return category_best_goods.filter(goods => goods.id !== goodsId);
		},
		/** [상품: 쿠폰] EP 쿠폰 조회 */
		getEpCoupon: async (goodsId: number) => {
			const { epCoupon } = await useBackend().command<{
				epCoupon: Nullable<EPCoupon>;
			}>(`v1/goods/${goodsId}/ep-coupon`);

			return epCoupon;
		},
		/** [상품: 쿠폰] 다운로드 가능 쿠폰 리스트 조회 */
		getDownloadableCoupons: async (goodsId: number) => {
			const { coupons } = await useBackend().command<{
				coupons: DownloadableCoupon[];
			}>(`v1/goods/${goodsId}/coupons`);

			return coupons;
		},
		/** [상품상세] 사용자에 따른 부가 기능 조회 */
		me: async (goodsId: number) => {
			const { is_wished, is_writable_review } = await useBackend().command<{
				is_wished: boolean;
				is_writable_review: boolean;
			}>(`v1/goods/${goodsId}/me`);

			if (is_wished) addWishedGoods(goodsId);

			return {
				is_wished,
				is_writable_review,
			};
		},
	};

};