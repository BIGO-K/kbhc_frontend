import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/mypage',
		meta: {
			// requiresAuth: true,
		},
		children: [
			// 등급별혜택
			{
				path: 'level',
				name: 'MyLevel',
				component: () => import('@/page/mypage/level/MyLevel.vue'),
			},
			// 주문관리
			{
				path: 'order',
				children: [
					{
						path: '',
						component: () => import('@/page/mypage/order/MyOrder.vue'),
						children: [
							// 주문1
							{
								path: '',
								name: 'MyOrder',
								meta: {
									tab: '주문',
								},
								component: () => import('@/page/mypage/order/MyOrderOrder.vue'),
							},
							// 취소
							{
								path: 'cancel',
								name: 'MyOrderCancel',
								meta: {
									tab: '취소',
								},
								component: () => import('@/page/mypage/order/cancel/MyOrderCancel.vue'),
							},
							// 반품
							{
								path: 'return',
								name: 'MyOrderReturn',
								meta: {
									tab: '반품',
								},
								component: () => import('@/page/mypage/order/return/MyOrderReturn.vue'),
							},
							// 교환
							{
								path: 'exchange',
								name: 'MyOrderExchange',
								meta: {
									tab: '교환',
								},
								component: () => import('@/page/mypage/order/exchange/MyOrderExchange.vue'),
							},
						],
					},
					{
						path: ':id(\\d+)',
						children: [
							// 주문상세
							{
								path: '',
								name: 'MyOrderDetail',
								component: () => import('@/page/mypage/order/detail/MyOrderDetail.vue'),
								props: (route) => ({ orderId: route.params.id }),
							},
						],
					},
					// 반품전환
					{
						path: 'to-return/:exchange_id',
						children: [
							// 반품전환 신청
							{
								path: 'create/:exchange_target_id',
								name: 'MyOrderToReturnCreate',
								component: () => import('@/page/mypage/order/to-return/create/MyOrderToReturnCreate.vue'),
								props: (route) => ({ exchangeId: route.params.exchange_id, exchangeTargetId: Number(route.params.exchange_target_id) }),
							},
							// 반품전환 신청완료
							{
								path: 'success/:return_id',
								name: 'MyOrderToReturnSuccess',
								component: () => import('@/page/mypage/order/to-return/success/MyOrderToReturnSuccess.vue'),
								props: (route) => ({ exchangeId: route.params.exchange_id, returnId: route.params.return_id }),
							},
						],
					},
					// 취소
					{
						path: 'cancel/:order_id',
						children: [
							// 취소 신청
							{
								path: 'create/:item_id',
								name: 'MyOrderCancelCreate',
								component: () => import('@/page/mypage/order/cancel/create/MyOrderCancelCreate.vue'),
								props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
							},
							// 취소 신청완료
							{
								path: 'success/:cancel_ids(.*)*',
								name: 'MyOrderCancelSuccess',
								component: () => import('@/page/mypage/order/cancel/success/MyOrderCancelSuccess.vue'),
								props: (route) => ({ orderId: route.params.order_id, cancelIds: route.params.cancel_ids }),
							},
						],
					},
					// 반품
					{
						path: 'return/:order_id',
						children: [
							// 반품 신청
							{
								path: 'create/:item_id',
								name: 'MyOrderReturnCreate',
								component: () => import('@/page/mypage/order/return/create/MyOrderReturnCreate.vue'),
								props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
							},
							// 반품 신청완료
							{
								path: 'success/:return_ids(.*)*',
								name: 'MyOrderReturnSuccess',
								component: () => import('@/page/mypage/order/return/success/MyOrderReturnSuccess.vue'),
								props: (route) => ({ orderId: route.params.order_id, returnIds: route.params.return_ids }),
							},
						],
					},
					// 교환
					{
						path: 'exchange/:order_id',
						children: [
							// 교환 신청
							{
								path: 'create/:item_id',
								children: [
									{
										path: '',
										name: 'MyOrderExchangeCreate',
										component: () => import('@/page/mypage/order/exchange/create/MyOrderExchangeCreate.vue'),
										props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
									},
									{
										path: 'start_bridge',
										name: 'ExchangePrepareBridge',
										component: () => import('@/page/mypage/order/exchange/create/ExchangePrepareBridge.vue'),
										props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
									},
									{
										path: 'end_bridge',
										name: 'ExchangeEndBridge',
										component: () => import('@/page/mypage/order/exchange/create/ExchangeEndBridge.vue'),
										props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
									},
								],
							},
							// 교환 신청완료
							{
								path: 'success/:exchange_id',
								name: 'MyOrderExchangeSuccess',
								component: () => import('@/page/mypage/order/exchange/success/MyOrderExchangeSuccess.vue'),
								props: (route) => ({ orderId: route.params.order_id, exchangeId: route.params.exchange_id }),
							},
						],
					},
				],
			},
			// 혜택관리
			{
				path: 'benefit',
				name: 'MyBenefit',
				component: () => import('@/page/mypage/benefit/MyBenefit.vue'),
			},
			// 마이찜
			{
				path: 'wishlist',
				children: [
					{
						path: '',
						name: 'MyWishlist',
						component: () => import('@/page/mypage/wishlist/MyWishlist.vue'),
						redirect: {
							name: 'MyWishlistProduct',
						},
						children: [
							// 아이템
							{
								path: 'product',
								name: 'MyWishlistProduct',
								meta: {
									tab: '찜한 아이템',
								},
								component: () => import('@/page/mypage/wishlist/product/MyWishlistProduct.vue'),
							},
							// 브랜드
							{
								path: 'brand',
								name: 'MyWishlistBrand',
								meta: {
									tab: '찜한 브랜드',
								},
								component: () => import('@/page/mypage/wishlist/brand/MyWishlistBrand.vue'),
							},
						],
					},
					// 아이템
					{
						path: 'product',
						children: [
							// 아이템 상세
							{
								path: ':id(\\d+)',
								name: 'MyWishlistProductDetail',
								component: () => import('@/page/mypage/wishlist/product/detail/MyWishlistProductDetail.vue'),
							},
							// 폴더 이동
							{
								path: 'folder',
								name: 'MyWishlistProductMove',
								component: () => import('@/page/mypage/wishlist/product/folder/MyWishlistProductFolder.vue'),
							},
						],
					},
				],
			},
			// 리뷰관리
			{
				path: 'review',
				children: [
					{
						path: '',
						name: 'MyReview',
						component: () => import('@/page/mypage/review/MyReview.vue'),
						redirect: {
							name: 'MyReviewPending',
						},
						children: [
							// 작성가능한리뷰
							{
								path: 'pending',
								name: 'MyReviewPending',
								meta: {
									tab: '작성 가능한 리뷰',
								},
								component: () => import('@/page/mypage/review/pending/MyReviewPending.vue'),
							},
							// 작성한리뷰
							{
								path: 'completed',
								name: 'MyReviewCompleted',
								meta: {
									tab: '작성한 리뷰',
								},
								component: () => import('@/page/mypage/review/completed/MyReviewCompleted.vue'),
							},
						],
					},
				],
			},
			// 문의관리
			{
				path: 'inquiry',
				children: [
					{
						path: '',
						name: 'MyInquiry',
						component: () => import('@/page/mypage/inquiry/MyInquiry.vue'),
						redirect: {
							name: 'MyInquirySingle',
						},
						children: [
							// 1:1문의
							{
								path: 'single',
								name: 'MyInquirySingle',
								meta: {
									tab: '1:1 문의',
								},
								component: () => import('@/page/mypage/inquiry/single/MyInquirySingle.vue'),
							},
							// 판매자 문의
							{
								path: 'seller',
								name: 'MyInquirySeller',
								meta: {
									tab: '판매자 문의',
								},
								component: () => import('@/page/mypage/inquiry/seller/MyInquirySeller.vue'),
							},
						],
					},
					// 1:1문의
					{
						path: 'single',
						children: [
							// 1:1문의 작성
							{
								path: 'create',
								name: 'MyInquirySingleCreate',
								component: () => import('@/page/mypage/inquiry/single/create/MyInquirySingleCreate.vue'),
							},
						],
					},
				],
			},
			// 배송지연신고
			{
				path: 'delayed',
				name: 'MyDelayed',
				component: () => import('@/page/mypage/delayed/MyDelayed.vue'),
				redirect: {
					name: 'MyDelayedPending',
				},
				children: [
					{
						path: 'pending',
						name: 'MyDelayedPending',
						meta: {
							tab: '배송지연 신고',
						},
						component: () => import('@/page/mypage/delayed/pending/MyDelayedPending.vue'),
					},
					{
						path: 'completed',
						name: 'MyDelayedCompleted',
						meta: {
							tab: '배송지연 처리결과',
						},
						component: () => import('@/page/mypage/delayed/completed/MyDelayedCompleted.vue'),
					},
				],
			},
			// 품절취소신고
			{
				path: 'soldout',
				name: 'MySoldout',
				component: () => import('@/page/mypage/soldout/MySoldout.vue'),
				redirect: {
					name: 'MySoldoutPending',
				},
				children: [
					{
						path: 'pending',
						name: 'MySoldoutPending',
						meta: {
							tab: '품절취소 신고',
						},
						component: () => import('@/page/mypage/soldout/pending/MySoldoutPending.vue'),
					},
					{
						path: 'completed',
						name: 'MySoldoutCompleted',
						meta: {
							tab: '품절취소 처리결과',
						},
						component: () => import('@/page/mypage/soldout/completed/MySoldoutCompleted.vue'),
					},
				],
			},
			// 최근본쇼핑정보
			{
				path: 'recently',
				name: 'MyRecently',
				component: () => import('@/page/mypage/recently/MyRecently.vue'),
				redirect: {
					name: 'MyRecentlyProduct',
				},
				children: [
					{
						path: 'product',
						name: 'MyRecentlyProduct',
						meta: {
							tab: '최근 본 상품',
						},
						component: () => import('@/page/mypage/recently/product/MyRecentlyProduct.vue'),
					},
					{
						path: 'promotion',
						name: 'MyRecentlyPromotion',
						meta: {
							tab: '최근 본 기획전',
						},
						component: () => import('@/page/mypage/recently/promotion/MyRecentlyPromotion.vue'),
					},
				],
			},
			// 환불계좌관리
			{
				path: 'refund',
				children: [
					{
						path: '',
						name: 'MyRefund',
						component: () => import('@/page/mypage/refund/MyRefund.vue'),
					},
				],
			},
			// 환불계좌관리
			{
				path: 'address',
				children: [
					{
						path: '',
						name: 'MyAddress',
						component: () => import('@/page/mypage/address/MyAddress.vue'),
					},
				],
			},
		],
	},
];

export default routes;