import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	// 랭킹
	{
		path: '/ranking',
		meta: {
			type: 'b',
		},
		component: () => import('@/feature/ranking/b/Ranking.vue'),
		children: [
			{
				path: '',
				name: 'RankingMain',
				meta: {
					tab: '홈',
				},
				component: () => import('@/feature/ranking/b/RankingMain.vue'),
			},
			{
				path: 'product',
				name: 'RankingProduct',
				meta: {
					tab: '아이템',
				},
				component: () => import('@/feature/ranking/b/RankingProduct.vue'),
			},
			{
				path: 'brand',
				name: 'RankingBrand',
				meta: {
					tab: '브랜드',
				},
				component: () => import('@/feature/ranking/b/RankingBrand.vue'),
			},
			{
				path: 'view',
				name: 'RankingView',
				meta: {
					tab: 'View',
				},
				component: () => import('@/feature/ranking/b/RankingView.vue'),
			},
			{
				path: 'wishlist',
				name: 'RankingWishlist',
				meta: {
					tab: '찜',
				},
				component: () => import('@/feature/ranking/b/RankingWishlist.vue'),
			},
		],
	},
	// 이벤트
	{
		path: '/event',
		children: [
			{
				path: '',
				name: 'Event',
				component: () => import('@/feature/event/Event.vue'),
			},
			// 이벤트 상세
			{
				path: ':id(\\d+)',
				name: 'EventDetail',
				component: () => import('@/feature/event/EventDetail.vue'),
				props: (route) => ({ eventId: Number(route.params.id) }),
			},
		],
	},
	// 체험단
	{
		path: '/experience',
		children: [
			{
				path: '',
				name: 'Experience',
				component: () => import('@/feature/experience/Experience.vue'),
			},
			// 체험단 상세
			{
				path: ':id(\\d+)',
				name: 'ExperienceDetail',
				component: () => import('@/feature/experience/ExperienceDetail.vue'),
				props: (route) => ({ experienceId: Number(route.params.id) }),
			},
		],
	},
	// 공동구매
	{
		path: '/coop',
		children: [
			{
				path: '',
				name: 'Coop',
				component: () => import('@/feature/coop/Coop.vue'),
				redirect: {
					name: 'CoopOngoin',
				},
				children: [
					// 진행중
					{
						path: 'ongoing',
						name: 'CoopOngoin',
						meta: {
							tab: '진행중',
						},
						component: () => import('@/feature/coop/ongoing/CoopListOngoing.vue'),
					},
					// 마감
					{
						path: 'completed',
						name: 'CoopCompeted',
						meta: {
							tab: '마감',
						},
						component: () => import('@/feature/coop/completed/CoopListCompleted.vue'),
					},
				],
			},
			// 공동구매 상세
			{
				path: ':id(\\d+)',
				name: 'CoopDetail',
				component: () => import('@/feature/coop/CoopDetail.vue'),
			},
		],
	},
	// 래플
	{
		path: '/raffle',
		children: [
			{
				path: '',
				name: 'Raffle',
				meta: {
					type: 'b',
				},
				component: () => import('@/feature/raffle/b/Raffle.vue'),
			},
			// 래플 상세
			{
				path: ':id(\\d+)',
				name: 'RaffleDetail',
				component: () => import('@/feature/raffle/RaffleDetail.vue'),
			},
		],
	},
	{
		path: '/mypage/raffle',
		name: 'MyRaffle',
		component: () => import('@/feature/raffle/RaffleMy.vue'),
	},
	// 쇼케이스
	{
		path: '/showcase',
		children: [
			{
				path: '',
				name: 'Showcase',
				component: () => import('@/feature/showcase/Showcase.vue'),
			},
			// 쇼케이스 상세
			{
				path: ':id(\\d+)',
				name: 'ShowcaseDetail',
				component: () => import('@/feature/showcase/ShowcaseDetail.vue'),
				props: (route) => ({ showcaseId: Number(route.params.id) }),
			},
		],
	},
];

export default routes;