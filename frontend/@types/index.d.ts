type HeadOf<T> = T extends unknown[] ? T[0] : never;

type TailOf<T> = T extends [unknown, ...infer U] ? U : [];

type IsEmpty<T extends unknown[]> = T extends [] ? true : false;

type Split<S extends string> = S extends `${infer T}.${infer U}` ? [T, ...Split<U>] : [S];

type ValueOf<Type, Paths extends unknown[]> =
	IsEmpty<TailOf<Paths>> extends true
		? Type[HeadOf<Paths>]
		: ValueOf<Type[HeadOf<Paths>], TailOf<Paths>>;

type Nullable<T> = T | null;

type Optional<T, RequiredKey extends keyof T> = Partial<T> & Pick<T, RequiredKey>;

type OptionalNullable<T, NullableKey extends keyof T> = {
	[P in keyof T]: P extends NullableKey ? Nullable<T[P]> : T[P]
};

type DiscountType = 'rate' | 'KRW';

type Discounter = {
	/** discount_type에 따라 rate, KRW 단위로 적용 */
	discount_amount: number;
	discount_type: DiscountType;
	/** discount_type과 상관없이 KRW 단위로 적용 */
	maximum_discount_amount: number;
};

type TypeCodeLabel = {
	code: number;
	label: string;
};

type TypeIdLabel = {
	id: number;
	label: string;
};

type TypeCodeName = {
	code: number;
	name: string;
};

type Paginator<T> = SimplePaginator<T> & {
	total: number;
};

/**
 * 심플 페이지네이터 객체
*/
type SimplePaginator<T> = {
	per_page: number;
	current_page: number;
	data: T[];
};

type HasWriter = {
	writer_grade_image_url: string;
	writer_grade_label: string;
	writer_masking_id: string;
};

type GenerateEnterContext = {
	enter_url: string;
	token: string;
};

/** 애니메이션 옵션 */
type AnimationTarget = gsap.TweenTarget;
type AnimationOption = gsap.TweenVars;

/** 지불 컨텍스트 설정 */
type PayingProcessContext = {
	processId: string;
	isPayStart: boolean;
	isPayEnd: boolean;
};