<template>
	<div class="mm_view L=lowbtn">
		<!-- 헤더 -->
		<header class="mm_header">
			<h1><b>상품 상세</b></h1>
			<div class="mm_lside">
				<button
					type="button"
					class="btn_back"
					@click="historyBack"
				>
					<i class="ico_history-back"></i><b class="mm_ir-blind">이전으로</b>
				</button>
			</div>
			<div class="mm_rside">
				<mm-link :to="{ name: 'Search' }">
					<i class="ico_search"></i><b class="mm_ir-blind">검색</b>
				</mm-link>
				<cart-link></cart-link>
			</div>
		</header>

		<!-- 내용 -->
		<div
			id="mm_body"
			class="mm_page"
		>
			<!-- (D) 페이지 하단에 고정버튼이 있는 경우에는 html, mm_view 태그에 'L=lowbtn' 클래스를 추가합니다. -->
			<div class="mm_scroller">
				<div class="mm_page-inner">
					<!-- 본문 -->
					<div class="mm_page-content">
						<slot name="page"></slot>
					</div>
				</div>
			</div>

			<!-- 하단 옵션선택 -->
			<slot name="optionButton"></slot>

			<slot name="timedeal"></slot>

			<share v-if="shareStore.isShareOpen"></share>

			<scroll-top v-if="isMounted"></scroll-top>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { useShareStore } from '$/stores/useShareStore';
	import { useAppBridge } from '$/composables/useAppBridge';
	import ScrollTop from '@/component/ScrollTop.vue';
	import Share from '@/component/Share.vue';
	import CartLink from '@/component/link/CartLink.vue';

	const shareStore = useShareStore();

	const isMounted = ref<boolean>(false);
	onMounted(() => {
		isMounted.value = true;
	});

	const router = useRouter();
	const { closeCurrentWebview } = useAppBridge();

	/** 브라우저 뒤로가기와, 자체 버튼 뒤로가기 처리를 위해 필요 * */
	const historyBack = () => {
		if (window.history.state.position === 0
			&& window.history.state.back == null
		) {
			return closeCurrentWebview();
		}

		router.go(-1);
	};
</script>
