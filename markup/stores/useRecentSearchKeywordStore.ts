import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { uuid } from '$/utils/string';

type RecentSearchKeyword = {
	uuid: string;
	keyword: string;
	recentViewedAt: Date | string;
};

export const useRecentSearchKeywordStore = defineStore('recent-search-keyword', () => {
	const records = ref<RecentSearchKeyword[]>([]);
	const recordsByRecent = computed<RecentSearchKeyword[]>(() => {
		const sorted = [...records.value];

		return sorted.sort((a, b) => new Date(b.recentViewedAt).getTime() - new Date(a.recentViewedAt).getTime());
	});

	return {
		records,
		recordsByRecent,
		/**
		 * 최근 검색어 추가
		 * @param keyword
		 */
		add: async (keyword: string) => {
			// 추가 처리
			records.value = records.value
				.filter(record => record.keyword !== keyword)
				.concat([
					{ keyword, recentViewedAt: new Date(), uuid: uuid() },
				]);
		},
		remove: async (keyword: string) => {
			records.value = records.value.filter(record => record.keyword !== keyword);
		},
	};

}, {
	persist: {
		storage: sessionStorage,
	},
});