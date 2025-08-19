<template>
	<div class="mm_sns">
		<div class="mm_sns-dim"></div>
		<div
			class="mm_sns-list"
			:style="{ top: `${positionTop}px` }"
		>
			<ul>
				<li>
					<button
						type="button"
						class="btn_sns-kakaotalk"
						@click.prevent="kakaoShare"
					>
						<i class="ico_sns-kakao"></i><b class="mm_ir-blind">카카오톡 공유</b>
					</button>
				</li>
			</ul>
			<button
				ref="$btnShareClose"
				type="button"
				class="btn_sns-close"
				@click="shareStore.close()"
			>
				<i class="ico_sns-close"></i><b class="mm_ir-blind">공유 모달 닫기</b>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, onMounted, ref } from 'vue';
	import { useShareStore } from '$/stores/useShareStore';
	import { env } from '$/utils/env';
	import { useAppBridge } from '$/composables/useAppBridge';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useShareLink } from '$/composables/useShareLink';

	const shareStore = useShareStore();
	const positionTop = computed(() => shareStore.clickTarget!.getBoundingClientRect().top + (shareStore.clickTarget!.offsetTop >= window.innerHeight / 2 ? -105 : 105));
	const { bom, route } = useGlobalPageContext();
	const { getShortLink } = useShareLink();
	const $btnShareClose = ref<HTMLButtonElement>();
	// (접근성) mm_sns 노출 시 닫기버튼에 포커스
	onMounted(() => {
		$btnShareClose.value?.focus();
	});

	const { toShare } = useAppBridge();
	async function kakaoShare() {
		try {
			const shortenUri = await getShortLink(shareStore.shared.url || `${route.fullPath}`, shareStore.shared.previousUrl);
			const shareUrl = `${env('MM_SHARE_BASE_URL')}/ocareBridge?${shortenUri}`;

			toShare(shareUrl);
		}
		catch (e) {
			bom.alert('공유하기에 실패 하였습니다.');
		}
	}
</script>