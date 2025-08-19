/**
 * 할인 정보 계산
 * @param { number } price : 계산전 가격
 * @param { Discounter } discounter : 할인 계산 정보
 * @param { number } priceUnit : 상품 가격 단위 ex) 10, 100
 * @returns { number } 할인할 가격
 */
export const calculateDiscountAmount = (price: number, discounter: Discounter, priceUnit: number = 10): number => {
	const discountAmount = discounter.discount_type === 'KRW'
		? discounter.discount_amount
		: Math.floor((price * discounter.discount_amount / 100) / priceUnit) * priceUnit;

	return discounter.maximum_discount_amount !== 0
		? Math.min(discounter.maximum_discount_amount, discountAmount)
		: discountAmount;
};