/** 최근 본 기획전  */
type RecentViewPlanningEvent = {
	id: number;
	title: string;
	is_ended: boolean;
};

/** 진행 상태 */
type ProcessLabel = 'all' | 'progress' | 'end';

/** 이벤트 */
type SpecialEvent = {
	id: number;
	title: string;
	description: string;
	image_url: string;
	alt: string;
	start_at: string;
	end_at: string;
	is_use_detail_url: string;
	detail_url: Nullable<string>;
};

/** 이벤트 상세 */
type SpecialEventDetail = Omit<SpecialEvent, 'is_use_detail_url' | 'detail_url'> & {
	/**
	 * 컨텐츠 유형
	 * html: 에디터로 등록
	 * image: 이미지로 등록
	 */
	contents_type: 'html' | 'image';
	/** 컨텐츠 HTML */
	contents_html: Nullable<string>;
	/** 컨텐츠 이미지 URL */
	contents_image_url: Nullable<string>;
	/** 컨텐츠 이미지 대체텍스트 */
	contents_image_alt: Nullable<string>;
	/** 댓글작성가능여부 */
	is_commentable: boolean;
	/** 상품그룹 */
	goods_groups: {
		id: number;
		title: string;
		goods_list: Goods[];
	}[];
} & ({
	contents_type: 'html';
	contents_html: string;
} | {
	contents_type: 'image';
	contents_image_url: string;
	contents_image_alt: string;
});

type SpecialEventComment = PlanningComment;

type SpecialEventCommentForm = PlanningCommentForm;


/** 기획전 */
type PlanningEvent = {
	id: number;
	title: string;
	is_use_comment: boolean;
	/** 상세컨텐츠 */
	sections: {
		id: number;
		title: string;
		mobile_html: string;
		pc_html: string;
		goods_list: Goods[];
	}[];
	/** 상품 그룹 */
	groups: PlanningEventGroup[];
};

type PlanningEventGroup = {
	id: number;
	title: string;
	goods_list: Goods[];
	has_mobile_image: boolean;
	has_pc_image: boolean;
	mobile_alt: string;
	mobile_image_url: string;
	mobile_link: string;
	pc_alt: string;
	pc_image_url: string;
	pc_link: string;
};

/**
 * 기획전 댓글
 */
type PlanningComment = {
	id: number;
	contents: string;
	is_editable: boolean;
	is_private: boolean;
	created_at: string;
	writer_masking_login_id: string;
	writer_grade_level: number;
	writer_grade_image_url: string;
};

type PlanningCommentForm = Pick<PlanningComment, 'contents' | 'is_private'>;