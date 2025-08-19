import { ref } from 'vue';
import { useExpireStore } from '$/stores/useExpireStore';
import monsDate from '$/utils/date';
import { useBackend } from '$/composables/useBackend';

const categoryStoreKey = 'all-categories';

export function useCategories() {

	const categories = ref<Category[]>([]);
	const { get, set } = useExpireStore();


	const getAll = async () => {
		if (get(categoryStoreKey)) {
			categories.value = get(categoryStoreKey);

			return;
		}

		const { category_list } = await useBackend().command<{ category_list: Category[] }>('/v1/goods-categories');
		categories.value = category_list;
		set(categoryStoreKey, categories.value, {
			expired_at: monsDate().add(3, 'minute').toDate(),
		});
	};



	return {
		categories,
		getAll,
	};
}