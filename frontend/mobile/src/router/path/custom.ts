import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	// 선물하기
	{
		path: '/present',
		children: [
			{
				path: ':id',
				name: 'Present',
				meta: {
					onlyGuest: true,
				},
				component: () => import('@/custom/present/Present.vue'),
				props: (route) => ({ giftCode: route.params.id }),
			},
			// 선물 상세
			{
				path: 'my/receive/:id(\\d+)',
				name: 'PresentReceiveDetail',
				component: () => import('@/custom/present/PresentDetail.vue'),
				props: (route) => ({ orderId: route.params.id, isReceive: true }),
			},
			{
				path: 'my/sent/:id(\\d+)',
				name: 'PresentSentDetail',
				component: () => import('@/custom/present/PresentDetail.vue'),
				props: (route) => ({ orderId: route.params.id, isReceive: false }),
			},
			// 마이 선물함
			{
				path: 'my',
				name: 'PresentMy',
				component: () => import('@/custom/present/PresentMy.vue'),
				redirect: {
					name: 'PresentMyReceive',
				},
				children: [
					{
						path: 'receive',
						name: 'PresentMyReceive',
						meta: {
							tab: '받은 선물함',
						},
						component: () => import('@/custom/present/receive/PresentMyReceive.vue'),
					},
					{
						path: 'sent',
						name: 'PresentMySent',
						meta: {
							tab: '보낸 선물함',
						},
						component: () => import('@/custom/present/sent/PresentMySent.vue'),
					},
				],
			},
		],
	},
	// 패키지 상품사세
	{
		path: '/bundle/:id(\\d+)',
		name: 'BundleGoodsDetail',
		component: () => import('@/custom/bundle/BundleGoodsDetail.vue'),
	},
];

export default routes;