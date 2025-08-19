import { ref } from 'vue';
import { defineStore } from 'pinia';

type CustomBrowserHistoryContext = {
	needAdultCertification?: boolean;
	needRedirectToOrder?: boolean;
	redirectPath?: string;
};

export const useInAppBrowserContextStore = defineStore('in-app-context', () => {
	/** 페이지 진입시 발급된 토큰  */
	const generatedToken = ref<Nullable<string>>(null);
    /** 히스토리 처리를 위한 페이지 히스토리 저장 */
	const historyPositionContext = ref<Nullable<{
		path: string;
		startPosition: number;
		arrivedPosition: number;
		diff: number;
		options?: CustomBrowserHistoryContext;
	}>>(null);

    /** 뒤로가기 처리 후, 저장된 정보 삭제 처리 */
	const clearHistoryPosition = () => historyPositionContext.value = null;

	return {
		generatedToken,
		historyPositionContext,
		/**
		 * 외부 페이지 진입 전 발급된 토큰 정보설정
		 * @param token
		*/
		applyGeneratedToken: (token: string, arrivedPath: string, options?: CustomBrowserHistoryContext) => {
			clearHistoryPosition();
			generatedToken.value = token;
			// console.log(generatedToken.value, 'onStore');

			historyPositionContext.value = {
				path: arrivedPath,
				startPosition: window.history.state.position || 0,
				arrivedPosition: 0,
				diff: 0,
				options: options,
			};
		},
		/**
		 * 뒤로가기시 돌아가야할 히스토리 포지션 정보 설정
		 */
		applyHistoryPosition: (path: string) => {
			// XXX 시작 지점이 없으면..
			// XXX 돌아갈 지점도 없는데 .. 어케 처리하냐 .. ?
			if (historyPositionContext.value?.path !== path) return;

			historyPositionContext.value.arrivedPosition = (window.history.state.position || 0);
			historyPositionContext.value.diff = Math.max(1, historyPositionContext.value.arrivedPosition - historyPositionContext.value.startPosition);

		},
		clearToken: () => {
			generatedToken.value = null;
		},
	};
}, {
	persist: {
		storage: sessionStorage,
	},
});