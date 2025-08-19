<template>
	<div
		ref="$page"
		class="m_like-folder"
	>
		<h3><b>상품을 담을 폴더를 선택하세요</b></h3>
		<button
			type="button"
			class="btn_add-folder"
			@click="createWishFolder"
		>
			<i class="ico_add"></i><b>새 폴더 추가하기</b>
		</button>
		<ul>
			<li
				v-for="folder in folders"
				:key="folder.id"
			>
				<button
					type="button"
					@click="prop.type === 'add' ? addWishedItem(folder) : moveWishedItem(folder)"
				>
					<lazyload
						class="mm_bg-cover image_product"
						:src="folder.recent_goods_thumbnail_url"
					></lazyload>
					<p><span>{{ folder.name }}</span><small>{{ folder.records_count }}</small></p>
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useWishedStore } from '$/stores/useWishedStore';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { usePageScroller } from '$/composables/usePageScroller';
	import { useWishedGoods } from '$/composables/useWishedGoods';
	import Lazyload from '@/component/Lazyload.vue';

	const prop = defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
		/** @prop { 'add' | 'move' } - 추가, 이동 유형 */
		type: 'add' | 'move';
		/** @prop {} */
		goodsId: number | number[];
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `폴더 선택`,
	});

	const { bom } = useGlobalPageContext();
	const {
		folders,
		createFolder,
		moveToFolder,
	} = await useWishedGoods();
	const wishedStore = useWishedStore();
	const { getScroller, scrollTo } = usePageScroller();

	const $page = ref<HTMLElement>();

	/** 폴더 생성 */
	const createWishFolder = async () => {
		await createFolder();

		const $scroller = getScroller($page.value, true) as HTMLElement;
		if ($scroller instanceof HTMLElement === false) return;
		scrollTo({ top: $scroller.scrollHeight - $scroller.clientHeight, left: 0 });
	};

	const addWishedItem = async (_folder: GoodsWishFolder) => {
		await wishedStore.addToFolder({
			goods_id: prop.goodsId as number,
			folder_id: _folder.id,
		});

		bom.alert(`${_folder.name} 폴더에 추가되었습니다.`, () => {
			prop.closer();
		});
	};

	const moveWishedItem = async (_folder: GoodsWishFolder) => {
		await moveToFolder(prop.goodsId as number[], _folder);

		bom.alert(`${_folder.name} 폴더로 이동되었습니다.`, () => {
			prop.closer();
		});
	};
</script>