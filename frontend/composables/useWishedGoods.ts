import { ref } from 'vue';
import { useAuthStore } from '$/stores/useAuthStore';
import { useBackend } from '$/composables/useBackend';
import { useErrorAlert } from '$/composables/useErrorAlert';
import { useForm } from '$/composables/useForm';
import { useGlobalPageContext } from '$/composables/useGlobalPageContext';

export const useWishedGoods = async () => {
	const authStore = useAuthStore();
	const { bom, loading } = useGlobalPageContext();
	const { form, validate } = useForm<{
		name: string;
	}>({ name: '' }, { rule: { 'name(폴더명)': ['required', 'maxLength: 10'] } });

	/** 찜한 상품 폴더 리스트 조회 */
	const getFolders = async () => {
		if (authStore.member === null) return [];

		const { wish_goods_folders } = await useBackend().command<{
			wish_goods_folders: GoodsWishFolder[];
		}>('v1/my/wish/goods/folders', {
			isForce: true,
		});

		return wish_goods_folders;
	};

	const folders = ref<GoodsWishFolder[]>(await getFolders());

	return {
		folders,
		/** 찜한상품 페이지네이터 조회 */
		getPaginator: async (folderId: number, page: number = 1, pageSize: number = 50) => {
			if (authStore.member === null) return {
				per_page: pageSize,
				current_page: page,
				data: [],
				total: 0,
			};

			const { paginator } = await useBackend().command<{
				paginator: Paginator<WishedGoods>;
			}>('v1/my/wish/goods', {
				params: {
					page,
					page_size: pageSize,
					folder_id: folderId || '',
				},
			});

			return paginator;
		},
		/** 찜한상품 리스트 조회 */
		getAll: async (folderId: number) => {
			if (authStore.member === null) return [];

			const { wish_goods } = await useBackend().command<{
				wish_goods: WishedGoods[];
			}>(`v1/my/wish/goods/folders/${folderId}`, {
				isForce: true,
			});

			return wish_goods;
		},
		/** 찜한 상품 폴더 리스트 조회 */
		getFolders,
		/** 찜한 상품 폴더 추가 */
		createFolder: () => {
			return new Promise((_resolve, _reject) => {
				bom.prompt('추가할 폴더 이름을 입력하세요.', async (_is: boolean, _values: Record<string, string>) => {
					if (!_is) return;

					form.value.name = _values.folder_name;
					loading.show();
					try {
						await validate();
						if (authStore.member == null) return;

						await useBackend().command('v1/my/wish/goods/folders', {
							method: 'post',
							data: { name: form.value.name },
						});

						form.value.name = '';
						folders.value = await getFolders();

						bom.alert('폴더가 추가되었습니다.', () => {
							_resolve('fulfilled');
						});
					}
					catch (_e) {
						useErrorAlert(_e);

						_reject('rejected');
					}
					finally {
						loading.hide();
					}
				},
				{
					title: '새 폴더 추가하기',
					forms: [
						{ type: 'text', name: 'folder_name', maxLength: 10, placeholder: '최대 10자 입력', value: '' },
					],
				});
			});
		},
		/** 찜한 상품 폴더명 수정 */
		updateFolder: (_folder: GoodsWishFolder) => {
			bom.prompt('변경할 폴더 이름을 입력하세요', async (_is: boolean, _values: Record<string, string>) => {
				if (!_is) return;

				form.value.name = _values.folder_name;
				loading.show();
				try {
					await validate();
					if (authStore.member == null) return;

					await useBackend().command(`v1/my/wish/goods/folders/${_folder.id}`, {
						method: 'post',
						data: { name: form.value.name },
					});

					form.value.name = '';
					folders.value = await getFolders();
					bom.alert(`폴더 이름이 변경되었습니다.`);
				}
				catch (_e) {
					useErrorAlert(_e);
				}
				finally {
					loading.hide();
				}
			},
			{
				title: '폴더 이름 변경하기',
				forms: [
					{ type: 'text', name: 'folder_name', maxLength: 10, placeholder: '최대 10자 입력', value: _folder.name },
				],
			});
		},
		/** 찜한 상품 폴더 삭제 */
		removeFolder: (_folder: GoodsWishFolder) => {
			bom.confirm(`${_folder.name} 폴더를 삭제하시겠습니까?<br>삭제된 폴더는 복구할 수 없습니다.`, async (_is) => {
				if (!_is) return;

				loading.show();
				try {
					if (authStore.member == null) return;
					await useBackend().command(`v1/my/wish/goods/folders/${_folder.id}/destroy`, {
						method: 'post',
					});

					folders.value = await getFolders();
					bom.alert('폴더가 삭제되었습니다.');
				}
				catch (_e) {
					useErrorAlert(_e);
				}
				finally {
					loading.hide();
				}
			});
		},
		/** 찜한 상품 폴더 순서 변경 */
		updateFolderSort: async (sorts: Pick<GoodsWishFolder, 'id' | 'order_seq'>[]) => {
			if (authStore.member === null) return;

			await useBackend().command('v1/my/wish/goods/folders/sort', {
				method: 'post',
				data: { sorts },
			});
		},
		/** 찜한 상품 폴더 이동 */
		moveToFolder: (_goodsIds: number[], _folder: GoodsWishFolder) => {
			return new Promise((_resolve, _reject) => {
				bom.confirm(`선택한 ${_goodsIds.length}개의 상품을<br>${_folder.name} 폴더로 이동하시겠습니까?`, async (_is) => {
					if (!_is) return;

					loading.show();
					try {
						if (authStore.member === null) return;
						await useBackend().command('v1/my/wish/goods/move-many', {
							method: 'post',
							data: {
								goods_ids: _goodsIds,
								folder_id: _folder.id,
							},
						});

						_resolve('fulfilled');
					}
					catch (_e) {
						useErrorAlert(_e);

						_reject('rejected');
					}
					finally {
						loading.hide();
					}
				});
			});
		},
	};
};