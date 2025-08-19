import { ref } from 'vue';
import { useBackend } from '$/composables/useBackend';

export const useCaptcha = () => {
	const imageUrl = ref('');
	const validateToken = ref('');

    /** 캡차코드 생성 */
	const generate = async () => {
		const { captcha_image_url, token } = await useBackend().command<{
			captcha_image_url: string;
			token: string;
		}>('v1/auth/make-captcha', {
			method: 'post',
		});

		imageUrl.value = captcha_image_url;
		validateToken.value = token;
	};

	return {
		imageUrl,
		generate,
		/**
		 * 캡차코드 매칭 검증
		 * @param code
		*/
		match: async (code: string) => {
			try {
				await useBackend().command('v1/auth/check-captcha', {
					method: 'post',
					data: {
						token: validateToken.value,
						captcha_code: code,
					},
				});
			}
			catch (error) {
				/** 실패한 캡챠 재사용 불가 */
				generate();
				throw error;
			}
		},
	};
};