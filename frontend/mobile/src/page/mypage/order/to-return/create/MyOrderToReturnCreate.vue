<template>
	<layout
		title="반품 전환"
		layout="popup"
	>
		<div
			v-if="switchReturnable.order.packs.length"
			class="mm_process"
		>
			<!-- 상품 선택 -->
			<div
				v-if="process.orderItems.isOn"
				class="mm_process-item S=process-on"
			>
				<!-- 주문목록 -->
				<div class="mm_order-item">
					<div class="mm_order-item-head">
						<p class="text_date">
							{{ date(switchReturnable.order.ordered_at, 'YYYY.MM.DD') }}
						</p>
						<dl><dt>주문번호</dt><dd>{{ switchReturnable.order.order_id }}</dd></dl>
					</div>
					<div
						v-for="pack in switchReturnable.order.packs"
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
										:value="orderItem.exchange_target_id"
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
												<b>반품 수량: {{ partialSelectedOrderItems[orderItem.exchange_target_id]?.length || 0 }}개</b>
												<button
													type="button"
													class="mm_btn T=xs T=secondary"
													@click="_e => overlayMyReturnChoice(_e, orderItem)"
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
							icon-class="T=sm"
						>
							<template #button>
								<i class="ico_info"></i><b>반품 전환 주의사항</b>
							</template>
							<template #content>
								<ul>
									<li>반품 전환하신 상품은 바로 반품 완료 처리가 진행됩니다.</li>
								</ul>
							</template>
						</dropdown>
					</div>
				</div>
			</div>

			<!-- 반품 사유 -->
			<div
				v-if="process.reason.isOn"
				class="mm_process-item S=process-on"
			>
				<div class="mm_inner">
					<h3 class="mm_heading m_myclaim-title">
						<b><strong class="mm_text-secondary">반품 사유</strong>를 확인하세요</b>
					</h3>
					<div class="m_myclaim-reason">
						<ul>
							<li
								v-for="reason in returnReasons"
								:key="reason.code"
							>
								<form-radio
									v-model="switchReturnable.chosenExchangeReason.eng_label"
									name="claim_reason"
									:value="reason.eng_label"
									selected-disabled
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
							v-if="showReasonDetail"
							class="m_myclaim-reason-write S=on"
						>
							<h6 class="mm_strapline">
								<b>상세사유</b><strong>(필수)</strong>
							</h6>
							<p class="text_readonly T=teatarea">
								<b>{{ switchReturnable.chosenExchangeReason.detail }}</b>
							</p>
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
													<strong class="mm_text-secondary">{{ number(refundInfo.refund_price + refundInfo.refund_star_point + refundInfo.refund_reward_point) }}</strong>
												</p>
											</td>
										</tr>
									</tfoot>
								</table>
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
												<b>{{ switchReturnable.order.payment_method_label }} 환불</b>
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
										<b>반품 전환하기</b>
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
	import { ref, watch, watchEffect, computed, defineAsyncComponent } from 'vue';
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
	import MyOrderItem from '@/page/mypage/order/component/MyOrderItem.vue';

	/** 반품전환 단계 */
	type SwitchReturnProcess = 'orderItems' | 'reason' | 'refund';

	const props = defineProps<{
		exchangeId: string;
		exchangeTargetId: number;
	}>();

	const { date, number } = useFormatter();
	const { bom, loading, router, openOverlay } = useGlobalPageContext();
	const {
		defaultRefundInfo,
		getReturnReasons,
		getExchangeToReturnable,
		applyExchangeToReturn,
		getExchangeToReturnRefundInfo,
		getRefundCalculations,
	} = useMyOrder();
	const { get: getMyRefundAccount, getBankCodes } = useMyRefundAccount();

	const [returnReasons, switchReturnable, myRefundAccount] = await Promise.all([
		getReturnReasons(),
		(async () => {
			try {
				const switchReturnable = await getExchangeToReturnable(props.exchangeId);
				if (switchReturnable.order.packs.length < 1) {
					throw Error('반품전환할 상품이 없습니다.');
				}

				return switchReturnable;
			}
			catch (e) {
				useErrorAlert(e, {
					httpCatcher: {
						404: '반품전환할 상품이 없습니다.',
					},
					alertCallback: () => {
						router.go(-1);
					},
				});

				const defaultOrder: ExchangeToReturnableOrderSet = {
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
				};
				const chosenReason: ChosenExchangeReason = {
					code: 0,
					label: '',
					eng_label: 'change_mind',
					detail: '',
				};

				return {
					order: defaultOrder,
					chosenExchangeReason: chosenReason,
				};
			}
		})(),
		getMyRefundAccount(),
	]);

	/** 환불정보 */
	const refundInfo = ref(defaultRefundInfo);
	/** 환불계좌 */
	const refundAccount = ref(myRefundAccount);
	/** 은행코드 */
	const bankCodes = ref<BankCode[]>([]);
	/** 선택된 주문묶음 */
	const selectedOrderItemSetIds = ref<number[]>([]);
	/** 부분선택된 주문상품 */
	const partialSelectedOrderItems = ref<Record<string, number[]>>({});
	/** 상세사유 노출 여부 (교환시 선택한 사유가 상세사유 필수인 경우 노출) */
	const showReasonDetail = computed<boolean>(() => {
		return returnReasons.find(reason => switchReturnable.chosenExchangeReason.eng_label == reason.eng_label)?.require_detail || false;
	});
	/** 반품전환 신청 form */
	const { form, validate } = useForm<ExchangeToReturnForm>(
		{
			exchange_id: props.exchangeId,
			exchange_target_ids: [],
			refund_account: {
				owner_name: myRefundAccount?.owner_name || '',
				bank_code: myRefundAccount?.bank_code || null,
				account_number: myRefundAccount?.account_number || '',
			},
		},
		{
			rule: {},
			message: {
				'exchange_target_ids.required': ':param(을/를) 선택해주세요.',
				'refund_account.owner_name.required': ':param(을/를) 등록해주세요.',
				'refund_account.bank_code.required': ':param(을/를) 등록해주세요.',
				'refund_account.account_number.required': ':param(을/를) 등록해주세요.',
			},
		}
	);
	/** 유효성검사 규칙 */
	const baseValidationRules: Record<string, Record<string, string[]>> = {
		order_item_ids: {
			'exchange_target_ids(반품 전환하실 상품)': ['required'],
		},
		refund: {
			'refund_account.owner_name(환불계좌)': ['required'],
			'refund_account.bank_code(환불계좌)': ['required'],
			'refund_account.account_number(환불계좌)': ['required'],
		},
	};

	/** 반품전환 단계 */
	const currentProcess = ref<SwitchReturnProcess>('orderItems');
	const process = ref<{
		[processName in SwitchReturnProcess]: {
			isOn: boolean;
			rules: Record<string, string[]>;
			next: Nullable<SwitchReturnProcess>;
			previous: Nullable<SwitchReturnProcess>;
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
			rules: {},
			next: 'refund',
			previous: 'orderItems',
		},
		refund: {
			isOn: false,
			rules: baseValidationRules.refund,
			next: null,
			previous: 'reason',
		},
	});

	const overlayMyReturnChoice = (_e: MouseEvent, orderItemSet: ExchangeToReturnableOrderItemSet) => {
		openOverlay(defineAsyncComponent(() => import('@/page/mypage/order/pick/MyOrderPick.vue')), {
			clickElement: _e.currentTarget,
			props: {
				valueName: 'exchange_target_id',
				orderItemSet,
				legacySelected: partialSelectedOrderItems.value[orderItemSet.exchange_target_id],
			},
			onClose: (_value: { selected: number[] }) => {
				if (!_value.selected || _value.selected.length <= 0) {
					return;
				}

				partialSelectedOrderItems.value[orderItemSet.exchange_target_id] = _value.selected;
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

	/** 단계 진행 */
	async function processTo(forward: boolean = true) {
		const nextStep = process.value[currentProcess.value].next;
		const previousStep = process.value[currentProcess.value].previous;

		if (forward && nextStep) {
			try {
				await validate(process.value[currentProcess.value].rules);
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

	/** 반품전환 신청 */
	async function apply() {
		try {
			await validate(Object.assign(
				baseValidationRules.order_item_ids,
				baseValidationRules.refund
			));
		}
		catch (e) {
			useErrorAlert(e);

			return;
		}

		bom.confirm('주문 반품전환을 진행하시겠습니까?', async (flag) => {
			if (!flag) return;

			loading.show();
			try {
				const returnId = await applyExchangeToReturn(form.value);
				router.replace({
					name: 'MyOrderToReturnSuccess',
					params: {
						exchange_id: props.exchangeId,
						return_id: returnId,
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
	switchReturnable.order.packs.forEach(pack => {
		pack.order_items.forEach(set => {
			if (set.items.length == 1) {
				partialSelectedOrderItems.value[set.exchange_target_id] = [set.exchange_target_id];
			}
			else {
				partialSelectedOrderItems.value[set.exchange_target_id] = [];
			}

			set.items.forEach(item => {
				if (item.exchange_target_id == props.exchangeTargetId && set.exchange_target_id) {
					partialSelectedOrderItems.value[set.exchange_target_id] = [props.exchangeTargetId];
					selectedOrderItemSetIds.value = [set.exchange_target_id];
				}
			});
		});
	});

	/** 선택한 주문상품 form에 동기화 */
	watchEffect(() => {
		form.value.exchange_target_ids = selectedOrderItemSetIds.value
			.map((setId) => partialSelectedOrderItems.value[setId])
			.flat(1);
	});

	/** 환불정보 조회 */
	watch(
		() => process.value.refund.isOn,
		async (to) => {
			if (!to) {
				return;
			}

			if (form.value.exchange_target_ids.length < 1) {
				refundInfo.value = defaultRefundInfo;

				return;
			}

			try {
				refundInfo.value = await getExchangeToReturnRefundInfo(props.exchangeId, form.value.exchange_target_ids);
			}
			catch (e) {
				useErrorAlert(e);
				refundInfo.value = defaultRefundInfo;
			}
		}
	);
</script>