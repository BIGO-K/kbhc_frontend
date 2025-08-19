<template>
	<layout title="이벤트">
		<div class="m_event">
			<!-- (D) 등록된 카테고리 메뉴가 있는 경우 아래 메뉴 구조로 노출됩니다. -->
			<!-- 탭메뉴 -->
			<div class="mm_tab_menu">
				<!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
				<ul>
					<li
						v-for="tab in processTabs"
						:key="tab.value"
					>
						<mm-link
							:class="{ 'S=tab-on': processState == tab.value }"
							:to="{ name: 'Event', query: { process: tab.value }}"
							replace
						>
							<b>{{ tab.label }}</b>
						</mm-link>
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

				<ul
					v-if="!paginator"
					class="m_event-list T=skeleton"
				>
					<li
						v-for="_i in 5"
						:key="_i"
					>
						<i class="image_banner"></i>
						<p class="text_main"></p>
						<p class="text_sub"></p>
						<p class="text_period"></p>
					</li>
				</ul>
				<p
					v-else-if="paginator.total < 1"
					class="mm_text-none"
				>
					<i class="ico_text-none"></i>등록된 이벤트가 없습니다
				</p>

				<template v-else>
					<!-- 이벤트 리스트 -->
					<ul class="m_event-list">
						<li
							v-for="specialEvent in paginator.data"
							:key="specialEvent.id"
						>
							<mm-link
								:to="specialEvent.is_use_detail_url
									? specialEvent.detail_url
									: { name: 'EventDetail', params: { id: specialEvent.id } }
								"
							>
								<figure>
									<lazyload
										class="mm_bg-cover image_banner"
										:src="specialEvent.image_url"
									></lazyload>
									<figcaption>
										<p class="text_main">
											{{ specialEvent.title }}
										</p>
										<p class="text_sub">
											{{ specialEvent.description }}
										</p>
										<p class="text_period">
											{{ date(specialEvent.start_at, 'YYYY.MM.DD') }} ~
											{{ date(specialEvent.end_at, 'YYYY.MM.DD') }}
										</p>
									</figcaption>
								</figure>
							</mm-link>
						</li>
					</ul>

					<pagination
						v-if="paginator"
						v-bind="{
							currentPage: paginator.current_page,
							itemsPerPage: paginator.per_page,
							totalCount: paginator.total
						}"
						@move:page="fetch"
					></pagination>
				</template>
			</section>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, computed, watch, onMounted } from 'vue';
	import { onBeforeRouteLeave } from 'vue-router';
	import { useRouteQuery } from '@vueuse/router';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useSpecialEvent } from '$/composables/useSpecialEvent';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import Pagination from '@/component/Pagination.vue';

	const { route, loading } = useGlobalPageContext();
	const { date } = useFormatter();
	const { processTabs, getPaginator } = useSpecialEvent();

	const process = useRouteQuery<ProcessLabel | null>('process', null);

	watch(process, (to, from) => {
		if (from && !to) {
			process.value = from;
		}
	});

	const processState = computed(() => {
		if (!process.value) {
			return 'progress';
		}

		return processTabs.map(tab => tab.value).includes(process.value) ? process.value : 'progress';
	});

	const paginator = ref<Paginator<SpecialEvent> | null>(null);

	async function fetch(page: number = 1) {
		paginator.value = null;
		loading.show();

		try {
			paginator.value = await getPaginator(processState.value, page);
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}

	const stateWatcher = watch(processState, async () => {
		await fetch();
	});

	onMounted(() => {
		fetch(route.query.page ? Number(route.query.page) : 1);
	});

	onBeforeRouteLeave(() => {
		stateWatcher();
	});
</script>

<style src="./_event.scss" lang="scss"></style>