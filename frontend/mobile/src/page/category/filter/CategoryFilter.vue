<template>
	<div class="mm_filter">
		<!-- 필터상단 -->
		<div class="mm_filter-unit">
			<div class="mm_scroller T=x">
				<div class="mm_btn_box">
					<div class="mm_inline">
						<!-- (D) 선택한 버튼에 'S=btn-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
						<template
							v-for="benefit in filterable.benefits || []"
							:key="benefit.label"
						>
							<button
								type="button"
								class="mm_btn T=sm T=lighter"
								:title="f.selected.benefits.includes(benefit) ? '선택됨' : undefined"
								:class="{ 'S=btn-on' : f.selected.benefits.includes(benefit) }"
								@click="toggleBenefit(benefit)"
							>
								<b>{{ benefit.label }}</b>
							</button>
						</template>
					</div>
				</div>
			</div>
		</div>

		<!-- 필터영역 -->
		<div
			ref="$filterTab"
			class="mm_filter-tab"
		>
			<div
				class="mm_tab"
				data-tab
			>
				<!-- 탭메뉴 -->
				<div class="mm_tab_menu">
					<div class="mm_scroller">
						<!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀이 추가됩니다. -->
						<ul>
							<li
								v-for="tab in tabMenuList"
								:key="tab.name"
							>
								<button
									type="button"
									class="btn_tab"
									:class="{ 'S=tab-on': selectTabMenu === tab.name }"
									:title="selectTabMenu === tab.name? '선택됨' : undefined"
									@click="selectTabMenu = tab.name"
								>
									<b>{{ tab.label }}</b>
								</button>
							</li>
						</ul>
					</div>
				</div>

				<!-- 카테고리 -->
				<div
					class="mm_tab-item"
					:class="{ 'S=tab-on': selectTabMenu === 'category' }"
				>
					<div class="mm_filter-tab-category">
						<div class="mm_scroller">
							<div class="mm_accordion">
								<!--
									(D) 전체체크를 위해서 각 카테고리 영역에 맞게 체크박스의 '_group' 명을 맞춰줍니다.
									체크박스 옵션에 '_group' 명이 두개 들어가는 경우엔 1depth '_group' 명을 먼저 작성하시고, 2depth '_group' 명은 그 다음에 작성해주세요.
								-->
								<ul>
									<li
										v-for="category in filterable.categories"
										:key="category.name"
									>
										<dropdown
											tag="dl"
											group="category"
											icon-class="T=sm"
										>
											<template #button>
												<p>{{ category.name }}</p>
												<b
													v-if="f.selectedCategoriesCount.value"
													class="text_count"
													:class="{'S=count-on' : (f.selectedCategoriesCount && f.selectedCategoriesCount.value[category.code]?.depth3SelectedCount > 0) }"
												>
													<template v-if="f.selectedCategoriesCount.value[category.code].isDepth2All">
														전체
													</template>
													<template v-else>
														<span>{{ f.selectedCategoriesCount.value[category.code].depth3SelectedCount }}</span>개
													</template>
												</b>
											</template>
											<template #content>
												<!-- 카테고리 2depth -->
												<div class="mm_filter...sub">
													<label class="mm_form-check">
														<input
															type="checkbox"
															:checked="f.selectedCategoriesCount.value![category.code].isDepth2All"
															@change="() => toggleAllChildCategories(category)"
														>
														<b class="mm_inline">
															<b class="mm_flex">
																<span class="text_label">전체</span>
																<small>{{ number(category.goods_count) }}</small>
															</b>
														</b>
													</label>
													<ul>
														<li
															v-for="depth2Category in category.child_categories"
															:key="depth2Category.name"
														>
															<dropdown
																tag="dl"
																:class="{ 'S=use' : f.isChildrenCategoryAllSelected(depth2Category) }"
																:group="category.code"
																icon-class="T=sm"
															>
																<template #button>
																	<p><b class="mm_flex"><span>{{ depth2Category.name }}</span><small>{{ number(depth2Category.goods_count) }}</small></b></p>
																</template>
																<template #content>
																	<!-- 카테고리 3depth -->
																	<div class="mm_check-list">
																		<label class="mm_form-check">
																			<input
																				type="checkbox"
																				:checked="f.isChildrenCategoryAllSelected(depth2Category)"
																				@change="f.toggleChildrenCategory(depth2Category)"
																			>
																			<b class="mm_inline">
																				<b class="mm_flex">
																					<span class="text_label">전체</span>
																					<small>{{ number(depth2Category.goods_count) }}</small>
																				</b>
																			</b>
																		</label>
																		<ul>
																			<li
																				v-for="depth3Category in depth2Category.child_categories"
																				:key="depth3Category.name"
																			>
																				<form-check
																					v-model="f.selected.categories"
																					:hide-icon="false"
																					:value="depth3Category"
																					block-style="inline"
																				>
																					<div class="mm_flex">
																						<span class="text_label">{{ depth3Category.name }}</span>
																						<small>{{ number(depth3Category.goods_count) }}</small>
																					</div>
																				</form-check>
																			</li>
																		</ul>
																	</div>
																</template>
															</dropdown>
														</li>
													</ul>
												</div>
											</template>
										</dropdown>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				<!-- 브랜드 -->
				<div
					class="mm_tab-item"
					:class="{ 'S=tab-on': selectTabMenu === 'brand' }"
				>
					<div class="mm_filter-tab-brand">
						<!-- 브랜드검색 -->
						<div class="mm_filter...search">
							<form-text
								v-model="filter.brandKeyword"
								type="search"
								placeholder="브랜드를 검색하세요"
								@keydown.enter.prevent="f.brandKeyword.value = filter.brandKeyword"
							>
								<template #button>
									<button
										type="button"
										class="btn_search"
										@click="f.brandKeyword.value = filter.brandKeyword"
									>
										<i class="ico_search T=lg"></i><b class="mm_ir-blind">검색하기</b>
									</button>
								</template>
							</form-text>
						</div>

						<!-- 브랜드목록 -->
						<div class="mm_filter...list">
							<!-- 검색된브랜드목록 -->
							<div class="mm_scroller T=brand-search">
								<template v-if="f.selectableBrands.value.length">
									<div class="mm_check-list">
										<ul>
											<li
												v-for="brand in f.selectableBrands.value"
												:key="brand.id"
											>
												<form-check
													v-model="f.selected.brands"
													:value="brand"
													:hide-icon="false"
													block-style="inline"
												>
													<b class="mm_flex">
														<span class="text_label">{{ brand.name }}</span>
														<small>{{ brand.goods_count }}</small>
													</b>
												</form-check>
											</li>
										</ul>
									</div>
								</template>
								<template v-else>
									<!-- (D) 정렬 키워드에 속한 브랜드가 없는 경우 '.mm_text-none' 요소를 노출합니다. -->
									<p class="mm_text-none">
										<i class="ico_text-none"></i>브랜드가 없습니다
									</p>
								</template>
							</div>

							<!-- 자음목록 -->
							<div class="mm_scroller T=brand-sort">
								<!-- (D) 현재페이지에 적용되어 있는 버튼에 'S=btn-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
								<ul>
									<li
										v-for="charGroup in f.brandFilterCharGroups.mobile"
										:key="charGroup"
									>
										<button
											type="button"
											:class="{ 'S=btn-on' : f.brandCharGroup.value === charGroup }"
											:title="f.brandCharGroup.value === charGroup ? '선택됨' : undefined"
											@click="f.brandCharGroup.value = charGroup"
										>
											<b>{{ charGroup }}</b>
										</button>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				<!-- 가격 -->
				<div
					class="mm_tab-item"
					:class="{ 'S=tab-on': selectTabMenu === 'price' }"
				>
					<div class="mm_filter-tab-price">
						<div class="mm_scroller">
							<div class="mm_check-list">
								<ul>
									<li
										v-for="priceRange in f.selectablePriceRanges.value"
										:key="`${priceRange.min}~${priceRange.max}`"
									>
										<label class="mm_form-check">
											<input
												v-model="f.selected.price_ranges"
												type="checkbox"
												:value="priceRange"
												@change="e => filter.handlePriceRangeChange(e, priceRange)"
											>
											<b class="mm_block">
												<span class="text_label">{{ f.textPriceRange(priceRange) }}</span>
											</b>
										</label>
									</li>
								</ul>
							</div>
							<div class="mm_form_mix-linked">
								<form-text
									v-model="filter.priceMin"
									input-mode="number"
									placeholder="최저금액"
									@input="f.selected.price_ranges = []"
								></form-text>
								<span class="text_tilde">~</span>
								<form-text
									v-model="filter.priceMax"
									input-mode="number"
									placeholder="최고금액"
								></form-text>
							</div>
						</div>
					</div>
				</div>

				<!-- 별점 -->
				<div
					class="mm_tab-item"
					:class="{ 'S=tab-on': selectTabMenu === 'star' }"
				>
					<div class="mm_filter-tab-star">
						<div class="mm_scroller">
							<div class="mm_check-list">
								<ul>
									<li
										v-for="reviewRate in f.selectableReviewRates.value"
										:key="reviewRate.value"
									>
										<label class="mm_form-check">
											<input
												v-model="f.selected.review_rates"
												:value="reviewRate"
												type="checkbox"
											>
											<b class="mm_block">
												<span class="text_label"><i class="ico_star-fill"></i>{{ reviewRate.label }}</span>
											</b>
										</label>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				<size-filter
					v-if="useSizeFilter"
					:class="{ 'S=tab-on': selectTabMenu === 'shoes' }"
					:select-shoes-size="selectShoesSize"
					:selected-shoes="selectedShoes"
				></size-filter>
			</div>
		</div>

		<!-- 하단고정버튼 -->
		<div class="mm_btn_box T=fixed">
			<div class="mm_flex T=auto">
				<button
					type="button"
					class="btn_filter-reset"
					@click="filter.reset"
				>
					<i class="ico_reload"></i><b class="mm_ir-blind">초기화</b>
				</button>
				<button
					type="button"
					@click="filter.apply"
				>
					<b>적용하기</b>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGoodsFilterable } from '$/composables/useGoodsFilterable';
	import Dropdown from '@/component/Dropdown.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormText from '@/component/form/FormText.vue';
	import SizeFilter from '@/feature/size-filter/component/SizeFilter.vue';

	const props = defineProps<{
		filterable: GoodsFilterable;
		initParamsForCommand: GoodsFilterParamForCommand;
		closer: CloseHandler<GoodsFilterSelected>;
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
	}>();

	const { number } = useFormatter();
	const tabMenuList = computed(() => {
		return [
			{
				name: 'category',
				label: '카테고리',
				usable: (props.filterable.categories || []).length > 0 ? true : false,
			},
			{
				name: 'brand',
				label: '브랜드',
				usable: (props.filterable.brands || []).length > 0 ? true : false,
			},
			{
				name: 'price',
				label: '가격',
				usable: (props.filterable.price_ranges || []).length > 0 ? true : false,
			},
			{
				name: 'star',
				label: '별점',
				usable: (props.filterable.review_rates || []).length > 0 ? true : false,
			},
			{
				name: 'color',
				label: '색상',
				usable: (props.filterable.colors || []).length > 0 ? true : false,
			},
			{
				name: 'fit',
				label: 'FIT',
				usable: false,
			},
			{
				name: 'shoes',
				label: '슈즈',
				usable: false,
			},
		].filter(filterable => filterable.usable);
	});

	const selectTabMenu = ref(tabMenuList.value[0].name);

	const useSizeFilter = ref(true);
	const selectShoesSize = ref([
		{ size: '220 이하' },
		{ size: '225' },
		{ size: '230' },
		{ size: '235' },
		{ size: '240' },
		{ size: '245' },
		{ size: '250' },
		{ size: '255' },
		{ size: '260' },
		{ size: '265' },
		{ size: '270' },
		{ size: '275' },
		{ size: '280' },
		{ size: '285' },
		{ size: '290' },
		{ size: '300 이상' },
	]);
	const selectedShoes = ref<string[]>([]);

	defineExpose<OverlayComponentExpose>({
		title: `필터`,
		isFull: true,
	});

	const f = useGoodsFilterable(
		props.filterable,
		props.initParamsForCommand
	);
	const filter = ref({
		brandKeyword: '',

		priceMin: '',
		priceMax: '',
		handlePriceRangeChange: (e: Event, priceRange: PriceRangeForFilter) => {
			if ((e.target as HTMLInputElement).checked) {
				f.selected.price_ranges = [priceRange];
			}

		},
		applyManualPriceRange: () => {
			const min = !filter.value.priceMin ? 0 : Number.parseInt(filter.value.priceMin);
			const max = !filter.value.priceMax ? 0 : Number.parseInt(filter.value.priceMax);

			const priceRange: PriceRangeForFilter = {
				min,
				max,
			};

			f.selected.price_ranges = [priceRange];
		},

		reset: () => {
			filter.value.brandKeyword = '';
			f.brandCharGroup.value = '전체';
			filter.value.priceMin = '';
			filter.value.priceMax = '';

			f.resetSelected();
			props.closer(f.selected);
		},

		apply: () => {
			if (filter.value.priceMax || filter.value.priceMin) {
				filter.value.applyManualPriceRange();
			}
			props.closer(f.selected);
		},
	});

	function toggleBenefit(benefit: BenefitForFilter) {
		if (f.selected.benefits.includes(benefit)) {
			f.selected.benefits = f.selected.benefits.filter(selected => selected !== benefit);

			return;
		}
		f.selected.benefits.push(benefit);
	}

	function toggleAllChildCategories(category: CategoryForFilter) {
		if (!f.selectedCategoriesCount.value) {
			return;
		}

		if (f.selectedCategoriesCount.value[category.code].isDepth2All || f.selectedCategoriesCount.value[category.code].depth3SelectedCount < 1) {
			category.child_categories.forEach((child) => f.toggleChildrenCategory(child));

			return;
		}

		const notSelectedCategory = category.child_categories.filter(child => !f.isChildrenCategoryAllSelected(child));
		notSelectedCategory.forEach(child => f.toggleChildrenCategory(child));

	}
</script>