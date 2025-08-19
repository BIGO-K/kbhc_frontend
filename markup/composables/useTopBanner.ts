import { ref } from 'vue';
import { useBackend } from '$/composables/useBackend';

export const useTopBanner = () => {
	const isShow = ref(false);

	return {
		isShow,
		/** [탑 배너] 조회 */
		get: async () => {
			const { top_banner } = await useBackend().command<{
				top_banner: Nullable<TopBanner>;
			}>('v1/exhibit/top-banners/displays');

			return top_banner;
		},
	};
};