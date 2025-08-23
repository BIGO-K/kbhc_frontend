import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useAuthStore } from '$/stores/useAuthStore';
import { unique } from '$/utils/array';
import { useBackend } from '$/composables/useBackend';

type GoodsId = WishManageableGoods['id'];

type WishedGoodsForm = {
	goods_id: number;
	folder_id: number;
};

export const useWishedStore = defineStore('wished-items', () => {
	const authStore = useAuthStore();
	/** 찜한 상품 */
	const wishedGoodsIds = ref<GoodsId[]>([]);

	const add = async (_id: GoodsId) => {
		wishedGoodsIds.value = unique(wishedGoodsIds.value.concat(_id));
	};

	return {
		wishedGoodsIds,
		/** 찜한 상품 추가 */
		add,
		/** 찜 폴더에 상품 추가 */
		addToFolder: async (form: WishedGoodsForm) => {
			if (authStore.member == null) return;

			await useBackend().command<void, WishedGoodsForm>('v1/my/wish/goods/wish', {
				method: 'post',
				data: {
					goods_id: form.goods_id,
					folder_id: form.folder_id,
				},
			});
			add(form.goods_id);
		},
		/** 찜 여부 확인 */
		isWishedGoods: (_id: GoodsId) => {
			return wishedGoodsIds.value.includes(_id);
		},
		/** 찜한 상품 제거 */
		remove: async (_ids: GoodsId[]) => {
			if (authStore.member == null) return;

			await useBackend().command('v1/my/wish/goods/unwish-many', {
				method: 'post',
				data: {
					goods_ids: _ids,
				},
			});

			wishedGoodsIds.value = wishedGoodsIds.value.filter(_id => !_ids.includes(_id));
		},
		/** 찜 여부 조회하여 store에 저장 */
		check: async (_ids: number[]) => {
			if (authStore.member == null || _ids.length < 1) return;

			const { liked_relation_goods } = await useBackend().command<{
				liked_relation_goods: {
					goods_id: number;
					liked: boolean;
				}[];
			}>('v1/my/wish/goods/check-many', {
				method: 'post',
				data: {
					goods_ids: _ids,
				},
			});

			const newLikedGoodsIds = liked_relation_goods
				.filter(relation => relation.liked)
				.map(relation => relation.goods_id);

			wishedGoodsIds.value = unique(wishedGoodsIds.value.concat(newLikedGoodsIds));
		},
	};
}, {
	persist: false,
});