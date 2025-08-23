import { useBackend } from '$/composables/useBackend';

export const useWingBanner = () => {
	return {
		/** 윙배너 리스트 조회 */
		getList: async () => {
			const { wing_banners } = await useBackend().command<{
				wing_banners: WingBanner[];
			}>('v1/exhibit/right-wing-banners');

			return wing_banners;
		},
	};
};