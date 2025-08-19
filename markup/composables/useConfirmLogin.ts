import { useAuthStore } from '$/stores/useAuthStore';
import { useGlobalPageContext } from './useGlobalPageContext';

// XXX 사용 안함?
export const useConfirmLogin = (redirectToAfter: string, message?: string) => {
	// const authStore = useAuthStore();
	// const { router, bom } = useGlobalPageContext();

	// if (!authStore.member) {
	// 	bom.confirm(message || '로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까?', flag => {
	// 		if (!flag) return;

	// 		router.push({
	// 			name: 'Login',
	// 			query: {
	// 				redirect_to_after: redirectToAfter,
	// 			},
	// 		});
	// 	});
	// }
};