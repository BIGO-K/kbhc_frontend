<template>
	<layout
		title="검색"
		:hide-title="true"
		layout="popup"
		class="L=search"
	>
		<template #afterTitle>
			<div class="mm_lside">
				<i class="ico_search"><b class="mm_ir-blind">검색</b></i>
			</div>
			<form-text
				v-model="searchKeyword"
				placeholder="검색어를 입력하세요"
			></form-text>
		</template>

		<template #default>
			<!-- 상품 및 검색어 -->
			<carousel
				:items="searchCarouselItems"
				class="m_search"
				:use-pagination="true"
				:is-more-side="true"
			>
				<template #default="{ item }">
					<!-- 최근본상품 -->
					<template v-if="item.title === '최근 본 상품'">
						<section class="m_search-list">
							<h3><b>{{ item.title }}</b></h3>
							<div class="mm_scroller">
								<div class="mm_product-list T=sm">
									<ul>
										<li
											v-for="(entry, _i) in (item as SearchProduct).items"
											:key="_i"
										>
											<div
												class="mm_product-item"
												:class="{ 'S=soldout': entry.isSoldout }"
											>
												<mm-link :to="entry.link">
													<figure>
														<div class="mm_product-item-image">
															<lazyload
																class="mm_bg-cover image_product"
																:src="entry.image"
															></lazyload>
															<p
																v-if="entry.isSoldout"
																class="text_soldout"
															>
																<b>품절</b>
															</p>
														</div>
														<figcaption>
															<p class="text_product">
																{{ entry.name }}
															</p>
															<p class="text_price">
																<strong>{{ number(entry.price) }}</strong>
															</p>
														</figcaption>
													</figure>
												</mm-link>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</section>
					</template>

					<!-- 최근검색어 -->
					<template v-else-if="item.title === '최근 검색어'">
						<section class="m_search-list">
							<h3><b>{{ item.title }}</b></h3>
							<p
								v-if="(item as SearchKeyword).items.length < 1"
								class="mm_text-none T=sm"
							>
								<i class="ico_text-none"></i>최근 검색내역이 없습니다
							</p>
							<div
								v-else
								class="mm_scroller"
							>
								<ul>
									<li
										v-for="entry in (item as SearchKeyword).items"
										:key="entry"
									>
										<mm-link :to="{ name: 'SearchResult', query: { keyword: entry } }">
											<b>{{ entry }}</b>
										</mm-link>
										<button
											type="button"
											class="btn_remove"
										>
											<i class="ico_remove"></i><b class="mm_ir-blind">삭제</b>
										</button>
									</li>
								</ul>
							</div>
							<div class="m...list-foot">
								<button
									type="button"
									class="btn_remove-all"
								>
									<b>최근 검색어 전체삭제</b><i class="ico_remove-trash"></i>
								</button>
							</div>
						</section>
					</template>

					<!-- 인기검색어 -->
					<template v-else>
						<section class="m_search-list">
							<h3><b>{{ item.title }}</b></h3>
							<div class="mm_scroller">
								<ol>
									<li
										v-for="(entry, _i) in (item as SearchPopular).items"
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
								<p>{{ (item as SearchPopular).date }} 기준</p>
							</div>
						</section>
					</template>
				</template>
			</carousel>

			<!-- 검색어 자동완성 -->
			<div
				class="mm_full m_search-auto"
				:class="{ 'S=auto-on': searchKeyword.trim().length > 0 }"
			>
				<div class="mm_scroller">
					<template v-if="showAutoComplete">
						<div
							v-if="autoCompleteKeywords.brands.length > 0"
							class="m...auto-brand"
						>
							<ul>
								<li
									v-for="brand in autoCompleteKeywords.brands"
									:key="brand.id"
								>
									<mm-link :to="{ name: 'BrandShop', params: { id: 123 }}">
										<figure>
											<lazyload
												class="mm_bg-contain"
												:src="brand.logo_image_url"
											></lazyload>
											<figcaption v-html="strwrap(brand.kor_name, searchKeyword, `<strong class='mm_text-variable'>`, '</strong>')"></figcaption>
										</figure>
										<span>바로가기<i class="ico_link"></i></span>
									</mm-link>
								</li>
							</ul>
						</div>

						<div class="m...auto-category">
							<ul>
								<li
									v-for="category in autoCompleteKeywords.categories"
									:key="category.code"
								>
									<mm-link :to="{ name: 'Category', params: { id: 123456789 } }">
										<b v-html="strwrap(category.full_path, searchKeyword, `<strong class='mm_text-variable'>`, '</strong>')"></b>
									</mm-link>
								</li>
							</ul>
						</div>

						<div class="m...auto-keyword">
							<ul>
								<li
									v-for="keyword in autoCompleteKeywords.keywords"
									:key="keyword"
								>
									<mm-link :to="{ name: 'SearchResult' }">
										<b v-html="strwrap(keyword, searchKeyword, `<strong class='mm_text-variable'>`, '</strong>')"></b><i class="ico_link-arrow"></i>
									</mm-link>
								</li>
							</ul>
						</div>
					</template>
					<template v-else>
						<p class="m...auto-none">
							일치하는 검색어가 없습니다<i class="ico_link-arrow"></i>
						</p>
					</template>
				</div>
			</div>
		</template>
	</layout>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { strwrap } from '$/utils/string';
	import { useFormatter } from '$/composables/useFormatter';
	import Layout from '@/component/layout/Layout.vue';
	import Carousel from '@/component/Carousel.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormText from '@/component/form/FormText.vue';

	type SearchProduct = {
		title: string;
		items: {
			link: string;
			image: string;
			name: string;
			price: string;
			isSoldout: boolean;
		}[];
	};

	type SearchKeyword = {
		title: string;
		items: string[];
	};

	type SearchPopular = {
		title: string;
		date: string;
		items: {
			keyword: string;
			status: number;
		}[];
	};

	const { number } = useFormatter();

	const searchCarouselItems: (SearchProduct | SearchKeyword | SearchPopular)[] = [
		{
			title: '최근 본 상품',
			items: [
				{
					link: '/product/123',
					image: '/image/_sample/prod_x1_1.png',
					name: '남녀공용 블랙 숏 라이너 리버 시블 점퍼',
					price: '90,150',
					isSoldout: false,
				},
				{
					link: '/product/222',
					image: '/image/_sample/prod_x1_2.png',
					name: '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140',
					price: '54,800',
					isSoldout: true,
				},
				{
					link: '/product/333',
					image: '/image/_sample/prod_x1_3.png',
					name: '데일리&데이트 13,900원 균일',
					price: '13,900',
					isSoldout: false,
				},
				{
					link: '/product/444',
					image: '/image/_sample/prod_x1_1.png',
					name: '시스루스트라이프셔츠',
					price: '54,800',
					isSoldout: false,
				},
				{
					link: '/product/222',
					image: '/image/_sample/prod_x1_2.png',
					name: '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140',
					price: '54,800',
					isSoldout: true,
				},
				{
					link: '/product/123',
					image: '/image/_sample/prod_x1_1.png',
					name: '남녀공용 블랙 숏 라이너 리버 시블 점퍼',
					price: '90,150',
					isSoldout: false,
				},
				{
					link: '/product/444',
					image: '/image/_sample/prod_x1_1.png',
					name: '시스루스트라이프셔츠',
					price: '54,800',
					isSoldout: false,
				},
				{
					link: '/product/222',
					image: '/image/_sample/prod_x1_2.png',
					name: '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140',
					price: '54,800',
					isSoldout: true,
				},
				{
					link: '/product/123',
					image: '/image/_sample/prod_x1_1.png',
					name: '남녀공용 블랙 숏 라이너 리버 시블 점퍼',
					price: '90,150',
					isSoldout: false,
				},
			],
		},
		{
			title: '최근 검색어',
			items: [
				'원피스',
				'오버핏 후드',
				'맨투맨',
				'스티커즈',
				'플랫슈즈',
				'치마',
				'슬랙스',
				'율이에',
				'코치',
				'양말',
			],
		},
		{
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
		},
	];

	const searchKeyword = ref('');
	const showAutoComplete = computed(() => autoCompleteKeywords.value.brands.length > 0 || autoCompleteKeywords.value.categories.length > 0 || autoCompleteKeywords.value.keywords.length > 0);
	const autoCompleteKeywords = ref<AutoCompleteKeyword>({
		from: '',
		brands: [
			{
				eng_name: 'Pants',
				id: 31,
				kor_name: '팬츠 브랜드명',
				logo_image_url: '/image/_sample/brand_logo_1.jpg',
			},
		],
		categories: [
			{
				code: '003006002',
				depth: 3,
				full_path: '남성패션 > 정장 > 정장 팬츠',
				name: '정장 팬츠',
			},
			{
				code: '003006001',
				depth: 3,
				full_path: '남성패션 > 팬츠 > 트레이닝팬츠',
				name: '트레이닝 팬츠',
			},
		],
		keywords: [
			'코튼 팬츠',
			'스트링 팬츠',
			'테이퍼드 팬츠',
			'멀티 팬츠',
			'트레이닝 팬츠',
			'하프 팬츠',
			'조거 팬츠',
			'스트레치 팬츠',
		],
	});
</script>