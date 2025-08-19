<template>
	<div class="m_myclaim">
		<h3>
			<b>신고 가능 주문 수</b><strong class="mm_text-secondary">{{ number(paginator.total) }}개</strong>
		</h3>

		<!-- 신고 가능 주문 목록 -->
		<template v-if="paginator.data.length === 0">
			<p class="mm_text-none T=sm">
				<i class="ico_text-none"></i>품절취소 신고 가능 주문이 없습니다
			</p>
		</template>
		<template v-else>
			<div
				v-for="order in paginator.data"
				:key="order.order_id"
				class="mm_order-item"
			>
				<div class="mm_order-item-head">
					<p class="text_date">
						{{ date(order.paid_at, 'YYYY.MM.DD') }}
					</p>
					<dl><dt>주문번호</dt><dd>{{ order.order_id }}</dd></dl>
				</div>
				<template
					v-for="pack in order.packs"
					:key="pack.shipping_rule_id"
				>
					<div
						v-for="seller in pack.sellers"
						:key="seller.id"
						class="mm_order-item-seller"
					>
						<div class="mm_order...seller-head">
							<h5><i class="ico_shop"></i><b>{{ seller.name }}</b></h5>
						</div>
						<div class="mm_product-list T=sm">
							<ul>
								<li
									v-for="orderItem in seller.order_items"
									:key="orderItem.id"
								>
									<my-order-item :order-item="orderItem"></my-order-item>
									<div class="mm_product-unit">
										<div class="mm_product-unit-indent">
											<p class="text_payments">
												결제방식<strong>{{ order.payment_method_label }}</strong>
											</p>
										</div>
										<div class="mm_btn_box">
											<div class="mm_flex T=equal">
												<button
													type="button"
													class="mm_btn T=xs T=line"
													@click="cancelReport(orderItem.id)"
												>
													<b>품절취소 신고하기</b>
												</button>
											</div>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</template>
			</div>

			<pagination
				v-bind="{
					currentPage: paginator.current_page,
					itemsPerPage: paginator.per_page,
					totalCount: paginator.total
				}"
				@move:page="fetch"
			></pagination>
		</template>

		<!-- 품절취소 보상정책 안내 -->
		<section
			v-if="cancelRewardPolicies.length != 0"
			class="m_myclaim-info"
		>
			<h6 class="mm_strapline">
				<b>품절취소 보상정책 안내</b>
			</h6>
			<p>
				재고 부족 등의 이유로 결제 완료일 다음날(1일째) 품절 사실을 안내받은 경우
				{{ cancelRewardPolicies.length === 1 ? `${cancelRewardPolicies[0].reward_rate}%` : `최저 ${cancelRewardPolicies[0].reward_rate}% ~ 최고 ${cancelRewardPolicies[cancelRewardPolicies.length - 1].reward_rate}%` }}
				까지 {{ korean(`${pointConfig.label_name}(으로/로)`) }} 보상해드리는 제도입니다.
			</p>
			<table>
				<caption>결제 완료일로부터 품절등록일 수 기준</caption>
				<tbody>
					<tr
						v-for="policy in cancelRewardPolicies"
						:key="policy.day"
					>
						<th scope="row">
							<b>{{ policy.day }}일 지연</b>
						</th>
						<td>{{ `${policy.reward_rate}%` }} ({{ pointConfig.label_name }} 보상)</td>
					</tr>
				</tbody>
			</table>
			<div class="mm_note">
				<ul>
					<li>단, 오전 10시 이후 주문은 2일째부터 적용</li>
				</ul>
			</div>
		</section>

		<!-- 품절취소 신고 안내 -->
		<div class="mm_inner">
			<div class="mm_note">
				<dropdown
					:is-active="true"
					icon-class="T=sm"
				>
					<template #button>
						<i class="ico_info"></i><b>품절취소 신고 안내</b>
					</template>
					<template #content>
						<ul>
							<li>결제일로부터 30일 이내에 신고하셔야 보상금 지급이 가능합니다.</li>
							<li>해외배송 상품 및 주문제작 상품은 보상제도에서 제외됩니다.</li>
							<li v-if="paidConfig.reward_policies != null">
								보상 신청은 결제일로부터 최대 30일 이내에 하셔야 하고, 최대 보상 금액은 {{ `${number(paidConfig.reward_policies.maximum_reward_price)}원` }} 입니다.
							</li>
							<li>지연일은 영업일 기준으로 토,일,공휴일은 포함하지 않습니다.</li>
							<li>비회원, 해외직배송, 주문 제작, 주문 후 오프라인 매장을 통한 배송 상품, 해당 상품 취소 및 반품 시에는 본 기준에서 제외됩니다.</li>
							<li>무통장 결제의 경우 입금완료일을 기준으로 합니다.</li>
						</ul>
					</template>
				</dropdown>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref } from 'vue';
	import config from '$/utils/config';
	import { useComplain } from '$/composables/useComplain';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Dropdown from '@/component/Dropdown.vue';
	import Pagination from '@/component/Pagination.vue';
	import MyOrderItem from '@/page/mypage/order/component/MyOrderItem.vue';

	const { number, date, korean } = useFormatter();

	const { getSoldoutCancelReportablePaginator, reportSoldoutCancel } = useComplain();

	const paidConfig = config('paid_features');
	const pointConfig = config('point');

	const cancelRewardPolicies = computed(() => paidConfig.reward_policies?.soldout_cancel_reward_policies || []);

	const { bom, loading } = useGlobalPageContext();

	const paginator = ref<Paginator<ComplainReportableOrder>>({
		total: 0,
		per_page: 20,
		current_page: 1,
		data: [],
	});

	/** 품절취소 신고 */
	const cancelReport = async (orderItemId: number) => {

		try {
			await reportSoldoutCancel(orderItemId);
			bom.alert('품절취소 신고가 완료되었습니다.', async () => {

				loading.show();
				paginator.value = await getSoldoutCancelReportablePaginator(1);
				loading.hide();

			});
		}
		catch (_e) {
			useErrorAlert(_e);
		}

	};

	const fetch = async (page: number = 1) => {

		loading.show();
		try {
			paginator.value = await getSoldoutCancelReportablePaginator(page);
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}

	};

	await fetch();
</script>