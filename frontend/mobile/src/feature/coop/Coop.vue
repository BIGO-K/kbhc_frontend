<template>
	<layout title="공동구매">
		<div class="m_coopbuy">
			<div class="m_coopbuy-head">
				<h3><b>목표 수량에 도달하면<br> <strong>공동구매</strong> 성공!</b></h3>
				<strong><b>지금 참여하기 버튼을 누르세요</b></strong>
				<p>목표수량 도달 시 알림톡과 쿠폰이 발송되며<br> 해당 상품을 공동구매가로 구매하실 수 있습니다.</p>
				<ol>
					<li><i class="ico_coopbuy-join"></i><b>공동구매<br> 참여</b></li>
					<li><i class="ico_coopbuy-goal"></i><b>목표 달성</b></li>
					<li><i class="ico_coopbuy-coupon"></i><b>쿠폰 발급</b></li>
					<li><i class="ico_coopbuy-buy"></i><b>상품 구매</b></li>
				</ol>
			</div>
			<tab-router
				class="T=full T=lg"
				:is-keep="false"
			></tab-router>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import Layout from '@/component/layout/Layout.vue';
	import TabRouter from '@/component/TabRouter.vue';
</script>

<style src="./_coop.scss" lang="scss"></style>