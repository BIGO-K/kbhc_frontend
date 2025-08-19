import { useBomStore } from '$/stores/useBomStore';
import { uuid } from '$/utils/string';

/**
 * 프로젝트내, 공용 함수
 * @returns
 */
const mons = () => {
	const bomStore = useBomStore();

	return {
		bom: {
			alert: (message: string, callback?: () => void, options?: BaseBomOptions) => bomStore.addBomContext({
				message: message,
				callback: callback ? callback : () => {},
				type: 'alert',
				uuid: uuid(),
				options: {
					okLabel: options?.okLabel || '확인',
					title: options?.title || '알림',
					cancelLabel: '',
					hideIcon: options?.hideIcon || false,
				},
			}),
			confirm: (message: string, callback?: (select: boolean) => void, options?: BaseBomOptions) => bomStore.addBomContext({
				message: message,
				callback: callback ? callback : () => {},
				type: 'confirm',
				uuid: uuid(),
				options: {
					okLabel: options?.okLabel || '확인',
					cancelLabel: options?.cancelLabel || '취소',
					title: options?.title || '확인',
					hideIcon: options?.hideIcon || false,
				},
			}),
			prompt: (message: string, formCallback?: (select: boolean, values: Record<string, string>) => void, options?: PromptOptions) => bomStore.addBomContext({
				message: message,
				callback: () => {},
				formCallback: formCallback ? formCallback : () => {},
				type: 'prompt',
				uuid: uuid(),
				options: {
					okLabel: options?.okLabel || '확인',
					cancelLabel: options?.cancelLabel || '취소',
					title: options?.title || '확인',
					forms: options?.forms,
					hideIcon: options?.hideIcon || false,
				},
			}),
		},
		loading: {
			show: bomStore.showLoading,
			hide: bomStore.hideLoading,
		},
	};
};

export default mons;