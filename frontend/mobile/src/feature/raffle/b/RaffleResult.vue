<template>
	<div
		class="m_raffle-result T=rb"
		:class="{ 'T=raffle-prize': raffle.is_winner }"
	>
		<div class="mm_product-item">
			<figure>
				<div class="mm_product-item-image">
					<lazyload
						class="mm_bg-cover image_product"
						:src="raffle.goods.thumbnail_url"
						:is-error-image="false"
					></lazyload>
				</div>
				<figcaption>
					<p class="text_product">
						{{ raffle.goods.name }}
					</p>
				</figcaption>
			</figure>
		</div>

		<template v-if="raffle.is_winner">
			<h3><b>래플 당첨을 축하합니다!</b></h3>
			<p class="text_notice">
				해당 기간에 꼭 구매해주세요.
			</p>
			<p class="text_period">
				<!-- 구매가능 기간 시작, 종료 날짜가 같음 -->
				<template v-if="isSameDay">
					{{ date(raffle.buy_start_at, 'YYYY년 MM월 DD일 dd요일') }}
					<b>{{ `${date(raffle.buy_start_at, 'HH:mm')} ~ ${date(raffle.buy_end_at, 'HH:mm')} (${diffHour}시간)` }}</b>
				</template>
				<template v-else>
					<b>{{ date(raffle.buy_start_at, 'YYYY년 MM월 DD일 (ddd) HH:mm') }}</b>
					<b>{{ date(raffle.buy_end_at, 'YYYY년 MM월 DD일 (ddd) HH:mm') }}</b>
				</template>
			</p>
			<div class="mm_btn_box">
				<!-- <template v-if="!prop.raffle.is_bought"> -->
				<template v-if="!raffle.is_bought">
					<mm-link
						class="mm_btn T=primary"
						:to="{ name: 'RaffleDetail', params : { id: raffle.id} }"
					>
						<b>구매하러 가기</b>
					</mm-link>
				</template>
				<template v-else>
					<b class="mm_btn T=disabled">구매 완료</b>
				</template>
			</div>
		</template>
		<template v-else>
			<h3><b>아쉽게도 당첨되지 않았습니다</b></h3>
			<p class="text_notice">
				다음에 다시 도전해주세요!
			</p>
		</template>
	</div>
</template>

<script setup lang="ts">
	import monsDate from '$/utils/date';
	import { useFormatter } from '$/composables/useFormatter';
	import Lazyload from '@/component/Lazyload.vue';

	const prop = defineProps<{
		/** @prop { T } - LayoutModal의 closer 함수 */
		closer: <T>(context?: T) => void;
		raffle: Pick<MyRaffle, 'id' | 'buy_start_at' | 'buy_end_at' | 'goods' | 'is_winner' | 'is_bought'>;
	}>();

	const { date } = useFormatter();

	defineExpose<ModalComponentExpose>({
		title: `당첨 결과 확인`,
		isHideHeader: true,
	});

	const isSameDay = monsDate(prop.raffle.buy_start_at).isSame(prop.raffle.buy_end_at, 'day');
	const diffHour = Math.abs(monsDate(prop.raffle.buy_start_at).diff(prop.raffle.buy_end_at, 'h'));
</script>

<style src="../_raffle.scss" lang="scss"></style>