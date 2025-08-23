import { AsyncComponentLoader, Component } from 'vue';
import { usePageContextStore } from '$/stores/usePageContextStore';
import { useWishedStore } from '$/stores/useWishedStore';
import { findNestedArray, unique } from '$/utils/array';
import { useBackend } from '$/composables/useBackend';

export const useBlock = () => {
	const MOBILE_BLOCK_COMPONENTS = import.meta.glob<false, 'raw', AsyncComponentLoader<Component>>('../mobile/src/page/main/component/**/*.vue');
	const { applyPageContext, getCurrentPageContext } = usePageContextStore();
	const { check } = useWishedStore();

    /**
     * 블록 컴포넌트 경로 리턴
     * @param name
     * @returns
     */
	const getValidBlockPath = (name: string): Nullable<string> => {
		const path = `../mobile/src/page/main/component/${name}.vue`;

		return MOBILE_BLOCK_COMPONENTS[path] ? path : null;
	};

	const hasContents = (block: Block) => {
		return (block.banner_partition?.banners ?? []).length > 0
			|| (block.goods_group?.goods_list ?? []).length > 0
			|| (block.tabs ?? []).length > 0;
	};

	return {
		/**
		 * 블록 페이지 조회
		 * @param pageName
		 * @returns
		 */
		getPage: async (): Promise<Container[]> => {
			const { containers } = await useBackend().command<{
				containers: Container[];
			}>(`v1/exhibit/lego/mainpage`);

			return containers.filter(container => container.blocks.filter(block => hasContents(block) && getValidBlockPath(block.mui_code)).length > 0);
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
		getBannerContext: (block: Block, banner: BlockBanner): BlockContext | undefined => {
			return getCurrentPageContext(`${block.mui_code}_${block.id}_${banner.id}`)?.optional;
		},
		applyBannerContext: (block: Block, banner: BlockBanner, context: BlockContext) => {
			applyPageContext({
				key: `${block.mui_code}_${block.id}_${banner.id}`,
				scrollTop: 0,
				optional: context,
			});
		},
		checkLikedGoods: (containers: Container[]) => check(unique(findNestedArray(containers, 'goods_list.id')) as number[]),
	};
};