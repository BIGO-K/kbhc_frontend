import { ref } from 'vue';
import { defineStore } from 'pinia';
import ApplicationError from '$/errors/ApplicationError';

type PageContext = {
	key: string;
	scrollTop: number;
	optional?: Record<string, string | number | object | boolean>;
};

export const usePageContextStore = defineStore('page-context', () => {
	const pageContexts = ref<PageContext[]>([]);
	const applicationError = ref<Nullable<ApplicationError>>(null);

	return {
		pageContexts,
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
	};
}, {
	persist: false,
});