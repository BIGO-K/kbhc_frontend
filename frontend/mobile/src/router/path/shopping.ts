import { RouteRecordRaw } from 'vue-router';
import { productDetailGuard } from '@/router/guard/productDetailGuard';
// import { useCategoryStore } from '@/store/category';

const routes: RouteRecordRaw[] = [
	{
		path: '/category/:id',
		name: 'Category',
		component: () => import('@/page/category/Category.vue'),
	},
	{
		path: '/product/:id(\\d+)',
		name: 'ProductDetail',
		beforeEnter: productDetailGuard,
		component: () => import('@/page/product/detail/ProductDetail.vue'),
	},
	// 검색
	{
		path: '/search',
		children: [
			{
				path: '',
				name: 'Search',
				component: () => import('@/page/search/Search.vue'),
			},
			// 검색 결과
			{
				path: 'result',
				name: 'SearchResult',
				component: () => import('@/page/search/result/SearchResult.vue'),
			},
		],
	},
	// 판매자
	{
		path: '/seller/:id(\\d+)',
		name: 'SellerShop',
		component: () => import('@/page/seller/shop/SellerShop.vue'),
	},
	// 브랜드
	{
		path: '/brand/:id(\\d+)',
		name: 'BrandShop',
		component: () => import('@/page/brand/shop/BrandShop.vue'),
	},
	// 프로모션
	{
		path: '/promotion/:id(\\d+)',
		name: 'PromotionDetail',
		component: () => import('@/page/promotion/detail/PromotionDetail.vue'),
		props: (route) => ({ promotionId: Number(route.params.id) }),
	},
];

export default routes;