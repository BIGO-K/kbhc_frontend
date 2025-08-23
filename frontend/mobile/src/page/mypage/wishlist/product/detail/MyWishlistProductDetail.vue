<template>
	<layout
		:title="folderName"
		layout="popup"
	>
		<div :class="['m_mylike-folder-detail', { 'S=folder-modify': isEdit }]">
			<!-- 상단영역 -->
			<div class="m...folder-head">
				<div class="mm_lside">
					<p>전체<strong class="mm_text-variable">{{ productItems.length }}개</strong></p>
				</div>
				<div
					v-if="productItems.length > 0"
					class="mm_rside"
				>
					<div class="mm_btn_box">
						<div class="mm_inline">
							<button
								type="button"
								class="mm_btn T=xs T=secondary btn_modify"
								@click="isEdit = true"
							>
								<b class="mm_text-variable">편집하기</b>
							</button>
							<button
								type="button"
								class="mm_btn T=xs T=line T=light btn_modify_cancel"
								@click="isEdit = false"
							>
								<b>편집취소</b>
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- 상품목록 -->
			<template v-if="productItems.length === 0">
				<p class="mm_text-none">
					<i class="ico_text-none"></i>찜한 아이템이 없습니다
				</p>
			</template>
			<template v-else>
				<div class="mm_product-list T=sm">
					<ul>
						<li
							v-for="item in productItems"
							:key="item.id"
						>
							<form-check
								v-model="selectedIds"
								:value="item.id"
								label="상품 선택"
								label-on-blind
								class="T=sm"
								icon-class="T=sm"
							></form-check>
							<product-item
								class="T=single"
								:goods="(item as Goods)"
								:usable="{
									keys: ['brand_name', 'base_discounted_price', 'is_soldout'],
								}"
								:use-wish="false"
							></product-item>
						</li>
					</ul>
				</div>
				<div class="mm_btn_box T=fixed">
					<div class="mm_flex T=equal">
						<button
							type="button"
							class="mm_btn T=secondary btn_remove"
							:disabled="selectedIds.length === 0"
							@click="removeWishProduct"
						>
							<b>삭제</b>
						</button>
						<button
							type="button"
							class="mm_btn T=primary btn_move"
							:disabled="selectedIds.length === 0"
							@click="_e => overlayMyWishlistProductFolder(_e)"
						>
							<b>이동</b>
						</button>
					</div>
				</div>
			</template>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, defineAsyncComponent, computed } from 'vue';
	import { useWishedStore } from '$/stores/useWishedStore';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useWishedGoods } from '$/composables/useWishedGoods';
	import Layout from '@/component/layout/Layout.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import FormCheck from '@/component/form/FormCheck.vue';

	const { bom, loading, openOverlay, route } = useGlobalPageContext();
	const {
		folders,
		getAll,
	} = await useWishedGoods();
	const { remove } = useWishedStore();

	const folderId = Number(route.params.id);

	const folderName = computed(() => folders.value.find(_folder => _folder.id === folderId)?.name ?? '');
	const productItems = ref(await getAll(folderId));

	// 편집
	const isEdit = ref(false);
	const selectedIds = ref<number[]>([]);

	/** 찜한상품 삭제 */
	const removeWishProduct = async () => {
		bom.confirm('선택한 상품을 삭제하시겠습니까?', async (_is) => {
			if (!_is) return;

			loading.show();
			try {
				await remove(selectedIds.value);
				productItems.value = await getAll(folderId);
				selectedIds.value = [];
				bom.alert('상품이 삭제되었습니다.');
			}
			catch (_e) {
				useErrorAlert(_e);
			}
			finally {
				loading.hide();
			}
		});
	};

	/** 찜한상품 폴더 이동 */
	const overlayMyWishlistProductFolder = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/mypage/wishlist/product/folder/MyWishlistProductFolder.vue')), {
			props: {
				type: 'move',
				goodsId: selectedIds.value,
			},
			clickElement: _e.currentTarget,
			onClose: async () => {
				productItems.value = await getAll(folderId);
				selectedIds.value = [];
			},
		});
	};
</script>