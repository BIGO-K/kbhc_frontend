import { AsyncComponentLoader, Component } from 'vue';
import { usePageContextStore } from '$/stores/usePageContextStore';
import { useBackend } from '$/composables/useBackend';

export const useBlock = () => {
	const MOBILE_BLOCK_COMPONENTS = import.meta.glob<false, 'raw', AsyncComponentLoader<Component>>('../mobile/src/block/**/*.vue');// XXX any
	const { applyPageContext, getCurrentPageContext } = usePageContextStore();

    /**
     * 블록 컴포넌트 경로 리턴
     * @param name
     * @returns
     */
	const getValidBlockPath = (name: string): Nullable<string> => {
		const path = `../mobile/src/block/${name}.vue`;

		return MOBILE_BLOCK_COMPONENTS[path] ? path : null;
	};

	return {
		/**
		 * 블록 페이지 조회
		 * @param pageName
		 * @returns
		 */
		getPage: async (pageName: string): Promise<Container[]> => {
			const { containers } = await useBackend().command<{
				containers: Container[];
			}>(`v1/exhibit/lego/${pageName}`);

			return containers.filter(container => container.blocks.filter(block => (
				(block.banner_partition?.total ?? 0) > 0
				|| (block.coop_deal_partition?.total ?? 0) > 0
				|| (block.showcase_partition?.total ?? 0) > 0
				|| (block.goods_group?.total ?? 0) > 0
				|| (block.tabs?.length ?? 0) > 0
			) && getValidBlockPath(block.mui_code)).length > 0);
		},
		/**
		 * 블록 컴포넌트 getter 함수 리턴
		 * @param name
		 * @returns
		 */
		getComponentGetter: (name: string) => {
			const path = getValidBlockPath(name);
			if (!path) {
				throw Error('block component not exists');
			}

			return MOBILE_BLOCK_COMPONENTS[path];
		},
		applyContext: (block: Block, context: BlockContext) => {
			applyPageContext({
				key: `${block.mui_code}_${block.id}`,
				scrollTop: 0,
				optional: context,
			});
		},
		getContext: (block: Block): BlockContext | undefined => getCurrentPageContext(`${block.mui_code}_${block.id}`)?.optional,
	};
};