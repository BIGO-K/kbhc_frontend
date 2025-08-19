<template>
	<!-- 메인 팝업 -->
	<div
		v-if="isPopupOpen && mainLayerBanners.length > 0"
		class="m_main-popup T=pa S=on"
	>
		<div class="m_main-popup-dim"></div>
		<div class="m_main-popup-item">
			<carousel
				:items="mainLayerBanners"
				:use-count="true"
				:auto-delay="0"
				:is-auto-height="true"
			>
				<template #default="{ item }">
					<mm-link
						:to="item.link"
						open-webview
					>
						<lazyload
							:is-force="true"
							class="mui_bg-cover image_banner"
							:src="item.image_url"
							:alt="item.image_alt"
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
	import { useMainBanner } from '$/composables/useMainBanner';
	import Carousel from '@/component/Carousel.vue';
	import Lazyload from '@/component/Lazyload.vue';

	const { mainLayerBanners, isHideToday, hide, all } = useMainBanner();

	try {
		await all();
	}
	catch (e) {
		//
	}

	const isPopupOpen = ref(!isHideToday.value);

	// 팝업 닫기
	const closeLayer = (_isToday: boolean) => {

		isPopupOpen.value = false;

		// 오늘 그만보기
		if (_isToday) {
			hide();
		}

	};
</script>