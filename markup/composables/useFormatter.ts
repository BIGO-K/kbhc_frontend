import monsDate from '$/utils/date';

export const useFormatter = () => {
	return {
		/** xxxxxx => xxx,xxx 처리 */
		number: (source?: Nullable<string | number>) => source == null ? '' : source.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
		/** 전화번호 처리 */
		phone: (source: string) => {
			return source.length === 11
				? source.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
				: source.startsWith('02') && source.length === 10
					? source.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3')
					: source;
		},
		/** \n 개행 문자 BR로 치환 */
		newLineToBr: (source: string) => source.replace(/\n/g, '<br>'), // XXX \r은?
		date: (source: Nullable<string>, format: string, isKo = true) => source == null ? '' : monsDate(source).format(format, isKo),
		url: (url?: string) => {
			return !url || url.startsWith('/') || url.startsWith('http')
				? url ?? ''
				: url.startsWith('www.')
					? `//${url}`
					: `/${url}`;
		},
		optionText: (optionName?: string) => {
			const optionNames = (optionName ?? '').split('/');

			return optionNames.filter(o => o.trim() !== '-').join('').trim();
		},
		/**
		 * 받침유무에 따라 달라지는 한국어 조사 적용하는 함수
		 * @param  { string } targetString
		 * @returns string
		 */
		korean: (targetString: string): string => {
			if (targetString.startsWith('(') || targetString.startsWith('undefined')) return '';

			const checkpoints = [
				'(은/는)',
				'(이/가)',
				'(을/를)',
				'(과/와)',
				'(아/야)',
				'(이여/여)',
				'(이랑/랑)',
				'(으로/로)',
				'(으로서/로서)',
				'(으로써/로써)',
				'(으로부터/로부터)',
			];

			return checkpoints.reduce((_result, _cp) => {
				const words = _cp.replace(/\(|\)/g, '').split('/');
				const regex = `${_cp}|(${words[1]}/${words[0]})`.replace(/(\(|\))/g, '\\$1');// 역순 포함

				return _result.replace(new RegExp(regex, 'g'), (_keyword, _index) => {
					const code = _result.charCodeAt(_index - 1) - 44032;

					return code >= 0 && code <= 11171
						? code % 28 === 0 ? words[1] : words[0]
						: _cp;
				});
			}, targetString);
		},
	};
};