/**
 * 특정 문자열 전/후 문자열 추가
 * @param { string } origin
 * @param { string } search
 * @param { string } before - search 문자 이전에 추가
 * @param { string } after - search 문자 다음에 추가
 * @returns
 */
export const strwrap = (origin: string, search: string, before: string = '', after: string = ''): string => origin.split(search).join(before + search + after);

/**
 * 고유 식별자 생성
 * xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx 형태의 난수
 * @returns {xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx}
 */

export const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
	const r = Math.random() * 16 | 0;
	const v = c === 'x' ? r : (r & 0x3 | 0x8);

	return v.toString(16);
});