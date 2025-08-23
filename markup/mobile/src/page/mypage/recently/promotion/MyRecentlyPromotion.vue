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
						<mm-link :to="{ name: 'PromotionDetail', params: { id: planning.id } }">
							<b :class="['mm_tag', { 'T=bg T=gray': planning.is_ended }]">{{ planning.is_ended ? '종료' : '진행중' }}</b>
							<p>{{ planning.title }}</p>
						</mm-link>
					</li>
				</ul>
			</div>
		</div>
	</template>
</template>

<script setup lang="ts">
	const promotions: RecentViewPlanningEvent[] = [
		{
			id: 1,
			// title: '트릴리온(TRILLION) 지금 가장 핫한 특가! 봄 신상 핫 세일 트릴리온(TRILLION) 지금 가장 핫한 특가! 봄 신상 핫 세일 트릴리온(TRILLION) 지금 가장 핫한 특가! 봄 신상 핫 세일 트릴리온(TRILLION) 지금 가장 핫한 특가! 봄 신상 핫 세일',
			title: '트릴리온(TRILLION) 지금 가장 핫한 특가! 봄 신상 핫 세일',
			is_ended: false,
		},
		{
			id: 2,
			title: '깜짝 브랜드day♡ MAX 추가 20%인하',
			is_ended: false,
		},
		{
			id: 3,
			title: 'LESHOP 아울렛 독점오픈! 매장상품 저렴하게',
			is_ended: false,
		},
		{
			id: 4,
			title: '브랜드 위크 최대 24%쿠폰혜택',
			is_ended: true,
		},
		{
			id: 5,
			title: '온라인 쿠폰위크대전 SUMMER 소장각 ITEM 가득',
			is_ended: true,
		},
	];
	// const planningEvents = [];
	const planningEvents = promotions;
</script>