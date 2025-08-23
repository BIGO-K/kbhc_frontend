import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';

export const useShareStore = defineStore('share', () => {
	const isShareOpen = ref(false);
	const clickTarget = ref<HTMLElement>();
	const shared = reactive({
		title: '',
		content: '',
		imageUrl: '',
		url: '',
		previousUrl: '',
	});

	return {
		isShareOpen,
		clickTarget,
		shared,
		open: (_e: MouseEvent, _title: string, _content: string, _imageUrl: string = '', _url: string = '', _previousUrl: string = '') => {
			isShareOpen.value = true;
			clickTarget.value = _e.currentTarget as HTMLElement;

			shared.title = _title;
			shared.content = _content;
			shared.imageUrl = _imageUrl;
			shared.url = _url;
			shared.previousUrl = _previousUrl;

		},
		close: () => {
			isShareOpen.value = false;

			// (접근성) 닫기버튼 클릭 시 공유하기로 포커스
			clickTarget.value?.focus();
		},
	};
});