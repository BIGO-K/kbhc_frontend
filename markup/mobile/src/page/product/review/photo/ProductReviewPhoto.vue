<template>
	<div class="m_image-detail">
		<ul>
			<li>
				<i>
					<lazyload
						tag="img"
						src="/image/_sample/prod_x3_2.png"
					></lazyload>
				</i>
			</li>
			<li>
				<i>
					<lazyload
						tag="img"
						src="/image/_sample/prod_x3_3.png"
					></lazyload>
				</i>
			</li>
			<li>
				<i>
					<lazyload
						tag="img"
						src="/image/_sample/prod_x3_1.png"
					></lazyload>
				</i>
			</li>
		</ul>
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
		title: `포토리뷰`,
	});
</script>