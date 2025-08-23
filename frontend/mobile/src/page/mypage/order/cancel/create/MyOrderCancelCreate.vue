<template>
	<layout
		title="주문 취소"
		layout="popup"
	>
		<div
			v-if="cancelableOrder.packs.length"
			class="m_myclaim-cancel"
		>
			<!-- 주문목록 -->
			<!-- (D) '입금 대기' 상태일 경우 상단에 상품선택 체크박스는 노출하지 않습니다. -->
			<div class="mm_order-item">
				<div class="mm_order-item-head">
					<p class="text_date">
						{{ date(cancelableOrder.ordered_at, 'YYYY.MM.DD') }}
					</p>
					<dl><dt>주문번호</dt><dd>{{ cancelableOrder.order_id }}</dd></dl>
				</div>
				<div
					v-for="pack in cancelableOrder.packs"
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
									v-if="partialCancelable"
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
										v-if="partialCancelable && orderItem.items.length > 1"
										class="mm_product-unit-indent"
									>
										<p class="text_amount">
											<b>취소 수량: {{ partialSelectedOrderItems[orderItem.id]?.length || 0 }}개</b>
											<button
												type="button"
												class="mm_btn T=xs T=secondary"
												@click="_e => overlayMyCancelChoice(_e, orderItem)"
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
			<hr class="mm_line">

			<!-- 취소신청 -->
			<div class="m_myorder-info">
				<section>
					<h6 class="mm_strapline">
						<b>취소 사유</b>
					</h6>
					<h6 class="mm_text-label T=sm">
						<b>취소 사유</b>
					</h6>
					<div class="m_myclaim-cancel-reason">
						<form-select
							v-model.number="form.cancel_reason_code"
							title="취소사유"
							use-overlay
							need-overlay-hide-first-option
						>
							<option :value="null">
								취소 사유를 선택하세요
							</option>
							<option
								v-for="reason in cancelReasons"
								:key="reason.code"
								:value="reason.code"
							>
								{{ reason.label }}
							</option>
						</form-select>
						<div
							v-if="reasonDetailRequired"
							class="m...reason-write S=on"
						>
							<form-textarea
								v-model="form.cancel_reason_detail"
								placeholder="취소 사유를 입력하세요(필수입력)"
								:byte="2000"
							></form-textarea>
						</div>
					</div>
				</section>
				<hr class="mm_line">

				<section v-if="cancelableOrder.is_paid">
					<h6 class="mm_strapline">
						<b>환불 정보</b>
					</h6>
					<div class="mm_cost">
						<table>
							<tbody>
								<tr>
									<th scope="row">
										<b>{{ cancelableOrder.payment_method_label }} 환불</b>
									</th>
									<td>
										<p class="text_price">
											<strong>{{ number(totalRefundAmount) }}</strong>
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
								<tr>
									<th scope="row">
										<b>환불 예상금액</b>
									</th>
									<td>
										<p class="text_price">
											<strong class="mm_text-secondary">{{ number(refundInfo.refund_price + refundInfo.refund_star_point + refundInfo.refund_reward_point) }}</strong>
										</p>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>
				<template v-if="form.require_refund_account">
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
					</section>
				</template>
			</div>
			<div class="mm_inner">
				<div class="mm_foot">
					<div class="mm_btn_box">
						<button
							type="button"
							class="mm_btn T=primary"
							@click="apply"
						>
							<b>취소 신청하기</b>
						</button>
					</div>
				</div>
				<div class="mm_note">
					<dropdown
						:is-active="true"
						icon-class="T=sm"
					>
						<template #button>
							<i class="ico_info"></i><b>주문 취소 주의사항</b>
						</template>
						<template #content>
							<ul>
								<li>취소 시, 결제 수단의 경우 원 결제 수단 취소로 진행됩니다.</li>
								<!-- <li>휴대폰 주문은 결제한 당월이 지날 경우 원 결제 취소가 불가합니다.</li> -->
							</ul>
						</template>
					</dropdown>
				</div>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, defineAsyncComponent, computed, watchEffect, watch } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useForm } from '$/composables/useForm';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyOrder } from '$/composables/useMyOrder';
	import { useMyRefundAccount } from '$/composables/useMyRefundAccount';
	import Layout from '@/component/layout/Layout.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import FormTextarea from '@/component/form/FormTextarea.vue';
	import MyOrderItem from '@/page/mypage/order/component/MyOrderItem.vue';

	const props = defineProps<{
		orderId: string;
		orderItemId: number;
	}>();

	const { date, number } = useFormatter();
	const { bom, loading, router, openOverlay } = useGlobalPageContext();
	const { get: getMyRefundAccount, getBankCodes } = useMyRefundAccount();
	const {
		defaultRefundInfo,
		getCancelReasons,
		getCancelables,
		getCancelRefundInfo,
		getRefundCalculations,
		applyCancel,
	} = useMyOrder();

	const [cancelReasons, pCancelableOrder, myRefundAccount] = await Promise.all([
		getCancelReasons(),
		(async () => {
			try {
				const cancelables = await getCancelables(props.orderId, props.orderItemId);
				if (cancelables.packs.length < 1) {
					throw Error('취소할 상품이 없습니다.');
				}

				return cancelables;
			}
			catch (e) {
				useErrorAlert(e, {
					httpCatcher: {
						404: '취소할 상품이 없습니다.',
					},
					alertCallback: () => {
						router.go(-1);
					},
				});

				return {
					is_paid: false,
					is_partial_cancelable: false,
					order_id: '',
					ordered_at: '',
					packs: [],
					payment_method_label: '',
					require_refund_account: false,
				};
			}
		})(),
		getMyRefundAccount(),
	]);

	const cancelableOrder = pCancelableOrder;
	const refundInfo = ref(defaultRefundInfo);
	const refundAccount = ref(myRefundAccount);
	const bankCodes = ref<BankCode[]>([]);

	const { form, validate } = useForm<CancelForm & {
		require_refund_account: 1 | 0;
	}>(
		{
			order_id: props.orderId,
			order_item_ids: [],
			cancel_reason_code: null,
			cancel_reason_detail: '',
			refund_account_owner_name: refundAccount.value?.owner_name || '',
			refund_bank_code: refundAccount.value?.bank_code || null,
			refund_account_number: refundAccount.value?.account_number || '',
			require_refund_account: cancelableOrder.require_refund_account ? 1 : 0,
		},
		{
			rule: {
				'order_item_ids(주문 취소하실 상품)': ['required'],
				'cancel_reason_code(주문 취소 사유)': ['required', `in:${cancelReasons.map(reason => reason.code).join(',')}`],
				'cancel_reason_detail(주문 취소 사유)': [`requiredIf:cancel_reason_code,${cancelReasons.filter(reason => reason.require_detail).map(reason => reason.code).join(',')}`],
				'refund_account_owner_name(환불계좌)': ['requiredIf:require_refund_account,1'],
				'refund_bank_code(환불계좌)': ['requiredIf:require_refund_account,1'],
				'refund_account_number(환불계좌)': ['requiredIf:require_refund_account,1'],
			},
			message: {
				'order_item_ids.required': ':param(을/를) 선택해주세요.',
				'cancel_reason_code.required': ':param(을/를) 선택해주세요.',
				'cancel_reason_code.in': ':param(이/가) 올바르지 않습니다.',
				'refund_account_owner_name.requiredIf': ':param(을/를) 등록해주세요.',
				'refund_bank_code.requiredIf': ':param(을/를) 등록해주세요.',
				'refund_account_number.requiredIf': ':param(을/를) 등록해주세요.',
			},
		}
	);

	/** 선택된 주문묶음 */
	const selectedOrderItemSetIds = ref<number[]>([]);
	/** 부분선택가능 */
	const partialCancelable = ref(cancelableOrder.is_paid);
	/** 사유상세 필요여부 */
	const reasonDetailRequired = computed(() => cancelReasons.find(reason => reason.code === form.value.cancel_reason_code)?.require_detail || false);
	/** 총 환불금액 */
	const totalRefundAmount = computed(() => getRefundCalculations(refundInfo.value).totalRefund);
	/** 부분선택된 주문상품 */
	const partialSelectedOrderItems = ref<Record<string, number[]>>({});
	// 취소신청 가능여부 (입금대기주문 or 적립금 제외 환불금액 0원 이상)
	const isCancelable = computed(() => !cancelableOrder.is_paid || refundInfo.value.refund_price >= 0);

	/** 주문상품 선택 overlay open */
	const overlayMyCancelChoice = (_e: MouseEvent, orderItemSet: CancelableOrderItemSet) => {
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

	async function apply() {
		if (!isCancelable.value) {
			bom.alert('적립금을 제외한 환불금액이 0원 이하일 경우 취소 신청이 불가합니다.');
		}

		try {
			await validate();
		}
		catch (e) {
			useErrorAlert(e);

			return;
		}

		bom.confirm('주문 취소를 진행하시겠습니까?', async (flag) => {
			if (!flag) return;

			loading.show();
			try {
				const cancelIds = await applyCancel(form.value);
				router.replace({
					name: 'MyOrderCancelSuccess',
					params: {
						order_id: props.orderId,
						cancel_ids: cancelIds,
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
	if (partialCancelable.value) {
		cancelableOrder.packs.forEach(pack => {
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
	}
	else {
		cancelableOrder.packs.forEach(pack => {
			pack.order_items.forEach(set => {
				set.items.forEach(item => {
					partialSelectedOrderItems.value[set.id] = (partialSelectedOrderItems.value[set.id] || [])
						.filter(partial => partial != item.id)
						.concat([item.id]);
					selectedOrderItemSetIds.value = selectedOrderItemSetIds.value
						.filter(setId => setId != set.id)
						.concat([set.id]);
				});
			});
		});
	}

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

		form.value.refund_account_number = newAccount.account_number;
		form.value.refund_account_owner_name = newAccount.owner_name;
		form.value.refund_bank_code = newAccount.bank_code;
	});

	/** 환불정보 조회 */
	if (cancelableOrder.is_paid) {
		watch([
			() => form.value.order_item_ids,
			() => form.value.cancel_reason_code,
		], async ([itemIds, reason]) => {
			if (!reason || itemIds.length < 1) {
				refundInfo.value = defaultRefundInfo;

				return;
			}

			try {
				refundInfo.value = await getCancelRefundInfo(props.orderId, itemIds, reason);
			}
			catch (e) {
				useErrorAlert(e);
				refundInfo.value = defaultRefundInfo;
			}
		});
	}
</script>