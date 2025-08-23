<template>
	<div class="mm_inner">
		<div class="m_coopbuy-off">
			<p
				v-if="items.length < 1"
				class="mm_text-none"
			>
				<i class="ico_text-none"></i>종료된 <b>공동구매가</b> 없습니다
			</p>

			<ul
				v-else
				class="m_coopbuy-list"
			>
				<li
					v-for="item in 3"
					:key="item"
				>
					<mm-link :to="{ name: 'CoopDetail', params: { id: 123 } }">
						<figure>
							<lazyload
								class="mm_bg-cover image_product"
								:src="isAdultOnly ? null : `/image/_sample/prod_x3_1.png`"
							></lazyload>
							<p
								v-if="isAdultOnly"
								class="text_adult"
							>
								<b class="mm_ir-blind">미성년자 구매불가</b><i class="ico_adult"></i>
							</p>
							<figcaption>
								<p class="text_state">
									{{ isComplete? '목표 달성': '목표 미달성' }}<span>/</span><strong>{{ '1,530' }}</strong> 명 참여
								</p>
								<p class="text_brand">
									{{ '엠몬스타' }}
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
	import { useFormatter } from '$/composables/useFormatter';
	import Lazyload from '@/component/Lazyload.vue';

	const { number } = useFormatter();

	const items: unknown[] = [''];// 내용없음 확인용 임시 변수

	const isAdultOnly = computed(() => Math.floor(Math.random() * 2) == 0 ? true : false);
	const isComplete = computed(() => Math.floor(Math.random() * 2) == 0 ? true : false);
</script>