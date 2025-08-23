import { useBackend } from '$/composables/useBackend';

export const useSpotTheme = () => {
	return {
		/** [스팟성 테마관] 상세조회 (템플릿 리스트 조회) */
		getTemplates: async (spotThemeId: number) => {
			const { template_list } = await useBackend().command<{
				template_list: SpotThemeTemplate[];
			}>(`v1/exhibit/spot-themes/${spotThemeId}/template-list`);

			return template_list;
		},
	};
};