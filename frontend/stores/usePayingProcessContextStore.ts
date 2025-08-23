import { ref } from 'vue';
import { defineStore } from 'pinia';
import { STORE_PAY_PROCESS_CONTEXT_KEY } from '$/constants';

/** key 값 변경 금지 */
export const usePayingProcessContextStore = defineStore(STORE_PAY_PROCESS_CONTEXT_KEY, () => {

	const payingProcessContext = ref<PayingProcessContext | null>(null);
	const isCurrentProcessEnded = ref<boolean>(false);

	return {
		payingProcessContext,
		isCurrentProcessEnded,
		clearContext: () => {
			payingProcessContext.value = null;
			isCurrentProcessEnded.value = false;
		},
		startContext: (processId: string) => {
			if (!payingProcessContext.value) {
				payingProcessContext.value = {
					processId: processId,
					isPayStart: true,
					isPayEnd: false,
				};

				return;
			}

			if (payingProcessContext.value.processId === processId) {

				payingProcessContext.value = {
					processId: processId,
					isPayStart: true,
					isPayEnd: true,
				};
				isCurrentProcessEnded.value = true;

			}

		},
		endProcessContext: (processId: string) => {
			payingProcessContext.value = {
				processId: processId,
				isPayStart: true,
				isPayEnd: true,
			};

			isCurrentProcessEnded.value = true;
		},
		touchEnd: () => {
			if (payingProcessContext.value) {
				payingProcessContext.value.isPayEnd = true;
				isCurrentProcessEnded.value = true;
			}
		},
	};
}, {
	persist: {
		storage: localStorage,
	},
});