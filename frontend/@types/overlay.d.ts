type OverlayComponentExpose = {
	title?: string;
	/** @prop { boolean } `default: false` - 전체 확장 */
	isFull?: boolean;
	/** @prop { boolean } `default: false` - 헤더 숨김 */
	isHideHeader?: boolean;
};

type OverlayCloseHandler<OverlayCloseContext> = (context: OverlayCloseContext) => void | Promise<void>;