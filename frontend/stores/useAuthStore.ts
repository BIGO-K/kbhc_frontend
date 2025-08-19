import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import SecureLS from 'secure-ls';
import { useAppBridge } from '$/composables/useAppBridge';
import { useBackend } from '$/composables/useBackend';


const secureLs = new SecureLS({ isCompression: true });

export const useAuthStore = defineStore('auth', () => {
	const { login: appLogin } = useAppBridge();
	const userUuid = ref<string | undefined>(undefined);
	const memberToken = ref<Nullable<MemberToken>>(null);
	const member = ref<Nullable<AuthorizeMember>>(null);
	const memberUsableStartPoint = computed(() => member.value?.usable_star_point || false);
	const isUpdatedToken = ref<boolean>(false);
	const loginFailCount = ref<number>(0);
    /** 쇼핑몰 방문자의 고유값 생성 */
	const generateUserUuid = async () => {
		if (userUuid.value != null) return;

		const { uuid } = await useBackend().command<{ uuid: string }>('v1/generate-uuid');
		userUuid.value = uuid;
	};

	return {
		loginFailCount,
		isUpdatedToken,
		userUuid,
		memberUsableStartPoint,
		member,
		memberToken,
		generateUserUuid,
		/** 로그인 처리 */
		login: async (token: string): Promise<LoginResult> => {
			const response = await useBackend().command<LoginResult>('v1/auth/kbhc-login', {
				method: 'post',
				data: {
					token,
				},
			});

			memberToken.value = {
				token: response.token,
				refresh_token: response.refresh_token,
				expiry_at: response.expiry_at,
			};

			member.value = {
				name: response.user.name,
				grade: response.user.grade,
				usable_star_point: response.usable_star_point,
			};

			useBackend().command(`v1/auth/visits`, {
				method: 'post',
			}
			);

			loginFailCount.value = 0;

			return response;
		},
		getAccessToken: async () => {
			if (!member.value) {
				return null;
			}

			if (!memberToken.value) {
				member.value = null;

				return null;
			}


			const diffTimes = new Date(memberToken.value.expiry_at).getTime() - new Date().getTime();
			if (Math.round((diffTimes / 1000) / 60) < 10 && !isUpdatedToken.value) {
				isUpdatedToken.value = true;
				try {
					const { token, expiry_at } = await useBackend().command<{
						token: string;
						expiry_at: string;
					}>(
						'v1/auth/refresh-token',
						{
							method: 'post',
							data: {
								token: memberToken.value.token,
								refresh_token: memberToken.value.refresh_token,
							},
						}
					);

					memberToken.value.token = token;
					memberToken.value.expiry_at = expiry_at;
				}
				catch (e) {
					memberToken.value = null;
					member.value = null;

					return null;
				}
				finally {
					isUpdatedToken.value = false;
				}
			}

			return memberToken.value.token;
		},
		retryLogin: async () => {
			if (loginFailCount.value > 1) {
				return;
			}

			await appLogin();
			loginFailCount.value++;
		},


	};
}, {
	persist: {
		storage: {
			getItem: (key) => secureLs.get(key),
			setItem: (key, value) => secureLs.set(key, value),
		},
	},
});