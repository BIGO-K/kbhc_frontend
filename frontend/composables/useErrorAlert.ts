import { AxiosError } from 'axios';
import { useGlobalPageContext } from '$/composables/useGlobalPageContext';

type HttpCatcher = Record<number, string>;

/** 에러 알럿 처리 */
export const useErrorAlert = (
	error: unknown,
	options?: {
		httpCatcher?: HttpCatcher;
		alertCallback?: () => void;
		defaultMessage?: string;
	}
) => {
	let message = '';
	if (error instanceof AxiosError) {
		message = options?.httpCatcher && error.response
			? (options.httpCatcher[error.response.status] ?? error.response?.data.message)
			: error.response?.data.message ?? '';
	}
	else {
		message = error instanceof Error
			? error.message
			: typeof error === 'string'
				? error
				: options?.defaultMessage ?? '';
	}

	const { bom } = useGlobalPageContext();
	bom.alert(message, typeof options?.alertCallback === 'function' ? options?.alertCallback : () => {});
};