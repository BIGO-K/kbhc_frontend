import { useBackend } from '$/composables/useBackend';

export const useCardInstallment = () => {
	return {
		/** [카드 할부] 조회 */
		get: async () => {
			const { interest_info } = await useBackend().command<{
				interest_info: CardInstallment;
			}>('v1/informations/installment');

			return interest_info;
		},
	};
};