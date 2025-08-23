import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useMyOrder } from '$/composables/useMyOrder';

type ExchangePrepareForm = ExchangeForm & { is_self_retrieve: 1 | 0 };

export const useExchangeStore = defineStore('exchange-prepare', () => {

	const { applyExchange, getExchangePayResult } = useMyOrder();
	const exchangeForm = ref<ExchangePrepareForm | null>(null);

	return {
		exchangeForm,
		setForm: (form: ExchangePrepareForm) => {
			exchangeForm.value = form;
		},
		checkPayResult: async () => {
			if (!exchangeForm.value?.payment_token) {
				return {
					is_success: false,
					error_message: '올바른 요청이 아닙니다.',
				};
			}

			const { is_success, error_message } = await getExchangePayResult(exchangeForm.value.payment_token);

			if (is_success) {
				exchangeForm.value.is_additional_payment_paid = true;
			}

			return {
				is_success,
				error_message,
			};
		},
		apply: async () => {
			if (!exchangeForm.value) {
				return;
			}

			try {
				const exchangeId = await applyExchange(exchangeForm.value);

				return exchangeId;
			}
			catch (e) {
				return;
			}
			/** 교환 신청 처리 */
		},
		resetForm: () => {
			exchangeForm.value = null;
		},
	};

}, {
	persist: {
		storage: sessionStorage,
	},
});