<template>
	<div class="m_image-detail">
		<ul>
			<li
				v-for="imageUrl in imageUrls"
				:key="imageUrl"
			>
				<i>
					<lazyload
						tag="img"
						is-force
						:src="imageUrl"
					></lazyload>
				</i>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	import Lazyload from '@/component/Lazyload.vue';

	withDefaults(defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
		imageUrls: string[];
	}>(), {
		imageUrls: () => [],
	});

	defineExpose<OverlayComponentExpose>({
		title: `포토리뷰`,
	});
</script>