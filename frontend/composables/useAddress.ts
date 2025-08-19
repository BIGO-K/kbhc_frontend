import { useBackend } from '$/composables/useBackend';

export const useAddress = () => {
	return {
		/**
		 * 우편번호 찾기 paginator 결과 리턴
		 * @param keyword
		 * @param page
		 * @param pageSize
		 * @returns
		 */
		getAddressPaginator: async (keyword: string, page: number = 1, pageSize: number = 5) => {
			const { paginator } = await useBackend().command<{
				paginator: Paginator<SearchAddress>;
			}>('v1/search-address', {
				params: {
					page: page,
					page_size: pageSize,
					keyword: keyword,
				},
			});

			return paginator;
		},
		/**
		 * 도서산간 여부 체크
		 * @param zipCode
		 * @param roadAddress
		 * @returns
		 */
		isExtraAreaCheck: async (zipCode: string, roadAddress: string) => {
			const { is_extra_area } = await useBackend().command<{
				is_extra_area: boolean;
			}>('v1/shopping/is-extra-shipping-price-area', {
				method: 'post',
				params: {
					zip_code: zipCode,
					address: roadAddress,
				},
			});

			return is_extra_area;
		},
	};
};