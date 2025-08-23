<template>
	<layout title="체험단 후기">
		<div class="m_experience">
			<div class="mm_inner">
				<!-- 체험단 후기 목록 -->
				<!-- (D) 회원일 경우에만 체험단 후기 작성 버튼을 노출합니다. -->
				<div class="m_experience-top">
					<button
						type="button"
						class="btn_register"
						@click="_e => overlayExperienceCreate(_e)"
					>
						<i class="ico_experience-write"></i><b>체험단 후기 작성</b>
					</button>
				</div>

				<div
					v-if="!paginator"
					class="m_experience-list T=skeleton"
				>
					<ul>
						<li
							v-for="_i in 4"
							:key="_i"
						>
							<i class="image_banner"></i>
							<p class="text_title"></p>
							<p class="text_user"></p>
							<p class="text_date"></p>
						</li>
					</ul>
				</div>
				<p
					v-else-if="paginator.total < 1"
					class="mm_text-none"
				>
					<i class="ico_text-none"></i>등록된 후기가 없습니다
				</p>
				<template v-else>
					<div class="m_experience-list">
						<ul>
							<li
								v-for="experienceReview in paginator.data"
								:key="experienceReview.id"
							>
								<mm-link :to="{ name: 'ExperienceDetail', params: { id: experienceReview.id } }">
									<figure>
										<lazyload
											class="mm_bg-cover image_banner"
											:src="experienceReview.thumbnail_url"
										></lazyload>
										<figcaption>
											<b class="text_star">
												<i
													class="ico_star-fill"
													title="별점"
												></i>
												<span>{{ experienceReview.grade }}</span>
											</b>
											<p class="text_title">
												{{ experienceReview.title }}
											</p>
											<p class="text_user">
												{{ experienceReview.writer }}
											</p>
										</figcaption>
									</figure>
								</mm-link>
								<b class="text_view"><i class="ico_view"></i>{{ number(experienceReview.view_count) }}</b>
								<toggle
									v-model:is-active="recommended[experienceReview.id]"
									is-lazy
									class="btn_thumb"
									@click="changeRecommend(experienceReview.id)"
								>
									<i class="ico_thumb"></i><b>{{ number(experienceReview.recommendation_count) }}</b>
								</toggle>
								<p class="text_date">
									{{ date(experienceReview.created_at, 'YYYY.MM.DD') }}
								</p>
							</li>
						</ul>
					</div>
					<pagination
						v-bind="{
							currentPage: paginator.current_page,
							itemsPerPage: paginator.per_page,
							totalCount: paginator.total
						}"
						@move:page="fetch"
					></pagination>
				</template>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, defineAsyncComponent, onMounted } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useExperienceReview } from '$/composables/useExperienceReview';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import Pagination from '@/component/Pagination.vue';
	import Toggle from '@/component/Toggle.vue';

	const { date, number } = useFormatter();
	const { route, loading, openOverlay } = useGlobalPageContext();
	const { getPaginator, getRecommended, recommend, cancelRecommend } = useExperienceReview();

	const paginator = ref<Paginator<ExperienceReview>>();
	const recommended = ref<Record<number, boolean>>({});

	async function fetch(page: number = 1) {
		try {
			paginator.value = await getPaginator(page);
			const recommendRelation = await getRecommended(paginator.value.data.map(review => review.id));
			recommended.value = Object.fromEntries(
				recommendRelation
					.map(relation => [relation.review_id, relation.is_recommendation])
			);
		}
		catch (e) {
			useErrorAlert(e);
		}
	}

	async function changeRecommend(id: number) {
		loading.show();
		try {
			if (!recommended.value[id]) {
				await recommend(id);
				recommended.value[id] = true;
				(paginator.value?.data || []).find(review => review.id == id)!.recommendation_count++;
			}
			else {
				await cancelRecommend(id);
				recommended.value[id] = false;
				(paginator.value?.data || []).find(review => review.id == id)!.recommendation_count--;
			}
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}

	const overlayExperienceCreate = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/feature/experience/ExperienceCreate.vue')), {
			clickElement: _e.currentTarget,
		});
	};

	onMounted(async () => {
		const page = route.query.page ? Number(route.query.page) : 1;
		await fetch(page);
	});
</script>

<style src="./_experience.scss" lang="scss"></style>