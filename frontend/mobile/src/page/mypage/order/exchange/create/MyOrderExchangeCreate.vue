<template>
	<page-move
		v-if="payingStart"
		@complete="endProcess"
	></page-move>
	<layout
		v-else
		title="주문 교환"
		layout="popup"
	>
		<div class="m_myclaim-exchange">
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
								{{ date(exchangeable.order.ordered_at, 'YYYY.MM.DD') }}
							</p>
							<dl><dt>주문번호</dt><dd>{{ exchangeable.order.order_id }}</dd></dl>
						</div>
						<div
							v-for="pack in exchangeable.order.packs"
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
											v-model="orderItemSelectForm.orderItemSetIds"
											:value="orderItem.id"
											label="상품 선택"
											label-on-blind
										></form-check>
										<p class="text_seller">
											<i class="ico_shop"></i>{{ orderItem.seller_name }}
										</p>
										<my-order-item :order-item="orderItem"></my-order-item>
										<div class="mm_product-unit">
											<div class="mm_product-unit-indent">
												<div class="mm_form_mix-linked text_amount">
													<b>교환 수량</b>
													<form-select
														v-model="orderItemSelectForm.exchangeEas[orderItem.id]"
														class="T=line"
														title="교환 수량"
														use-overlay
													>
														<option
															v-for="ea in orderItem.items.length"
															:key="ea"
															:value="ea"
														>
															{{ ea }}
														</option>
													</form-select>
												</div>
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

					<!-- 교환신청 -->
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
									<i class="ico_info"></i><b>교환 주의사항</b>
								</template>
								<template #content>
									<ul>
										<li>주문 제작하신 상품 및 해외 배송 상품은 반품이 불가하여 리스트에 노출되지 않습니다.</li>
										<li>가구 제품의 경우 자동 반품 처리가 어려워 신청이 어려우니 고객센터 문의 또는 업체로 문의해주시기 바랍니다.</li>
										<li>교환은 배송 완료 이후 14일 이내 신청 가능합니다.</li>
										<li>교환 사유별 배송비 부담이 상이합니다.</li>
										<li>묶음 교환의 경우 동일한 업체에 한해서 가능합니다.</li>
										<li>교환하실 상품을 발송하기 전에 한해서 교환 철회가 가능합니다.</li>
									</ul>
								</template>
							</dropdown>
						</div>
					</div>
				</div>

				<!-- 교환사유 -->
				<div
					v-if="process.reason.isOn"
					class="mm_process-item S=process-on"
				>
					<div class="mm_inner">
						<h3 class="mm_heading m_myclaim-title">
							<b><strong class="mm_text-secondary">교환 사유</strong>를 선택하세요</b>
						</h3>
						<div class="m_myclaim-reason">
							<ul>
								<li
									v-for="reason in exchangeReasons"
									:key="reason.code"
								>
									<form-radio
										v-model="form.reason_code"
										name="exchange_reason"
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
									v-model="form.reason_detail"
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
				<!-- 교환사유 -->

				<!-- 옵션변경 -->
				<div
					v-if="process.option.isOn"
					class="mm_process-item S=process-on"
				>
					<h3 class="mm_heading m_myclaim-title">
						<b><strong class="mm_text-secondary">변경할 옵션</strong>을 선택하세요</b>
					</h3>
					<div class="mm_order-item">
						<div
							v-for="pack in selectedPacks"
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
										<p class="text_seller">
											<i class="ico_shop"></i>{{ orderItem.seller_name }}
										</p>
										<my-order-item :order-item="orderItem"></my-order-item>
										<div class="mm_product-unit">
											<div class="mm_product-unit-indent">
												<button
													type="button"
													class="mm_btn T=xs T=line btn_option-change"
													@click="_e => overlayMyOrderExchangeCreateOption(_e, orderItem.items)"
												>
													<b>옵션 변경</b><i class="ico_toggle"></i>
												</button>
											</div>
											<my-exchange-options :order-item="orderItem"></my-exchange-options>
										</div>
									</li>
								</ul>
							</div>
						</div>
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

				<!-- 교환방법 -->
				<div
					v-if="process.retrieve.isOn"
					class="mm_process-item S=process-on"
				>
					<div class="mm_inner">
						<h3 class="mm_heading m_myclaim-title">
							<b><strong class="mm_text-secondary">교환 방법</strong>을 선택하세요</b>
						</h3>
						<div class="m_myclaim-way">
							<ul>
								<li
									v-for="retrieveMethod in exchangeable.availableRetrieveMethods"
									:key="retrieveMethod.code"
								>
									<form-radio
										v-model="form.retrieve_method_code"
										name="retrieve_way"
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
												need-overlay-hide-first-option
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
												<b>교환 수거지 정보</b>
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
													@click="_e => overlayAddress(_e, 'retrieve_from')"
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
							<!-- (D) 굿스플로 사용하는 브랜드 관리자 상품일 경우 노출합니다. -->
							<ul v-if="exchangeable.availableRetrieveMethods.find(method => method.is_auto_retrieve)">
								<li>배송비 관련 금액이 발생될 경우 추가 결제가 진행됩니다.</li>
								<li>배송비 관련 금액을 동봉하지 마세요.</li>
								<li>상품은 착불로 발송해주세요.</li>
								<li>본 상품은 택배사에 자동으로 교환/수거 접수됩니다.</li>
							</ul>
							<!-- (D) 굿스플로 사용하지 않는 브랜드 관리자 상품일 경우 노출합니다 -->
							<ul>
								<li>배송비 관련 금액이 발생될 경우 추가 결제가 진행됩니다. </li>
								<li>배송비 관련 금액을 동봉하지 마세요.</li>
								<li>상품은 착불로 발송해주세요.</li>
								<li>본 상품은 판매처에서 교환/수거 접수됩니다.</li>
								<li>3일 이내 회수되지 않을 경우 해당 택배사 또는 쇼핑몰 고객센터로 문의해주세요.</li>
								<li>회수 시 발급된 송장번호는 교환 상세내역에서 등록해주세요.</li>
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
				<!-- 교환방법 -->

				<!-- 교환받을주소 -->
				<div
					v-if="process.exchange.isOn"
					class="mm_process-item S=process-on"
				>
					<div class="mm_inner">
						<h3 class="mm_heading m_myclaim-title">
							<b><strong class="mm_text-secondary">교환 상품 받으실 주소</strong>를 설정하세요</b>
						</h3>
						<div class="m_myclaim-exchange-address">
							<div class="mm_order-info">
								<h4>
									<b>교환 수거지 정보</b>
								</h4>
								<table>
									<tbody>
										<tr>
											<th scope="row">
												<b>받는 사람</b>
											</th>
											<td>{{ form.exchange_to.name }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>휴대폰 번호</b>
											</th>
											<td>{{ form.exchange_to.tel }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>주소</b>
											</th>
											<td>{{ form.exchange_to.zip_code }}<br>{{ `${form.exchange_to.base_address} ${form.exchange_to.detail_address}` }}</td>
										</tr>
									</tbody>
								</table>
								<a
									class="mm_btn T=xs T=secondary btn_address-change"
									href="#"
									@click.prevent="_e => overlayAddress(_e, 'exchange_to')"
								>
									<b>주소 변경</b>
								</a>
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
				<!-- 교환받을주소 -->

				<!-- 추가금액결제 -->
				<div
					v-if="process.payment.isOn"
					class="mm_process-item S=process-on"
				>
					<div class="m_myclaim-exchange-cost">
						<h3 class="mm_heading m_myclaim-title">
							<b><strong class="mm_text-secondary">추가 금액</strong>을 결제하세요</b>
						</h3>
						<div class="m_myorder-info">
							<section>
								<h4 class="mm_strapline">
									<b>추가 결제 금액</b>
								</h4>
								<div class="mm_cost">
									<table>
										<tbody>
											<tr
												v-for="detail in additionalPayments.calculate_details"
												:key="detail.label"
											>
												<th scope="row">
													<b>{{ detail.label }}</b>
												</th>
												<td>
													<p class="text_price">
														<strong>{{ number(detail.amount) }}</strong>
													</p>
												</td>
											</tr>
										</tbody>
										<tfoot>
											<tr>
												<th scope="row">
													<b>추가 결제금액</b>
												</th>
												<td>
													<p class="text_price">
														<strong class="mm_text-secondary">{{ number(additionalPayments.total_price) }}</strong>
													</p>
												</td>
											</tr>
										</tfoot>
									</table>
								</div>
							</section>
							<section v-if="additionalPayments.total_price">
								<h4 class="mm_strapline">
									<b>결제방법 선택</b>
								</h4>
								<div class="m_myclaim-way">
									<ul>
										<li>
											<form-radio
												v-model.boolean="isPayNow"
												name="payment"
												:value="true"
											>
												<b class="mm_block">
													<i class="ico_form-radio"></i>
													<span class="text_label">즉시 결제</span>
												</b>
											</form-radio>
											<div
												v-if="isPayNow"
												class="S=radio-use"
											>
												<form-select
													v-model="paymentForm.card_code"
													title="카드사"
													use-overlay
													need-overlay-hide-first-option
												>
													<option value="null">
														카드를 선택하세요
													</option>
													<option
														v-for="card in creditCards"
														:key="card.code"
														:value="card.code"
													>
														{{ card.label }}
													</option>
												</form-select>
											</div>
										</li>
										<li>
											<form-radio
												v-model.boolean="isPayNow"
												name="payment"
												:value="false"
											>
												<b class="mm_block">
													<i class="ico_form-radio"></i>
													<span class="text_label">판매자와 협의 후 결제</span>
												</b>
											</form-radio>
										</li>
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
										<button
											type="button"
											class="mm_btn T=primary"
											@click="apply"
										>
											<b>{{ isProceedPayments ? '결제하기' : '교환 신청하기' }}</b>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 추가금액결제 -->
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, watch, computed, defineAsyncComponent } from 'vue';
	import { useStorage } from '@vueuse/core';
	import { useExchangeStore } from '$/stores/useExchangeStore';
	import { usePayingProcessContextStore } from '$/stores/usePayingProcessContextStore';
	import { useAppBridge } from '$/composables/useAppBridge';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useForm } from '$/composables/useForm';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyOrder } from '$/composables/useMyOrder';
	import { usePopupWindow } from '$/composables/usePopupWindow';
	import { STORE_BASE_KEY, STORE_PAY_PROCESS_CONTEXT_KEY } from '$/constants';
	import Layout from '@/component/layout/Layout.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import PageMove from '@/component/PageMove.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormRadio from '@/component/form/FormRadio.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import FormText from '@/component/form/FormText.vue';
	import FormTextarea from '@/component/form/FormTextarea.vue';
	import MyExchangeOptions from '@/page/mypage/order/component/MyExchangeOptions.vue';
	import MyOrderItem from '@/page/mypage/order/component/MyOrderItem.vue';
	/** 교환 단계 */
	type ExchangeProcess = 'orderItems' | 'option' | 'reason' | 'retrieve' | 'exchange' | 'payment';

	const props = defineProps<{
		orderId: string;
		orderItemId: number;
	}>();
	/** 지불 시작여부 */
	const payingStart = ref<boolean>(false);
	const { number, date } = useFormatter();
	const { bom, loading, router, openOverlay } = useGlobalPageContext();
	const {
		defaultExchangeAdditionalPayments,
		getExchangeReason,
		getExchangeable,
		applyExchange,
		getExchangePaymentInfo,
		getDeliveryCompanies,
		getPayMethods,
		prepareExchangePay,
		getExchangePayResult,
		validateInvoice,
	} = useMyOrder();

	const [
		exchangeReasons,
		exchangeable,
		deliveryCompanies,
		payMethods,
	] = await Promise.all([
		getExchangeReason(),
		(async () => {
			try {
				return await getExchangeable(props.orderId, props.orderItemId);
			}
			catch (e) {
				useErrorAlert(e, {
					httpCatcher: {
						404: '교환할할 상품이 없습니다.',
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
		getDeliveryCompanies(),
		getPayMethods(),
	]);

	/** 교환할 상품 선택 form */
	const orderItemSelectForm = ref<{
		orderItemSetIds: number[];
		exchangeEas: Record<string, number>;
	}>({
		orderItemSetIds: [],
		exchangeEas: {},
	});

	/** 사유상세 필요여부 */
	const reasonDetailRequired = computed(() => exchangeReasons.find(reason => reason.code === form.value.reason_code)?.require_detail || false);
	/** 주문자회수 여부 */
	const isRetrievedByOrderer = computed<boolean>(() => {
		return exchangeable.availableRetrieveMethods.find(method => form.value.retrieve_method_code == method.code)?.is_retrieve_by_orderer === true;
	});
	/** 옵션 변경할 주문상품묶음 */
	const selectedPacks = ref<ExchangeableOrderSet['packs']>([]);
	/** 동일옵션 선택 가능 여부 */
	const isSameOptionSelectable = computed<boolean>(() => {
		return exchangeReasons.find(reason => form.value.reason_code == reason.code && reason.is_same_option_exchangeable) ? true : false;
	});

	/** 바로결제 여부 */
	const isPayNow = ref<boolean>(true);
	/** 교환 추가결제 진행 여부 */
	const isProceedPayments = computed(() => additionalPayments.value.total_price > 0 && isPayNow.value);
	/** 교환 추가 결제 금액 정보 */
	const additionalPayments = ref<ExchangePaymentInfo>(defaultExchangeAdditionalPayments);
	/** 신용카드 리스트 */
	const creditCards = computed<PayMethod['child_methods']>(() => {
		return (payMethods.find(method => method.eng_label === 'credit_card')?.child_methods) || [];
	});

	/** 교환신청 form */
	const { form, validate } = useForm<ExchangeForm & {
		is_self_retrieve: 1 | 0;
	}>(
		{
			order_id: props.orderId,
			exchange_option_pair: [],
			reason_code: exchangeReasons[0].code,
			reason_detail: '',
			retrieve_method_code: exchangeable.availableRetrieveMethods[0].code,
			retrieve_invoice: {
				delivery_company: '',
				invoice_number: '',
			},
			retrieve_from: {
				...exchangeable.order.shipping_address,
			},
			exchange_to: {
				...exchangeable.order.shipping_address,
			},
			is_additional_payment_paid: false,
			payment_token: '',
			is_self_retrieve: 0,
		},
		{
			rule: {},
			message: {
				'exchange_option_pair.required': ':param(을/를) 선택해주세요.',
				'exchange_option_pair.*.order_item_id.required': ':param(을/를) 선택해주세요.',
				'exchange_option_pair.*.option_id.required': ':param(을/를) 선택해주세요.',
				'reason_code.in': ':param(이/가) 올바르지 않습니다.',
				'reason_code.required': ':param(을/를) 선택해주세요.',
				'retrieve_invoice.delivery_company.requiredIf': ':param(을/를) 선택해주세요.',
			},
		}
	);

	/** 교환 결제 form */
	const { form: paymentForm, validate: validatePaymentForm } = useForm<ExchangePaymentForm['payment_info']>(
		{

			card_code: null,
			interest_month: 0,
			is_interest_free: false,
			is_partial_interest_free: false,
			payment_price: 0,
		},
		{
			rule: {
				'card_code(결제수단)': ['required'],
			},
			message: {
				'card_code.required': ':param(을/를) 선택해주세요.',
				'card_code.in': ':param(이/가) 올바르지 않습니다.',
			},
		}
	);

	const baseValidationRules: Record<string, Record<string, string[]>> = {
		order_items: {
			'exchange_option_pair(주문 교환하실 상품)': ['required'],
		},
		exchange_options: {
			'exchange_option_pair.*.order_item_id(주문 교환하실 상품)': ['required'],
			'exchange_option_pair.*.option_id(주문 교환하실 옵션)': ['required'],
		},
		reason: {
			'reason_code(주문 교환 사유)': ['required'],
			'reason_detail(주문 교환 사유)': [`requiredIf:reason_code,${exchangeReasons.filter(reason => reason.require_detail).map(reason => reason.code).join(',')}`],
		},
		retrieve: {
			// 반품송장정보
			'retrieve_invoice.delivery_company(택배사)': ['requiredIf:is_self_retrieve,1'],
			'retrieve_invoice.invoice_number(송장번호)': ['requiredIf:is_self_retrieve,1'],
			// 반품수거지 정보
			'retrieve_from.name(교환 수거지 주문자명)': ['requiredIf:is_self_retrieve,0', 'maxLength:50'],
			'retrieve_from.tel(교환 수거지 연락처)': ['requiredIf:is_self_retrieve,0', 'number', 'maxLength:12'],
			'retrieve_from.zip_code(교환 수거지 우편번호)': ['requiredIf:is_self_retrieve,0'],
			'retrieve_from.base_address(교환 수거지 주소)': ['requiredIf:is_self_retrieve,0'],
			'retrieve_from.detail_address(교환 수거지 상세주소)': ['requiredIf:is_self_retrieve,0', 'maxLength:100'],
		},
		exchange: {
			'exchange_to.name(교환 배송지 주문자명)': ['requiredIf:is_self_retrieve,0', 'maxLength:50'],
			'exchange_to.tel(교환 배송지 연락처)': ['requiredIf:is_self_retrieve,0', 'number', 'maxLength:12'],
			'exchange_to.zip_code(교환 배송지 우편번호)': ['requiredIf:is_self_retrieve,0'],
			'exchange_to.base_address(교환 배송지 주소)': ['requiredIf:is_self_retrieve,0'],
			'exchange_to.detail_address(교환 배송지 상세주소)': ['requiredIf:is_self_retrieve,0', 'maxLength:100'],
		},
	};

	/** 교환 진행단계 */
	const currentProcess = ref<ExchangeProcess>('orderItems');
	const process = ref<{
		[processName in ExchangeProcess]: {
			isOn: boolean;
			rules: Record<string, string[]>;
			next: Nullable<ExchangeProcess>;
			previous: Nullable<ExchangeProcess>;
		}
	}>({
		orderItems: {
			isOn: true,
			rules: baseValidationRules.order_items,
			next: 'reason',
			previous: null,
		},
		reason: {
			isOn: false,
			rules: baseValidationRules.reason,
			next: 'option',
			previous: 'orderItems',
		},
		option: {
			isOn: false,
			rules: baseValidationRules.exchange_options,
			next: 'retrieve',
			previous: 'reason',
		},
		retrieve: {
			isOn: false,
			rules: baseValidationRules.retrieve,
			next: 'exchange',
			previous: 'option',
		},
		exchange: {
			isOn: false,
			rules: baseValidationRules.exchange,
			next: 'payment',
			previous: 'retrieve',
		},
		payment: {
			isOn: false,
			rules: baseValidationRules.refund,
			next: null,
			previous: 'exchange',
		},
	});

	const overlayAddress = (_e: MouseEvent, target: 'retrieve_from' | 'exchange_to') => {
		openOverlay(defineAsyncComponent(() => import('@/page/address/Address.vue')), {
			clickElement: _e.currentTarget,
			onClose: async (_value: { newAddress: MyShippingAddressDetail }) => {
				const newAddress = _value.newAddress;
				if (!newAddress) {
					return;
				}

				form.value[target] = {
					...newAddress,
				};
			},
		});
	};

	const overlayMyOrderExchangeCreateOption = (_e: MouseEvent, orderItems: ExchangeableOrderItem[]) => {
		openOverlay(defineAsyncComponent(() => import('@/page/mypage/order/exchange/create/option/MyOrderExchangeCreateOption.vue')), {
			clickElement: _e.currentTarget,
			props: {
				orderItems,
				isSameOptionSelectable: isSameOptionSelectable.value,
			},
			onClose: (_value: { selected: Record<string, number> }) => {
				if (!_value.selected) {
					return;
				}

				const orderItemIds = Object.keys(_value.selected).map(selected => Number(selected));

				form.value.exchange_option_pair = form.value.exchange_option_pair
					.filter((pair) => !orderItemIds.includes(pair.order_item_id));

				orderItems.forEach(item => {
					const selectedOptionId = _value.selected[item.id];
					if (!selectedOptionId) {
						return;
					}

					item.exchange_option = item.exchangeable_options.find(option => option.id == selectedOptionId) || null;
					form.value.exchange_option_pair = form.value.exchange_option_pair.concat([{
						order_item_id: item.id,
						option_id: selectedOptionId,
					}]);
				});
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
				if (nextStep == 'payment') {
					await fetchAdditionalPayments();
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
	/** 추가결제금액 조회 */
	async function fetchAdditionalPayments() {
		try {
			await validate(Object.assign(
				baseValidationRules.exchange_options,
				baseValidationRules.reason,
				baseValidationRules.retrieve,
				baseValidationRules.exchange
			));
		}
		catch (e) {
			return;
		}

		// 조회
		try {
			additionalPayments.value = await getExchangePaymentInfo(props.orderId, {
				exchange_options: form.value.exchange_option_pair,
				exchange_reason_code: form.value.reason_code,
				retrieve_method: form.value.retrieve_method_code,
				retrieve_from: form.value.retrieve_from,
				exchange_to: form.value.exchange_to,
			});
		}
		catch (e) {
			useErrorAlert(e);
			additionalPayments.value = defaultExchangeAdditionalPayments;
		}
	}

	const exchangeStore = useExchangeStore();
	const payingProcessContext = usePayingProcessContextStore();
	const sate = useStorage(
		`${STORE_BASE_KEY}${STORE_PAY_PROCESS_CONTEXT_KEY}`,
		{ payingProcessContext: null, isCurrentProcessEnded: false },
		localStorage,
		{
			listenToStorageChanges: true,
		});

	const inAppProcessWatcherStop = watch(sate, async (to) => {
		if (to.payingProcessContext && to.isCurrentProcessEnded) {
			try {
				const { is_success, error_message } = await getExchangePayResult(form.value.payment_token);
				if (!is_success) {
					loading.hide();
					throw new Error(error_message);
				}

				form.value.is_additional_payment_paid = true;
				const exchangeId = await applyExchange(form.value);
				router.replace({
					name: 'MyOrderExchangeSuccess',
					params: {
						order_id: props.orderId,
						exchange_id: exchangeId,
					},
				}).then(() => loading.hide());
			}
			catch (e) {
				loading.hide();
				useErrorAlert(e);
			}
		}
	}, {
		deep: true,
	});
	const { isAppUser, openWebview } = useAppBridge();

	if (!isAppUser) {
		inAppProcessWatcherStop();
	}

	const enterUrl = ref<string | undefined>(undefined);
	/** 교환 신청 */
	async function apply() {
		try {
			await validate();
			if (isProceedPayments.value) {
				await validatePaymentForm();
			}
		}
		catch (e) {
			useErrorAlert(e);

			return;
		}

		bom.confirm('주문 교환을 진행하시겠습니까?', async (flag) => {
			if (!flag) return;
			loading.show();
			try {
				/** 결제가 필요없는 경우는 바로 처리 * */
				if (!isProceedPayments.value) {
					const exchangeId = await applyExchange(form.value);
					router.replace({
						name: 'MyOrderExchangeSuccess',
						params: {
							order_id: props.orderId,
							exchange_id: exchangeId,
						},
					}).then(() => loading.hide());

					return;
				}

				/** 실제 지불금액 설정 */
				payingProcessContext.clearContext();
				payingStart.value = true;
				paymentForm.value.payment_price = additionalPayments.value.total_price;
				const popupWindow = usePopupWindow(`paying-action`, enterUrl);
				const { paying_url, payment_token } = await prepareExchangePay({
					order_id: props.orderId,
					payment_info: paymentForm.value,
					exchange_form: form.value,
					fe_redirect_url: `${location.origin}${router.resolve({
						name: 'ExchangeEndBridge',
						params: {
							order_id: props.orderId,
							item_id: props.orderItemId,
						},
					}).fullPath}`,
				});
				form.value.payment_token = payment_token;
				exchangeStore.setForm(form.value);

				if (isAppUser) {
					openWebview(`${router.resolve({
						name: 'ExchangePrepareBridge',
						params: {
							order_id: props.orderId,
						},
						query: {
							paying_url: paying_url,
						},
					}).fullPath}`);
					loading.hide();

					return;
				}

				if (!popupWindow) {
					return;
				}

				try {
					const popupPromise = popupWindow.open();
					enterUrl.value = `${router.resolve({
						name: 'ExchangePrepareBridge',
						params: {
							order_id: props.orderId,
						},
						query: {
							paying_url: paying_url,
						},
					}).fullPath}`;
					loading.hide();
					const { popupWindowClosed } = await popupPromise;
					const { is_success, error_message } = await getExchangePayResult(payment_token);

					if (!is_success) {
						throw new Error(error_message);
					}

					if (popupWindowClosed && is_success) {
						payingStart.value = false;
						form.value.is_additional_payment_paid = true;
						const exchangeId = await applyExchange(form.value);
						router.replace({
							name: 'MyOrderExchangeSuccess',
							params: {
								order_id: props.orderId,
								exchange_id: exchangeId,
							},
						}).then(() => loading.hide());
					}
				}
				catch (e) {
					loading.hide();
					if (!isAppUser) {
						payingStart.value = false;
						popupWindow.close();
					}
					useErrorAlert(e);
				}
			}
			catch (e) {
				loading.hide();
				useErrorAlert(e);
			}
		});
	}

	/** 상품 default 선택처리 */
	exchangeable.order.packs.forEach(pack => {
		pack.order_items.forEach(set => {
			set.items.forEach(item => {
				if (item.id == props.orderItemId) {
					orderItemSelectForm.value.orderItemSetIds = [set.id];
				}
			});
		});
	});

	/** 주문자 회수 여부 FORM 에 적용 */
	watch(isRetrievedByOrderer, () => {
		form.value.is_self_retrieve = isRetrievedByOrderer.value ? 1 : 0;
	}, {
		immediate: true,
	});

	/** 주문상품 선택 > 교환 form 적용 */
	watch(orderItemSelectForm, (itemSelectForm) => {
		const clonedOrder: ExchangeableOrderSet = JSON.parse(JSON.stringify(exchangeable.order));
		let selectedOrderItemIds: number[] = [];

		selectedPacks.value = clonedOrder.packs.filter(pack => {
			pack.order_items = pack.order_items.filter(itemSet => {
				itemSet.items = itemSet.items.slice(0, (Number(itemSelectForm.exchangeEas[itemSet.id]) || 1));
				itemSet.total_paid_price = itemSet.items.reduce((sum, current) => sum += current.paid_price, 0);
				itemSet.goods.ea = itemSet.items.length;

				const isSelected = itemSelectForm.orderItemSetIds.find(setId => setId == itemSet.id);
				if (isSelected) {
					selectedOrderItemIds = selectedOrderItemIds.concat(itemSet.items.map(item => item.id));
				}

				return isSelected;
			});

			return pack.order_items.length > 0 ;
		});

		form.value.exchange_option_pair = selectedOrderItemIds.map(itemId => ({
			order_item_id: itemId,
			option_id: null,
		}));
	}, {
		immediate: true,
		deep: true,
	});

	function endProcess() {
		if (isAppUser) {
			payingProcessContext.endProcessContext(`${props.orderId}_${props.orderItemId}`);
		}
		payingStart.value = false;
	}
</script>