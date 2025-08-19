<template>
	<layout title="배송지 관리">
		<div class="mm_address-list">
			<a
				class="mm_btn T=primary btn_register"
				href="#"
				@click.prevent="_e => overlayAddressCreate(_e)"
			>
				<b>신규 배송지 등록하기</b>
			</a>

			<p
				v-if="addressList.length < 1"
				class="mm_text-none"
			>
				<i class="ico_text-none"></i>등록된 배송지가 없습니다
			</p>

			<ul v-else>
				<li
					v-for="address in addressList"
					:key="address.id"
				>
					<a>
						<div class="mm_address-item">
							<dl>
								<dt>
									<b>{{ address.shipping_name }}</b>
									<b
										v-if=" address.is_recent"
										class="mm_tag"
									>최근 배송지</b>
								</dt>
								<dd>{{ `${address.name} / ${phone(address.tel)}` }}</dd>
								<dd>{{ address.zip_code }}<br>{{ address.base_address }}<br>{{ address.detail_address }}</dd>
							</dl>
						</div>
					</a>
					<button
						v-if="!address.is_recent"
						type="button"
						class="btn_remove"
						@click="removeAddress(address.id)"
					>
						<b>삭제</b>
					</button>
				</li>
			</ul>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyAddress } from '$/composables/useMyAddress';
	import Layout from '@/component/layout/Layout.vue';

	const { phone } = useFormatter();
	const { bom, loading, openOverlay } = useGlobalPageContext();
	const { all, remove } = useMyAddress();

	const addressList = ref<MyShippingAddressDetail[]>([]);
	await fetch();

	async function fetch() {
		try {
			addressList.value = await all();
		}
		catch (e) {
			useErrorAlert(e);
		}
	}

	function removeAddress(id: number) {
		bom.confirm('배송지를 삭제하시겠습니까?', async (flag) => {
			if (!flag) {
				return;
			}
			loading.show();
			try {
				await remove(id);
				await fetch();
			}
			catch (e) {
				useErrorAlert(e);
			}
			finally {
				loading.hide();
			}
		});
	}

	const overlayAddressCreate = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/address/create/AddressCreate.vue')), {
			clickElement: _e.currentTarget,
			onClose: () => {
				fetch();
			},
		});
	};
</script>