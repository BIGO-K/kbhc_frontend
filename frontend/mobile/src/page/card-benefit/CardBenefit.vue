<template>
	<div class="m_card-benefit">
		<!-- 무이자할부안내 -->
		<template v-if="!cardInstallmentInfo">
			<p class="mm_text-none T=sm">
				<i class="ico_text-none"></i>등록된 할부 정보가 없습니다
			</p>
		</template>
		<template v-else>
			<section v-if="cardInstallmentInfo.interest_free_list.length > 0">
				<h3>
					<b>무이자 할부 안내</b>
				</h3>
				<ul>
					<li
						v-for="installment in cardInstallmentInfo.interest_free_list"
						:key="installment.card_code"
					>
						<lazyload
							class="mm_bg-contain image_card"
							is-force
							:src="installment.image_url"
							:title="installment.card_code"
							:is-error-image="false"
						></lazyload>
						<p v-html="newLineToBr(installment.info)"></p>
						<span>{{ cardInstallmentDueDate }}</span>
					</li>
				</ul>
			</section>

			<!-- 부분무이자할부안내 -->
			<section v-if="cardInstallmentInfo.partial_interest_list.length > 0">
				<h3>
					<b>부분 무이자 할부 안내</b>
				</h3>
				<ul>
					<li
						v-for="partial in cardInstallmentInfo.partial_interest_list"
						:key="`partial_${partial.card_code}`"
					>
						<lazyload
							class="mm_bg-contain image_card"
							is-force
							:src="partial.image_url"
							:title="partial.card_code"
							:is-error-image="false"
						></lazyload>
						<p v-html="newLineToBr(partial.info)"></p>
						<span>{{ cardInstallmentDueDate }}</span>
					</li>
				</ul>
			</section>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import Lazyload from '@/component/Lazyload.vue';

	const props = defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
		cardInstallmentInfo: Nullable<CardInstallment>;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `카드사별 혜택`,
	});

	const { newLineToBr, date } = useFormatter();
	const cardInstallmentDueDate = computed(() => props.cardInstallmentInfo ?
		`${date(props.cardInstallmentInfo.display_start_at, 'YYYY.MM.DD')} ~ ${date(props.cardInstallmentInfo.display_end_at, 'YYYY.MM.DD')}`
		: ''
	);
</script>