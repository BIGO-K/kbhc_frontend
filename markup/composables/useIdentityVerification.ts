import { ref } from 'vue';
import { useInAppBrowserContextStore } from '$/stores/useInAppBrowserContextStore';
import { useBackend } from '$/composables/useBackend';
import { usePopupWindow } from '$/composables/usePopupWindow';
import { useUserAgent } from '$/composables/useUserAgent';

export const useIdentityVerification = () => {
	const { isInappBrowser } = useUserAgent();
	const inappBrowserContextStore = useInAppBrowserContextStore();
	const processToken = ref('');

    /**
     * 시작 컨텍스트 생성
     * @param redirectUrl
     * @returns
     */
	const generateEnterContext = async (redirectUrl?: string): Promise<string> => {
		const { token, enter_url } = await useBackend().command<GenerateEnterContext>('v1/identity-verification/generate-token', {
			method: 'post',
			data: {
				fe_redirect_url: redirectUrl,
			},
		});

		if (redirectUrl) inappBrowserContextStore.applyGeneratedToken(token, redirectUrl);
		processToken.value = token;

		return enter_url;
	};

	return {
		/** 프로세스 시작 */
		open: async () => {
			const enterUrl = ref<string | undefined>(undefined);
			const popupPromise = usePopupWindow('identityVerification', enterUrl).open();
			enterUrl.value = await generateEnterContext();

			await popupPromise;
		},
		/** 결과 조회 */
		result: async (): Promise<IdentityProfile> => {
			const profileWithoutToken = await useBackend().command<Omit<IdentityProfile, 'token'>>(`v1/identity-verification/${processToken.value}/result`, {
				method: 'post',
			});

			return {
				...profileWithoutToken,
				token: processToken.value,
			};
		},
		/** 회원존재 여부 */
		hasMember: async () => {
			const { is_duplicate_user } = await useBackend().command<{
				is_duplicate_user: boolean;
			}>('v1/members/member-duplicate-check', {
				method: 'post',
				data: {
					identity_token: processToken.value,
				},
			});

			return is_duplicate_user;
		},
		/** 성인인증 승인요청 */
		confirmForAdultCertification: async () => {
			await useBackend().command('v1/members/adult-verifications/confirm', {
				method: 'post',
				data: {
					token: processToken.value,
				},
			});
		},
		/** 회원 승인 요청 */
		confirmForMember: async () => {
			await useBackend().command('v1/auth/confirm-identity-verification', {
				method: 'post',
				data: {
					token: processToken.value,
				},
			});
		},
		currentContextOpen: async () => {
			// 인앱 브라우저인경우 여기서 종료.
			if (!isInappBrowser.value) {
				throw {
					message: '인앱 브라우저가 아닙니다.',
				};
			}

			const enter_url = await generateEnterContext(
				`${location.origin}/certification-result`
			);
			location.href = enter_url;
		},
		setProcessToken: (token: string) => {
			if (!token) {
				throw {
					message: '토근 정보가 없습니다.',
				};
			}

			processToken.value = token;
		},
	};
};