<template>
	<div class="m_receipt">
		<div class="m_receipt-head">
			<form-select
				v-model="sortPaymentRange"
				class="T=sm T=short"
			>
				<option>부분취소</option>
			</form-select>
			<button
				type="button"
				class="mm_btn T=primary btn_send"
				@click.prevent="bomReceiptEmail"
			>
				<i class="ico_email"></i><b>이메일 발송</b>
			</button>
		</div>
		<div class="m_receipt-inner">
			<section>
				<h4 class="mm_strapline">
					<b>주문 정보</b>
				</h4>
				<table>
					<colgroup>
						<col style="width:121px;">
						<col>
					</colgroup>
					<tbody>
						<tr>
							<th scope="row">
								<b>주문번호</b>
							</th>
							<td>{{ '123456789123' }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>주문자명</b>
							</th>
							<td>{{ '홍*동' }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>상품명</b>
							</th>
							<td>{{ '[카파] 반다 스트랩 샌들 블랙 아동 키즈' }}</td>
						</tr>
					</tbody>
				</table>
			</section>
			<section>
				<h4 class="mm_strapline">
					<b>결제 정보</b>
				</h4>
				<table>
					<colgroup>
						<col style="width:121px;">
						<col>
					</colgroup>
					<tbody>
						<tr>
							<th scope="row">
								<b>결제수단</b>
							</th>
							<td>{{ receipt.approve.pay_method_name }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>거래상태</b>
							</th>
							<td>{{ receipt.approve.status }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>거래일시</b>
							</th>
							<td>{{ receipt.approve.paid_at }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>취소일시</b>
							</th>
							<td>{{ receipt.cancels[0].canceled_at }}</td>
						</tr>
						<template v-if="receiptType === 'card'">
							<tr>
								<th scope="row">
									<b>결제카드</b>
								</th>
								<td>{{ receipt.approve.card?.name }}</td>
							</tr>
							<tr>
								<th scope="row">
									<b>카드번호</b>
								</th>
								<td>{{ receipt.approve.card?.masked_number }}</td>
							</tr>
							<tr>
								<th scope="row">
									<b>할부개월</b>
								</th>
								<td>{{ receipt.approve.card?.installment }}</td>
							</tr>
							<tr>
								<th scope="row">
									<b>승인번호</b>
								</th>
								<td>{{ receipt.approve.card?.tid }}</td>
							</tr>
						</template>
						<template v-if="receiptType === 'account'">
							<tr>
								<th scope="row">
									<b>결제은행</b>
								</th>
								<td>{{ receipt.approve.virtual_bank?.bank_name }}</td>
							</tr>
							<tr>
								<th scope="row">
									<b>가상계좌번호</b>
								</th>
								<td>{{ receipt.approve.virtual_bank?.virtual_account_number }}</td>
							</tr>
						</template>
						<tr>
							<th scope="row">
								<b>승인금액</b>
							</th>
							<td>
								<p class="text_price">
									<strong class="mm_text-secondary">{{ number(receipt.approve.payment_price) }}</strong>
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<b>과세금액</b>
							</th>
							<td>
								<p class="text_price">
									<strong>-{{ number(receipt.approve.tax_price) }}</strong>
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<b>기취소금액</b>
							</th>
							<td>
								<p class="text_price">
									<strong>{{ number(receipt.cancels[0].canceled_price) }}</strong>
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<b>부가세</b>
							</th>
							<td>
								<p class="text_price">
									<strong>-{{ number(receipt.approve.surtax_price) }}</strong>
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<b>취소금액</b>
							</th>
							<td>
								<p class="text_price">
									<strong class="mm_text-secondary">{{ number(receipt.cancels[0].cancel_price) }}</strong>
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<b>면세금액</b>
							</th>
							<td>
								<p class="text_price">
									<strong>{{ number(receipt.approve.tax_free_price) }}</strong>
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<b>잔액</b>
							</th>
							<td>
								<p class="text_price">
									<strong>{{ number(receipt.cancels[0].balance_price) }}</strong>
								</p>
							</td>
						</tr>
					</tbody>
				</table>
			</section>
			<section v-if="receiptType === 'account'">
				<h4 class="mm_strapline">
					<b>현금영수증 정보</b>
				</h4>
				<table>
					<colgroup>
						<col style="width:121px;">
						<col>
					</colgroup>
					<tbody>
						<tr>
							<th scope="row">
								<b>결제수단</b>
							</th>
							<td>현금영수증</td>
						</tr>
						<tr>
							<th scope="row">
								<b>거래상태</b>
							</th>
							<td>{{ receipt.all.cash_receipt?.status }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>공급자사업자번호</b>
							</th>
							<td>{{ '116-81-19948' }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>현금영수증용도</b>
							</th>
							<td>{{ receipt.all.cash_receipt?.use_type }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>현금영수증발급형태</b>
							</th>
							<td>{{ '구매자요청발급' }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>현금영수증인증값</b>
							</th>
							<td>{{ receipt.all.cash_receipt?.masked_request_number }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>현금영수증승인번호</b>
							</th>
							<td>{{ receipt.all.cash_receipt?.auth_code }}</td>
						</tr>
					</tbody>
				</table>
			</section>
			<section>
				<h4 class="mm_strapline">
					<b>공급자 정보</b>
				</h4>
				<table>
					<colgroup>
						<col style="width:121px;">
						<col>
					</colgroup>
					<tbody>
						<tr>
							<th scope="row">
								<b>상호</b>
							</th>
							<td>{{ '(주)엠몬스타' }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>사업자번호</b>
							</th>
							<td>{{ '792-81-00850' }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>대표자명</b>
							</th>
							<td>{{ '장한필' }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>연락처</b>
							</th>
							<td>{{ '031-8023-9666' }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>주소</b>
							</th>
							<td>{{ '경기도 성남시 분당구 판교로 242판교디지털센터(PDC) C동 401호' }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>홈페이지</b>
							</th>
							<td>{{ 'www.mmonstar.co.kr' }}</td>
						</tr>
					</tbody>
				</table>
			</section>
			<section>
				<h4 class="mm_strapline">
					<b>결제대행사 정보</b>
				</h4>
				<table>
					<colgroup>
						<col style="width:121px;">
						<col>
					</colgroup>
					<tbody>
						<tr>
							<th scope="row">
								<b>상호</b>
							</th>
							<td>{{ receipt.payment_company_info.name }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>사업자번호</b>
							</th>
							<td>{{ receipt.payment_company_info.business_number }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>대표자명</b>
							</th>
							<td>{{ receipt.payment_company_info.ceo }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>연락처</b>
							</th>
							<td>{{ receipt.payment_company_info.phone }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>주소</b>
							</th>
							<td>{{ receipt.payment_company_info.address }}</td>
						</tr>
						<tr>
							<th scope="row">
								<b>홈페이지</b>
							</th>
							<td>{{ receipt.payment_company_info.homepage_url }}</td>
						</tr>
					</tbody>
				</table>
				<template v-if="receiptType === 'card'">
					<div class="mm_note T=bg">
						<ul>
							<li>신용카드 청구서에는 ‘한국정보통신(주)’로 표기됩니다.</li>
							<li>부가세세법시행령 제57조 2항에 따라 결제대행업체를 통한 신용 카드 매출전표는 사업자가 별도의 세금계산서를 교부하지 아니한 경우, 매입세금계산서로 사용하실 수 있습니다.</li>
						</ul>
					</div>
				</template>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import FormSelect from '@/component/form/FormSelect.vue';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	const { number } = useFormatter();
	const { bom } = useGlobalPageContext();

	const sortPaymentRange = ref('');
	const receiptType = ref('card');// 임시 변수

	const bomReceiptEmail = () => {
		bom.prompt(
			'이메일 주소를 입력해주세요',
			(_is: boolean, _values: Record<string, string>) => {
				console.log(_is, _values);
			},
			{
				title: '메일 발송',
				forms: [
					{ type: 'text', name: 'email', maxLength: 50, placeholder: `‘@’을 포함하여 50자 이하 입력` },
				],
			}
		);
	};

	defineExpose<OverlayComponentExpose>({
		title: `신용카드 영수증`,
	});

	type ReceiptResponse = {
		all: {
			pay_method_name: string;
			status: string;
			paid_at: string;
			canceled_at?: string;
			card?: {
				name: string;
				masked_number: string;
				installment: string;
				tid: string;
			};
			virtual_bank?: {
				bank_name: string;
				virtual_account_number: string;
			};
			cash_receipt?: {
				status: string;
				use_type: string;
				masked_request_number: string;
				auth_code: string;
			};
			payment_price: number;
			canceled_price: number;
			balance_price: number;
		};
		approve: {
			pay_method_name: string;
			status: string;
			paid_at: string;
			canceled_at?: string;
			card?: {
				name: string;
				masked_number: string;
				installment: string;
				tid: string;
			};
			virtual_bank?: {
				bank_name: string;
				virtual_account_number: string;
			};
			cash_receipt?: {
				status: string;
				use_type: string;
				masked_request_number: string;
				auth_code: string;
			};
			payment_price: number;
			tax_price: number;
			surtax_price: number;
			tax_free_price: number;
		};
		cancels: {
			pay_method_name: string;
			status: string;
			paid_at: string;
			canceled_at?: string;
			card?: {
				name: string;
				masked_number: string;
				installment: string;
				tid: string;
			};
			virtual_bank?: {
				bank_name: string;
				virtual_account_number: string;
			};
			cash_receipt?: {
				status: string;
				use_type: string;
				masked_request_number: string;
				auth_code: string;
			};
			payment_price: number;
			tax_price: number;
			surtax_price: number;
			tax_free_price: number;
			canceled_price: number;
			cancel_price: number;
			balance_price: number;
			refund_id: string;
		}[];
		payment_company_info: {
			name: string; // 상호
			business_number: string; // 사업자번호
			ceo: string; // 대표자명
			phone: string; // 연락처
			address: string; // 주소
			homepage_url: string; // 홈페이지
		};
	};

	const receipt = ref<ReceiptResponse>({
		all: {
			pay_method_name: '가상계좌',
			status: '입금',
			paid_at: '2022-05-16 14:02:28',
			canceled_at: '',
			card: {
				name: '하나카드',
				masked_number: '408966******8936',
				installment: '일시불',
				tid: '20220516977701',
			},
			virtual_bank: {
				bank_name: '하나은행',
				virtual_account_number: 'T0409260000019',
			},
			cash_receipt: {
				status: '승인',
				use_type: '소득공제',
				masked_request_number: '0101234****',
				auth_code: '987987987987',
			},
			payment_price: 54500,
			canceled_price: 4900,
			balance_price: 49600,
		},
		approve: {
			pay_method_name: '가상계좌',
			status: '입금',
			paid_at: '2022-05-16 14:02:28',
			canceled_at: '',
			card: {
				name: '하나카드',
				masked_number: '408966******8936',
				installment: '일시불',
				tid: '20220516977701',
			},
			virtual_bank: {
				bank_name: '하나은행',
				virtual_account_number: 'T0409260000019',
			},
			cash_receipt: {
				status: '승인',
				use_type: '소득공제',
				masked_request_number: '0101234****',
				auth_code: '987987987987',
			},
			payment_price: 54500,
			tax_price: 4455,
			surtax_price: 445,
			tax_free_price: 0,
		},
		cancels: [
			{
				pay_method_name: '가상계좌',
				status: '부분취소',
				paid_at: '2022-05-16 14:02:28',
				canceled_at: '',
				card: {
					name: '하나카드',
					masked_number: '408966******8936',
					installment: '일시불',
					tid: '20220516977701',
				},
				virtual_bank: {
					bank_name: '하나은행',
					virtual_account_number: 'T0409260000019',
				},
				cash_receipt: {
					status: '승인',
					use_type: '소득공제',
					masked_request_number: '0101234****',
					auth_code: '987987987987',
				},
				payment_price: 54500,
				tax_price: 4455,
				surtax_price: 445,
				tax_free_price: 0,
				canceled_price: 0,
				cancel_price: 4900,
				balance_price: 49600,
				refund_id: '123412341234',
			},
		],
		payment_company_info: {
			name: 'NHN한국사이버결제 주식회사',
			business_number: '113-85-21083',
			ceo: '홍길동',
			phone: '1588-0000',
			address: '08393 서울특별시 구로구 디지털로26길 72 (구로동, NHN한국사이버결제)',
			homepage_url: 'https://www.kcp.co.kr',
		},
	});
</script>