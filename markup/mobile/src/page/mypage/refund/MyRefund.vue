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
						@click.prevent="overlayMyRefundCreate"
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
						>
							<b>삭제하기</b>
						</button>
						<a
							class="mm_btn T=primary"
							href="#"
							@click.prevent="overlayMyRefundUpdate"
						>
							<b>변경하기</b>
						</a>
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
	import { defineAsyncComponent } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';

	const { openOverlay } = useGlobalPageContext();

	const refundAccount: RefundAccount = {
		account_number: '1234567890',
		bank_code: 100,
		bank_name: '국민은행',
		owner_name: '홍길동',
	};
	// const refundAccount: RefundAccount = null;

	const bankCodes = [
		{
			'code': 706,
			'label': 'KDB산업은행',
		},
		{
			'code': 101,
			'label': '기업은행',
		},
		{
			'code': 100,
			'label': '국민은행',
		},
		{
			'code': 701,
			'label': '수협',
		},
		{
			'code': 200,
			'label': '농협',
		},
		{
			'code': 201,
			'label': '지역농축협',
		},
		{
			'code': 801,
			'label': '우리은행',
		},
		{
			'code': 1500,
			'label': 'SC제일은행',
		},
		{
			'code': 705,
			'label': '한국씨티은행',
		},
		{
			'code': 300,
			'label': '대구은행',
		},
		{
			'code': 600,
			'label': '부산은행',
		},
		{
			'code': 103,
			'label': '광주은행',
		},
		{
			'code': 900,
			'label': '제주은행',
		},
		{
			'code': 901,
			'label': '전북은행',
		},
		{
			'code': 102,
			'label': '경남은행',
		},
		{
			'code': 702,
			'label': '새마을금고',
		},
		{
			'code': 712,
			'label': '신협',
		},
		{
			'code': 902,
			'label': '상호저축은행',
		},
		{
			'code': 1501,
			'label': 'HSBC은행',
		},
		{
			'code': 301,
			'label': '도이치은행',
		},
		{
			'code': 1509,
			'label': 'JP모건',
		},
		{
			'code': 1508,
			'label': 'BOA(Bank Of America)',
		},
		{
			'code': 602,
			'label': '비엔피파리바은행',
		},
		{
			'code': 711,
			'label': '산림조합',
		},
		{
			'code': 800,
			'label': '우체국',
		},
		{
			'code': 1400,
			'label': '하나은행',
		},
		{
			'code': 700,
			'label': '신한은행',
		},
		{
			'code': 1101,
			'label': '케이뱅크',
		},
		{
			'code': 1102,
			'label': '카카오뱅크',
		},
		{
			'code': 1200,
			'label': '토스뱅크',
		},
		{
			'code': 807,
			'label': '유안타증권',
		},
		{
			'code': 1506,
			'label': 'KB증권',
		},
		{
			'code': 500,
			'label': '미래에셋대우',
		},
		{
			'code': 708,
			'label': '삼성증권',
		},
		{
			'code': 1404,
			'label': '한국투자증권',
		},
		{
			'code': 1504,
			'label': 'NH투자증권',
		},
		{
			'code': 1403,
			'label': '하이투자증권',
		},
		{
			'code': 1405,
			'label': '현대차증권',
		},
		{
			'code': 1502,
			'label': 'SK증권',
		},
		{
			'code': 303,
			'label': '대신증권',
		},
		{
			'code': 1401,
			'label': '한화투자증권',
		},
		{
			'code': 1402,
			'label': '하나금융투자',
		},
		{
			'code': 707,
			'label': '신한금융투자',
		},
		{
			'code': 304,
			'label': 'DB금융투자',
		},
		{
			'code': 803,
			'label': '유진투자증권',
		},
		{
			'code': 501,
			'label': '메리츠증권',
		},
		{
			'code': 709,
			'label': '신영증권',
		},
	];

	function overlayMyRefundCreate() {
		const component = defineAsyncComponent(() => import('@/page/mypage/refund/create/MyRefundCreate.vue'));

		return openOverlay(component, {
			props: {
				bankCodes,
			},
		});
	}

	function overlayMyRefundUpdate() {
		const component = defineAsyncComponent(() => import('@/page/mypage/refund/update/MyRefundUpdate.vue'));

		return openOverlay(component, {
			props: {
				refundAccount,
				bankCodes,
			},
		});
	}
</script>