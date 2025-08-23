/** [공구상품] 정보 */
type CoopDeal = Pick<Goods,
'id' |
'headline' |
'brand_name' |
'name' |
'thumbnail_url' |
'price' |
'base_discounted_price' |
'sale_rate' |
'badges' |
'is_only_adult'
> & {
	sell_start_at: string;
	sell_end_at: string;
};

type CoopDealStatus = 'upcoming' | 'ongoing' | 'end';