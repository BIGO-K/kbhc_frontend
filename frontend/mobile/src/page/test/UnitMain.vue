<template>
	<layout
		:title="'임시 메인'"
	>
		<div style="margin-top: 10%">
			<h6
				style="padding-left: 20%;"
				class="mm_text-label"
			>
				<mm-link
					class="mm_btn T=primary"
					:to="{ name: 'Category', params: { id: '001000000'}}"
				>
					<b>카테고리(남성)페이지 바로가기</b>
				</mm-link>
			</h6>
			<h6
				style="padding-left: 20%;"
				class="mm_text-label"
			>
				<mm-link
					class="mm_btn T=primary"
					:to="{ name: 'BrandShop', params: { id: 1}}"
				>
					<b>브랜드샵 페이지 바로가기</b>
				</mm-link>
			</h6>
			<h6
				style="padding-left: 20%;"
				class="mm_text-label"
			>
				<mm-link
					class="mm_btn T=primary"
					:to="{ name: 'SellerShop', params: { id: 1}}"
				>
					<b>판매자샵 페이지 바로가기</b>
				</mm-link>
			</h6>
			<h6
				style="padding-left: 20%;"
				class="mm_text-label"
			>
				<mm-link
					class="mm_btn T=primary"
					:to="{ name: 'PromotionDetail', params: { id: 2}}"
				>
					<b>기획전 페이지 바로가기</b>
				</mm-link>
			</h6>
			<h6
				style="padding-left: 20%;"
				class="mm_text-label"
			>
				<mm-link
					class="mm_btn T=primary"
					:to="{ name: 'Event' }"
				>
					<b>이벤트 페이지 바로가기</b>
				</mm-link>
			</h6>
			<h6
				style="padding-left: 20%;"
				class="mm_text-label"
			>
				<mm-link
					class="mm_btn T=primary"
					:to="{ name: 'Coop' }"
				>
					<b>공동구매 리스트 페이지 바로가기</b>
				</mm-link>
			</h6>
			<h6
				style="padding-left: 20%;"
				class="mm_text-label"
			>
				<mm-link
					class="mm_btn T=primary"
					:to="{ name: 'Showcase' }"
				>
					<b>쇼케이스 리스트 페이지 바로가기</b>
				</mm-link>
			</h6>
			<h6
				style="padding-left: 20%;"
				class="mm_text-label"
			>
				<mm-link
					class="mm_btn T=primary"
					:to="{ name: 'RankingMain' }"
				>
					<b>랭킹 페이지 바로가기</b>
				</mm-link>
			</h6>

			<h6
				style="padding-left: 20%;"
				class="mm_text-label"
			>
				<mm-link
					class="mm_btn T=primary"
					:to="{ name: 'RankingMain' }"
					open-webview
				>
					<b>랭킹 웹뷰 테스트 하기</b>
				</mm-link>
			</h6>
		</div>
	</layout>
</template>

<script setup lang='ts'>
	import Layout from '@/component/layout/Layout.vue';
</script>