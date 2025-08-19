<template>
	<p
		v-if="planningEvents.length < 1"
		class="mm_text-none"
	>
		<i class="ico_text-none"></i>최근 본 기획전이 없습니다
	</p>

	<template v-else>
		<div class="mm_inner m_myrecent">
			<p class="m_myrecent-note">
				2주 후 자동 삭제
			</p>
			<div class="m_myrecent-promo">
				<ul>
					<li
						v-for="planning in planningEvents"
						:key="planning.id"
					>
						<a
							href="#"
							@click.prevent="goPromotionPage(planning)"
						>
							<b :class="['mm_tag', { 'T=bg T=gray': planning.is_ended }]">
								{{ planning.is_ended ? '종료' : '진행중' }}
							</b>
							<p>{{ planning.title }}</p>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</template>
</template>

<script setup lang="ts">
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyShopping } from '$/composables/useMyShopping';

	const { bom, router } = useGlobalPageContext();
	const planningEvents = await useMyShopping().getRecentViewPlanningEvents(30);

	const goPromotionPage = (planning: RecentViewPlanningEvent) => {

		if (planning.is_ended) return bom.alert('종료된 기획전 입니다.');

		router.push({
			name: 'PromotionDetail',
			params: {
				id: planning.id,
			},
		});
	};
</script>