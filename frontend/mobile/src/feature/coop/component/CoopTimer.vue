<template>
	<b>D<span>-</span>{{ timer.day }}<strong>{{ timer.hour }}<span>:</span>{{ timer.minute }}<span>:</span>{{ timer.second }}</strong></b>
</template>

<script setup lang='ts'>
	import { computed, ref } from 'vue';
	import { useIntervalFn } from '@vueuse/core';
	import monsDate from '$/utils/date';

	const props = defineProps<{
		target_at: string;
	}>();

	const targetDate = computed(() => props.target_at);
	// 타이머 interval
	const { pause } = useIntervalFn(() => {
		if (monsDate().isAfter(targetDate.value, 'minute')) {
			timerDuration.value = {
				day: 0,
				hour: 0,
				minute: 0,
				second: 0,
			};
			pause();

			return;
		}
		const duration = monsDate().duration(targetDate.value);
		timerDuration.value = {
			day: duration.days,
			hour: duration.hours,
			minute: duration.minutes,
			second: duration.seconds,
		};
	}, 1000);

	// 남은시간 단위별 숫자값
	const timerDuration = ref<{
		day: number;
		hour: number;
		minute: number;
		second: number;
	}>({
		day: 0,
		hour: 0,
		minute: 0,
		second: 0,
	});

	const timer = computed<{
		day: string;
		hour: string;
		minute: string;
		second: string;
	}>(() => {
		return {
			day: `${Math.abs(timerDuration.value.day)}`,
			hour: `${Math.abs(timerDuration.value.hour)}`.padStart(2, '0'),
			minute: `${Math.abs(timerDuration.value.minute)}`.padStart(2, '0'),
			second: `${Math.abs(timerDuration.value.second)}`.padStart(2, '0'),
		};
	});

	if (monsDate().isAfter(targetDate.value)) {
		timerDuration.value = {
			day: 0,
			hour: 0,
			minute: 0,
			second: 0,
		};
	}
	else {
		const duration = monsDate().duration(targetDate.value);
		timerDuration.value = {
			day: duration.days,
			hour: duration.hours,
			minute: duration.minutes,
			second: duration.seconds,
		};
	}
</script>