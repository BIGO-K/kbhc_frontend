/* XXX 사용 확인
type OverlayOpenOption<Props, OverlayCloseContext> = {
	props?: Props | (() => Promise<Props>);
	onClose?: OverlayCloseHandler<OverlayCloseContext>;
};

type OverlayLayer<Component, OverlayCloseContext> = {
	uuid: string;
	component: ShallowRef<Component>;
	props: object;
	uniqueCode?: string;
	isActive: boolean;
	onClose?: OverlayCloseHandler<OverlayCloseContext>;
};
*/

type OverlayComponentExpose = {
	title?: string;
	/** @prop { boolean } `default: false` - 전체 확장 */
	isFull?: boolean;
	/** @prop { boolean } `default: false` - 헤더 숨김 */
	isHideHeader?: boolean;
};

type OverlayCloseHandler<OverlayCloseContext> = (context: OverlayCloseContext) => void | Promise<void>;