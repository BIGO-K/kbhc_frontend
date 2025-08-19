import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import base from '@/router/path/base';
import custom from '@/router/path/custom';
import feature from '@/router/path/feature';
import mypage from '@/router/path/mypage';
import order from '@/router/path/order';
import shopping from '@/router/path/shopping';

const routes: RouteRecordRaw[] = [
	...base,
	...shopping,
	...order,
	...mypage,
	...feature,
	...custom,
];
const router = createRouter({
	history: createWebHistory(import.meta.env.MM_BASE_PATH ?? ''),
	routes,
});

router.onError((err) => {
	// console.error('router:error', err);
});


router.beforeEach((_to, _from, _next) => {
	// 로그인 필요
	if (_from.name === 'Present') {
		return _next(false);
	}
	_next();
});


router.afterEach((to, from) => {
    // 브라우저 자체 이동시 진출 트랜지션 처리를 위한 값
	to.meta.historyStatePosition = window.history.state.position;
	to.meta.isForward = (to.meta.historyStatePosition || 0) > (from.meta.historyStatePosition || 0);

});

export default router;