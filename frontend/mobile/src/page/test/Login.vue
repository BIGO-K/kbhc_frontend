<template>
	<layout
		:title="'임시 로그인'"
	>
		<div style="margin-top: 50%">
			<h6 class="mm_text-label">
				<b>회원 선택</b>
			</h6>
			<div class="mm_radio-list">
				<form-radio
					v-model="token"
					name="radio-delivery-info"
					value="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJKV1QgVE9LRU4iLCJhdWQiOiJLQkhDLUNsaWVudCIsIm1lbWJlckluZm8iOnsibWJyRW1hZCI6InRlc3RAdGVzdC5jby5rciIsIm1ick5tIjoi7ZmN6ri464-ZIiwibWJySm5UeXBlQ2QiOiIxMDUwMDEiLCJtYnJHcmRDZCI6IjEwNzAwMSIsIm1iclNuIjoxMDAwMDAwMDAxLCJtYnJOY2tubSI6Iu2ZjeuwmOyepSIsIm1ickpuTXRoVHlwQ2QiOiIxMDYwMDEiLCJtYmxVdWlkIjoiMGQzZWNjYjZkODM5In0sImlzcyI6IktCSEMtT0F1dGgiLCJleHAiOjI1NjM5MjI2MjEsImF1dGhUeXBlIjoiVVNFUiIsInRva2VuVHlwZSI6IkFDQ0VTUyIsImlhdCI6MTcwMDAwOTAyMX0.Y6AtZQKiA6hCe1OWxXcNPn6Xu5m1afkuiklnPbzFH-Tta30DxJ0zZ8vNfkeE91v7"
				>
					<b class="mm_block">
						<i class="ico_form-radio"></i>
						<span class="text_label">등급 welcome</span>
					</b>
				</form-radio>

				<form-radio
					v-model="token"
					name="radio-delivery-info"
					value="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJKV1QgVE9LRU4iLCJhdWQiOiJLQkhDLUNsaWVudCIsIm1lbWJlckluZm8iOnsibWJyRW1hZCI6InRlc3RAdGVzdC5jby5rciIsIm1ick5tIjoi7ZmN6ri47IicIiwibWJySm5UeXBlQ2QiOiIxMDUwMDEiLCJtYnJHcmRDZCI6IjEwNzAwMSIsIm1iclNuIjoxMDAwMDAwMDAyLCJtYnJOY2tubSI6Iu2Zjeq4uOyInDEiLCJtYnJKbk10aFR5cENkIjoiMTA2MDAxIiwibWJsVXVpZCI6IlVVSUQ0MzIxIn0sImlzcyI6IktCSEMtT0F1dGgiLCJleHAiOjI1NjM5MjI2ODEsImF1dGhUeXBlIjoiVVNFUiIsInRva2VuVHlwZSI6IkFDQ0VTUyIsImlhdCI6MTcwMDAwOTA4MX0._5zigGpTpQtqxaKhwFS6MXgXIpsL0P_L_JMQntfO5orjQf54T_1TPAPUstiK28WX"
				>
					<b class="mm_block">
						<i class="ico_form-radio"></i>
						<span class="text_label">등급 FAMILY</span>
					</b>
				</form-radio>


				<form-radio
					v-model="token"
					name="radio-delivery-info"
					value="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJKV1QgVE9LRU4iLCJhdWQiOiJLQkhDLUNsaWVudCIsIm1lbWJlckluZm8iOnsibWJyRW1hZCI6InRlc3RAdGVzdC5jby5rciIsIm1ick5tIjoi6rmA67SJ6riwIiwibWJySm5UeXBlQ2QiOiIxMDUwMDEiLCJtYnJHcmRDZCI6IjEwNzAwMSIsIm1iclNuIjoxMDAwMDAwMDAzLCJtYnJOY2tubSI6Iuq5gOu0iSIsIm1ickpuTXRoVHlwQ2QiOiIxMDYwMDEiLCJtYmxVdWlkIjoiVVVJRDU2NzgifSwiaXNzIjoiS0JIQy1PQXV0aCIsImV4cCI6MjU2MzkyMjcyOSwiYXV0aFR5cGUiOiJVU0VSIiwidG9rZW5UeXBlIjoiQUNDRVNTIiwiaWF0IjoxNzAwMDA5MTI5fQ.iFiC3Y3WyRWZ1T45quo_Vc8bJz17XlR2uB3lGEImDiqh8p6g1m1FNMEuA7EvsGKf"
				>
					<b class="mm_block">
						<i class="ico_form-radio"></i>
						<span class="text_label">등급 VVIP</span>
					</b>
				</form-radio>
			</div>
		</div>

		<div class="mm_foot">
			<div class="mm_btn_box">
				<button
					type="button"
					class="mm_btn T=lg T=primary"
					@click="login"
				>
					<b>로그인</b>
				</button>
			</div>
		</div>
	</layout>
</template>

<script setup lang='ts'>
	import { ref, computed } from 'vue';
	import { useAuthStore } from '$/stores/useAuthStore';
	import { useCart } from '$/composables/useCart';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import FormRadio from '@/component/form/FormRadio.vue';

	const token = ref<string>('');
	const { bom, loading, router } = useGlobalPageContext();
	const authStore = useAuthStore();
	const member = computed(() => authStore.member);
	// TOOD 백엔드 토큰 구현
	const login = async () => {
		if (!token.value) {
			return bom.alert('선택해주세요.');
		}

		loading.show();
		try {
			await authStore.login(token.value);

			bom.alert(`${member.value?.grade.name || '등급'} 으로 로그인 되었습니다.`, () => {
				useCart().getCount();
				if (window.history.state.back) {
					router.replace(window.history.state.back);
				}
			});


		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}

	};
</script>