import { useBackend } from '$/composables/useBackend';

export const useMyAddress = () => {
	return {
		/** 회원 배송지 리스트 조회 */
		all: async () => {
			const { receive_addresses } = await useBackend().command<{
				receive_addresses: MyShippingAddressDetail[];
			}>('v1/shopping/receive-addresses', {
				isForce: true,
			});

			return receive_addresses;
		},
		/** 회원 배송지 등록 */
		add: async (form: MyShippingAddressStoreForm) => {
			await useBackend().command('v1/shopping/receive-addresses', {
				method: 'post',
				data: form,
			});
		},
		/** 회원 배송지 삭제 */
		remove: async (id: number) => {
			await useBackend().command(`v1/shopping/receive-addresses/${id}/destroy`, {
				method: 'post',
			});
		},
	};
};