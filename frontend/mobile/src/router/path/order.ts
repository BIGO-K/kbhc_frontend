import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    // 장바구니
	{
		path: '/cart',
		name: 'Cart',
		component: () => import('@/page/cart/Cart.vue'),
	},
    // 주문
	{
		path: '/order',
		children: [
			{
				path: ':id',
				name: 'Order',
				component: () => import('@/page/order/Order.vue'),
			},
			// 주문결과(완료/실패)
			{
				path: ':id/result',
				name: 'OrderResult',
				component: () => import('@/page/order/result/OrderResult.vue'),
			},
			{
				path: 'bridge/:id',
				name: 'OrderBridge',
				component: () => import('@/page/order/OrderBridge.vue'),
			},
			{

				path: ':id/paying_start',
				name: 'OrderStart',
				component: () => import('@/page/order/OrderPayingStart.vue'),
			},
		],
	},
];

export default routes;