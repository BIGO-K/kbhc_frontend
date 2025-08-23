<template>
	<layout title="이벤트">
		<div class="m_event">
			<!-- (D) 등록된 카테고리 메뉴가 있는 경우 아래 메뉴 구조로 노출됩니다. -->
			<!-- 탭메뉴 -->
			<div
				v-if="tabItems.length > 1"
				ref="$tabmenu"
				class="mm_tab_menu"
				:class="classSticky"
			>
				<!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
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
			<!-- 이벤트 -->
			<section class="mm_inner">
				<!-- 이벤트 메뉴 -->
				<div class="m_event-menu">
					<mm-link
						class="btn_experience"
						:to="{ name: 'Experience' }"
					>
						<b>체험단 후기</b><i class="ico_link"></i>
					</mm-link>
				</div>

				<p
					v-if="items.length < 1"
					class="mm_text-none"
				>
					<i class="ico_text-none"></i>등록된 이벤트가 없습니다
				</p>

				<template v-else>
					<!-- 이벤트 리스트 -->
					<ul class="m_event-list">
						<li
							v-for="item in 5"
							:key="item"
						>
							<mm-link :to="{ name: 'EventDetail', params: { id: 123 } }">
								<figure>
									<lazyload
										class="mm_bg-cover image_banner"
										src="/image/_sample/event_banner1.png"
									></lazyload>
									<figcaption>
										<p class="text_main">
											{{ '담백한 이지웨어' }}
										</p>
										<p class="text_sub">
											{{ '의식있는 소비자를 위한 국내 최초 커스터마이징 클린 뷰티 브랜드 그린아뜰리 에의 이재연 대표를 만나다.' }}
										</p>
										<p class="text_period">
											{{ '2022.07.01' }} ~ {{ '2022.08.02' }}
										</p>
									</figcaption>
								</figure>
							</mm-link>
						</li>
					</ul>

					<pagination></pagination>
				</template>
			</section>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import Pagination from '@/component/Pagination.vue';

	const classSticky = ref('');

	const tabItems = [
		{ id: '0', tab: '전체' },
		{ id: '1', tab: '진행중' },
		{ id: '2', tab: '종료' },
	];

	const tabId = ref<string>(tabItems[0].id);
	const items: unknown[] = [''];// 내용없음 확인용 임시 변수
</script>

<style src="./_event.scss" lang="scss"></style>