import { useRouteQuery } from '@vueuse/router';

export const useRouteQueryCast = () => {
	const queryToArray = (keyName: string, defaultValue: string[]): string[] => {
		const originQuery = useRouteQuery<string[] | string>(keyName, defaultValue);

		return originQuery.value === ''
			? defaultValue
			: Array.isArray(originQuery.value)
				? originQuery.value
				: [originQuery.value];
	};

	return {
		queryToArray,
		queryToBoolean: (keyName: string, defaultValue: boolean) => {
			return useRouteQuery(keyName, `${defaultValue}`).value === 'true';
		},
		queryToNumber: (keyName: string, defaultValue: number) => {
			return parseFloat(useRouteQuery<string>(keyName, `${defaultValue}`).value);
		},
		queryToNumberArray: (keyName: string, defaultValue: string[]) => {
			return queryToArray(keyName, defaultValue).map(query => parseFloat(query));
		},
		queryToString: (keyName: string, defaultValue: string) => {
			return useRouteQuery(keyName, defaultValue).value;
		},
	};
};