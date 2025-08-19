<template>
	<div class="m_card-benefit">
		<!-- 무이자할부안내 -->
		<section>
			<h3>
				<b>무이자 할부 안내</b>
			</h3>
			<ul>
				<li>
					<lazyload
						class="mm_bg-contain image_card"
						src="/image/_sample/card_logo_1."
						title="비씨카드"
						:is-error-image="false"
					></lazyload>
					<p>하나카드 5만원이상 결제 시 2~6개월 무이자 할부</p>
					<p>대상: BC카드 전 회원(하나 BC카드 포함)</p>
					<span>2024.05.01~2024.05.05</span>
				</li>
				<li>
					<lazyload
						class="mm_bg-contain image_card"
						src="/image/_sample/card_logo_2.png"
						title="국민은행"
						:is-error-image="false"
					></lazyload>
					<p>국민카드 5만원이상 결제 시 2~6개월 무이자 할부</p>
					<p>대상: 국민카드 전 회원</p>
					<span>2024.05.01~2024.05.05</span>
				</li>
				<li>
					<lazyload
						class="mm_bg-contain image_card"
						src="/image/_sample/card_logo_3.png"
						title="농협카드"
						:is-error-image="false"
					></lazyload>
					<p>농협카드 5만원이상 결제 시 2~6개월 무이자 할부</p>
					<p>대상: 농협카드 전 회원</p>
					<span>2024.05.01~2024.05.05</span>
				</li>
			</ul>
		</section>

		<!-- 부분무이자할부안내 -->
		<section>
			<h3>
				<b>부분 무이자 할부 안내</b>
			</h3>
			<ul>
				<li>
					<lazyload
						class="mm_bg-contain image_card"
						src="/image/_sample/card_logo_4.png"
						title="삼성카드"
						:is-error-image="false"
					></lazyload>
					<p>삼성카드 10개월 부분 무이자</p>
					<p>대상: 삼성카드 전 회원</p>
					<span>2024.05.01~2024.05.05</span>
				</li>
				<li>
					<lazyload
						class="mm_bg-contain image_card"
						src="/image/_sample/card_logo_5.png"
						title="신한카드"
						:is-error-image="false"
					></lazyload>
					<p>신한카드 10개월 부분 무이자</p>
					<p>대상: 신한카드 전 회원</p>
					<span>2024.05.01~2024.05.05</span>
				</li>
				<li>
					<lazyload
						class="mm_bg-contain image_card"
						src="/image/_sample/card_logo_6.png"
						title="하나카드"
						:is-error-image="false"
					></lazyload>
					<p>하나카드 10개월 부분 무이자</p>
					<p>대상: 하나카드 전 회원</p>
					<span>2024.05.01~2024.05.05</span>
				</li>
			</ul>
		</section>
	</div>
</template>

<script setup lang="ts">
	import Lazyload from '@/component/Lazyload.vue';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `카드사별 혜택`,
	});
</script>