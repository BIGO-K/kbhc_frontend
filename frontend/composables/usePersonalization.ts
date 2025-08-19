import { useBackend } from '$/composables/useBackend';

export const usePersonalization = () => {
	return {
		/** 신발사이즈 리스트 조회 */
		getShoesSizes: async () => {
			try {
				const { shoes_sizes } = await useBackend().command<{
					shoes_sizes: ShoesSize[];
				}>('v1/informations/shoes-sizes');

				return shoes_sizes;
			}
			catch (e) {
				return [];
			}
		},
		/** 신발 카테고리 리스트 조회 */
		getShoesCategories: async () => {
			const { shoes_categories } = await useBackend().command<{
				shoes_categories: ShoesCategory[];
			}>('v1/informations/shoes-genders');

			return shoes_categories;
		},
		/** My핏 리스트 */
		getFits: async () => {
			const { fit_list } = await useBackend().command<{
				fit_list: Fit[];
			}>('v1/informations/fits');

			return fit_list;
		},
		/** My핏 리스트 */
		getMySize: async () => {
			const { fit_list } = await useBackend().command<{
				fit_list: Fit[];
			}>('v1/informations/fits');

			return fit_list;
		},
		/** MY사이즈 수정 */
		updateMySize: async (form: MySize) => {
			await useBackend().command('v1/my/personalization', {
				method: 'post',
				data: form,
			});
		},
	};
};