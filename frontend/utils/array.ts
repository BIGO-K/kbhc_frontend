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

/**
 * 배열 그룹핑 처리
 * @param targets
 * @param key
 * @returns
 */
export const groupBy = <T>(targets: T[], key: keyof T | ((item: T) => string)) => {
	return targets.reduce<Record<string, T[]>>((accumulation, current) => {
		const groupKey = typeof key == 'function' ? key(current) : `${current[key]}`;
		const group = accumulation[groupKey] || [];
		group.push(current);

		return { ...accumulation, [groupKey]: group };
	}, {});
};

/**
 * 배열 내 특정 프로퍼티명 모두 찾아 배열로 리턴
 * @param target
 * @param path
 * @returns
 * @example findNestedArray(goodsGroup, 'goods_list.id');
 */
export const findNestedArray = <T extends object>(target: T | (T[]), path: string | string[]): unknown[] => {
	const paths = typeof path === 'string' ? path.split('.') : path;
	const targetKey = paths.shift() || '';
	let result: unknown[] = [];

	Object.keys(target).forEach((currentKey) => {
		const currentTarget = target[currentKey as keyof typeof target];
		if (currentKey == targetKey) {
			result = result.concat([currentTarget]);
		}
		else if (typeof target == 'object' && typeof currentTarget == 'object' && currentTarget !== null) {
			result = result.concat(findNestedArray(currentTarget, targetKey));
		}
	});

	return paths.length ? findNestedArray(result, paths) : result;
};