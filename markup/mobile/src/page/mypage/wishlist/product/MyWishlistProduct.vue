<template>
	<div
		class="m_mylike-folder"
		data-sortable
		:class="{ 'S=sortable': isSorting }"
	>
		<!-- 상단영역 -->
		<div class="m_mylike-folder-head">
			<div class="mm_lside">
				<button
					type="button"
					class="btn_add-folder"
					@click="bomCreateWishlistFolder"
				>
					<i class="ico_add"></i><b>새 폴더 추가하기</b>
				</button>
				<p class="text_sortable-note">
					<i class="ico_sortable-handle"></i>끌어놓으면 순서를 바꿀 수 있어요
				</p>
			</div>
			<div class="mm_rside">
				<button
					type="button"
					class="mm_btn T=xs T=line T=light btn_sort-edit"
					@click="isSorting = true"
				>
					<i class="ico_edit"></i><b>순서편집</b>
				</button>
			</div>
		</div>

		<!-- 폴더목록 -->
		<div class="m_mylike-folder-list">
			<ul>
				<!-- (D) 기본폴더는 수정, 삭제, 순서이동이 불가능합니다 -->
				<li
					v-for="folder in folders"
					:key="folder.id"
				>
					<mm-link :to="{ name: 'MyWishlistProductDetail', params: { id: folder.id }}">
						<lazyload
							class="mm_bg-contain image_product"
							:src="folder.recent_goods_thumbnail_url"
						></lazyload>
						<p><span>{{ folder.name }}</span><small>{{ folder.records_count }}</small></p>
					</mm-link>
					<div class="mm_btn_box">
						<div class="mm_inline">
							<template v-if="folder.id !== 0">
								<button
									type="button"
									class="mm_btn T=line T=lighter btn_modify"
								>
									<b>수정</b>
								</button>
								<button
									type="button"
									class="btn_remove"
								>
									<i class="ico_remove T=sm"></i><b class="mm_ir-blind">폴더 삭제</b>
								</button>
							</template>
							<button
								type="button"
								class="btn_sort-handler"
							>
								<i class="ico_sortable-handle"></i><b class="mm_ir-blind">순서이동</b>
							</button>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div
			class="mm_btn_box T=fixed"
		>
			<div class="mm_flex T=equal">
				<button
					type="button"
					class="mm_btn T=light btn_sort-cancel"
					@click="isSorting = false"
				>
					<b>취소</b>
				</button>
				<button
					type="button"
					class="mm_btn T=primary btn_sort-complete"
					@click="isSorting = false"
				>
					<b>저장</b>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Lazyload from '@/component/Lazyload.vue';

	type GoodsWishFolder = {
		id: number;
		name: string;
		order_seq: number;
		records_count: number;
		recent_goods_thumbnail_url: Nullable<string>;
	};

	const isSorting = ref(false);

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
			name: '예쁜가방많네예쁜가방많네예쁜가방많네',
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
</script>