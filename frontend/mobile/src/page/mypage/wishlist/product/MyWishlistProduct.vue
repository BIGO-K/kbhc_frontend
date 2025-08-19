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
					@click="createWishFolder"
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
			<!-- (D) 기본폴더는 수정, 삭제, 순서이동이 불가능합니다 -->
			<sortable
				tag="ul"
				:list="folders"
				:options="{ handle: '.btn_sort-handler', animation: 100 }"
				item-key="id"
				@end="onDragEndFolder"
			>
				<template #item="{ element: folder }">
					<li :data-sort-index="folder.id">
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
										@click="updateFolder(folder)"
									>
										<b>수정</b>
									</button>
									<button
										type="button"
										class="btn_remove"
										@click="removeFolder(folder)"
									>
										<i class="ico_remove T=sm"></i><b class="mm_ir-blind">폴더 삭제</b>
									</button>
									<button
										type="button"
										class="btn_sort-handler"
									>
										<i class="ico_sortable-handle"></i><b class="mm_ir-blind">순서이동</b>
									</button>
								</template>
							</div>
						</div>
					</li>
				</template>
			</sortable>
		</div>
		<div class="mm_btn_box T=fixed">
			<div class="mm_flex T=equal">
				<button
					type="button"
					class="mm_btn T=light btn_sort-cancel"
					@click="sortedWishFolder(false)"
				>
					<b>취소</b>
				</button>
				<button
					type="button"
					class="mm_btn T=primary btn_sort-complete"
					@click="sortedWishFolder(true)"
				>
					<b>저장</b>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, watch } from 'vue';
	import { Sortable } from 'sortablejs-vue3';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { usePageScroller } from '$/composables/usePageScroller';
	import { useWishedGoods } from '$/composables/useWishedGoods';
	import Lazyload from '@/component/Lazyload.vue';

	const { loading } = useGlobalPageContext();
	const {
		folders,
		createFolder,
		updateFolder,
		removeFolder,
		updateFolderSort,
	} = await useWishedGoods();
	const { getScroller, scrollTo } = usePageScroller();

	const isSorting = ref(false);
	let beforeChangeFolders = [...folders.value];

	/** 폴더 생성 */
	const createWishFolder = async () => {
		await createFolder();

		const $scroller = getScroller() as HTMLElement;
		if ($scroller instanceof HTMLElement === false) return;
		scrollTo({ top: $scroller.scrollHeight - $scroller.clientHeight, left: 0 });
	};

	/** 폴더 순서변경 */
	const sortedWishFolder = async (_isSave: boolean) => {
		// 기본폴더 포함 2개면 변동 없음
		if (folders.value.length < 3) {
			isSorting.value = false;

			return;
		}

		const sorts = folders.value.map((_folder, _i) => ({ id: _folder.id, order_seq: _i }));
		sorts.shift();// 기본폴더 제외

		// 순서변경 저장
		if (_isSave) {
			loading.show();
			try {
				await updateFolderSort(sorts);
			}
			catch (_e) {
				useErrorAlert(_e);
			}
			finally {
				loading.hide();
			}
		}
		// 변경 전 순서로
		else folders.value = beforeChangeFolders;

		isSorting.value = false;
	};

	/** 폴더 순서변경 콜백 */
	const onDragEndFolder = (_e: { oldIndex: number; newIndex: number } & Event) => {
		const item = folders.value.splice(_e.oldIndex, 1);
		folders.value.splice(_e.newIndex, 0, ...item);
	};

	watch(isSorting, _value => {
		if (!_value) return;

		beforeChangeFolders = [...folders.value];// 순서 변경 전 순서 저장
	});
</script>