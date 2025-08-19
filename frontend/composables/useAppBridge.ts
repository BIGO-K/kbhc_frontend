import { computed, ref } from 'vue';
import { useAuthStore } from '$/stores/useAuthStore';
import { usePayingProcessContextStore } from '$/stores/usePayingProcessContextStore';
import { useUserAgent } from '$/composables/useUserAgent';

/** 앱 함수 브릿지  */
type AppBridgeBaseResult = {
	resCd: 'S' | 'F';
	resMsg: 'Success' | 'Fail';
};

export const useAppBridge = () => {
	const authStore = useAuthStore();
	const isMember = computed(() => authStore.member != null);

	const { isAndroidUser, isIosUser, isAppUser } = useUserAgent();

	const execute = (functionName: string, params?: object) => {
		if (!isAndroidUser && !isIosUser) {
			return;
		}

		const androidBridgeFunction = window.healthCare;
		if (isAndroidUser && androidBridgeFunction) {
			params ? androidBridgeFunction[functionName](JSON.stringify(params)) : androidBridgeFunction[functionName]();

			return;
		}
		const iosBridgeFunction = window.webkit?.messageHandlers;
		if (iosBridgeFunction && iosBridgeFunction[functionName]) {
			params ? iosBridgeFunction[functionName].postMessage(JSON.stringify(params)) : iosBridgeFunction[functionName].postMessage(JSON.stringify({}));
		}

	};

	// resCd : "S", "F" ,resMsg : "Success" or "Fail"
	window.baseBridgeCallback = (result: string) => {
		const parseJson: AppBridgeBaseResult = JSON.parse(result);
		// @TODO 콜백함수 오류 발생시 처리
		if (parseJson.resCd === 'F') {
			return;
		}
	};

	window.loginCallback = (result: string) => {
		const parseJson: AppBridgeBaseResult & { data: {
			accessToken: string;
			refreshToken: string;
		}; } = JSON.parse(result);

		if (parseJson.resCd === 'F') {

			return goLogin();
		}
		if (parseJson.resCd === 'S' && parseJson.data.accessToken) {
			authStore.login(parseJson.data.accessToken);
		}
	};

	const { touchEnd } = usePayingProcessContextStore();

	function goLogin() {
		if (isMember.value) {
			return;
		}

		execute('goLogin', {
			callback: 'baseBridgeCallback',
		});
	}

	return {
		execute,
		isAppUser,
		closeCurrentWebview: () => {
			execute('currentWebViewClose', {
				callback: 'baseBridgeCallback',
			});
		},
		goLogin: goLogin,
		login: () => {
			if (!isAppUser) {
				return;
			}

			execute('getLoginInfo', {
				callback: 'loginCallback',
			});
		},
		goBack: () => {
			execute('goBack');
		},
		showCloseButton: () => {
			if (!isAppUser) {
				return;
			}
			execute('showHeader', {
				callback: 'baseBridgeCallback',
				isShowHeader: 'Y',
				titleType: 'CloseType',
				titleText: '결제',
			});
		},
		openWebview: (path: string, callback?: string) => {
			execute('startWebView', {
				callback: callback || 'baseBridgeCallback',
				url: `${location.origin}${path}`,
			});
		},
		/** 앱내에서 브라우저 여는 함수 */
		openBrowser: (path: string, callback?: string) => {
			if (!isAppUser) {
				window.open(path, '_blank');
			}
			execute('openBrowser', {
				callback: callback || 'baseBridgeCallback',
				url: path,
			});
		},
		goMain: (callback?: string) => {
			if (!isAppUser) {
				location.href = '/';

				return;
			}
			execute('setReturnPage', {
				callback: callback || 'baseBridgeCallback',
				returnUrl: '',
				option: 'main',
				mainTab: 'shopping',
			});

			execute('goPage', {
				callback: callback || 'baseBridgeCallback',
			});
		},
		toShare: (shareUrl: string) => {
			execute('shareUrlSNS', {
				callback: 'baseBridgeCallback',
				url: shareUrl,
			});
		},
	};

};
