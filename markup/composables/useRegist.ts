import { useBackend } from '$/composables/useBackend';

export const useRegist = () => {
	return {
		isDuplicateLoginId: async (loginId: string) => {
			const { is_exist } = await useBackend().command<{
				is_exist: boolean;
			}>('v1/members/id-duplicate-check', {
				method: 'post',
				data: {
					login_id: loginId,
				},
			});

			return is_exist;
		},
	};
};