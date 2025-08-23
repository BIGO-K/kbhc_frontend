import { ref } from 'vue';

type TimeStampList = Record<string, number[]>;

export const useTimestamp = () => {
	const stamper = ref<TimeStampList>({});

	return {
		stamper,
		stampOn: (key: string): number => {
			const stamps: number[] | undefined = stamper.value[key];
			let _timeGap = 0;

			if (stamps == null) stamper.value[key] = [window.performance.now()];
			else {
				stamps.push(window.performance.now());
				_timeGap = stamps[stamps.length - 1] - stamps[stamps.length - 2];
			}

			return _timeGap;
		},
		stampOff: (__key: string): number => {
			const stamps: number[] | undefined = stamper.value[__key];
			if (stamps == null) return 0;

			const _timeGap = window.performance.now() - stamps[stamps.length - 1];
			delete stamper.value[__key];

			return _timeGap;
		},
	};
};