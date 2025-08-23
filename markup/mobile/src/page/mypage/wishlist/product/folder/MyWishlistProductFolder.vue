<template>
	<div class="m_like-folder">
		<h3><b>상품을 담을 폴더를 선택하세요</b></h3>
		<button
			type="button"
			class="btn_add-folder"
			@click.prevent="bomCreateWishlistFolder"
		>
			<i class="ico_add"></i><b>새 폴더 추가하기</b>
		</button>
		<ul>
			<li
				v-for="folder in folders"
				:key="folder.id"
			>
				<button type="button">
					<lazyload
						class="mm_bg-cover image_product"
						:src="folder.recent_goods_thumbnail_url"
					></lazyload>
					<p><span>{{ folder.name }}</span><small>{{ folder.records_count }}</small></p>
					<i class="ico_sortable-handle"></i><b class="mm_ir-blind">순서이동</b>
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Lazyload from '@/component/Lazyload.vue';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	const { bom } = useGlobalPageContext();

	const bomCreateWishlistFolder = () => {
		bom.prompt(
			'추가할 폴더 이름을 입력하세요',
			(_is: boolean, _values: Record<string, string>) => {
				console.log(_is, _values);
			},
			{
				title: '새 폴더 추가하기',
				forms: [
					{ type: 'text', name: 'folder', maxLength: 10, placeholder: '최대 10자 입력' },
				],
			}
		);
	};

	defineExpose<OverlayComponentExpose>({
		title: `폴더 선택`,
	});


	const folders: GoodsWishFolder[] = [
		{
			id: 0,
			name: '기본폴더',
			order_seq: 1,
			records_count: 50,
			recent_goods_thumbnail_url: '/image/_sample/prod_x1_2.png',
		},
		{
			id: 2,
			name: '구매각',
			order_seq: 2,
			records_count: 0,
			recent_goods_thumbnail_url: null,
		},
		{
			id: 3,
			name: '살까말까고민중',
			order_seq: 3,
			records_count: 50,
			recent_goods_thumbnail_url: '/image/_sample/prod_x1_1.png',
		},
		{
			id: 4,
			name: '예쁜가방많네...',
			order_seq: 4,
			records_count: 50,
			recent_goods_thumbnail_url: '/image/_sample/prod_x1_3.png',
		},
		{
			id: 5,
			name: '운동할때신을것',
			order_seq: 5,
			records_count: 50,
			recent_goods_thumbnail_url: '/image/_sample/prod_x1_4.png',
		},
	];
</script>