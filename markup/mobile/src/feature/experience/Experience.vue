<template>
	<layout title="체험단 후기">
		<div class="m_experience">
			<div class="mm_inner">
				<!-- 체험단 후기 목록 -->
				<!-- (D) 회원일 경우에만 체험단 후기 작성 버튼을 노출합니다. -->
				<div class="m_experience-top">
					<a
						class="btn_register"
						href="#"
						@click.prevent="overlayExperienceCreate"
					>
						<i class="ico_experience-write"></i><b>체험단 후기 작성</b>
					</a>
				</div>

				<p
					v-if="items.length < 1"
					class="mm_text-none"
				>
					<i class="ico_text-none"></i>등록된 후기가 없습니다
				</p>

				<template v-else>
					<div
						v-if="isLoading"
						class="m_experience-list T=skeleton"
					>
						<ul>
							<li>
								<i class="image_banner"></i>
								<p class="text_title"></p>
								<p class="text_user"></p>
								<p class="text_date"></p>
							</li>
							<li>
								<i class="image_banner"></i>
								<p class="text_title"></p>
								<p class="text_user"></p>
								<p class="text_date"></p>
							</li>
							<li>
								<i class="image_banner"></i>
								<p class="text_title"></p>
								<p class="text_user"></p>
								<p class="text_date"></p>
							</li>
							<li>
								<i class="image_banner"></i>
								<p class="text_title"></p>
								<p class="text_user"></p>
								<p class="text_date"></p>
							</li>
						</ul>
					</div>
					<div
						v-else
						class="m_experience-list"
					>
						<ul>
							<li
								v-for="item in 10"
								:key="item"
							>
								<mm-link :to="{ name: 'ExperienceDetail', params: { id: 123 } }">
									<figure>
										<lazyload
											class="mm_bg-cover image_banner"
											:src="`/image/_sample/experience_review1.png`"
										></lazyload>
										<figcaption>
											<b class="text_star">
												<i
													class="ico_star-fill"
													title="별점"
												></i>
												<span>4.5</span>
											</b>
											<p class="text_title">
												{{ '일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사' }}
											</p>
											<p class="text_user">
												{{ '박효*' }}
											</p>
										</figcaption>
									</figure>
								</mm-link>
								<b class="text_view"><i class="ico_view"></i>{{ number(9999) }}</b>
								<toggle class="btn_thumb">
									<i class="ico_thumb"></i><b>{{ number(9999) }}</b>
								</toggle>
								<p class="text_date">
									{{ '2022.07.10' }}
								</p>
							</li>
						</ul>
					</div>

					<pagination></pagination>
				</template>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, defineAsyncComponent } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import Pagination from '@/component/Pagination.vue';
	import Toggle from '@/component/Toggle.vue';

	const { number } = useFormatter();
	const { openOverlay } = useGlobalPageContext();

	const items: unknown[] = [''];// 내용없음 확인용 임시 변수
	const isLoading = ref<boolean>(false);

	function overlayExperienceCreate() {
		const component = defineAsyncComponent(() => import('@/feature/experience/ExperienceCreate.vue'));

		return openOverlay(component);
	}
</script>

<style src="./_experience.scss" lang="scss"></style>