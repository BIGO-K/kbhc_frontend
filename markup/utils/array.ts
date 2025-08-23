/**
 * 배열 N개씩 묶음
 * @param targets
 * @param size
 * @returns
 */
export const chunk = <T>(targets: T[], size = 1): T[][] => {
	if (size >= targets.length) return [targets];

	const result = [];
	for (let i = 0; i < targets.length; i += size) {
		const chunk = targets.slice(i, i + size);
		result.push(chunk);
	}

	return result;
};

/**
 * 배열 중복 제거
 * @param targets
 */
export const unique = <T>(targets: T[]): T[] => [...new Set(targets)];

/**
 * 배열 undefined, null 제거 리턴 함수
 * array.map Type 레퍼런스 도움용
 */
export const defined = <T>(param?: Nullable<T>): param is T => param != null;