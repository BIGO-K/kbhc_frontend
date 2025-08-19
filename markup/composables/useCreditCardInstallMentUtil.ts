import { ref, computed, ComputedRef } from 'vue';
import { useBackend } from '$/composables/useBackend';


export const useCreditCardInstallMentUtil = (isInterestDisabled: ComputedRef<boolean>) => {
	/** 카드별 무이자 할부 정보 */
	const interests = ref<InterestCard[]>([]);
	const defaultUsableInstallMents = computed<UsableInstallMentInfo[]>(() => new Array(12).fill({}).map((_entry, _i) => ({
		value: _i == 0 ? _i : _i + 1,
		label: _i == 0 ? '일시불' : `${_i + 1}개월`,
		isInterestFree: false,
		isPartialInterestFree: false,
		disabled: _i == 0 ? false : isInterestDisabled.value,
	})));

	const getUtilCardInstallMents = async () => {
		const { interests: pInterests } = await useBackend().command<{
			interests: InterestCard[];
		}>('v1/orders/utilities/credit-card-installments');

		interests.value = pInterests;
	};

	getUtilCardInstallMents();

	return {
		interests,
		getUtilCardInstallMents,
		getUsableInstallMents: (creditCardCode?: number): UsableInstallMentInfo[] => {
			if (creditCardCode == 0 || !creditCardCode) return [
				{ value: 0, label: '일시불', isInterestFree: false, isPartialInterestFree: false, disabled: false },
			];

			const cardInterest = interests.value.find(interest => interest.card_code == creditCardCode);
			if (cardInterest == null) defaultUsableInstallMents.value;

			return defaultUsableInstallMents.value.map(base => {
				const interestFree = cardInterest?.interest_free_months.includes(base.value);
				const isPartialInterestFree = cardInterest?.partial_interest_free_months.includes(base.value);

				return {
					value: base.value,
					label: base.label + (interestFree || isPartialInterestFree ? (interestFree ? '(무이자)' : '(부분무이자)') : ''),
					isInterestFree: interestFree,
					isPartialInterestFree: isPartialInterestFree,
					disabled: base.disabled,
				} as UsableInstallMentInfo;
			});
		},
	};
};