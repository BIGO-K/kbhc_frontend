import monsDate from '$/utils/date';
import { useBackend } from '$/composables/useBackend';

export const useGift = () => {

	/** 검색기간: 월 */
	const currentDate = monsDate();
	const monthTabs = [
		{ value: 1, label: '최근 1개월', from: currentDate.subtract(1, 'month').format('YYYY-MM-DD'), to: currentDate.format('YYYY-MM-DD') },
		{ value: 3, label: '최근 3개월', from: currentDate.subtract(3, 'month').format('YYYY-MM-DD'), to: currentDate.format('YYYY-MM-DD') },
		{ value: 6, label: '최근 6개월', from: currentDate.subtract(6, 'month').format('YYYY-MM-DD'), to: currentDate.format('YYYY-MM-DD') },
		{ value: 12, label: '최근 1년', from: currentDate.subtract(12, 'month').format('YYYY-MM-DD'), to: currentDate.format('YYYY-MM-DD') },
	];

	return {
		monthTabs,
		/**
		 * (비회원) 선물정보 조회
		 * @param giftCode 선물 코드
		 * @returns
		 */
		get: async (giftCode: string) => {
			const gift = await useBackend().command<Gift>('v1/orders/gift/detail', {
				params: {
					gift_code: giftCode,
				},
				isForce: true,
			});

			gift.gift_code = giftCode;

			return gift;
		},
		/**
		 * 선물함 리스트 조회
		 * @param monthValue 검색기간(월)
		 * @param is_receive 받은선물함 여부
		 * @param statusCode 상태코드
		 * @returns
		 */
		getList: async (monthValue: number, is_receive: boolean = true, statusCode?: Nullable<number>) => {
			const targetMonth = monthTabs.find(month => month.value === monthValue) || monthTabs[0];
			const { orders } = await useBackend().command<{
				orders: MyGift[];
			}>('v1/my/orders/normal-steps/gifts', {
				params: {
					status_code: !statusCode ? '' : statusCode,
					start_date: targetMonth.from,
					end_date: targetMonth.to,
					is_receive,
				},
				isForce: true,
			});

			return orders;
		},
		getStates: async () => {
			const { order_status_codes } = await useBackend().command<{
				order_status_codes: OrderState[];
			}>('v1/my/orders/normal-steps/gifts/status-codes');

			return order_status_codes;
		},
		add: async (code: string) => {
			await useBackend().command('/v1/my/to-my-gift', {
				method: 'post',
				data: {
					gift_code: code,
				},
			});
		},
		getDetail: async (orderId: string, isReceive: boolean = true) => {
			const gift = await useBackend().command<MyGiftDetail>(`v1/my/orders/${orderId}/sheet-for-gift`, {
				params: {
					is_receive: isReceive,
				},
				isForce: true,
			});

			if (!gift.order.shipping_address?.base_address) {
				gift.order.shipping_address = null;
			}

			return gift;
		},
		updatePersonalClearanceCode: async (orderId: string, code: string) => {
			await useBackend().command('v1/my/orders/normal-process/change-personal-clearance-code', {
				data: {
					order_id: orderId,
					personal_clearance_code: code,
				},
				method: 'post',
			});
		},
		accept: async (form: GiftAcceptForm) => {
			await useBackend().command('v1/orders/gift/change-receive-address', {
				method: 'post',
				data: form,
			});
		},
	};
};