<template>
	<div class="m_mypresent">
		<div class="mm_inner">
			<!-- 주문목록 정렬 -->
			<div class="m_myorder-sort">
				<form-select
					v-model="filter.month"
					title="조회기간"
					:use-overlay="true"
				>
					<option
						v-for="month in monthTabs"
						:key="month.value"
						:value="month.value"
					>
						{{ month.label }}
					</option>
				</form-select>
				<form-select
					v-model="filter.statusCode"
					title="주문상태"
					:use-overlay="true"
				>
					<option :value="null">
						주문상태 전체
					</option>
					<option
						v-for="status in statusCodes"
						:key="status.code"
						:value="status.code"
					>
						{{ status.label }}
					</option>
				</form-select>
			</div>
			<div class="mm_note T=bg">
				<ul>
					<li>선물을 보내 신 내역만 확인하실 수 있습니다.</li>
					<li>보내신 선물의 취소가 가능합니다.</li>
					<li>반품, 교환 신청은 선물을 받으신분만 진행 가능합니다.</li>
				</ul>
			</div>
		</div>

		<!-- 주문목록 -->
		<p
			v-if="giftOrders.length < 1"
			class="mm_text-none"
		>
			<i class="ico_text-none"></i>주문 내역이 없습니다
		</p>
		<div
			v-else
			class="mm_order-list"
		>
			<div
				v-for="order in giftOrders"
				:key="order.order_id"
				class="mm_order-item"
			>
				<div class="mm_order-item-head">
					<p class="text_date">
						{{ date(order.ordered_at, 'YYYY.MM.DD') }}
					</p>
					<dl><dt>주문번호</dt><dd>{{ order.order_id }}</dd></dl>
				</div>
				<mm-link
					class="btn_detail"
					:to="{ name: 'PresentSentDetail', params: { id: order.order_id } }"
				>
					<b>주문상세</b><i class="ico_link"></i>
				</mm-link>

				<template
					v-for="bundle, _i in order.bundles"
					:key="`${_i}_${bundle.bundle_goods_id}`"
				>
					<div
						v-if="bundle.bundle_goods_id"
						class="mm_order-item-bundle"
					>
						<div class="mm_order...bundle-head">
							<dl>
								<dt>패키지 상품명</dt>
								<dd>{{ bundle.bundle_goods_name }}</dd>
							</dl>
							<dl>
								<dt>패키지 상품번호</dt>
								<dd>{{ bundle.bundle_goods_no }}</dd>
							</dl>
						</div>

						<template
							v-for="pack in bundle.packs"
							:key="pack.shipping_rule_id"
						>
							<my-order-seller
								v-for="seller in pack.sellers"
								:key="seller.id"
								:order-id="order.order_id"
								:seller="seller"
								show-voucher-refund
								@refresh="getGifts"
							></my-order-seller>
						</template>
					</div>
					<template v-else>
						<template
							v-for="pack in bundle.packs"
							:key="pack.shipping_rule_id"
						>
							<my-order-seller
								v-for="seller in pack.sellers"
								:key="seller.id"
								:order-id="order.order_id"
								:seller="seller"
								@refresh="getGifts"
							></my-order-seller>
						</template>
					</template>
				</template>

				<!-- 선물 메시지 -->
				<div
					v-if="order.gift_message"
					class="m_mypresent-message"
				>
					<strong><i class="ico_message"></i>선물 메시지</strong>
					<p>{{ order.gift_message }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, watch } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGift } from '$/composables/useGift';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import FormSelect from '@/component/form/FormSelect.vue';
	import MyOrderSeller from '@/page/mypage/order/component/MyOrderSeller.vue';

	const { loading, route, router } = useGlobalPageContext();
	const { date } = useFormatter();
	const { monthTabs, getList, getStates } = useGift();

	/** 검색 필터 */
	const filter = ref<{
		statusCode: number | null;
		month: number;
	}>({
		statusCode: route.query.status_code ? Number(route.query.status_code) : null,
		month: route.query.month ? Number(route.query.month) : monthTabs[0].value,
	});

	const giftOrders = ref<MyGift[]>([]);
	const statusCodes = await getStates();


	/** 주문 조회 */
	async function getGifts() {
		loading.show();
		try {
			giftOrders.value = await getList(filter.value.month, false, filter.value.statusCode);
			router.replace({
				path: route.path,
				query: {
					status_code: filter.value.statusCode,
					month: filter.value.month,
				},
			});
		}
		catch (e) {
			useErrorAlert(e, {
				alertCallback: () => {
					router.go(-1);
				},
			});
		}
		finally {
			loading.hide();
		}
	}

	/** 선물 주문 리스트 조회. 날짜 검색필터 값 따라 재조회 */
	watch(filter, getGifts, {
		deep: true,
		immediate: true,
	});
</script>