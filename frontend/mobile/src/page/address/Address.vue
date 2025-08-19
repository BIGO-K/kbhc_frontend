<template>
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

		<!-- (D) 최근배송지인 'mm_address-item' 에 'S=on' 클래스를 추가합니다. -->
		<ul v-else>
			<li
				v-for="address in addressList"
				:key="address.id"
			>
				<a @click="closer({ newAddress: address })">
					<div class="mm_address-item">
						<i class="ico_form-radio T=check"></i>
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
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyAddress } from '$/composables/useMyAddress';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `배송지 관리`,
	});

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