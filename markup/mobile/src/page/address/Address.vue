<template>
	<div class="mm_address-list">
		<a
			class="mm_btn T=primary btn_register"
			href="#"
			@click.prevent="overlayAddressCreate"
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
				<a>
					<div
						class="mm_address-item"
						:class="{ 'S=on': address.is_recent }"
					>
						<i class="ico_form-radio T=circle"></i>
						<dl>
							<dt>
								<b>{{ address.shipping_name }}</b>
								<b
									v-if=" address.is_recent"
									class="mm_tag"
								>최근 배송지</b>
							</dt>
							<dd>{{ address.name }} / {{ address.tel }}</dd>
							<dd>{{ address.zip_code }}<br>{{ address.base_address }}<br>{{ address.detail_address }}</dd>
						</dl>
					</div>
				</a>
				<button
					v-if="!address.is_recent"
					type="button"
					class="btn_remove"
				>
					<b>삭제</b>
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `배송지 관리`,
	});

	const { openOverlay } = useGlobalPageContext();

	const myAddresses: MyShippingAddressDetail[] = [
		{
			'id': 36,
			'shipping_name': '나의자취방',
			'name': '홍길동',
			'tel': '010-1234-1234',
			'zip_code': '06616 ',
			'base_address': '서울특별시 도봉구 창2동 647-12 창동 북한 산 현대홈시티3차',
			'detail_address': '302동 101호',
			'is_recent': true,
		},
		{
			'id': 5,
			'shipping_name': '나의자취방',
			'name': '홍길동',
			'tel': '010-1234-1234',
			'zip_code': '06616 ',
			'base_address': '서울특별시 도봉구 창2동 647-12 창동 북한 산 현대홈시티3차',
			'detail_address': '302동 101호',
			'is_recent': false,
		},
	];

	const addressList = ref<MyShippingAddressDetail[]>(myAddresses);

	function overlayAddressCreate() {
		const component = defineAsyncComponent(() => import('@/page/address/create/AddressCreate.vue'));

		return openOverlay(component);
	}
</script>