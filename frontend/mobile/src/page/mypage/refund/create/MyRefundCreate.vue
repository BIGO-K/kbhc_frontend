<template>
	<div class="mm_inner m_myaccount">
		<my-refund-input
			v-model:owner-name="form.owner_name"
			v-model:bank-code="form.bank_code"
			v-model:account-number="form.account_number"
			:bank-codes="bankCodes"
		></my-refund-input>
		<div class="mm_foot">
			<div class="mm_btn_box">
				<button
					type="button"
					class="mm_btn T=primary"
					:disabled="!editable"
					@click="store"
				>
					<b>등록하기</b>
				</button>
			</div>
		</div>
		<div class="mm_note">
			<ul>
				<li>환불 계좌를 등록하시면 추후 이용 시에도 별도의 입력없이 이용 하실 수 있습니다.</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useForm } from '$/composables/useForm';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyRefundAccount } from '$/composables/useMyRefundAccount';
	import MyRefundInput from '@/page/mypage/refund/component/MyRefundInput.vue';

	const props = withDefaults(defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		bankCodes: BankCode[];
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>(), {
		bankCodes: () => [],
	});

	defineExpose<OverlayComponentExpose>({
		title: `환불 계좌 등록`,
	});

	const { bom, loading } = useGlobalPageContext();
	const { addOrUpdate } = useMyRefundAccount();
	const { form, validate } = useForm<RefundAccountForm>(
		{
			owner_name: '',
			bank_code: null,
			account_number: '',
		},
		{
			rule: {
				'owner_name(예금주명)': ['required', 'maxLength:50'],
				'bank_code(입금 은행)': ['required'],
				'account_number(계좌번호)': ['required', 'maxLength:20'],
			},
		}
	);

	const editable = computed<boolean>(() => !!(form.value.owner_name && form.value.bank_code && form.value.account_number));

	/** 환불계좌 수정 */
	async function store() {
		try {
			loading.show();
			await validate();
			await addOrUpdate(form.value);
			const bankName = props.bankCodes.find(bank => bank.code == form.value.bank_code)?.label;
			bom.alert('환불계좌가 등록되었습니다.', () => {
				props.closer({
					refundAccount: {
						...form.value,
						bank_name: bankName || '',
					},
				});
			});
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}
</script>