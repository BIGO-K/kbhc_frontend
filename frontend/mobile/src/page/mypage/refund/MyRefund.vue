<template>
	<layout title="환불 계좌 관리">
		<div class="mm_inner m_myaccount">
			<p
				v-if="!refundAccount"
				class="mm_text-none"
			>
				<i class="ico_text-none"></i>등록된 환불 계좌가 없습니다
			</p>

			<template v-else>
				<h6 class="mm_text-label">
					<b>예금주명</b>
				</h6>
				<p class="text_readonly">
					<b>{{ refundAccount.owner_name }}</b>
				</p>
				<h6 class="mm_text-label">
					<b>은행명</b>
				</h6>
				<p class="text_readonly">
					<b>{{ refundAccount.bank_name }}</b>
				</p>
				<h6 class="mm_text-label">
					<b>계좌번호</b>
				</h6>
				<p class="text_readonly">
					<b>{{ refundAccount.account_number }}</b>
				</p>
			</template>

			<div class="mm_foot">
				<div class="mm_btn_box">
					<a
						v-if="!refundAccount"
						class="mm_btn T=primary"
						href="#"
						@click.prevent="_e => overlayMyRefundCreate(_e)"
					>
						<b>환불 계좌 등록하기</b>
					</a>

					<div
						v-else
						class="mm_flex T=equal"
					>
						<button
							type="button"
							class="mm_btn T=support"
							@click="removeRefundAccount"
						>
							<b>삭제하기</b>
						</button>
						<button
							type="button"
							class="mm_btn T=primary"
							@click="_e => overlayMyRefundUpdate(_e)"
						>
							<b>변경하기</b>
						</button>
					</div>
				</div>
			</div>
			<div class="mm_note">
				<ul>
					<li>환불 계좌를 등록하시면 추후 이용 시에도 별도의 입력없이 이용 하실 수 있습니다.</li>
				</ul>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyRefundAccount } from '$/composables/useMyRefundAccount';
	import Layout from '@/component/layout/Layout.vue';

	const { bom, loading, openOverlay } = useGlobalPageContext();
	const { get, remove, getBankCodes } = useMyRefundAccount();

	const refundAccount = ref(await get());
	const bankCodes = ref<BankCode[]>([]);

	const overlayMyRefundCreate = async (_e: MouseEvent) => {
		if (!bankCodes.value.length) bankCodes.value = await getBankCodes();

		openOverlay(defineAsyncComponent(() => import('@/page/mypage/refund/create/MyRefundCreate.vue')), {
			props: { bankCodes },
			clickElement: _e.currentTarget,
			onClose: async (_value: { refundAccount: RefundAccount }) => {
				if (!_value?.refundAccount) {
					return;
				}
				refundAccount.value = _value.refundAccount;
			},
		});
	};

	const overlayMyRefundUpdate = async (_e: MouseEvent) => {
		if (!bankCodes.value.length) bankCodes.value = await getBankCodes();

		openOverlay(defineAsyncComponent(() => import('@/page/mypage/refund/update/MyRefundUpdate.vue')), {
			props: {
				refundAccount,
				bankCodes,
			},
			clickElement: _e.currentTarget,
			onClose: async (_value: { refundAccount: RefundAccount }) => {
				if (!_value?.refundAccount) {
					return;
				}
				refundAccount.value = _value.refundAccount;
			},
		});
	};

	/** 환불계좌 삭제 */
	const removeRefundAccount = async () => {
		bom.confirm('환불계좌를 삭제하시겠습니까?', async (flag) => {
			if (!flag) {
				return;
			}

			loading.show();
			try {
				await remove();
				bom.alert('환불계좌가 삭제되었습니다.', () => {
					refundAccount.value = null;
				});
			}
			catch (e) {
				useErrorAlert(e);
			}
			finally {
				loading.hide();
			}
		});
	};
</script>