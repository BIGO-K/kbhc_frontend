<template>
	<button
		type="button"
		class="btn_sns-share"
		@click="share"
	>
		<i class="ico_share"></i><b class="mm_ir-blind">공유하기</b>
	</button>
</template>
<script setup lang="ts">
	import { ref } from 'vue';
	import { useShareStore } from '$/stores/useShareStore';

	const props = withDefaults(defineProps<{
		title: string;
		description: string;
		firstGoodsImage: string;
	}>(), {
		title: '',
		description: '',
		firstGoodsImage: '',
	});
	const shareStore = useShareStore();
	const ogImage = ref('');

	function share(_e: MouseEvent) {
		if (!props.firstGoodsImage && !ogImage.value) {
			const $ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
			ogImage.value = $ogImage.content;
		}

		shareStore.open(_e, props.title, props.description, props.firstGoodsImage || ogImage.value);
	}
</script>