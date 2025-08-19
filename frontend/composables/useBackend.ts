import axios from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';
import { useAffiliateStore } from '$/stores/useAffiliateStore';
import { useAuthStore } from '$/stores/useAuthStore';
import { env } from '$/utils/env';
import { useUserAgent } from '$/composables/useUserAgent';
import { HTTP_STATUS_CODE } from '$/constants/HTTPSTATUSCODE';

declare global {
	interface Window {
		process: {
			env: Record<string, string>;
		};
	}
}

interface CommandOption<D> {
	method?: 'get' | 'post' | 'put' | 'delete';
	params?: Record<string, unknown>;
	isForce?: boolean;
	data?: D;
	asForm?: boolean;
}

window.process = { ...window.process, env: { LOGGER_LEVEL: 'warn' } };

const axiosInstance = axios
	.create({
		adapter: cacheAdapterEnhancer(axios.defaults.adapter!, {
			enabledByDefault: false,
		}),
		headers: {
			'user-device-type': 'mobile',
			'affiliate-code': 'MOBILE',
		},
		baseURL: env('MM_BACKEND_BASE_URL') || 'https://backend-mad.mmonstar.co.kr/api/',
	});

/**
 * axios request 인터셉트
 * 인증토큰 헤더 처리
 */
axiosInstance.interceptors.request.use(async config => {
	const authStore = useAuthStore();
	const { isMobileUser } = useUserAgent();
	const userToken = await authStore.getAccessToken();
	const affiliateStore = useAffiliateStore();

	if (config.headers) {
		if (userToken) config.headers.Authorization = `Bearer ${userToken}`;
		config.headers['uid-token'] = authStore.userUuid!;
		config.headers['agent-device-type'] = isMobileUser ? 'mobile' : 'pc';
		if (affiliateStore.currentCode) config.headers['affiliate-code'] = affiliateStore.currentCode;
	}

	return config;
}, undefined);

/**
 * axios response 인터셉트
 * 인증오류시 사용자 컨텍스트 초기화
 */
axiosInstance.interceptors.response.use(undefined, (error) => {
	const { isAppUser } = useUserAgent();
    // accessToken 값을 가지고 갔는데 AuthenticationException 오류가 나면 로컬 토큰 리셋처리
	if (
		// error.config?.headers?.Authorization &&
		error.response?.status == HTTP_STATUS_CODE.UNAUTHORIZED &&
        error.response?.headers &&
        error.response?.headers['cause-exception'] == 'AuthenticationException'
	) {
		const authStore = useAuthStore();
		if (
			!isAppUser
			&& (location.host === 'm-mad.mmonstar.co.kr' || location.host.includes('localhost'))
		) {
			return authStore.login('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJKV1QgVE9LRU4iLCJhdWQiOiJLQkhDLUNsaWVudCIsIm1lbWJlckluZm8iOnsibWJyRW1hZCI6InRlc3RAdGVzdC5jby5rciIsIm1ick5tIjoi6rmA67SJ6riwIiwibWJySm5UeXBlQ2QiOiIxMDUwMDEiLCJtYnJHcmRDZCI6IjEwNzAwMSIsIm1iclNuIjoxMDAwMDAwMDAzLCJtYnJOY2tubSI6Iuq5gOu0iSIsIm1ickpuTXRoVHlwQ2QiOiIxMDYwMDEiLCJtYmxVdWlkIjoiVVVJRDU2NzgifSwiaXNzIjoiS0JIQy1PQXV0aCIsImV4cCI6MjU2MzkyMjcyOSwiYXV0aFR5cGUiOiJVU0VSIiwidG9rZW5UeXBlIjoiQUNDRVNTIiwiaWF0IjoxNzAwMDA5MTI5fQ.iFiC3Y3WyRWZ1T45quo_Vc8bJz17XlR2uB3lGEImDiqh8p6g1m1FNMEuA7EvsGKf');
		}
		authStore.retryLogin();
	}

	return Promise.reject(error);
});

export const useBackend = () => {
	return {
		/** API 통신 실행 처리  */
		command: async <ResT, D = unknown>(
			path: string,
			options?: CommandOption<D>
		): Promise<ResT> => {
			// JWT 토큰 설정 처리
			if (options?.method === 'post') {
				const executor = options?.asForm ? axiosInstance.postForm : axiosInstance.post;
				const res = await executor(
					path,
					options.data,
					{
						params: options.params,
					}
				);

				return res.data;
			}

			const res = await axiosInstance.get<ResT>(path, {
				params: options?.params,
				cache: true,
				forceUpdate: history.state.forward === null || (options?.isForce ?? false),
			});

			return res.data;
		},
	};
};