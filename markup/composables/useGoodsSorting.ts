export const useGoodsSorting = (): Record<'label' | 'value', string>[] => [
	{
		label: '판매순',
		value: 'selling',
	},
	{
		label: '신상품순',
		value: 'recent',
	},
	{
		label: '낮은 가격순',
		value: 'lowprice',
	},
	{
		label: '높은 가격순',
		value: 'highprice',
	},
	{
		label: '할인율 높은순',
		value: 'salerate',
	},
	{
		label: '리뷰 많은순',
		value: 'review_count',
	},
];