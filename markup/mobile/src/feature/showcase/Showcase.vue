<template>
	<layout title="쇼케이스">
		<div class="m_showcase">
			<!-- (D) 등록된 카테고리 메뉴가 있는 경우 아래 메뉴 구조로 노출됩니다. -->
			<!-- 탭메뉴 -->
			<div
				v-if="tabItems.length > 1"
				ref="$tabmenu"
				class="mm_tab_menu T=scroll m_showcase-tab"
				:class="classSticky"
			>
				<!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
				<div class="mm_scroller T=x">
					<ul>
						<li
							v-for="item in tabItems"
							:key="item.id"
						>
							<a
								:class="{ 'S=tab-on': tabId === item.id }"
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

			<p
				v-if="items.length < 1"
				class="mm_text-none"
			>
				<i class="ico_text-none"></i>등록된 쇼케이스가 없습니다
			</p>

			<!-- 쇼케이스 -->
			<template v-else>
				<ul
					v-if="isLoading"
					class="m_showcase-list T=skeleton"
				>
					<li>
						<i class="image_banner"></i>
						<p class="text_side"></p>
						<p class="text_title"></p>
						<p class="text_main"></p>
					</li>
					<li>
						<i class="image_banner"></i>
						<p class="text_side"></p>
						<p class="text_title"></p>
						<p class="text_main"></p>
					</li>
				</ul>
				<ul
					v-else
					class="m_showcase-list"
				>
					<li>
						<mm-link :to="{ name: 'ShowcaseDetail', params: { id: 123 } }">
							<figure>
								<lazyload
									class="mm_bg-cover image_banner"
									src="/image/_sample/showcase_banner1.png"
								></lazyload>
								<figcaption>
									<p class="text_side">
										BRAND STORY
									</p>
									<p class="text_title">
										Hei (헤이)
									</p>
									<p class="text_main1">
										내추럴하면서도 그 시대의 핫한 감성 제안하는
									</p>
									<p class="text_main2">
										아티스틱 디자이너 브랜드
									</p>
									<b>자세히 보기<i class="ico_link"></i></b>
								</figcaption>
							</figure>
						</mm-link>
					</li>
					<li>
						<mm-link :to="{ name: 'ShowcaseDetail', params: { id: 123 } }">
							<figure>
								<lazyload
									class="mm_bg-cover image_banner"
									src="/image/_sample/showcase_banner2.png"
								></lazyload>
								<figcaption>
									<p class="text_side">
										BRAND STORY
									</p>
									<p class="text_title">
										Hei (헤이)
									</p>
									<p class="text_main1">
										내추럴하면서도 그 시대의 핫한 감성 제안하는
									</p>
									<p class="text_main2">
										아티스틱 디자이너 브랜드
									</p>
									<b>자세히 보기<i class="ico_link"></i></b>
								</figcaption>
							</figure>
						</mm-link>
					</li>
					<li class="T=showcase-left">
						<mm-link :to="{ name: 'ShowcaseDetail', params: { id: 123 } }">
							<figure>
								<lazyload
									class="mm_bg-cover image_banner"
									src="/image/_sample/showcase_banner3.png"
								></lazyload>
								<figcaption>
									<p class="text_side">
										BRAND STORY
									</p>
									<p class="text_title">
										Hei (헤이)
									</p>
									<p class="text_main1">
										내추럴하면서도 그 시대의 핫한 감성 제안하는
									</p>
									<p class="text_main2">
										아티스틱 디자이너 브랜드
									</p>
									<b>자세히 보기<i class="ico_link"></i></b>
								</figcaption>
							</figure>
						</mm-link>
					</li>
					<li class="T=showcase-left">
						<mm-link :to="{ name: 'ShowcaseDetail', params: { id: 123 } }">
							<figure>
								<lazyload
									class="mm_bg-cover image_banner"
									src="/image/_sample/showcase_banner4.png"
								></lazyload>
								<figcaption>
									<p class="text_side">
										BRAND STORY
									</p>
									<p class="text_title">
										Hei (헤이)
									</p>
									<p class="text_main1">
										내추럴하면서도 그 시대의 핫한 감성 제안하는
									</p>
									<p class="text_main2">
										아티스틱 디자이너 브랜드
									</p>
									<b>자세히 보기<i class="ico_link"></i></b>
								</figcaption>
							</figure>
						</mm-link>
					</li>
				</ul>
			</template>

			<!-- 하단버튼 -->
			<div
				v-if="items.length > 5"
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
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';

	const $view = ref<HTMLElement>();
	const $scroller = ref<HTMLElement>();
	const $tabmenu = ref<HTMLElement>();

	const smooth = ref(false);
	const behavior = computed(() => smooth.value ? 'smooth' : 'auto');
	const { y } = useScroll($scroller, { behavior });
	const classSticky = ref('');

	watch(y, (_currentScrollY, _beforeScrollY) => {

		if (_beforeScrollY < 1 || !$scroller.value || !$tabmenu.value) return;

		classSticky.value = ($tabmenu.value?.offsetHeight < _currentScrollY) ? 'S=sticky-on' : '';

	});

	onMounted(() => {

		$view.value = document.querySelector('.mm_view') as HTMLElement;
		if ($view.value !== null) $scroller.value = $view.value.querySelector('.mm_page > .mm_scroller') as HTMLElement;

	});

	const isLoading = ref<boolean>(false);
	const tabItems = [
		{ id: '0', tab: '메뉴명' },
		{ id: '1', tab: '메뉴명' },
		{ id: '2', tab: '메뉴명' },
		{ id: '3', tab: '메뉴명' },
		{ id: '4', tab: '메뉴명' },
		{ id: '5', tab: '메뉴명' },
		{ id: '6', tab: '메뉴명' },
		{ id: '7', tab: '메뉴명' },
		{ id: '8', tab: '메뉴명' },
		{ id: '9', tab: '메뉴명' },
	];

	const tabId = ref<string>(tabItems[0].id);
	const items: unknown[] = [''];// 내용없음 확인용 임시 변수
</script>

<style src="./_showcase.scss" lang="scss"></style>