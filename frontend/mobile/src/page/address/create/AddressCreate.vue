<template>
	<div class="mm_inner m_address">
		<h6 class="mm_text-label">
			<b>배송지명</b>
		</h6>
		<form-text
			v-model="form.shipping_name"
			maxlength="5"
			placeholder="배송지명을 입력하세요(필수입력)"
		></form-text>
		<h6 class="mm_text-label">
			<b>받는 사람</b>
		</h6>
		<form-text
			v-model="form.name"
			maxlength="10"
			placeholder="받는 사람을 입력하세요(필수입력)"
		></form-text>
		<h6 class="mm_text-label">
			<b>휴대폰 번호</b>
		</h6>
		<form-text
			v-model="form.tel"
			type="tel"
			maxlength="11"
			input-mode="number"
			placeholder="휴대폰 번호를 입력하세요(필수·숫자만입력)"
		></form-text>
		<div class="mm_form_mix-address">
			<h6 class="mm_text-label">
				<b>주소</b>
			</h6>
			<div class="mm_form_mix-linked">
				<form-text
					v-model="form.zip_code"
					readonly
					placeholder="우편번호"
					label-on-blind
				></form-text>
				<button
					type="button"
					class="mm_btn T=lg T=support"
					@click="_e => overlayAddressPostcode(_e)"
				>
					<b>우편번호 찾기</b>
				</button>
			</div>
			<form-text
				v-model="form.base_address"
				readonly
				label-on-blind
				placeholder="검색주소"
			></form-text>
			<form-text
				v-model="form.detail_address"
				placeholder="상세 주소를 입력하세요(필수입력)"
			></form-text>
		</div>

		<!-- 하단 버튼 -->
		<div class="mm_foot">
			<div class="mm_btn_box">
				<button
					type="button"
					class="mm_btn T=primary"
					:disabled="!registrable"
					@click="store"
				>
					<b>등록하기</b>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, computed } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useForm } from '$/composables/useForm';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyAddress } from '$/composables/useMyAddress';
	import FormText from '@/component/form/FormText.vue';

	const props = defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `신규 배송지 등록`,
	});

	const { bom, loading, openOverlay } = useGlobalPageContext();
	const { add } = useMyAddress();
	const { form, validate } = useForm<AddMyAddressForm>({
		shipping_name: '',
		name: '',
		tel: '',
		zip_code: '',
		base_address: '',
		detail_address: '',
	}, {
		rule: {
			'shipping_name(배송지명)': ['required'],
			'name(받는사람)': ['required'],
			'tel(휴대폰 번호)': ['required', 'validPhoneNumber'],
			'zip_code(우편번호)': ['required'],
			'base_address(기본 주소)': ['required'],
			'detail_address(상세 주소)': ['required'],
		},
	});

	const registrable = computed(() => {
		return form.value.shipping_name
			&& form.value.name
			&& form.value.tel
			&& form.value.zip_code
			&& form.value.base_address
			&& form.value.detail_address;
	});


	async function store() {
		loading.show();
		try {
			await validate();
			await add({
				name: form.value.name,
				shipping_name: form.value.shipping_name,
				tel: form.value.tel,
				zip_code: form.value.zip_code,
				base_address: form.value.base_address,
				detail_address: form.value.detail_address,
			});

			bom.alert('배송지가 등록 되었습니다.', props.closer);
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}

	const overlayAddressPostcode = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/address/postcode/AddressPostcode.vue')), {
			clickElement: _e.currentTarget,
			onClose: (address: SearchAddress) => {
				form.value.zip_code = address.zip_code;
				form.value.base_address = address.road_address;
			},
		});
	};
</script>