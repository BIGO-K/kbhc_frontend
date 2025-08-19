import { computed, ref } from 'vue';
import { usePageContextStore } from '$/stores/usePageContextStore';
import { useBackend } from '$/composables/useBackend';
import { useCardInstallment } from '$/composables/useCardInstallment';
import { useErrorAlert } from '$/composables/useErrorAlert';
import { useGoodsAdditional } from '$/composables/useGoodsAdditional';
export const useBundleGoodsDetail = async (bundleGoodsId: number) => {

	const pageContextStore = usePageContextStore();
	const { getBundleOptions } = useGoodsAdditional();
	/** [패키지 상품상세] 기본 구성요소 조회 */
	const getBasicInfo = async () => {
		return await useBackend().command<BundleGoodsDetail>(`v1/goods/bundle/${bundleGoodsId}/detail`);
	};

	/** [패키지] 프로모션 정보 조회 */
	const getPromotion = async () => {
		return await useBackend().command<BundlePromotion>(`v1/goods/bundle/${bundleGoodsId}/promotions`);
	};

	/** [패키지] 수량 조회 */
	const getStock = async () => {
		return await useBackend().command<BundleGoodsStockState>(`v1/goods/bundle/${bundleGoodsId}/stock`);
	};

	const fetch = async () => {
		const [
			pGoodsDetail,
			pOptions,
			pPromotion,
			pStock,
			// pReactionAggregate,
			pCreditCardInstallment,
		] = await Promise
			.all([
				getBasicInfo(),
				getBundleOptions(bundleGoodsId),
				getPromotion(),
				getStock(),
				// getReactionAggregate(goodsId),
				useCardInstallment().get(),
			])
			.catch(e => {
				// 에러 처리
				useErrorAlert(e, {
					httpCatcher: {
						404: '상품이 존재하지 않습니다.',
						500: '판매중인 상품이 아닙니다.',
					},
					alertCallback: () => {
						//
						pageContextStore.clearErrorWithHistoryBack();
					},
				});
				throw (e);
			});

		return {
			pGoodsDetail,
			pOptions,
			pPromotion,
			pStock,
			// // pReactionAggregate,
			pCreditCardInstallment,
		};
	};

	// const { pGoodsDetail, pOptions, pPromotion, pStock, pCreditCardInstallment } = await fetch();
	const { pGoodsDetail, pOptions, pPromotion, pStock, pCreditCardInstallment } = await fetch();

	const bundleGoodsDetail = ref<BundleGoodsDetail>(pGoodsDetail);
	const options = ref<BundleGoodsOptions[]>(pOptions);
	const stockState = ref<BundleGoodsStockState>(pStock);
	const promotion = ref<BundlePromotion>(pPromotion);
	const creditCardInstallment = ref<Nullable<CardInstallment>>(pCreditCardInstallment);

	const saleMemberBenefits = computed(() => {
		return [
			{
				title: '회원할인',
				price: promotion.value.sell_price - promotion.value.base_discounted_price,
				usable: promotion.value.sell_price > promotion.value.base_discounted_price,
			},
			{
				title: '쿠폰할인',
				price: promotion.value.highest_downloadable_coupon_amount,
				usable: promotion.value.highest_downloadable_coupon_amount > 0,
			},
		].filter(t => t.usable);
	});

	return {
		bundleGoodsDetail,
		stockState,
		options,
		promotion,
		saleMemberBenefits,
		creditCardInstallment,
		/** [패키지: 쿠폰] 다운로드 가능 쿠폰 리스트 조회 */
		getDownloadableCoupons: async () => {
			const { coupons } = await useBackend().command<{
				coupons: DownloadableCoupon[];
			}>(`v1/goods/bundle/${bundleGoodsId}/coupons`);

			return coupons;
		},
		/** 상세설명정보 조회 */
		getInformation: async () => await useBackend().command<BundleGoodsInformation>(`v1/goods/bundle/${bundleGoodsId}/information`),
		/** [상품상세] 리뷰/문의/좋아요 집계 */
		getReactionAggregate: async () => await useBackend().command<GoodsReactionAggregate>(`v1/goods/bundle/${bundleGoodsId}/aggregate`),
		// getPackageGoodsList: async (bundleGoodsId: number): Promise<PackageGoods[]> => {
		// 	const { goods_packages } = await useBackend().command<{
		// 		goods_packages: Nullable<(PackageGoods & { goods_id: number })[]>;
		// 	}>(`v1/goods/bundle/${bundleGoodsId}/packages`);

		// 	return (goods_packages || [])?.map(packageGood => ({
		// 		...packageGood,
		// 		id: packageGood.goods_id,
		// 	}));
		// },
		/** [상품상세] 브랜드 베스트 상품 리스트 조회 */
		getBrandBestGoodsList: async (bundleGoodsId: number) => {
			const { brand_best_goods } = await useBackend().command<{
				brand_best_goods: BestGoods[];
			}>(`v1/goods/bundle/${bundleGoodsId}/best-of-brand`);

			return brand_best_goods.filter(goods => goods.id !== bundleGoodsId);
		},
		/** [상품상세] 대표카테고리 베스트 상품 리스트 조회 */
		getCategoryBestGoodsList: async (bundleGoodsId: number) => {
			const { category_best_goods } = await useBackend().command<{
				category_best_goods: BestGoods[];
			}>(`v1/goods/bundle/${bundleGoodsId}/best-of-category`);

			return category_best_goods.filter(goods => goods.id !== bundleGoodsId);
		},
		getAdvertisementGoodsList: async (bundleGoodsId: number) => {
			const { goods: advertisementGoods } = await useBackend().command<{
				goods: BestGoods[];
			}>(`v1/goods/bundle/${bundleGoodsId}/best-of-advertisement`);

			return advertisementGoods.filter(goods => goods.id !== bundleGoodsId);
		},
		/** [상품상세] 사용자에 따른 부가 기능 조회 */
		me: async () => {
			const { is_wished, is_writable_review } = await useBackend().command<{
				is_wished: boolean;
				is_writable_review: boolean;
			}>(`v1/goods/bundle/${bundleGoodsId}/me`);

			// if (is_wished) addWishedGoods(goodsId);

			return {
				is_wished,
				is_writable_review,
			};
		},
	};
};