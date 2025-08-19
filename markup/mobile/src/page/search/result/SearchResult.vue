<template>
	<layout
		:title="`${searchedKeyword} 검색 결과`"
		:hide-title="true"
		layout="popup"
		class="L=search"
	>
		<template #afterTitle>
			<div class="mm_lside">
				<i class="ico_search"><b class="mm_ir-blind">검색</b></i>
			</div>
			<form-text
				v-model="searchedKeyword"
				placeholder="검색어를 입력하세요"
			></form-text>
		</template>

		<template #default>
			<div class="m_search-result">
				<template v-if="!isResult">
					<!-- 결과없음 -->
					<p class="mm_text-none">
						<i class="ico_text-none"></i>검색 결과가 없습니다
					</p>
					<div class="mm_note T=bg">
						<ul>
							<li>정확한 검색어를 입력하셨는지 확인해 주세요.</li>
							<li>다른 검색어를 입력해 주세요.</li>
							<li>노출이 제한된 상품일 수 있습니다.</li>
						</ul>
					</div>

					<!-- 인기 검색어 -->
					<div class="mm_inner">
						<section class="m_search-list">
							<h3><b>{{ searchPopular.title }}</b></h3>
							<div class="mm_scroller">
								<ol>
									<li
										v-for="(entry, _i) in searchPopular.items"
										:key="_i"
									>
										<mm-link :to="{ name: 'SearchResult', query: { keyword: entry.keyword } }">
											<b>{{ entry.keyword }}</b>
											<template v-if="Number.isNaN(entry.status)">
												<i
													class="ico_rank-new"
													title="신규"
												></i>
											</template>
											<template v-else-if="entry.status === 0">
												<i
													class="ico_rank-unchanged"
													title="변동없음"
												></i>
											</template>
											<template v-else-if="entry.status > 0">
												<i
													class="ico_rank-up"
													title="상승"
												></i>
												<b class="text_rank">{{ entry.status }}</b>
											</template>
											<template v-else>
												<i
													class="ico_rank-down"
													title="하락"
												></i>
												<b class="text_rank">{{ Math.abs(entry.status) }}</b>
											</template>
										</mm-link>
									</li>
								</ol>
							</div>
							<div class="m...list-foot">
								<p>{{ searchPopular.date }} 기준</p>
							</div>
						</section>
					</div>

					<!-- best 아이템 -->
					<section
						v-if="productItems.length > 0"
						class="m...result-best"
					>
						<h3><b>BEST 아이템</b></h3>
						<div class="mm_scroller T=x">
							<div class="mm_product-list T=card">
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
							</div>
						</div>
					</section>
				</template>

				<template v-else>
					<!-- 검색어 변환 -->
					<div class="m...result-offer">
						<p><strong>{{ '티셔츠' }}</strong>(으)로 자동 변환된<br> 검색 결과입니다</p>
						<mm-link :to="{ name: 'SearchResult' }">
							<strong class="mm_text-variable">'{{ 'xltucm' }}'</strong><b>검색 결과 보기</b><i class="ico_link"></i>
						</mm-link>
					</div>

					<!-- 연관 검색어 -->
					<div
						v-if="resultKeyword.length > 0"
						class="m...result-keyword"
					>
						<div class="mm_scroller T=x">
							<ul>
								<li
									v-for="keyword in resultKeyword"
									:key="keyword"
								>
									<button
										class="mm_btn T=sm T=lighter"
										type="button"
									>
										<b>{{ keyword }}</b>
									</button>
								</li>
							</ul>
						</div>
					</div>

					<!-- 브랜드샵 -->
					<!-- (D) 브랜드명 검색 시 노출되는 버튼입니다. -->
					<mm-link
						v-if="searchBrand"
						class="btn_brandshop"
						:to="{ name: 'BrandShop', params: { id: searchBrand.id } }"
					>
						<strong>{{ searchBrand.name }}</strong><b>브랜드샵 가기<i class="ico_link"></i></b>
					</mm-link>

					<div class="mm_inner">
						<div class="mm_product-list">
							<div class="mm_product-list-head">
								<p class="text_total">
									<strong>8,960</strong>개
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
									></i>
									<b class="mm_ir-blind">상품 정렬 변경</b>
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

							<p
								v-if="items.length < 1"
								class="mm_text-none"
							>
								<i class="ico_text-none"></i>등록된 상품이 없습니다
							</p>

							<ul v-else>
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
						</div>

						<!-- 하단더보기 -->
						<div
							v-if="items.length > 5"
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
			</div>
		</template>
	</layout>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref, computed } from 'vue';
	import { useFakeCreator } from '$/composables/useFakeCreator';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useRouteQueryCast } from '$/composables/useRouteQueryCast';
	import Layout from '@/component/layout/Layout.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import Toggle from '@/component/Toggle.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import FormText from '@/component/form/FormText.vue';

	const productItems = useFakeCreator().goods(50);// XXX 상품 임시 생성

	const { openOverlay } = useGlobalPageContext();
	const { queryToString } = useRouteQueryCast();

	const searchedKeyword = ref<string>(queryToString('keyword', ''));

	const isSortCard = ref(true);
	const toggleStyleProduct = (_isActive: boolean) => {
		isSortCard.value = _isActive;
		console.log('상품정렬 토글', _isActive);
	};

	function overlayCategoryFilter() {
		const component = defineAsyncComponent(() => import('@/page/category/filter/CategoryFilter.vue'));

		return openOverlay(component);
	}

	const sortProductFilter = ref('');
	const isResult = computed(() => Math.floor(Math.random() * 2) == 0 ? true : false);
	const items: unknown[] = [];// 내용없음 확인용 임시 변수

	type SearchPopular = {
		title: string;
		date: string;
		items: {
			keyword: string;
			status: number;
		}[];
	};

	type SearchBrand = {
		name: string;
		id: number;
	};

	const searchPopular = ref<SearchPopular>({
		title: '인기 검색어',
		date: '2021.00.00 00:00',
		items: [
			{
				keyword: 'M.mon 엠몬스타',
				status: 2,
			},
			{
				keyword: '티셔츠',
				status: -1,
			},
			{
				keyword: '원피스',
				status: -1,
			},
			{
				keyword: '첼시부츠',
				status: NaN,
			},
			{
				keyword: '가디건',
				status: 0,
			},
			{
				keyword: '맨투맨',
				status: 8,
			},
			{
				keyword: '셔츠',
				status: 0,
			},
			{
				keyword: '자켓',
				status: -3,
			},
			{
				keyword: '양말',
				status: NaN,
			},
			{
				keyword: '데님',
				status: 2,
			},
		],
	});

	const searchBrand = ref<SearchBrand>({
		name: '엠몬스타',
		id: 12345,
	});

	const resultKeyword = [
		'후드 티셔츠',
		'맨투맨 티셔츠',
		'반팔 티셔츠',
		'롱슬리브 티셔츠',
		'기모 티셔츠',
		'프린팅 티셔츠',
	];
</script>