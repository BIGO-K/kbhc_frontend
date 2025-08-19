<template>
	<layout
		:title="selectedCategoryFullName"
		:hide-title="true"
	>
		<template #afterTitle>
			<h1>
				<toggle
					v-model:is-active="isMenuOpen"
					class="btn_category"
					title="펼쳐보기"
					active-title="접어놓기"
					@click="isMenuOpen = !isMenuOpen"
				>
					<b>{{ currentCategory1?.name }}</b><i class="ico_dropdown T=sm"></i>
				</toggle>
			</h1>

			<!-- 대카테고리 -->
			<div
				v-if="isMenuOpen"
				class="mm_header-category"
			>
				<div class="mm_header-category-dim"></div>
				<div class="mm_scroller">
					<ul>
						<li
							v-for="category1 in categories"
							:key="category1.code"
						>
							<a
								href="#"
								:class="{ 'S=category-on' : currentCategory1?.code === category1.code }"
								:title="currentCategory1?.code === category1.code ? '선택됨' : undefined"
								@click.prevent="categoryChange(category1)"
							>
								<b>{{ category1.name }}</b>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</template>

		<template #default>
			<!-- (D) 카테고리 선택 시 새로고침 되지 않고 페이지 내에서 카테고리 아래로 내용만 변경됩니다 -->
			<!-- 카테고리 -->
			<div class="m_product-category">
				<!-- 중카테고리 -->
				<div class="mm_tab_menu T=scroll m_product-category-list">
					<x-scroll-menu
						:items="currentCategory1?.children || []"
						:active-index="(currentCategory1?.children || []).findIndex(cate2 => cate2.code === currentCategory2?.code)"
					>
						<template #firstItem>
							<a
								href="#"
								:class="{ 'S=tab-on': currentCategory2 === undefined }"
								:title="currentCategory2 === undefined ? '선택됨' : undefined"
								@click.prevent="categoryChange(currentCategory1)"
							>
								<b>전체</b>
							</a>
						</template>
						<template #default="{ item: cate2 }">
							<!-- (D) 선택된 카테고리에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다 -->
							<a
								:class="{ 'S=tab-on': currentCategory2?.code === cate2.code }"
								href="#"
								:title="currentCategory2?.code === cate2.code ? '선택됨' : undefined"
								@click.prevent="categoryChange(currentCategory1, cate2)"
							>
								<b>{{ cate2.name }}</b>
							</a>
						</template>
					</x-scroll-menu>
				</div>

				<!-- 소카테고리 -->
				<div class="m_product-category-list">
					<x-scroll-menu
						:items="currentCategory2?.children || []"
						:active-index="(currentCategory2?.children || []).findIndex(cate3 => cate3.code === currentCategory3?.code)"
					>
						<template #firstItem>
							<a
								class="mm_btn T=sm T=lighter"
								:class="{ 'S=category-on': currentCategory3 === undefined }"
								href="#"
								:title="currentCategory3 === undefined ? '선택됨' : undefined"
								@click.prevent="categoryChange(currentCategory1, currentCategory2)"
							>
								<b>전체</b>
							</a>
						</template>
						<template #default="{ item: cate3 }">
							<!-- (D) 선택된 카테고리에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다 -->
							<a
								class="mm_btn T=sm T=lighter"
								:class="{ 'S=category-on': currentCategory3?.code === cate3.code }"
								href="#"
								:title="cate3.code === currentCategory3?.code ? '선택됨' : undefined"
								@click.prevent="categoryChange(currentCategory1, currentCategory2, cate3)"
							>
								<b>{{ cate3.name }}</b>
							</a>
						</template>
					</x-scroll-menu>
				</div>

				<!-- 소카테고리 드롭다운 -->
				<dropdown :icon-class="'T=category T=sm'">
					<template #button>
						<b class="mm_ir-blind">소 카테고리</b>
					</template>
					<template #content>
						<!-- (D) 선택된 카테고리에 'S=category-on' 클래스와 '선택됨' 타이틀을 추가합니다 -->
						<div class="mm_scroller">
							<ul>
								<li>
									<a
										:class="{ 'S=category-on': currentCategory3 === undefined }"
										href="#"
										:title="currentCategory3 === undefined ? '선택됨' : undefined"
										@click.prevent="categoryChange(currentCategory1, currentCategory2)"
									>
										<b>전체</b>
									</a>
								</li>

								<template v-if="currentCategory2 !== undefined">
									<li
										v-for="cate3 in currentCategory2?.children"
										:key="cate3.code"
									>
										<a
											:class="{ 'S=category-on': currentCategory3?.code === cate3.code }"
											href="#"
											:title="cate3.code === currentCategory3?.code ? '선택됨' : undefined"
											@click.prevent="categoryChange(currentCategory1, currentCategory2, cate3)"
										>
											<b>{{ cate3.name }}</b>
										</a>
									</li>
								</template>
							</ul>
						</div>
					</template>
				</dropdown>
			</div>

			<!-- 카테고리 배너 -->
			<div
				v-if="selectedCategory?.mobile_top_image_url"
				class="m_product-category-banner"
			>
				<i class="image_banner">
					<lazyload
						tag="img"
						is-force
						:src="selectedCategory?.mobile_top_image_url"
						:alt="selectedCategory?.mobile_top_alt"
					></lazyload>
				</i>
			</div>

			<filter-goods-infinite-list
				:key="`${selectedCategoryCode}_${itemsChanged}`"
				:is-pending="itemsChanged"
				:total-count="totalCount"
				:filterable="filterable"
				:goods-list-by-page="goodsListByPage"
				:init-params-for-command="paramsForCommand"
				:fetch-count="fetchCount"
				:fetch-list="fetchList"
			>
			</filter-goods-infinite-list>
		</template>
	</layout>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { useCategories } from '$/composables/useCategories';
	import { useCategoryShop } from '$/composables/useCategoryShop';
	import { useFilterable } from '$/composables/useFilterable';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import FilterGoodsInfiniteList from '@/component/FilterGoodsInfiniteList.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import Toggle from '@/component/Toggle.vue';
	import XScrollMenu from '@/component/XScrollMenu.vue';

	const { route, router } = useGlobalPageContext();
	const categoryCode = ref<string>(`${route.params.id}`);
	const { getAll, categories } = useCategories();
	const isMenuOpen = ref<boolean>(false);

	const {
		getInfo,
		fetchFilterable,
		fetchCount,
		fetchList,
		changeCategoryCode,
	} = useCategoryShop(categoryCode.value);

	const {
		filterable,
		goodsListByPage,
		paramsForCommand,
		totalCount,
		startContext,
		changeContext,
		itemsChanged,
	} = useFilterable(
		fetchFilterable,
		fetchCount,
		fetchList
	);

	await Promise.all([
		getInfo(categoryCode.value, true),
		getAll(),
		startContext(),
	]);

	const currentCategory1 = ref<Category | undefined>(categories.value.find(
		cate1 => cate1.code === categoryCode.value
			|| cate1.children.some(
				cate2 => cate2.code === categoryCode.value
					|| cate2.children.some(cate3 => cate3.code === categoryCode.value)
			)
	));

	const currentCategory2 = ref<Category | undefined>(currentCategory1.value?.children?.find(
		category2 => category2.code == categoryCode.value
			|| category2.children?.some(category3 => category3.code == categoryCode.value)
	));

	const currentCategory3 = ref<Category | undefined>(currentCategory2.value?.children?.find(category3 => category3.code == categoryCode.value));

	const selectedCategoryFullName = computed(() => {
		if (currentCategory3.value && currentCategory1.value && currentCategory2.value) {
			return `${currentCategory1.value.name} > ${currentCategory2.value.name} > $${currentCategory3.value.name}`;
		}

		if (currentCategory1.value && currentCategory2.value) {
			return `${currentCategory1.value.name} > ${currentCategory2.value.name}`;
		}

		return `${currentCategory1.value?.name || ''}`;
	});
	const selectedCategory = computed<Category | undefined>(() => currentCategory3.value || currentCategory2.value || currentCategory1.value);
	/** 현재 활성화된 카테고리 코드 */
	const selectedCategoryCode = computed<string>(() => selectedCategory.value?.code || categoryCode.value);

	const categoryChange = async (depth1Category?: Category, depth2Category?: Category, depth3Category?: Category) => {
		await getInfo(depth3Category ? depth3Category.code : (depth2Category ? depth2Category.code : depth1Category?.code || ''));
		currentCategory1.value = depth1Category ?? undefined;
		currentCategory2.value = depth2Category ?? undefined;
		currentCategory3.value = depth3Category ?? undefined;
		changeCategoryCode(selectedCategoryCode.value);
		isMenuOpen.value = false;
		await changeContext();
		router.replace({
			params: {
				id: selectedCategoryCode.value,
			},
		});
	};
</script>