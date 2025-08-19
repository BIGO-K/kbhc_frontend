<template>
	<layout
		title="주문 반품"
		layout="popup"
	>
		<div class="mm_process">
			<!-- 상품 선택 -->
			<div
				v-if="process.orderItems.isOn"
				class="mm_process-item S=process-on"
			>
				<!-- 주문목록 -->
				<div class="mm_order-item">
					<div class="mm_order-item-head">
						<p class="text_date">
							{{ date(returnable.order.ordered_at, 'YYYY.MM.DD') }}
						</p>
						<dl><dt>주문번호</dt><dd>{{ returnable.order.order_id }}</dd></dl>
					</div>
					<div
						v-for="pack in returnable.order.packs"
						:key="pack.shipping_rule_id"
						class="mm_order-item-seller"
					>
						<div class="mm_order...seller-head">
							<p class="text_ship">
								<i class="ico_ship"></i>
								<span :class="{'text_price': pack.paid_shipping_price > 0}">
									<strong>{{ pack.paid_shipping_price === 0 ? '무료배송' : number(pack.paid_shipping_price) }}</strong>
								</span>
							</p>
						</div>
						<div class="mm_product-list T=sm">
							<ul>
								<li
									v-for="orderItem in pack.order_items"
									:key="orderItem.id"
								>
									<form-check
										v-model="selectedOrderItemSetIds"
										:value="orderItem.id"
										label="상품 선택"
										label-on-blind
									></form-check>
									<p class="text_seller">
										<i class="ico_shop"></i>{{ orderItem.seller_name }}
									</p>
									<my-order-item :order-item="orderItem"></my-order-item>
									<div class="mm_product-unit">
										<div
											v-if="orderItem.items.length > 1"
											class="mm_product-unit-indent"
										>
											<p class="text_amount">
												<b>반품 수량: {{ partialSelectedOrderItems[orderItem.id]?.length || 0 }}개</b>
												<button
													type="button"
													class="mm_btn T=xs T=secondary"
													@click="_e => overlayMyOrderPick(_e, orderItem)"
												>
													<b>부분선택</b>
												</button>
											</p>
										</div>
										<div class="mm_product-unit-point">
											<dl class="mm_flex">
												<dt><i class="ico_star-point"></i>사용 스타포인트</dt>
												<dd>
													<p class="text_price">
														<strong class="mm_text-secondary">{{ number(orderItem.star_point_used) }}</strong>
													</p>
												</dd>
											</dl>
											<dl class="mm_flex">
												<dt><i class="ico_reward-point"></i>사용 리워드포인트</dt>
												<dd>
													<p class="text_price">
														<strong class="mm_text-secondary">{{ number(orderItem.reward_point_used) }}</strong>
													</p>
												</dd>
											</dl>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<!-- 반품신청 -->
				<div class="mm_inner">
					<div class="mm_foot">
						<div class="mm_btn_box">
							<button
								type="button"
								class="mm_btn T=primary"
								@click="processTo()"
							>
								<b>다음 단계로</b>
							</button>
						</div>
					</div>
					<div class="mm_note">
						<dropdown
							:is-active="true"
							icon-class="T=box"
						>
							<template #button>
								<i class="ico_info"></i><b>반품 주의사항</b>
							</template>
							<template #content>
								<ul>
									<li>주문 제작하신 상품 및 해외 배송 상품은 반품이 불가하여 리스트에 노출되지 않습니다.</li>
									<li>가구 제품의 경우 자동 반품 처리가 어려워 신청이 어려우니 고객센터 문의 또는 업체로 문의해주시기 바랍니다.</li>
									<li>반품은 배송 완료 이후 14일 이내 신청 가능합니다.</li>
									<li>반품 사유별 배송비 부담이 상이합니다.</li>
									<li>묶음 반품의 경우 동일한 업체에 한해서 가능합니다.</li>
									<li>반품하실 상품을 발송하기 전에 한해서 반품 철회가 가능합니다.</li>
								</ul>
							</template>
						</dropdown>
					</div>
				</div>
			</div>

			<!-- 반품사유 -->
			<div
				v-if="process.reason.isOn"
				class="mm_process-item S=process-on"
			>
				<div class="mm_inner">
					<h3 class="mm_heading m_myclaim-title">
						<b><strong class="mm_text-secondary">반품 사유</strong>를 선택하세요</b>
					</h3>
					<div class="m_myclaim-reason">
						<ul>
							<li
								v-for="reason in returnReasons"
								:key="reason.code"
							>
								<form-radio
									v-model="form.return_reason_code"
									name="dev_radio-reason"
									:value="reason.code"
								>
									<b class="mm_block">
										<i class="ico_form-radio"></i>
										<i :class="`ico_my-${reason.icon_class_name}`"></i>
										<strong>{{ reason.label }}</strong>
										<span>{{ reason.censure === 'seller' ? '판매자' : '구매자' }} 반품비용 부담</span>
									</b>
								</form-radio>
							</li>
						</ul>
						<div
							v-if="reasonDetailRequired"
							class="m_myclaim-reason-write S=on"
						>
							<h6 class="mm_strapline">
								<b>상세사유</b><strong>(필수)</strong>
							</h6>
							<form-textarea
								v-model="form.return_reason_detail"
								placeholder="상세 사유를 입력하세요"
								:byte="2000"
							></form-textarea>
						</div>
					</div>
					<div class="mm_foot">
						<div class="mm_btn_box">
							<div class="mm_flex T=auto">
								<button
									type="button"
									class="mm_btn T=light btn_back"
									@click="processTo(false)"
								>
									<i class="ico_back"></i><b>이전으로</b>
								</button>
								<button
									type="button"
									class="mm_btn T=primary"
									@click="processTo()"
								>
									<b>다음으로</b>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 반품방법 -->
			<div
				v-if="process.retrieve.isOn"
				class="mm_process-item S=process-on"
			>
				<div class="mm_inner">
					<h3 class="mm_heading m_myclaim-title">
						<b><strong class="mm_text-secondary">반품 방법</strong>을 선택하세요</b>
					</h3>
					<div class="m_myclaim-way">
						<ul>
							<li
								v-for="retrieveMethod in returnable.availableRetrieveMethods"
								:key="retrieveMethod.code"
							>
								<form-radio
									v-model="form.retrieve_method_code"
									name="dev_radio-send"
									:value="retrieveMethod.code"
									@change.passive="() => {
										form.retrieve_invoice!.delivery_company = '';
										form.retrieve_invoice!.invoice_number = '';
									}"
								>
									<b class="mm_block">
										<i class="ico_form-radio"></i>
										<span class="text_label">{{ retrieveMethod.is_retrieve_by_orderer ? '상품을 이미 보냈어요' : '상품을 아직 보내지 않았어요' }}</span>
									</b>
								</form-radio>
								<template v-if="form.retrieve_method_code == retrieveMethod.code">
									<div
										v-if="isRetrievedByOrderer"
										class="m_myclaim-way-info S=radio-use"
									>
										<h6 class="mm_text-label T=sm">
											<b>발송한 택배사</b>
										</h6>
										<form-select
											v-model="form.retrieve_invoice.delivery_company"
											title="택배사"
											use-overlay
										>
											<option value="">
												택배사를 선택하세요
											</option>
											<option
												v-for="deliveryCompany in deliveryCompanies"
												:key="deliveryCompany.code"
												:value="deliveryCompany.code"
											>
												{{ deliveryCompany.name }}
											</option>
										</form-select>
										<h6 class="mm_text-label T=sm">
											<b>송장번호</b>
										</h6>
										<form-text
											v-model="form.retrieve_invoice.invoice_number"
											type="number"
											:max-length="50"
											input-mode="number"
											placeholder="송장번호를 입력하세요"
										></form-text>
									</div>

									<div
										v-else
										class="m_myclaim-way-info S=radio-use"
									>
										<h4>
											<b>반품 수거지 정보</b>
										</h4>
										<div class="mm_order-info">
											<table>
												<tbody>
													<tr>
														<th scope="row">
															<b>보내는 분</b>
														</th>
														<td>{{ form.retrieve_from?.name }}</td>
													</tr>
													<tr>
														<th scope="row">
															<b>휴대폰 번호</b>
														</th>
														<td>{{ form.retrieve_from?.tel }}</td>
													</tr>
													<tr>
														<th scope="row">
															<b>주소</b>
														</th>
														<td>{{ form.retrieve_from?.zip_code }}<br>{{ `${form.retrieve_from?.base_address} ${form.retrieve_from?.detail_address}` }}</td>
													</tr>
												</tbody>
											</table>
											<!-- (D) '입금 대기, 결제 완료' 주문일 경우 '주소변경' 버튼을 노출합니다. -->
											<button
												type="button"
												class="mm_btn T=xs T=secondary btn_address-change"
												@click="overlayAddress"
											>
												<b>주소 변경</b>
											</button>
										</div>
									</div>
								</template>
							</li>
						</ul>
					</div>
					<div
						v-if="!isRetrievedByOrderer"
						class="mm_note T=bg S=radio-use"
					>
						<ul v-if="returnable.availableRetrieveMethods.find(method => method.is_auto_retrieve)">
							<li>배송비 관련 금액은 반품 완료 시 환불 예정 금액에서 차감됩니다.</li>
							<li>배송비 관련 금액을 동봉하지 마세요.</li>
							<li>상품은 착불로 발송해주세요.</li>
							<li>본 상품은 택배사에 자동으로 교환/수거 접수됩니다.</li>
						</ul>
						<ul v-else>
							<li>배송비 관련 금액이 발생될 경우 추가 결제가 진행됩니다.</li>
							<li>배송비 관련 금액을 동봉하지 마세요.</li>
							<li>상품은 착불로 발송해주세요.</li>
							<li>본 상품은 판매처에서 반품/수거 접수됩니다.</li>
							<li>3일 이내 회수되지 않을 경우 해당 택배사 또는 쇼핑몰 고객센터로 문의해주세요.</li>
							<li>회수 시 발급된 송장번호는 반품 상세내역에서 등록해주세요.</li>
						</ul>
					</div>
					<div class="mm_foot">
						<div class="mm_btn_box">
							<div class="mm_flex T=auto">
								<button
									type="button"
									class="mm_btn T=light btn_back"
									@click="processTo(false)"
								>
									<i class="ico_back"></i><b>이전으로</b>
								</button>
								<button
									type="button"
									class="mm_btn T=primary"
									@click="processTo()"
								>
									<b>다음으로</b>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 환불관련정보 -->
			<div
				v-if="process.refund.isOn"
				class="mm_process-item S=process-on"
			>
				<div class="m_myclaim-refund">
					<h3 class="mm_heading m_myclaim-title">
						<b><strong class="mm_text-secondary">예상 환불금액</strong>을 확인하세요</b>
					</h3>
					<hr class="mm_line">
					<div class="m_myorder-info">
						<section>
							<h6 class="mm_strapline">
								<b>환불 예상금액</b>
							</h6>
							<div class="mm_cost">
								<table>
									<tbody>
										<tr>
											<th scope="row">
												<b>반품 상품 주문 금액</b>
											</th>
											<td>
												<p class="text_price">
													<strong>{{ number(getRefundCalculations(refundInfo).totalRefund) }}</strong>
												</p>
											</td>
										</tr>
										<tr
											v-for="detail in refundInfo.calculate_details"
											:key="detail.label"
										>
											<th scope="row">
												<b>{{ detail.label }}</b>
											</th>
											<td>
												<p class="text_price">
													{{ detail.is_substracted ? '-' : '+' }}
													<strong>{{ number(detail.amount) }}</strong>
												</p>
											</td>
										</tr>
									</tbody>
									<tfoot>
										<tr>
											<th scope="row">
												<b>환불 예상 금액</b>
											</th>
											<td>
												<p class="text_price">
													<strong>{{ number(refundInfo.refund_price + refundInfo.refund_star_point + refundInfo.refund_reward_point) }}</strong>
												</p>
											</td>
										</tr>
									</tfoot>
								</table>
							</div>
							<div class="mm_note T=bg">
								<ul>
									<li>초도 배송비를 지불하셨을 경우 귀책 사유 관계 없이 면제 배송비가 부과되지 않습니다.</li>
								</ul>
							</div>
						</section>

						<hr class="mm_line">
						<section>
							<h6 class="mm_strapline">
								<b>환불 정보</b>
							</h6>
							<div class="mm_cost">
								<table>
									<tbody>
										<tr>
											<th scope="row">
												<b>{{ returnable.order.payment_method_label }} 환불</b>
											</th>
											<td>
												<p class="text_price">
													<strong>{{ number(refundInfo.refund_price) }}</strong>
												</p>
											</td>
										</tr>
										<tr>
											<th scope="row">
												<b>스타포인트 환불</b>
											</th>
											<td>
												<p class="text_point">
													<strong>{{ number(refundInfo.refund_star_point) }}</strong><sub>원</sub>
												</p>
											</td>
										</tr>
										<tr>
											<th scope="row">
												<b>리워드포인트 환불</b>
											</th>
											<td>
												<p class="text_point">
													<strong>{{ number(refundInfo.refund_reward_point) }}</strong><sub>원</sub>
												</p>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div class="mm_note T=bg">
								<ul>
									<li>최종적으로 환불 받으실 금액은 상이할 수 있습니다.</li>
								</ul>
							</div>
						</section>

						<hr class="mm_line">
						<section>
							<h6 class="mm_strapline">
								<b>환불 계좌 관리</b>
							</h6>
							<div
								v-if="refundAccount"
								class="mm_order-refund"
							>
								<p class="text_bank">
									{{ refundAccount.bank_name }}
								</p>
								<p class="text_name">
									{{ refundAccount.owner_name }}
								</p>
								<p>{{ refundAccount.account_number }}</p>
								<button
									type="button"
									class="mm_btn T=xs T=secondary"
									@click="overlayMyRefundUpdate"
								>
									<b>변경</b>
								</button>
							</div>
							<div
								v-else
								class="mm_order-refund-none"
							>
								<a
									href="#"
									@click.prevent="overlayMyRefundCreate"
								>
									<i class="ico_plus"></i><b>환불 계좌를 등록하세요</b>
								</a>
							</div>
							<div class="mm_note T=bg">
								<ul>
									<li>입력하신 계좌 정보는 환불 목적으로만 이용되고 있습니다.</li>
								</ul>
							</div>
						</section>
					</div>
					<div class="mm_inner">
						<div class="mm_foot">
							<div class="mm_btn_box">
								<div class="mm_flex T=auto">
									<button
										type="button"
										class="mm_btn T=light btn_back"
										@click="processTo(false)"
									>
										<i class="ico_back"></i><b>이전으로</b>
									</button>
									<a
										class="mm_btn T=primary"
										href="#"
										@click.prevent="apply"
									>
										<b>반품 신청하기</b>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, watch, computed, defineAsyncComponent, watchEffect } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useForm } from '$/composables/useForm';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyOrder } from '$/composables/useMyOrder';
	import { useMyRefundAccount } from '$/composables/useMyRefundAccount';
	import Layout from '@/component/layout/Layout.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormRadio from '@/component/form/FormRadio.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import FormText from '@/component/form/FormText.vue';
	import FormTextarea from '@/component/form/FormTextarea.vue';
	import MyOrderItem from '@/page/mypage/order/component/MyOrderItem.vue';

	/** 반품 프로세스 단계명 */
	type ReturnProcess = 'orderItems' | 'reason' | 'retrieve' | 'refund';

	const props = defineProps<{
		orderId: string;
		orderItemId: number;
	}>();

	const { date, number } = useFormatter();
	const { bom, loading, router, openOverlay } = useGlobalPageContext();
	const { get: getMyRefundAccount, getBankCodes } = useMyRefundAccount();
	const {
		defaultRefundInfo,
		getReturnReasons,
		getReturnable,
		getReturnRefundInfo,
		applyReturn,
		getDeliveryCompanies,
		validateInvoice,
		getRefundCalculations,
	} = useMyOrder();

	const [
		returnReasons,
		returnable,
		myRefundAccount,
		deliveryCompanies,
	] = await Promise.all([
		getReturnReasons(),
		(async () => {
			try {
				return await getReturnable(props.orderId, props.orderItemId);
			}
			catch (e) {
				useErrorAlert(e, {
					httpCatcher: {
						404: '반품할 상품이 없습니다.',
					},
					alertCallback: () => {
						router.go(-1);
					},
				});

				return {
					order: {
						order_id: '',
						ordered_at: '',
						payment_method_label: '',
						require_refund_account: false,
						shipping_address: {
							name: '',
							tel: '',
							zip_code: '',
							base_address: '',
							detail_address: '',
						},
						packs: [],
					},
					availableRetrieveMethods: [],
				};
			}
		})(),
		getMyRefundAccount(),
		getDeliveryCompanies(),
	]);

	/** 환불정보 */
	const refundInfo = ref(defaultRefundInfo);
	/** 환불계좌 */
	const refundAccount = ref(myRefundAccount);
	/** 은행코드 */
	const bankCodes = ref<BankCode[]>([]);
	/** 사유상세 필요여부 */
	const reasonDetailRequired = computed(() => returnReasons.find(reason => reason.code === form.value.return_reason_code)?.require_detail || false);
	/** 주문자회수 여부 */
	const isRetrievedByOrderer = computed<boolean>(() => {
		return returnable.availableRetrieveMethods.find(method => form.value.retrieve_method_code == method.code)?.is_retrieve_by_orderer === true;
	});
	/** 선택된 주문묶음 */
	const selectedOrderItemSetIds = ref<number[]>([]);
	/** 부분선택된 주문상품 */
	const partialSelectedOrderItems = ref<Record<string, number[]>>({});
	/** 반품 요청 FORM */
	const { form, validate } = useForm<ReturnForm & {
		is_self_retrieve: 1 | 0;
	}>(
		{
			order_id: props.orderId,
			order_item_ids: [],
			return_reason_code: returnReasons[0].code,
			return_reason_detail: '',
			retrieve_method_code: returnable.availableRetrieveMethods[0].code,
			retrieve_invoice: {
				delivery_company: '',
				invoice_number: '',
			},
			retrieve_from: {
				...returnable.order.shipping_address,
			},
			refund_account: {
				owner_name: refundAccount.value?.owner_name || '',
				bank_code: refundAccount.value?.bank_code || null,
				account_number: refundAccount.value?.account_number || '',
			},
			is_self_retrieve: 0,
		},
		{
			rule: {},
			message: {
				'order_item_ids.required': ':param(을/를) 선택해주세요.',
				'return_reason_code.in': ':param(이/가) 올바르지 않습니다.',
				'return_reason_code.required': ':param(을/를) 선택해주세요.',
				'retrieve_invoice.delivery_company.requiredIf': ':param(을/를) 선택해주세요.',
				'retrieve_invoice.invoice_number.number': ':param(은/는) 숫자만 입력가능합니다.',
				'refund_account.owner_name.required': ':param(을/를) 등록해주세요.',
				'refund_account.bank_code.required': ':param(을/를) 등록해주세요.',
				'refund_account.account_number.required': ':param(을/를) 등록해주세요.',
			},
		}
	);
	/** 유효성검사 규칙 */
	const baseValidationRules: Record<string, Record<string, string[]>> = {
		order_item_ids: {
			'order_item_ids(주문 반품하실 상품)': ['required'],
		},
		reason: {
			'return_reason_code(주문 반품 사유)': ['required'],
			'return_reason_detail(주문 반품 사유)': [
				`requiredIf:return_reason_code,${returnReasons.filter(reason => reason.require_detail).map(reason => reason.code).join(',')}`,
			],
		},
		retrieve: {
			// 반품송장정보
			'retrieve_invoice.delivery_company(택배사)': ['requiredIf:is_self_retrieve,1'],
			'retrieve_invoice.invoice_number(송장번호)': ['requiredIf:is_self_retrieve,1'],
			// 반품수거지 정보
			'retrieve_from.name(반품 수거지 주문자)': ['requiredIf:is_self_retrieve,0', 'maxLength:50'],
			'retrieve_from.tel(반품 수거지 연락처)': ['requiredIf:is_self_retrieve,0', 'number', 'maxLength:12'],
			'retrieve_from.zip_code(반품 수거지 우편번호)': ['requiredIf:is_self_retrieve,0'],
			'retrieve_from.base_address(반품 수거지 주소)': ['requiredIf:is_self_retrieve,0'],
			'retrieve_from.detail_address(반품 수거지 상세주소)': ['requiredIf:is_self_retrieve,0', 'maxLength:100'],
		},
		refund: {
			'refund_account.owner_name(환불계좌)': ['required'],
			'refund_account.bank_code(환불계좌)': ['required'],
			'refund_account.account_number(환불계좌)': ['required'],
		},
	};

	/** 반품 단계 */
	const currentProcess = ref<ReturnProcess>('orderItems');
	const process = ref<{
		[processName in ReturnProcess]: {
			isOn: boolean;
			rules: Record<string, string[]>;
			next: Nullable<ReturnProcess>;
			previous: Nullable<ReturnProcess>;
		}
	}>({
		orderItems: {
			isOn: true,
			rules: baseValidationRules.order_item_ids,
			next: 'reason',
			previous: null,
		},
		reason: {
			isOn: false,
			rules: baseValidationRules.reason,
			next: 'retrieve',
			previous: 'orderItems',
		},
		retrieve: {
			isOn: false,
			rules: baseValidationRules.retrieve,
			next: 'refund',
			previous: 'reason',
		},
		refund: {
			isOn: false,
			rules: baseValidationRules.refund,
			next: null,
			previous: 'retrieve',
		},
	});

	const overlayAddress = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/address/Address.vue')), {
			clickElement: _e.currentTarget,
			onClose: async (_value: { newAddress: MyShippingAddressDetail }) => {
				const newAddress = _value.newAddress;
				if (!newAddress) {
					return;
				}

				form.value.retrieve_from = {
					...newAddress,
				};
			},
		});
	};

	const overlayMyOrderPick = (_e: MouseEvent, orderItemSet: ReturnableOrderItemSet) => {
		openOverlay(defineAsyncComponent(() => import('@/page/mypage/order/pick/MyOrderPick.vue')), {
			clickElement: _e.currentTarget,
			props: {
				orderItemSet,
				legacySelected: partialSelectedOrderItems.value[orderItemSet.id],
			},
			onClose: (_value: { selected: number[] }) => {
				if (!_value.selected || _value.selected.length <= 0) {
					return;
				}

				partialSelectedOrderItems.value[orderItemSet.id] = _value.selected;
			},
		});
	};

	const overlayMyRefundUpdate = async (_e: MouseEvent) => {
		if (!bankCodes.value.length) {
			bankCodes.value = await getBankCodes();
		}
		openOverlay(defineAsyncComponent(() => import('@/page/mypage/refund/update/MyRefundUpdate.vue')), {
			clickElement: _e.currentTarget,
			props: {
				bankCodes: bankCodes.value,
				refundAccount,
			},
			onClose: (_value: { refundAccount: RefundAccount }) => {
				if (!_value?.refundAccount) {
					return;
				}
				refundAccount.value = _value?.refundAccount;
			},
		});
	};

	const overlayMyRefundCreate = async (_e: MouseEvent) => {
		if (!bankCodes.value.length) {
			bankCodes.value = await getBankCodes();
		}
		openOverlay(defineAsyncComponent(() => import('@/page/mypage/refund/create/MyRefundCreate.vue')), {
			clickElement: _e.currentTarget,
			props: {
				bankCodes: bankCodes.value,
			},
			onClose: (_value: { refundAccount: RefundAccount }) => {
				if (!_value?.refundAccount) {
					return;
				}
				refundAccount.value = _value?.refundAccount;
			},
		});
	};

	/** 단계 진행 */
	async function processTo(forward: boolean = true) {
		const nextStep = process.value[currentProcess.value].next;
		const previousStep = process.value[currentProcess.value].previous;

		if (forward && nextStep) {
			try {
				await validate(process.value[currentProcess.value].rules);
				if (currentProcess.value == 'retrieve' && isRetrievedByOrderer.value) {
					await validateInvoice(form.value.retrieve_invoice);
				}
				process.value[currentProcess.value].isOn = false;
				process.value[nextStep].isOn = true;
				currentProcess.value = nextStep;
			}
			catch (e) {
				useErrorAlert(e);
			}
		}
		else if (!forward && previousStep) {
			process.value[currentProcess.value].isOn = false;
			process.value[previousStep].isOn = true;
			currentProcess.value = previousStep;
		}
	}

	/** 반품 신청 */
	async function apply() {
		if (refundInfo.value.refund_price <= 0) {
			return bom.alert('적립금을 제외한 환불금액이 0원 이하일 경우 반품 신청이 불가합니다.');
		}

		try {
			await validate(Object.assign(
				baseValidationRules.order_item_ids,
				baseValidationRules.reason,
				baseValidationRules.retrieve,
				baseValidationRules.refund
			));
		}
		catch (e) {
			useErrorAlert(e);

			return;
		}

		bom.confirm('주문 반품을 진행하시겠습니까?', async (flag) => {
			if (!flag) return;

			loading.show();
			try {
				const returnIds = await applyReturn(form.value);
				router.replace({
					name: 'MyOrderReturnSuccess',
					params: {
						order_id: props.orderId,
						return_ids: returnIds,
					},
				});
			}
			catch (e) {
				useErrorAlert(e);
			}
			finally {
				loading.hide();
			}
		});
	}


	/** 상품 default 선택처리 */
	returnable.order.packs.forEach(pack => {
		pack.order_items.forEach(set => {
			if (set.items.length == 1) {
				partialSelectedOrderItems.value[set.id] = [set.id];
			}
			else {
				partialSelectedOrderItems.value[set.id] = [];
			}

			set.items.forEach(item => {
				if (item.id == props.orderItemId) {
					partialSelectedOrderItems.value[set.id] = [props.orderItemId];
					selectedOrderItemSetIds.value = [set.id];
				}
			});
		});
	});

	/** 선택한 주문상품 form에 동기화 */
	watchEffect(() => {
		form.value.order_item_ids = selectedOrderItemSetIds.value
			.map((setId) => partialSelectedOrderItems.value[setId])
			.flat(1);
	});

	/** 환불계좌 form에 동기화 */
	watch(refundAccount, (newAccount) => {
		if (!newAccount) {
			return;
		}

		form.value.refund_account.account_number = newAccount.account_number;
		form.value.refund_account.owner_name = newAccount.owner_name;
		form.value.refund_account.bank_code = newAccount.bank_code;
	});

	/** 환불정보 조회 */
	watch(
		() => process.value.refund.isOn,
		async (to) => {
			if (!to) {
				return;
			}

			if (
				!form.value.return_reason_code
				|| form.value.order_item_ids.length < 1
				|| !form.value.retrieve_method_code
			) {
				refundInfo.value = defaultRefundInfo;

				return;
			}

			try {
				refundInfo.value = await getReturnRefundInfo(props.orderId, {
					order_item_ids: form.value.order_item_ids,
					return_reason_code: form.value.return_reason_code,
					retrieve_method: form.value.retrieve_method_code,
					retrieve_zip_code: form.value.retrieve_from?.zip_code || '',
					retrieve_base_address: form.value.retrieve_from?.base_address || '',
					retrieve_detail_address: form.value.retrieve_from?.base_address || '',
				});
			}
			catch (e) {
				useErrorAlert(e);
				refundInfo.value = defaultRefundInfo;
			}
		}
	);

	/** 주문자 회수 여부 FORM 에 적용 */
	watch(isRetrievedByOrderer, () => {
		form.value.is_self_retrieve = isRetrievedByOrderer.value ? 1 : 0;
	}, {
		immediate: true,
	});
</script>