<template>
	<div class="mm_product-item T=pa">
		<mm-link :to="{ name: 'RaffleDetail', params: { id: raffle.id } }">
			<figure>
				<div class="mm_product-item-image">
					<lazyload
						class="mm_bg-cover image_product"
						:src="raffle.goods.thumbnail_url"
					></lazyload>
					<p
						v-if="raffle.status != RAFFLE_STATUS.UPCOMING"
						class="text_join"
					>
						{{ number(raffle.total_entry_count) }}{{ isEnd ? '명 참여' : '명 참여중' }}
					</p>
				</div>
				<figcaption>
					<div
						v-if="raffle.status !== RAFFLE_STATUS.BUY_END"
						class="m_raffle-ongoing-progress"
						:class="{ 'T=proceeding': raffle.status == RAFFLE_STATUS.ENTRY_START }"
					>
						<dl v-if="raffle.status == RAFFLE_STATUS.UPCOMING">
							<dt>래플 진행 예정</dt>
							<dd>{{ date(raffle.entry_start_at, 'MM.DD (ddd)') }}</dd>
						</dl>
						<dl v-else-if="raffle.status == RAFFLE_STATUS.ENTRY_START">
							<dt>래플 종료 까지</dt>
							<dd>{{ timer.hour }}<span>:</span>{{ timer.minute }}<span>:</span>{{ timer.second }}</dd>
						</dl>
						<dl v-else>
							<dt>래플 종료</dt>
							<dd>00<span>:</span>00<span>:</span>00</dd>
						</dl>
						<div
							v-if="raffle.status != RAFFLE_STATUS.UPCOMING"
							class="m...progress-bar"
						>
							<template v-if="raffle.status == RAFFLE_STATUS.ENTRY_START">
								<p
									class="text_state"
									:style="`left: ${timeProgress}%;`"
									title="20%"
								>
									진행중
								</p>
								<b :style="`width: ${timeProgress}%;`"><i></i></b>
							</template>
							<template v-else>
								<!-- (D) 종료일 경우 p태그에 style 속성을 주지 않습니다. -->
								<p
									class="text_state"
									title="100%"
								>
									종료
								</p>
								<b style="width: 100%;"><i></i></b>
							</template>
						</div>
					</div>
					<p class="text_brand">
						{{ raffle.goods.brand_name }}
					</p>
					<p class="text_product">
						{{ raffle.goods.name }}
					</p>
					<p
						v-if="raffle.goods.sale_rate > 0"
						class="text_sale"
					>
						{{ raffle.goods.sale_rate }}%
					</p>
					<p class="text_price">
						<strong>{{ number(raffle.goods.base_discounted_price) }}</strong>
						<del v-if="raffle.goods.base_discounted_price != raffle.goods.price"><span>{{ number(raffle.goods.price) }}</span></del>
					</p>
				</figcaption>
			</figure>
		</mm-link>
	</div>
	<template v-if="isEnd">
		<div class="mm_btn_box">
			<div class="mm_flex T=equal">
				<template v-if="raffle.is_entry && raffle.status !== RAFFLE_STATUS.BUY_END">
					<button
						type="button"
						class="mm_btn T=xs T=primary"
						@click="_e => modalRaffleResult(_e, raffle)"
					>
						<b>당첨 결과 확인하기</b>
					</button>
				</template>
				<template v-else>
					<b class="mm_btn T=xs T=disabled">래플 종료</b>
					<button
						v-if="raffle.is_confirmed_winner"
						type="button"
						class="mm_btn T=xs T=primary"
						@click="_e => overlayRaffleWinner(_e, raffle.id)"
					>
						<b>당첨자 보기</b>
					</button>
				</template>
			</div>
		</div>
	</template>
	<template v-else>
		<div
			v-if="raffle.status === RAFFLE_STATUS.ENTRY_START"
			class="mm_btn_box"
		>
			<b
				v-if="raffle.is_entry"
				class="mm_btn T=disabled"
			>
				{{ date(raffle.notice_at, 'MM.DD (ddd) HH:mm') }} 당첨자 발표 예정
			</b>
			<button
				v-else
				type="button"
				class="mm_btn T=primary"
				@click="_e => overlayEntryRaffle(_e)"
			>
				<b>응모하기</b>
			</button>
		</div>
	</template>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, computed, ref } from 'vue';
	import monsDate from '$/utils/date';
	import { useCountDown } from '$/composables/useCountDown';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useRaffle } from '$/composables/useRaffle';
	import Lazyload from '@/component/Lazyload.vue';

	const prop = defineProps<{
		item: Raffle;
		isEnd: boolean;
	}>();

	const { number, date } = useFormatter();
	const { openModal, openOverlay } = useGlobalPageContext();
	const { RAFFLE_STATUS, prepareEntry, getWinners, getWinningResult } = useRaffle();

	const raffle = ref(prop.item);
	const timeProgress = computed(() => {
		const progressed = monsDate().diff(raffle.value.entry_start_at, 'second');
		const total = monsDate(raffle.value.entry_start_at).diff(raffle.value.entry_end_at, 'second');

		return Math.ceil((Math.abs(progressed / total) * 0.985) * 100);
	});

	const { timer } = useCountDown(
		raffle.value.entry_end_at, {
			startDate: raffle.value.entry_start_at,
			dayToHour: true,
		}
	);

	const modalRaffleResult = async (_e: MouseEvent, _raffle: Raffle) => {
		const winningResult = await getWinningResult(_raffle.id);
		openModal(defineAsyncComponent(() => import('@/feature/raffle/b/RaffleResult.vue')), {
			props: {
				raffle: Object.assign({}, _raffle, {
					is_winner: winningResult.is_winner,
				}),
			},
			clickElement: _e.currentTarget,
		});
	};

	const overlayRaffleWinner = async (_e: MouseEvent, raffleId: number) => {
		const winners = await getWinners(raffleId);
		openOverlay(defineAsyncComponent(() => import('@/feature/raffle/RaffleWinner.vue')), {
			clickElement: _e.currentTarget,
			props: {
				raffleWinners: winners,
			},
		});
	};

	const overlayEntryRaffle = async (_e: MouseEvent) => {
		try {
			const entryInfo = await prepareEntry(prop.item.id);
			openOverlay(defineAsyncComponent(() => import('@/feature/raffle/RaffleEntry.vue')), {
				props: {
					entryInfo: entryInfo,
					raffleId: prop.item.id,
				},
				clickElement: _e.currentTarget,
				onClose: async () => {
					raffle.value.is_entry = true;
				},
			});
		}
		catch (error) {
			useErrorAlert(error);
		}
	};
</script>