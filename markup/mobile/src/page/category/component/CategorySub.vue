<template>
	<layout
		:title="selectedCategories.map(_value => _value.name).join(' > ')"
		:hide-title="true"
	>
		<template #afterTitle>
			<h1>
				<toggle
					class="btn_category"
					title="펼쳐보기"
					active-title="접어놓기"
					@click="isMenuOpen = !isMenuOpen"
				>
					<b>{{ selectedCategories[0].name }}</b><i class="ico_dropdown T=sm"></i>
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
							v-for="item in tabItems"
							:key="item.id"
						>
							<a
								:class="{ 'S=category-on': tabId === item.id }"
								href="#"
								:title="tabId === item.id ? '선택됨' : undefined"
								@click.prevent="tabId = item.id"
							>
								<b>{{ item.tab }}</b>
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
					<x-scroll-menu :items="tabItems2depth">
						<template #firstItem>
							<a>
								<b>전체</b>
							</a>
						</template>
						<template #default="{ item }">
							<!-- (D) 선택된 카테고리에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다 -->
							<a
								:class="{ 'S=tab-on': tabId2depth === item.id }"
								href="#"
								:title="tabId2depth === item.id ? '선택됨' : undefined"
								@click.prevent="e => tabId2depth = item.id"
							>
								<b>{{ item.tab }}</b>
							</a>
						</template>
					</x-scroll-menu>
				</div>

				<!-- 소카테고리 -->
				<div class="m_product-category-list">
					<x-scroll-menu :items="tabItems3depth">
						<template #default="{ item }">
							<!-- (D) 선택된 카테고리에 'S=category-on' 클래스와 '선택됨' 타이틀을 추가합니다 -->
							<a
								class="mm_btn T=sm T=lighter"
								:class="{ 'S=category-on': tabId3depth === item.id }"
								href="#"
								:title="tabId3depth === item.id ? '선택됨' : undefined"
								@click.prevent="tabId3depth = item.id"
							>
								<b>{{ item.tab }}</b>
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
								<li
									v-for="item in tabItems3depth"
									:key="item.id"
								>
									<a
										:class="{ 'S=category-on': tabId3depth === item.id }"
										href="#"
										:title="tabId3depth === item.id ? '선택됨' : undefined"
										@click.prevent="tabId3depth = item.id"
									>
										<b>{{ item.tab }}</b>
									</a>
								</li>
							</ul>
						</div>
					</template>
				</dropdown>
			</div>

			<!-- 상품리스트 -->
			<div class="mm_inner">
				<!-- 카테고리 배너 -->
				<div class="m_product-category-banner">
					<i class="image_banner">
						<lazyload
							tag="img"
							src="/image/_sample/category_banner_1.jpg"
							alt="미니멀한 색상과 패턴 SEASON-OFF 단독 최대 60% 할인"
						></lazyload>
					</i>
				</div>

				<div class="mm_product-list">
					<div class="mm_product-list-head">
						<p class="text_total">
							전체 <strong>8,960</strong>개
						</p>
						<form-select v-model="sortProductFilter">
							<option>판매순</option>
							<option>신상품순</option>
							<option>낮은가격순</option>
							<option>높은가격순</option>
							<option>할인율 높은순</option>
							<option>리뷰 많은순</option>
						</form-select>
						<toggle
							class="btn_array"
							:is-active="true"
							active-class="T=card"
							title="리스트형"
							active-title="카드형"
							parent-selector=".mm_product-list"
							@toggle="toggleStyleProduct"
						>
							<i
								class="ico_array"
								:class="isSortCard ? 'T=wide' : 'T=card'"
							></i><b class="mm_ir-blind">상품 정렬 변경</b>
						</toggle>
						<!-- (D) 필터에 선택된 사항이 있을 경우 'btn_filter'에 'S=filter-on' 클래스를 추가합니다 -->
						<a
							href="#"
							class="btn_filter"
							@click.prevent="overlayCategoryFilter"
						>
							<b>필터</b><i class="ico_filter"></i>
						</a>
					</div>

					<template v-if="productItems.length < 1">
						<p class="mm_text-none">
							<i class="ico_text-none"></i>등록된 상품이 없습니다
						</p>
					</template>
					<template v-else>
						<ul>
							<li
								v-for="item in productItems"
								:key="item.id"
							>
								<product-item
									class="T=pa"
									:goods="item"
								></product-item>
							</li>
						</ul>
					</template>
				</div>

				<!-- 하단더보기 -->
				<div
					class="mm_foot"
				>
					<div class="mm_btn_box">
						<div class="mm_inline">
							<button
								type="button"
								class="mm_btn T=xs T=line btn_more"
							>
								<b>상품 리스트 더보기</b><i class="ico_more"></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</template>
	</layout>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref } from 'vue';
	import { useFakeCreator } from '$/composables/useFakeCreator';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import Toggle from '@/component/Toggle.vue';
	import XScrollMenu from '@/component/XScrollMenu.vue';
	import FormSelect from '@/component/form/FormSelect.vue';

	const { openOverlay } = useGlobalPageContext();

	const productItems = useFakeCreator().goods(50);// XXX 상품 임시 생성

	const isSortCard = ref(true);
	const toggleStyleProduct = (_isActive: boolean) => {
		isSortCard.value = _isActive;
		console.log('상품정렬 토글', _isActive);
	};

	const selectedCategories = [
		{
			code: '001000000',
			name: '남성',
		},
		{
			code: '001001000',
			name: '아우터',
		},
	];

	const tabItems = [
		{ id: '0', tab: 'NEW' },
		{ id: '1', tab: '남성' },
		{ id: '2', tab: '여성' },
		{ id: '3', tab: '키즈' },
		{ id: '4', tab: '캠핑' },
		{ id: '5', tab: '화장품' },
		{ id: '6', tab: '캐리어' },
		{ id: '7', tab: '아울렛' },
	];
	const tabId = ref<string>(tabItems[0].id);

	const tabItems2depth = [
		{ id: '0', tab: '아우터' },
		{ id: '1', tab: '티셔츠' },
		{ id: '2', tab: '팬츠' },
		{ id: '3', tab: '가방' },
		{ id: '4', tab: '신발' },
		{ id: '5', tab: '모자' },
		{ id: '6', tab: '반팔' },
	];
	const tabId2depth = ref<string>(tabItems2depth[0].id);

	const tabItems3depth = [
		{ id: '0', tab: '전체' },
		{ id: '1', tab: '비즈니스 라인' },
		{ id: '2', tab: '백팩' },
		{ id: '3', tab: '슬링백/힙색' },
		{ id: '4', tab: '서브백' },
		{ id: '5', tab: '멀티백' },
	];
	const tabId3depth = ref<string>(tabItems3depth[0].id);

	const sortProductFilter = ref('');
	const isMenuOpen = ref(false);

	function overlayCategoryFilter() {
		const component = defineAsyncComponent(() => import('@/page/category/filter/CategoryFilter.vue'));

		return openOverlay(component);
	}
</script>