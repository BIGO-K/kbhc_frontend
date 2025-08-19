<template>
	<div class="m_prodetail-tab-info">
		<div class="mm_inner">
			<!-- 셀러 휴무일 -->
			<div class="m...info-seller-off">
				<strong>배송 공지</strong>
				<p>{{ '재고 정리' }}(으)로 {{ '0000-00-00 ~ 0000-00-00' }} 주문한 상품은 {{ '0000-00-00' }}부터 순차적으로 배송됩니다.</p>
			</div>

			<!-- 상품 공통배너 -->
			<div class="m...info-banner">
				<ul>
					<li>
						<!-- 이미지 등록 방식 -->
						<i class="image_banner">
							<lazyload
								tag="img"
								src="/image/_sample/prodetail_banner_1.png"
							></lazyload>
						</i>
					</li>
					<li>
						<!-- 에디터 등록 방식 -->
						<div class="mm_editor">
							<p>
								<lazyload
									tag="img"
									src="/image/_sample/prodetail_banner_1.png"
								></lazyload>
							</p>
						</div>
					</li>
				</ul>
			</div>

			<p class="text_code">
				상품번호<span>{{ '2345678' }}</span>
			</p>

			<!-- 동영상 -->
			<div class="m...info-media">
				<iframe
					width="560"
					height="315"
					src="https://www.youtube.com/embed/TM6m8TGlQBA"
					title="YouTube video player"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
				></iframe>
			</div>

			<!-- 상품 상세설명 및 이미지 -->
			<div class="m...info-desc">
				<p
					ref="$textZoom"
					class="text_zoom"
					:class="useNotice ? 'S=on' : ''"
				>
					상세정보를 확대해서 볼 수 있어요
				</p>

				<!-- 상세설명 -->
				<div
					class="mm_pinchzoom"
					data-pinchzoom
				>
					<div class="mm_pinchzoom-wrapper">
						<!-- (D) 에디터로 등록 -->
						<div class="mm_editor">
							<p style="text-align:center;">
								Rosy Bag_3colors
							</p>
							<p style="text-align:center;">
								N212UTS906 오버핏
							</p>
							<p style="text-align:center;">
								Butter컬러 28일발송
							</p>
							<br>
							<p style="text-align:center;">
								<lazyload
									tag="img"
									src="/image/_sample/prod_x3_4.png"
								></lazyload>
							</p>
							<br>
							<p style="text-align:center;">
								<lazyload
									tag="img"
									src="/image/_sample/product_detail_1.png"
								></lazyload>
							</p>
							<br>
							<br>
							<p style="text-align:center;">
								<lazyload
									tag="img"
									src="/image/_sample/product_detail_1.png"
								></lazyload>
							</p>
						</div>
					</div>
				</div>
				<div class="mm_btn_box">
					<toggle
						class="mm_btn T=line btn_more"
						title="상세정보 펼쳐보기"
						active-title="상세정보 접어놓기"
						parent-selector=".m...info-desc"
						@toggle="toggleDetailOpen"
					>
						<b class="mm_ir-blind">상세정보 더보기</b>
						<i class="ico_toggle"></i>
					</toggle>
				</div>
			</div>

			<!-- 상품 공통배너 -->
			<div class="m...info-banner">
				<ul>
					<li>
						<!-- 이미지 등록 방식 -->
						<i class="image_banner">
							<lazyload
								tag="img"
								src="/image/_sample/prodetail_banner_1.png"
							></lazyload>
						</i>
					</li>
					<li>
						<!-- 에디터 등록 방식 -->
						<div class="mm_editor">
							<p>
								<lazyload
									tag="img"
									src="/image/_sample/prodetail_banner_1.png"
								></lazyload>
							</p>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useAnimation } from '$/composables/useAnimation';
	import Lazyload from '@/component/Lazyload.vue';
	import Toggle from '@/component/Toggle.vue';

	const animation = useAnimation();

	const useNotice = ref(false);
	const $textZoom = ref<Nullable<HTMLElement>>(null);

	const toggleDetailOpen = (_isActive: boolean) => {
		useNotice.value = _isActive;

		animation.to($textZoom.value, { opacity: 1, duration: 0.3, ease: 'Sine.Out' });

		setTimeout(() => animation.to($textZoom.value, { opacity: 0, duration: 0.2, ease: 'Sine.In', onComplete: () => { useNotice.value = false; } }), 1500);

		console.log('확대 안내문구', _isActive);
	};
</script>