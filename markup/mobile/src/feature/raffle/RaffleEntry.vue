<template>
	<div class="mm_inner m_raffle-entry">
		<h6 class="mm_text-label">
			<b>아이디</b>
		</h6>
		<p class="text_readonly">
			<b>{{ 'fghij***@naver.com' }}</b>
		</p>
		<h6 class="mm_text-label">
			<b>이름</b>
		</h6>
		<p class="text_readonly">
			<b>{{ '홍길동' }}</b>
		</p>
		<h6 class="mm_text-label">
			<b>휴대폰 번호</b>
		</h6>
		<p class="text_readonly">
			<b>{{ '01012344567' }}</b>
		</p>

		<!-- 유의사항 -->
		<div class="mm_note T=bg">
			<ul>
				<li>래플은 회원 아이디 기준으로 이벤트 당 1회 응모 가능합니다.</li>
				<li>래플은 선착순이 아닌 랜덤 추첨으로 진행됩니다.</li>
				<li>마이페이지 &#62; 래플 응모 내역에서 당첨 여부 확인할 수 있습니다.</li>
				<li>회원정보 기준으로 당첨자 본인만 구매 가능합니다.</li>
				<li>당첨자에 한하여 구매기간 이내 구매 가능하며 미구매 시 당첨이 취소됩니다.</li>
				<li>래플 상품은 취소, 반품, 교환이 불가능합니다.</li>
			</ul>
		</div>

		<form-check
			v-model="raffleEntryAgree"
			label="안내사항을 확인하였으며 이에 동의합니다."
			icon-class="T=sm"
		></form-check>

		<!-- 하단버튼 -->
		<div class="mm_foot">
			<div class="mm_btn_box">
				<button
					type="button"
					class="mm_btn T=primary"
				>
					<b>응모하기</b>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import FormCheck from '@/component/form/FormCheck.vue';

	const raffleEntryAgree = ref(false);

	defineExpose<OverlayComponentExpose>({
		title: `응모하기`,
	});
</script>

<style src="./_raffle.scss" lang="scss"></style>