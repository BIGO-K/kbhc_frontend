<template>
	<layout
		title="살까말까 고민중"
		layout="popup"
	>
		<div :class="['m_mylike-folder-detail', { 'S=folder-modify': isEditing }]">
			<!-- 상단영역 -->
			<div class="m...folder-head">
				<div class="mm_lside">
					<p>전체<strong class="mm_text-variable">3개</strong></p>
				</div>
				<div
					v-if="wishItems.length > 0"
					class="mm_rside"
				>
					<div class="mm_btn_box">
						<div class="mm_inline">
							<button
								type="button"
								class="mm_btn T=xs T=secondary btn_modify"
								@click="() => { isEditing = !isEditing }"
							>
								<b class="mm_text-variable">편집하기</b>
							</button>
							<button
								type="button"
								class="mm_btn T=xs T=line T=light btn_modify_cancel"
								@click="() => { isEditing = false }"
							>
								<b>편집취소</b>
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- 상품목록 -->
			<p
				v-if="wishItems.length < 1"
				class="mm_text-none"
			>
				<i class="ico_text-none"></i>찜한 아이템이 없습니다
			</p>

			<div
				v-else
				class="mm_product-list T=sm"
			>
				<ul>
					<li
						v-for="goods in wishItems"
						:key="goods.id"
					>
						<form-check
							v-model="selectedItems"
							:value="goods.id"
							label="상품 선택"
							label-on-blind
							class="T=sm"
							icon-class="T=sm"
						></form-check>
						<div class="mm_product-item">
							<mm-link :to="{ name: 'ProductDetail', params: { id: goods.id } }">
								<figure>
									<div class="mm_product-item-image">
										<lazyload
											class="mm_bg-cover image_product"
											:src="goods.thumbnail_url"
										></lazyload>
									</div>
									<p
										v-if="goods.is_soldout"
										class="text_soldout"
									>
										품절
									</p>
									<figcaption>
										<p class="text_brand">
											{{ goods.brand_name }}
										</p>
										<p class="text_product">
											{{ goods.name }}
										</p>
										<p class="text_price">
											<strong>{{ number(goods.base_discounted_price) }}</strong>
										</p>
									</figcaption>
								</figure>
							</mm-link>
						</div>
					</li>
				</ul>
			</div>
			<div class="mm_btn_box T=fixed">
				<div class="mm_flex T=equal">
					<button
						type="button"
						class="mm_btn T=secondary btn_remove"
					>
						<b>삭제</b>
					</button>
					<button
						type="button"
						class="mm_btn T=primary btn_move"
						@click="overlayMyWishlistProductFolder"
					>
						<b>이동</b>
					</button>
				</div>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, defineAsyncComponent } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormCheck from '@/component/form/FormCheck.vue';

	type WishedGoods = {
		id: number;
		name: string;
		thumbnail_url: string;
		base_discounted_price: number;
		sale_rate: number;
		brand_name: string;
		is_soldout: boolean;
	};

	const { number } = useFormatter();
	const { openOverlay } = useGlobalPageContext();

	/** 편집중 여부 */
	const isEditing = ref(false);

	const goodsList = [
		{
			id: 1,
			name: '[유튜브PICK ] 2.64 SUMMER EDITION',
			thumbnail_url: '/image/_sample/prod_x1_1.png',
			base_discounted_price: 99000,
			sale_rate: 10,
			brand_name: 'M.Mon 엠몬스타',
			is_soldout: false,
		},
		{
			id: 3,
			name: '[나를위한특가] 에리제론 올인원 비건 샴푸',
			thumbnail_url: '/image/_sample/prod_x1_2.png',
			base_discounted_price: 99000,
			sale_rate: 10,
			brand_name: 'M.Mon 엠몬스타',
			is_soldout: true,
		},
		{
			id: 2,
			name: '시스루스트라이프셔츠',
			thumbnail_url: '/image/_sample/prod_x1_3.png',
			base_discounted_price: 99000,
			sale_rate: 10,
			brand_name: 'M.Mon 엠몬스타',
			is_soldout: false,
		},
	];

	const wishItems = ref<WishedGoods[]>(goodsList);
	const selectedItems = ref<WishedGoods[]>(wishItems.value.filter(_item => !_item.id));

	function overlayMyWishlistProductFolder() {
		const component = defineAsyncComponent(() => import('@/page/mypage/wishlist/product/folder/MyWishlistProductFolder.vue'));

		return openOverlay(component);
	}
</script>