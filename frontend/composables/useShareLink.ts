import { useBackend } from '$/composables/useBackend';

export const useShareLink = () => {
	return {
		getShortLink: async (_url: string, _previousUrl: string = '') => {
			const pathUrl = _previousUrl
				? `popupUri=${_url}&tab=shopping&previousPopupUri=${_previousUrl}`
				: `popupUri=${_url}&tab=shopping`;

			const { short_url } = await useBackend().command<{
				short_url: string;
			}>('v1/register-shorten-url', {
				method: 'get',
				params: {
					url: pathUrl.replace(/\//g, '%2F'),
				},
			});

			return short_url;
		},
	};
};

