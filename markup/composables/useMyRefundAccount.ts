import { useBackend } from '$/composables/useBackend';

export const useMyRefundAccount = () => {
	return {
		/** 환불계좌 조회 */
		get: async () => {
			try {
				const { refund_account } = await useBackend().command<{
					refund_account: RefundAccount;
				}>('v1/my/refund-account');

				return refund_account;
			}
			catch (e) {
				console.log(e);

				return null;
			}
		},
		/** 환불계좌 변경 */
		addOrUpdate: async (form: RefundAccountForm) => {
			await useBackend().command('v1/my/refund-account', {
				method: 'post',
				data: form,
			});
		},
		/** 환불계좌 삭제 */
		remove: async () => {
			await useBackend().command('v1/my/unset-refund-account', {
				method: 'post',
			});
		},
		/** 은행코드 조회 */
		getBankCodes: async () => {
			try {
				const { bank_codes } = await useBackend().command<{
					bank_codes: BankCode[];
				}>('v1/informations/banks');

				return bank_codes;
			}
			catch (e) {
				console.log(e);

				return [];
			}
		},
	};
};