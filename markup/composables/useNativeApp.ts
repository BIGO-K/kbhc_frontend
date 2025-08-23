import { useUserAgentStore } from '$/stores/useUserAgentStore';
import { useBackend } from '$/composables/useBackend';
import { useErrorAlert } from '$/composables/useErrorAlert';
import { useUserAgent } from '$/composables/useUserAgent';

export const useNativeApp = () => {
	const agentStore = useUserAgentStore();
	const { isAppUser } = useUserAgent();

	return {
		/**
		 * [앱 토큰] 저장
		 * 앱 첫 진입시 실행
		 * @param token 디바이스 고유토큰
		 * @param os 디바이스 OS ('A': 안드로이드, 'I': ios)
		 */
		storeFirebaseMessagingToken: async (uniqueId: string, token: string, os: 'A' | 'I') => {
			if (!token || !os) return;

			try {
				await useBackend().command('v1/native-app/store-token', {
					method: 'post',
					data: {
						token,
						os,
					},
				});

				agentStore.applyDeviceInfo({
					uuid: uniqueId,
					token: token,
					os: os,
				});
			}
			catch (e) {
				useErrorAlert(e);
			}
		},
		/**
		 * [앱 토큰] 수정
		 * 로그인/로그아웃시 실행
		 * @param token 디바이스 고유토큰
		 * @param os 디바이스 OS ('A': 안드로이드, 'I': ios)
		 */
		updateFirebaseMessagingToken: async () => {
			if (!isAppUser
				|| agentStore.deviceInfo === null
				|| (!agentStore.deviceInfo.os || !agentStore.deviceInfo.token)
			) return;

			await useBackend().command('v1/native-app/update-token-member', {
				method: 'post',
				data: {
					token: agentStore.deviceInfo.token,
					os: agentStore.deviceInfo.os,
				},
			});
		},
		/**
		 * [광고성 푸시] 수신동의 여부 조회
		 * @param token 디바이스 고유토큰
		 * @param os 디바이스 OS ('A': 안드로이드, 'I': ios)
		 * @returns
		 */
		getPushAgreement: async () => {
			if (!isAppUser
				|| agentStore.deviceInfo === null
				|| (!agentStore.deviceInfo.os || !agentStore.deviceInfo.token)
			) return;

			return await useBackend().command<{
				is_receive_push: boolean;
				is_receive_night_push: boolean;
			}>('v1/native-app/push-agreement', {
				params: {
					token: agentStore.deviceInfo.token,
					os: agentStore.deviceInfo.os,
				},
			});
		},
		/**
		 * [광고성 푸시] 수신 동의 여부 수정
		 * @param token 디바이스 고유토큰
		 * @param os 디바이스 OS ('A': 안드로이드, 'I': ios)
		 * @param isReceivePush push알림 수신
		 * @param isReceiveNightPush 야간 push알림 수신
		 */
		updatePushAgreement: async (isReceivePush: boolean, isReceiveNightPush: boolean) => {
			if (!isAppUser
				|| agentStore.deviceInfo === null
				|| (!agentStore.deviceInfo.os || !agentStore.deviceInfo.token)
			) return;

			await useBackend().command('v1/native-app/update-token-push-agreement', {
				method: 'post',
				data: {
					token: agentStore.deviceInfo.token,
					os: agentStore.deviceInfo.os,
					is_notification_agree: isReceivePush,
					is_night_notification_agree: isReceiveNightPush,
				},
			});
		},
		/**
		 * 앱버전 정보 조회
		 * @returns 최신앱버전, 앱 업데이트 링크
		 */
		getAppVersionInfo: async () => await useBackend().command<{
			recent_app_version: string;
			app_update_link: string;
		}>('v1/native-app/version-info'),
		/**
		 * 생체인증 토큰 생성
		 * @param uuid
		 */
		createBiometricToken: async (uuid: string) => {
			const { token } = await useBackend().command<{
				token: string;
			}>('v1/native-app/app-access-token', {
				method: 'post',
				data: {
					uuid,
				},
			});

			return token;
		},
	};
};