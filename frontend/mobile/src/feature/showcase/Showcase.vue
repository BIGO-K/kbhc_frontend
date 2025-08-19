<template>
	<layout title="쇼케이스">
		<showcase-infinite-scroll
			class="m_showcase"
			v-bind="{
				paginator,
				initPage,
				pending: isLoading,
				resetPage,
				itemContainerClass: 'm_showcase-list'
			}"
			@page-required="fetch"
		>
			<template #tab>
				<!-- (D) 등록된 카테고리 메뉴가 있는 경우 아래 메뉴 구조로 노출됩니다. -->
				<!-- 탭메뉴 -->
				<div
					ref="$tabmenu"
					class="mm_tab_menu T=scroll m_showcase-tab"
					:class="classSticky"
				>
					<!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
					<div class="mm_scroller T=x">
						<ul>
							<li>
								<mm-link
									:class="{ 'S=tab-on': categoryId === 0 }"
									:title="categoryId === 0 ? '선택됨' : ''"
									:to="{ name: 'Showcase' }"
									replace
								>
									<b>전체보기</b>
								</mm-link>
							</li>
							<li
								v-for="category in showcaseCategories"
								:key="category.id"
							>
								<mm-link
									:class="{ 'S=tab-on': categoryId === category.id }"
									:title="categoryId === category.id ? '선택됨' : ''"
									:to="{ name: 'Showcase', query: { categoryId: category.id }}"
									replace
								>
									<b>{{ category.name }}</b>
								</mm-link>
							</li>
						</ul>
					</div>
				</div>
			</template>
			<template #skeleton>
				<li>
					<i class="image_banner"></i>
					<p class="text_side"></p>
					<p class="text_title"></p>
					<p class="text_main"></p>
				</li>
			</template>
			<template #none>
				<p class="mm_text-none">
					<i class="ico_text-none"></i>등록된 쇼케이스가 없습니다
				</p>
			</template>
			<template #item="{ item: showcase, index }">
				<li
					ref="$item"
					:class="{ 'T=showcase-left': (index % 4) > 1 }"
				>
					<mm-link :to="{ name: 'ShowcaseDetail', params: { id: showcase.id } }">
						<figure>
							<lazyload
								:key="showcase.thumbnail_url"
								class="mm_bg-cover image_banner"
								:src="showcase.thumbnail_url"
							></lazyload>
							<figcaption>
								<p class="text_side">
									{{ showcase.sort_name }}
								</p>
								<p class="text_title">
									{{ showcase.title }}
								</p>
								<p class="text_main1">
									{{ showcase.first_words }}
								</p>
								<p class="text_main2">
									{{ showcase.second_words }}
								</p>
								<b>자세히 보기<i class="ico_link"></i></b>
							</figcaption>
						</figure>
					</mm-link>
				</li>
			</template>
		</showcase-infinite-scroll>
		<div
			v-if="false"
			class="m_showcase"
		>
			<!-- (D) 등록된 카테고리 메뉴가 있는 경우 아래 메뉴 구조로 노출됩니다. -->
			<!-- 탭메뉴 -->
			<div
				ref="$tabmenu"
				class="mm_tab_menu T=scroll m_showcase-tab"
				:class="classSticky"
			>
				<!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
				<div class="mm_scroller T=x">
					<ul>
						<li>
							<mm-link
								:class="{ 'S=tab-on': categoryId === 0 }"
								:title="categoryId === 0 ? '선택됨' : ''"
								:to="{ name: 'Showcase' }"
								replace
							>
								<b>전체보기</b>
							</mm-link>
						</li>
						<li
							v-for="category in showcaseCategories"
							:key="category.id"
						>
							<mm-link
								:class="{ 'S=tab-on': categoryId === category.id }"
								:title="categoryId === category.id ? '선택됨' : ''"
								:to="{ name: 'Showcase', query: { categoryId: category.id }}"
								replace
							>
								<b>{{ category.name }}</b>
							</mm-link>
						</li>
					</ul>
				</div>
			</div>
			<ul
				v-if="!paginator"
				class="m_showcase-list T=skeleton"
			>
				<li
					v-for="_i in 2"
					:key="_i"
				>
					<i class="image_banner"></i>
					<p class="text_side"></p>
					<p class="text_title"></p>
					<p class="text_main"></p>
				</li>
			</ul>
			<p
				v-else-if="paginator.total < 1"
				class="mm_text-none"
			>
				<i class="ico_text-none"></i>등록된 쇼케이스가 없습니다
			</p>

			<!-- 쇼케이스 -->
			<ul
				v-else
				class="m_showcase-list"
			>
				<li
					v-for="(showcase, _i) in paginator.data"
					:key="showcase.id"
					:class="{ 'T=showcase-left': (_i % 4) > 1 }"
				>
					<mm-link :to="{ name: 'ShowcaseDetail', params: { id: showcase.id } }">
						<figure>
							<lazyload
								class="mm_bg-cover image_banner"
								:src="showcase.thumbnail_url"
							></lazyload>
							<figcaption>
								<p class="text_side">
									{{ showcase.sort_name }}
								</p>
								<p class="text_title">
									{{ showcase.title }}
								</p>
								<p class="text_main1">
									{{ showcase.first_words }}
								</p>
								<p class="text_main2">
									{{ showcase.second_words }}
								</p>
								<b>자세히 보기<i class="ico_link"></i></b>
							</figcaption>
						</figure>
					</mm-link>
				</li>
			</ul>

			<!-- 하단버튼 -->
			<div
				v-if="paginator && paginator.total > paginator.per_page"
				class="mm_inner"
			>
				<div class="mm_foot">
					<div class="mm_btn_box">
						<button
							type="button"
							class="mm_btn T=line btn_more"
						>
							<b>더보기</b><i class="ico_more"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, onMounted, computed, watch } from 'vue';
	import { useScroll } from '@vueuse/core';
	import { usePageContextStore } from '$/stores/usePageContextStore';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useShowcase } from '$/composables/useShowcase';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import ShowcaseInfiniteScroll from '@/feature/showcase/component/ShowcaseInfiniteScroll.vue';

	const pageContextStore = usePageContextStore();
	const { route, router, loading } = useGlobalPageContext();
	const { defaultPageSize, getCategories, getPaginator } = useShowcase();

	const currentPageContextTop = computed(() => pageContextStore.getCurrentPageContext(route.path)?.scrollTop || 0);
	const initPage = route.query.page && currentPageContextTop.value > 0 ? Number(route.query.page) : 1;

	/** 쇼케이스 */
	const showcaseCategories = await getCategories();
	const categoryId = computed(() => route.query.categoryId ? Number(route.query.categoryId) : 0);
	const paginator = ref<Paginator<Showcase>>({
		total: 0,
		per_page: defaultPageSize,
		current_page: 1,
		data: [],
	});

	const isLoading = ref(false);
	const resetPage = ref(false);

	/** ELEMENTS */
	const $view = ref<HTMLElement>();
	const $scroller = ref<HTMLElement>();
	const $tabmenu = ref<HTMLElement>();

	/** sticky 탭 관련 변수 */
	const smooth = ref(false);
	const behavior = computed(() => smooth.value ? 'smooth' : 'auto');
	const { y } = useScroll($scroller, { behavior });
	const classSticky = ref('');

	/** 쇼케이스 조회 */
	async function fetch(page: number = 1) {
		isLoading.value = true;
		loading.show();

		try {
			paginator.value = await getPaginator(categoryId.value, page);
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
			isLoading.value = false;
		}
	}

	watch(categoryId, async () => {
		resetPage.value = true;
		await fetch();
		resetPage.value = false;
	});

	watch(y, (_currentScrollY, _beforeScrollY) => {

		if (_beforeScrollY < 1 || !$scroller.value || !$tabmenu.value) return;

		classSticky.value = ($tabmenu.value?.offsetHeight < _currentScrollY) ? 'S=sticky-on' : '';

	});

	onMounted(async () => {
		if (initPage > 1) {
			isLoading.value = true;
			loading.show();
			try {
				await Promise.all([initPage, initPage - 1].map(async page => {
					paginator.value = await getPaginator(categoryId.value, page);
				}));
			}
			catch (e) {
				useErrorAlert(e);
			}
			finally {
				loading.hide();
				isLoading.value = false;
			}
		}
		else {
			fetch();
			router.replace({
				query: {
					...router.currentRoute.value.query,
					page: 1,
				},
			});
		}

		$view.value = document.querySelector('.mm_view') as HTMLElement;
		if ($view.value !== null) $scroller.value = $view.value.querySelector('.mm_page > .mm_scroller') as HTMLElement;

	});
</script>

<style src="./_showcase.scss" lang="scss"></style>