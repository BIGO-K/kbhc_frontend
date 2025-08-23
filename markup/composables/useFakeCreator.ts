// XXX api 연결하면 파일 삭제
export const useFakeCreator = () => {
	const randomIs = () => Math.floor(Math.random() * 2) === 1 ? true : false;
	const randomNumber = (_max: number) => Math.floor(Math.random() * _max);
	const randomText = (_max: number) => new Array(2 + randomNumber(_max - 2)).fill(undefined).map(() => String.fromCharCode(45032 + randomNumber(10172))).join('');// 최소 2자
	const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

	return {
		/**
		 * 상품리스트 생성
		 * @param { number } _length - 생성할 개수
		 * @param { number: 1 } _thumnailSize - 썸네일 크기 1~3
		 * @returns { Goods[] }
		 */
		goods: (_length: number, _thumnailSize: number = 1): Goods[] => new Array(_length).fill(undefined).map((_value, _i) => ({
			id: _i,
			headline: randomIs() ? randomText(5) : null,
			name: randomText(25),
			thumbnail_url: `/image/_sample/prod_x${_thumnailSize}_${_i % (_thumnailSize === 3 ? 5 : 9)}.png`,
			price: randomNumber(1000000),
			base_discounted_price: randomNumber(1000000),
			badges: (() => {
				const fillLength = randomNumber(3);
				if (fillLength === 1) return [randomIs() ? '무료배송' : '쿠폰'];
				else return new Array(fillLength).fill(undefined).map((_v, _i) => _i == 0 ? '무료배송' : _i == 1 ? '쿠폰' : '최근배송지');
			})(),
			brand_id: randomNumber(1000),
			brand_name: randomText(10),
			icon: randomIs() ? {
				background_color_code: randomColor(),
				font_color_code: randomIs() ? '#fff' : '#000',
				label: randomText(4),
			} : null,
			sale_rate: randomNumber(90),
			stock: randomNumber(1000),
			is_only_adult: randomIs(),
			is_soldout: randomIs(),
			is_use_stock_notify: randomIs(),
			review_count: randomNumber(1300),
			review_score_average: randomNumber(6),
			wish_count: randomNumber(1300),
		})),
	};
};