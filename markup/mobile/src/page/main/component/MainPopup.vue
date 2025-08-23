<template>
	<!-- 메인 팝업 -->
	<div
		class="m_main-popup T=pa"
		:class="{ 'S=on': isPopupOpen }"
	>
		<div class="m_main-popup-dim"></div>
		<div class="m_main-popup-item">
			<carousel
				:items="carouselItems"
				:use-count="true"
				:auto-delay="0"
				:is-auto-height="true"
			>
				<template #default="{ item }">
					<mm-link :to="item.link">
						<lazyload
							tag="img"
							class="mui_bg-cover image_banner"
							:src="item.image"
							:alt="item.alt"
						></lazyload>
					</mm-link>
				</template>
			</carousel>
			<div class="mm_btn_box">
				<button
					type="button"
					class="btn_today"
					@click="closeLayer(true)"
				>
					<b>오늘 그만보기</b>
				</button>
				<button
					type="button"
					class="btn_close"
					@click="closeLayer(false)"
				>
					<i class="ico_popup-close T=sm"></i><b>닫기</b>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import Carousel from '@/component/Carousel.vue';
	import Lazyload from '@/component/Lazyload.vue';

	const carouselItems = [
		{
			link: '#',
			image: '/image/_sample/main_popup_a_01.jpg',
			alt: '대체텍스트',
		},
		{
			link: '#',
			image: '/image/_sample/main_popup_a_01.jpg',
			alt: '대체텍스트',
		},
	];

	const isPopupOpen = ref(true);

	// 팝업 닫기
	const closeLayer = (_isToday: boolean) => {

		isPopupOpen.value = false;

		// 오늘 그만보기
		if (_isToday) {
			//
		}

	};
</script>