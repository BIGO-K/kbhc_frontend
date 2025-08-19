<template>
	<layout title="랭킹">
		<div class="m_ranking T=rb">
			<h2 v-if="$route.name != 'RankingMain'">
				<b>Ranking</b>
			</h2>

			<!-- 랭킹gnb -->
			<div
				v-gnb-sticky
				class="m_ranking-gnb"
				:class="classSticky"
			>
				<div class="mm_tab_menu m_ranking-gnb-inner">
					<ul>
						<li
							v-for="_item in tabItems"
							:key="_item.name"
						>
							<mm-link
								:class="{ 'S=tab-on': _item.name === route.name }"
								:to="{ name: _item.name }"
								replace
							>
								<b>{{ _item.meta?.tab ?? '' }}</b>
							</mm-link>
						</li>
					</ul>
				</div>
			</div>

			<router-view></router-view>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, computed, watch } from 'vue';
	import { useRoute } from 'vue-router';
	import { useScroll } from '@vueuse/core';
	import Layout from '@/component/layout/Layout.vue';

	const route = useRoute();
	const tabItems = route.matched.at(-2)?.children;

	// 랭킹 gnb sticky
	const $scroller = ref<HTMLElement | null>(null);
	const $gnb = ref<HTMLElement | null>(null);
	const classSticky = ref('');

	const vGnbSticky = {
		mounted(_$element: HTMLElement) {

			$gnb.value = _$element;
			$scroller.value = document.querySelector('.mm_page > .mm_scroller') as HTMLElement;

			const smooth = ref(false);
			const behavior = computed(() => smooth.value ? 'smooth' : 'auto');
			const { y } = useScroll($scroller, { behavior });

			watch(y, () => {

				const offsetTop = _$element.getBoundingClientRect().top;

				if (offsetTop + _$element.offsetHeight <= 0) {
					_$element.style.height = getComputedStyle(_$element)['height'];
					classSticky.value = 'S=sticky';
				}
				else {
					_$element.style.height = '';
					classSticky.value = '';
				}

			});
		},
	};
</script>

<style src="../_ranking.scss" lang="scss"></style>