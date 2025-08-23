import { useBackend } from '$/composables/useBackend';

export const useBrand = () => {
	return {
		all: async (): Promise<Brand[]> => {
			const { brands } = await useBackend().command<{
				brands: Brand[];
			}>('v1/brand');

			return brands;
		},
	};
};