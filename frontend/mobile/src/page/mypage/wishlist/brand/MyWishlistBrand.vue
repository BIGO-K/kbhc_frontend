<template>
	<template v-if="brands.length < 1">
		<p class="mm_text-none">
			<i class="ico_text-none"></i>찜한 브랜드가 없습니다
		</p>
	</template>
	<template v-else>
		<div class="m_mylike-brand">
			<ul>
				<li
					v-for="brand in brands"
					:key="brand.id"
				>
					<mm-link :to="{ name: 'BrandShop', params: { id: brand.id } }">
						<figure>
							<lazyload
								class="mm_bg-contain image_brand"
								:src="brand.logo_image_url"
								:title="brand.name"
								:is-ratio="true"
								:is-error-image="false"
							></lazyload>
							<figcaption>{{ brand.name }}</figcaption>
						</figure>
					</mm-link>
					<button
						type="button"
						class="btn_remove"
						@click="removeBrand(brand.id)"
					>
						<i class="ico_remove T=sm"></i><b class="mm_ir-blind">삭제</b>
					</button>
				</li>
			</ul>
		</div>
	</template>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useWishedBrand } from '$/composables/useWishedBrand';
	import Lazyload from '@/component/Lazyload.vue';

	const { bom, loading } = useGlobalPageContext();
	const wished = useWishedBrand();

	const brands = ref(await wished.all());
	const removeBrand = async (_id: number) => {
		bom.confirm('찜한 브랜드를 삭제하시겠습니까?', async (_is) => {
			if (!_is) return;

			loading.show();
			try {
				await wished.remove(_id);
				bom.alert('브랜드가 삭제되었습니다.', async () => {
					brands.value = await wished.all();
				});
			}
			catch (_e) {
				useErrorAlert(_e);
			}
			finally {
				loading.hide();
			}
		});
	};
</script>