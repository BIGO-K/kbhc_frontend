import { useBackend } from '$/composables/useBackend';

// 문의 관련 컴포저블
export const useInquiry = () => {
	const defaultPageSize = 20;

	return {
		/** 1:1 문의 리스트 조회 */
		getQnaPaginator: async (page: number = 1, pageSize: number = defaultPageSize) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<Qna>;
			}>('v1/my/qna', {
				params: {
					page,
					page_size: pageSize,
				},
			});

			return paginator;
		},
		/** 1:1 문의 유형 조회 */
		getQnaTypes: async () => {
			const { qna_types } = await useBackend().command<{
				qna_types: QnaType[];
			}>('v1/cs/qna/categories');

			return qna_types;
		},
		/** 1:1 문의 가능 주문 조회 */
		getQnaOrders: async () => {
			const { orders } = await useBackend().command<{
				orders: QnaOrder[];
			}>('v1/cs/qna/orders');

			return orders;
		},
		/** 1:1 문의 상세 조회 */
		getQnaDetail: async (id: number) => {
			const { qna } = await useBackend().command<{
				qna: QnaDetail;
			}>(`v1/cs/qna/${id}/edit`);

			return qna;
		},
		/** 1:1 문의 등록 */
		storeQna: async (form: QnaStoreForm) => {
			await useBackend().command('v1/cs/qna', {
				method: 'post',
				data: form,
			});
		},
		/** 1:1 문의 수정 */
		updateQna: async (id: number, form: QnaUpdateForm) => {
			await useBackend().command(`v1/cs/qna/${id}/edit`, {
				method: 'post',
				data: form,
			});
		},
		/** 1:1 문의 삭제 */
		destroyQna: async (id: number) => {
			await useBackend().command(`v1/cs/qna/${id}/destroy`, {
				method: 'post',
			});
		},
		/** 판매자문의 리스트 조회 */
		getSellerQnaPaginator: async (page: number, pageSize: number = defaultPageSize) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<SellerQna>;
			}>('v1/my/seller-qna', {
				params: {
					page: page,
					page_size: pageSize,
				},
			});

			return paginator;
		},
		/**
		 * 판매자문의 유형 조회
		 * @param onlyGoodsQnaType 상품문의유형만 조회 여부
		*/
		getSellerQnaTypes: async (onlyGoodsQnaType: boolean = false) => {
			const { seller_qna_types } = await useBackend().command<{
				seller_qna_types: SellerQnaType[];
			}>('v1/cs/seller-qna/categories', {
				params: {
					is_goods_qna: onlyGoodsQnaType,
				},
			});

			return seller_qna_types;
		},
		/** 판매자문의 가능 주문상품 리스트 조회 (동일 주문,셀러 기준) */
		getSellerQnaOrderItems: async (orderId: string, sellerId: number) => {
			const { order_items } = await useBackend().command<{
				order_items: QnaOrderItem[];
			}>('v1/cs/seller-qna/order-items', {
				params: {
					order_id: orderId,
					seller_id: sellerId,
				},
			});

			return order_items;
		},
		/** 판매자문의 상세 조회 */
		getSellerQnaDetail: async (id: number) => {
			const { seller_qna } = await useBackend().command<{
				seller_qna: SellerQnaDetail;
			}>(`v1/cs/seller-qna/${id}/edit`);

			return seller_qna;
		},
		/** 판매자문의 작성 */
		storeSellerQna: async (form: SellerQnaStoreForm) => {
			await useBackend().command('v1/cs/seller-qna', {
				method: 'post',
				data: form,
			});
		},
		/** 판매자 문의 수정 */
		updateSellerQna: async (id: number, form: SellerQnaUpdateForm) => {
			await useBackend().command(`v1/cs/seller-qna/${id}/edit`, {
				method: 'post',
				data: form,
			});
		},
		/** 판매자 문의 삭제 */
		destroySellerQna: async (id: number) => {
			await useBackend().command(`v1/cs/seller-qna/${id}/destroy`, {
				method: 'post',
			});
		},
		/** 상품문의 페이지네이터 조회 */
		getGoodsQnaPaginator: async (goodsId: number, page: number, pageSize: number = defaultPageSize, onlyAnswered: boolean = false) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<GoodsQna>;
			}>(`v1/goods/${goodsId}/qna`, {
				params: {
					page: page,
					page_size: pageSize,
					only_answered: onlyAnswered,
				},
				isForce: true,
			});

			return paginator;
		},
		/** 상품 문의 작성용 데이터 조회 */
		getGoodsQnaCreateInfo: async (goodsId: number) => {
			return await useBackend().command<GoodsQnaCreateInfo>(`v1/goods/${goodsId}/qna/information`);
		},
		/** 상품 문의 작성 */
		storeGoodsQna: async (goodsId: number, form: GoodsQnaStoreForm) => {
			await useBackend().command(`v1/goods/${goodsId}/qna`, {
				method: 'post',
				data: form,
			});
		},
		/** 상품문의 상세 조회 */
		getGoodsQnaDetail: async (goodsId: number, qnaId: number) => {
			return await useBackend().command<GoodsQnaDetail>(`v1/goods/${goodsId}/qna/${qnaId}/edit`);
		},
		/** 상품 문의 수정 */
		updateGoodsQna: async (goodsId: number, qnaId: number, form: GoodsQnaUpdateForm) => {
			await useBackend().command(`v1/goods/${goodsId}/qna/${qnaId}/edit`, {
				method: 'post',
				data: form,
			});
		},
		/** 상품 문의 삭제 */
		destroyGoodsQna: async (goodsId: number, qnaId: number) => {
			await useBackend().command(`v1/goods/${goodsId}/qna/${qnaId}/destroy`, {
				method: 'post',
			});
		},
	};
};