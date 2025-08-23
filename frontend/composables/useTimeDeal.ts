import { useBackend } from '$/composables/useBackend';

export const useTimeDeal = () => {
	return {
		/** [타임딜] 리스트 조회 */
		getList: async () => {
			return await useBackend().command<{
				type: TimeDealBannerType;
				banners: TimeDealBanner[];
			}>('v1/exhibit/time-attacks');
		},
		/** [타임딜] 정보 조회 */
		getInformation: async (goodsId: number) => {
			const { time_deal_info } = await useBackend().command<{
				time_deal_info: TimeDealInformation;
			}>(`v1/goods/${goodsId}/timeattack`);

			return time_deal_info;
		},
	};
};