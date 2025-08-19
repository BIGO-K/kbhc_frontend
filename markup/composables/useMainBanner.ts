import { ref, computed } from 'vue';
import { usePopupStore } from '$/stores/usePopupStore';
import { useBackend } from '$/composables/useBackend';

export const useMainBanner = () => {
	const storeKey = 'MAIN_PO=PUP';

	const popup = usePopupStore();

	const mainLayerBanners = ref<MainBanner[]>([]);
	const isHideToday = computed(() => popup.isHide(storeKey));

	return {
		mainLayerBanners,
		isHideToday,
		/** 메인 배너항목 조회 */
		all: async () => {
			const { main_popups } = await useBackend().command<{
				main_popups: MainBanner[];
			}>('v1/exhibit/popups');

			mainLayerBanners.value = main_popups;
		},
		hide: () => popup.hide(storeKey),
	};
};