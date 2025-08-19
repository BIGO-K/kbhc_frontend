<template>
	<div class="mm_inner">
		<div class="m_coopbuy-on">
			<p
				v-if="items.length < 1"
				class="mm_text-none"
			>
				<i class="ico_text-none"></i>진행중인 공동구매가 없습니다
			</p>

			<ul
				v-else
				class="m_coopbuy-list"
			>
				<li
					v-for="item in 2"
					:key="item"
					:class="{'S=coopbuy-complete': isComplete}"
				>
					<mm-link :to="{ name: 'CoopDetail', params: { id: 123 } }">
						<figure>
							<lazyload
								class="mm_bg-cover image_product"
								:src="isAdultOnly ? null : `/image/_sample/prod_x3_1.png`"
							></lazyload>
							<figcaption>
								<p
									v-if="isAdultOnly"
									class="text_adult"
								>
									<b class="mm_ir-blind">미성년자 구매불가</b><i class="ico_adult"></i>
								</p>
								<div class="m_coopbuy-on-progress">
									<p class="text_state">
										<b>D<span>-</span>{{ '30' }}<strong>{{ '719' }}<span>:</span>{{ '14' }}<span>:</span>{{ '38' }}</strong></b>
										<strong
											class="mm_tag"
											:class="{'T=bg T=primary': !isComplete}"
										>
											{{ isComplete? '목표 달성': '진행 중' }}
										</strong>
									</p>
									<p class="text_goal">
										목표까지<b><strong>{{ '5,852' }}<sub>명</sub></strong><span>/</span>{{ '10,000' }}명</b>
									</p>
									<b class="m...progress-bar">
										<i
											:style="`width:${isComplete? '100': '50'}%`"
											:title="`${isComplete? '100': '50'}%`"
										></i>
									</b>
								</div>
								<p class="text_brand">
									{{ 'BRANDNAME 엠몬스타' }}
								</p>
								<p class="text_product">
									{{ 'ProductNAME [굿프라이스][22SPRING][기은세, 뷰티펄진 주 착용][1차: OATMEAL 4/8, 2차: LIGHT GREY' }}
								</p>
								<p class="text_price">
									<b>공동구매가</b><strong>{{ number(99000) }}</strong><del><span>{{ number(118800) }}</span></del>
								</p>
							</figcaption>
						</figure>
					</mm-link>
					<div class="mm_btn_box">
						<div class="mm_flex T=equal">
							<!-- 공유하기 -->
							<button
								type="button"
								class="mm_btn T=light btn_sns-share"
								@click="shareStore.open"
							>
								<i class="ico_share"></i><b>친구에게 공유하기</b>
							</button>
							<mm-link
								class="mm_btn T=primary btn_coopbuy-entry"
								:to="{ name: 'CoopDetail', params: { id: 123 } }"
							>
								<b>공동구매 참여하기</b>
							</mm-link>
						</div>
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
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import { useShareStore } from '$/stores/useShareStore';
	import { useFormatter } from '$/composables/useFormatter';
	import Lazyload from '@/component/Lazyload.vue';

	const { number } = useFormatter();
	const shareStore = useShareStore();
	const items: unknown[] = [''];// 내용없음 확인용 임시 변수

	const isAdultOnly = computed(() => Math.floor(Math.random() * 2) == 0 ? true : false);
	const isComplete = computed(() => Math.floor(Math.random() * 2) == 0 ? true : false);
</script>