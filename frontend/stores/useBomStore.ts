import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const useBomStore = defineStore('bom', () => {
    /** BOM 관련 컨텍스트 */
	const bomContexts = ref<BomContext[]>([]);
    /** 로딩 여부 */
	const loading = ref<boolean>(false);

	return {
		bomContexts,
		/** 현재 포커스된 BOM 객체 */
		focusedBomContext: computed<Nullable<BomContext>>(() => bomContexts.value.at(-1) ?? null),
		/** BOM 객체 추가 */
		addBomContext: (context: BomContext) => {
			bomContexts.value = bomContexts.value.concat(context);
		},
		/** BOM 객체 삭제 */
		removeBomContext: (context: BomContext) => {
			bomContexts.value = bomContexts.value.filter(bom => bom.uuid !== context.uuid);
		},
		loading,
		/** 로딩 노출 */
		showLoading: () => {
			loading.value = true;
		},
		/** 로딩 숨김 */
		hideLoading: () => {
			loading.value = false;
		},
	};
});