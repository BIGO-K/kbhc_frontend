<template>
	<layout title="코디샷">
		<div class="m_codyshot">
			<template v-if="useNewCodyshot">
				<div class="m_codyshot-new">
					<h2><b>신규 코디샷</b></h2>
					<div class="mm_scroller T=x">
						<ul>
							<li
								v-for="item in 5"
								:key="item"
							>
								<div class="m_codyshot-item">
									<mm-link :to="{ name: 'CodyshotDetail', params: { id: 123 } }">
										<figure>
											<lazyload
												class="mm_bg-cover image_banner"
												src="/image/_sample/prod_x2_1.png"
											></lazyload>
											<figcaption>
												<p class="text_brand">
													{{ 'M.MONSTAR' }}
												</p>
												<p class="text_main">
													{{ '한 번에 완성하는 봄 스타일' }}
												</p>
											</figcaption>
										</figure>
									</mm-link>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<hr class="mm_line">
			</template>
			<div class="mm_inner">
				<form-select v-model="sortCodyshot">
					<option>전체 코디샷</option>
					<option>아울렛</option>
				</form-select>

				<p
					v-if="items.length < 1"
					class="mm_text-none"
				>
					<i class="ico_text-none"></i>등록된 상품이 없습니다
				</p>

				<ul
					v-else
					class="m_codyshot-list"
				>
					<li
						v-for="item in 6"
						:key="item"
					>
						<div class="m_codyshot-item">
							<mm-link :to="{ name: 'CodyshotDetail', params: { id: 123 } }">
								<figure>
									<lazyload
										class="mm_bg-cover image_banner"
										src="/image/_sample/prod_x2_3.png"
									></lazyload>
									<figcaption>
										<p class="text_brand">
											{{ 'M.MONSTAR' }}
										</p>
										<p class="text_main">
											{{ '한 번에 완성하는 봄 스타일' }}
										</p>
									</figcaption>
								</figure>
							</mm-link>
						</div>
					</li>
				</ul>

				<div
					v-if="items.length > 5"
					class="mm_foot"
				>
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
	import { ref, computed } from 'vue';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormSelect from '@/component/form/FormSelect.vue';

	const sortCodyshot = ref('');
	const items: unknown[] = [''];// 내용없음 확인용 임시 변수
	const useNewCodyshot = computed(() => Math.floor(Math.random() * 2) == 0 ? true : false);
</script>

<style src="./_codyshot.scss" lang="scss"></style>