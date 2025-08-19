import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	// 선물하기
	{
		path: '/present',
		children: [
			{
				path: '',
				name: 'Present',
				component: () => import('@/custom/present/Present.vue'),
			},
			{
				path: 'success',
				name: 'PresentSuccess',
				component: () => import('@/custom/present/success/PresentSuccess.vue'),
			},
			// 선물 상세
			{
				path: ':id(\\d+)',
				name: 'PresentDetail',
				component: () => import('@/custom/present/PresentDetail.vue'),
			},
			// 마이 선물함
			{
				path: 'my',
				name: 'PresentMy',
				component: () => import('@/custom/present/PresentMy.vue'),
				redirect: {
					name: 'MyRecentlyProduct',
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
];

export default routes;