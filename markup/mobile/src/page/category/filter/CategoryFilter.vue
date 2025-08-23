<template>
	<div class="mm_filter">
		<!-- 필터상단 -->
		<div class="mm_filter-unit">
			<div class="mm_scroller T=x">
				<div class="mm_btn_box">
					<div class="mm_inline">
						<!-- (D) 선택한 버튼에 'S=btn-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
						<button
							v-for="unit in filterUnitList"
							:key="unit.name"
							type="button"
							class="mm_btn T=sm T=lighter"
							:class="{'S=btn-on': selectedUnit.includes(unit.name) }"
							:title="selectedUnit.includes(unit.name)? '선택됨' : undefined"
							@click="() => {
								if(selectedUnit.includes(unit.name)) selectedUnit = selectedUnit.filter(_selected => _selected !== unit.name).slice();
								else selectedUnit.push(unit.name);
							}"
						>
							<b>{{ unit.name }}</b>
						</button>
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
										v-for="category in selectCategoryList"
										:key="category.name"
									>
										<dropdown
											tag="dl"
											group="category"
											icon-class="T=sm"
											@toggle="anchorCategory"
										>
											<template #button>
												<p>{{ category.name }}</p>
												<b class="text_count"><span data-check="{ '_group': 'dev_check-women' }">0</span>개</b>
											</template>
											<template #content>
												<!-- 카테고리 2depth -->
												<div class="mm_filter...sub">
													<label class="mm_form-check">
														<input
															type="checkbox"
															data-check="{ '_type': 'check_all', '_group': 'dev_check-women' }"
														>
														<b class="mm_inline">
															<b class="mm_flex">
																<span class="text_label">전체</span>
																<small>115,884</small>
															</b>
														</b>
													</label>
													<ul>
														<li
															v-for="category2depth in category.children"
															:key="category2depth.name"
														>
															<form-check
																v-if="!category2depth.children"
																v-model="selectedCategory2depth"
																:hide-icon="false"
																:value="category2depth.name"
																block-style="inline"
															>
																<div class="mm_flex">
																	<span class="text_label">{{ category2depth.name }}</span>
																	<small>{{ category2depth.amount }}</small>
																</div>
															</form-check>
															<dropdown
																v-else
																tag="dl"
																group="category-women"
																icon-class="T=sm"
																@trigger="setCategoryHeight"
															>
																<template #button>
																	<p><b class="mm_flex"><span>{{ category2depth.name }}</span><small>{{ category2depth.amount }}</small></b></p>
																</template>
																<template #content>
																	<!-- 카테고리 3depth -->
																	<div class="mm_check-list">
																		<label class="mm_form-check">
																			<input
																				type="checkbox"
																				data-check="{ '_type': 'check_all', '_group': 'dev_check-women dev_check-women01' }"
																			>
																			<b class="mm_inline">
																				<b class="mm_flex">
																					<span class="text_label">전체</span>
																					<small>115,884</small>
																				</b>
																			</b>
																		</label>
																		<ul>
																			<li
																				v-for="category3depth in category2depth.children"
																				:key="category3depth.name"
																			>
																				<form-check
																					v-model="selectedCategory3depth"
																					:hide-icon="false"
																					:value="category3depth.name"
																					block-style="inline"
																				>
																					<div class="mm_flex">
																						<span class="text_label">{{ category3depth.name }}</span>
																						<small>{{ category3depth.amount }}</small>
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
								v-model="searchBrand"
								type="search"
								placeholder="브랜드를 검색하세요"
							>
								<template #button>
									<button
										type="button"
										class="btn_search"
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
								<div class="mm_check-list">
									<ul>
										<li
											v-for="brand in selectBrandItems"
											:key="brand.label"
										>
											<form-check
												v-model="selectedBrands"
												:value="brand.label"
												:hide-icon="false"
												block-style="inline"
											>
												<b class="mm_flex">
													<span class="text_label">{{ brand.label }}</span>
													<small>{{ brand.amount }}</small>
												</b>
											</form-check>
										</li>
									</ul>
								</div>
								<!-- (D) 정렬 키워드에 속한 브랜드가 없는 경우 '.mm_text-none' 요소를 노출합니다. -->
								<!-- <p class="mm_text-none"><i class="ico_text-none"></i>브랜드가 없습니다</p> -->
							</div>

							<!-- 자음목록 -->
							<div class="mm_scroller T=brand-sort">
								<!-- (D) 현재페이지에 적용되어 있는 버튼에 'S=btn-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
								<ul>
									<li
										v-for="word in sortWords"
										:key="word"
									>
										<button
											type="button"
											:class="{ 'S=btn-on': selectedWord === word }"
											:title="selectedWord === word ? '선택됨' : undefined"
											@click="selectedWord = selectedWord === word ? '' : word"
										>
											<b>{{ word }}</b>
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
										v-for="priceRange in selectPriceRanges"
										:key="priceRange.range"
									>
										<form-check
											v-model="selectedPrices"
											:value="priceRange.range"
											:hide-icon="false"
											:label="priceRange.range"
										></form-check>
									</li>
								</ul>
							</div>
							<div class="mm_form_mix-linked">
								<form-text
									type="number"
									placeholder="최저금액"
								></form-text>
								<span class="text_tilde">~</span>
								<form-text
									type="number"
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
										v-for="review in selectReviewStars"
										:key="review.star"
									>
										<form-check
											v-model="selectedReviews"
											:value="review.star"
											:hide-icon="false"
										>
											<span class="text_label"><i class="ico_star-fill"></i>{{ review.star }}</span>
										</form-check>
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
			<div class="mm_inline">
				<button
					type="button"
					class="btn_filter-reset"
				>
					<i class="ico_reload"></i><b class="mm_ir-blind">초기화</b>
				</button>
				<button type="button">
					<b>적용하기</b>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import Dropdown from '@/component/Dropdown.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormText from '@/component/form/FormText.vue';
	import SizeFilter from '@/feature/size-filter/component/SizeFilter.vue';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	const filterUnitList = [
		{ name: '무료배송' },
		{ name: '할인상품' },
		{ name: '품절제외' },
	];
	const selectedUnit = ref<string[]>([]);

	const tabMenuList = [
		{
			name: 'category',
			label: '카테고리',
		},
		{
			name: 'brand',
			label: '브랜드',
		},
		{
			name: 'price',
			label: '가격',
		},
		{
			name: 'star',
			label: '별점',
		},
		{
			name: 'shoes',
			label: '슈즈',
		},
	];

	const anchorCategory = () => {
		console.log('category anchor');
	};

	const setCategoryHeight = () => {
		console.log('category height');
	};

	const selectTabMenu = ref('category');

	const selectCategoryList = ref([
		{
			name: '카테고리 1',
			children: [
				{
					name: '가방',
					amount: '5,884',
				},
				{
					name: '티셔츠',
					amount: '111',
				},
				{
					name: '아우터',
					amount: '12,345',
					children: [
						{
							name: '가죽자켓',
							amount: '1,800',
						},
						{
							name: '바람막이',
							amount: '104',
						},
						{
							name: '캐쥬얼 점퍼',
							amount: '12,475',
						},
					],
				},
				{
					name: '가디건',
					amount: '12,345',
					children: [
						{
							name: '울',
							amount: '1,800',
						},
						{
							name: '미니',
							amount: '104',
						},
						{
							name: '루즈핏',
							amount: '12,475',
						},
					],
				},
				{
					name: '신발',
					amount: '11,345',
					children: [
						{
							name: '슬리퍼',
							amount: '1,800',
						},
						{
							name: '운동화',
							amount: '104',
						},
					],
				},
			],
		},
		{
			name: '카테고리 2',
			children: [
				{
					name: '가방',
					amount: '5,884',
				},
				{
					name: '티셔츠',
					amount: '111',
				},
				{
					name: '아우터',
					amount: '12,345',
					children: [
						{
							name: '가죽자켓',
							amount: '1,800',
						},
						{
							name: '바람막이',
							amount: '104',
						},
						{
							name: '캐쥬얼 점퍼',
							amount: '12,475',
						},
					],
				},
				{
					name: '신발',
					amount: '11,345',
					children: [
						{
							name: '슬리퍼',
							amount: '1,800',
						},
						{
							name: '운동화',
							amount: '104',
						},
					],
				},
			],
		},
	]);
	const selectedCategory2depth = ref<string[]>([]);
	const selectedCategory3depth = ref<string[]>([]);

	const searchBrand = ref('');
	const selectBrandItems = ref([
		{
			label: '나나아웃도어',
			amount: '1,284',
		},
		{
			label: '나나키즈',
			amount: '365',
		},
		{
			label: '나로',
			amount: '104',
		},
		{
			label: '나이스크랍',
			amount: '800',
		},
		{
			label: '나이키',
			amount: '11,800',
		},
		{
			label: '나이키골프',
			amount: '20',
		},
		{
			label: '나인',
			amount: '16',
		},
		{
			label: '나인스텝',
			amount: '2,800',
		},
		{
			label: '나인식스뉴욕',
			amount: '20',
		},
		{
			label: '나즈나',
			amount: '2,800',
		},
		{
			label: '내셔널 지오그래픽',
			amount: '20',
		},
		{
			label: '널디',
			amount: '365',
		},
		{
			label: '나인',
			amount: '16',
		},
		{
			label: '나인스텝',
			amount: '2,800',
		},
		{
			label: '나인식스뉴욕',
			amount: '20',
		},
		{
			label: '나즈나',
			amount: '2,800',
		},
		{
			label: '내셔널 지오그래픽',
			amount: '20',
		},
		{
			label: '널디',
			amount: '365',
		},
	]);
	const selectedBrands = ref<string[]>([]);

	const sortWords = '전체 ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ ABC 123'.split(' ');
	const selectedWord = ref('');

	const selectPriceRanges = ref([
		{ range: '~5만원' },
		{ range: '5만원 ~ 10만원' },
		{ range: '10만원 ~ 50만원' },
		{ range: '50만원 ~ 100만원' },
		{ range: '100만원~' },
	]);
	const selectedPrices = ref<string[]>([]);

	const selectReviewStars = ref([
		{ star: '5.0' },
		{ star: '4.0' },
		{ star: '3.0' },
		{ star: '2.0' },
		{ star: '1.0' },
	]);
	const selectedReviews = ref<string[]>([]);

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
</script>