import { RouteRecordRaw } from 'vue-router';

// TODO store에서 사용하는 유료 타입에 따라 링크 삭제

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
			},
		],
	},
	// 코디샷
	{
		path: '/codyshot',
		children: [
			{
				path: '',
				name: 'Codyshot',
				// query: { category: 0, page: 1 },
				component: () => import('@/feature/codyshot/Codyshot.vue'),
			},
			// 코디샷 상세
			{
				path: ':id(\\d+)',
				name: 'CodyshotDetail',
				component: () => import('@/feature/codyshot/CodyshotDetail.vue'),
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
			{
				path: 'my',
				name: 'RaffleMy',
				component: () => import('@/feature/raffle/RaffleMy.vue'),
			},
		],
	},
	// 쇼케이스
	{
		path: '/showcase',
		children: [
			{
				path: '',
				name: 'Showcase',
				// query: { category: 0, page: 1 },
				component: () => import('@/feature/showcase/Showcase.vue'),
			},
			// 쇼케이스 상세
			{
				path: ':id(\\d+)',
				name: 'ShowcaseDetail',
				component: () => import('@/feature/showcase/ShowcaseDetail.vue'),
			},
		],
	},
];

export default routes;