import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import { useAppBridge } from '$/composables/useAppBridge';
import ApplicationError from '$/errors/ApplicationError';

type PageContext = {
	key: string;
	scrollTop: number;
	optional?: Record<string, string | number | object | boolean>;
};

export const usePageContextStore = defineStore('page-context', () => {
	const pageContexts = ref<PageContext[]>([]);
	const headerSticky = ref<boolean>(false);
	const router = useRouter();
	const applicationError = ref<Nullable<ApplicationError>>(null);
	const { isAppUser, closeCurrentWebview } = useAppBridge();

	return {
		pageContexts,
		headerSticky,
		applicationError,
		getCurrentPageContext: (path: string) => pageContexts.value.find(context => context.key === path),
		/** 현재 페이지 컨텍스트 저장 */
		applyPageContext: (currentPageContext: PageContext) => {
			pageContexts.value = pageContexts.value
				.filter(pageContext => pageContext.key !== currentPageContext.key)
				.concat(currentPageContext);
		},
		/** 페이지 컨텍스트 삭제  */
		removePageContext: (currentPageContext: PageContext) => {
			pageContexts.value = pageContexts.value
				.filter(pageContext => pageContext.key !== currentPageContext.key);
		},
		clearErrorWithHistoryBack: () => {
			const beforePath = window.history.state.back || '/';
			applicationError.value = null;


			if (beforePath === '/') {
				if (isAppUser) {
					closeCurrentWebview();
				}
				else {
					router.push({
						path: '/',
					});
				}
			}
			else {
				router.go(-1);
			}
		},
		setHeaderSticky: (flag: boolean) => {
			headerSticky.value = flag;
		},
	};
}, {
	persist: {
		storage: sessionStorage,
	},
});