<template>
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
		</div>
	</div>

	<!-- 주문목록 -->
	<p
		v-if="returnOrders.length === 0"
		class="mm_text-none"
	>
		<i class="ico_text-none"></i>반품 내역이 없습니다
	</p>
	<div
		v-else
		class="mm_order-list"
	>
		<div
			v-for="order in returnOrders"
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
				:to="{ name: 'MyOrderDetail', params: { id: order.order_id } }"
			>
				<b>주문상세</b><i class="ico_link"></i>
			</mm-link>
			<template
				v-for="pack in order.packs"
				:key="pack.shipping_rule_id"
			>
				<my-order-seller
					v-for="seller in pack.sellers"
					:key="seller.id"
					:order-id="order.order_id"
					:return-id="order.return_id"
					:seller="seller"
					@refresh="getReturnOrders"
				>
				</my-order-seller>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, watch } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyOrder } from '$/composables/useMyOrder';
	import FormSelect from '@/component/form/FormSelect.vue';
	import MyOrderSeller from '@/page/mypage/order/component/MyOrderSeller.vue';

	const { date } = useFormatter();
	const { loading, router, route } = useGlobalPageContext();
	const { monthTabs, getReturnStepOrders } = useMyOrder();

	/** 검색 필터 */
	const filter = ref<{
		month: number;
	}>({
		month: monthTabs[0].value,
	});

	const returnOrders = ref<ReturnStepOrder[]>([]);
	/** [반품]주문 조회 */
	async function getReturnOrders() {
		loading.show();
		try {
			returnOrders.value = await getReturnStepOrders(filter.value.month);
			router.replace({
				path: route.path,
				query: {
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

	/**
	 * [반품] 철회
	 * @param returnId
	 * @param returnTargetId
	 */
	// async function bomReturnCancel(returnId: string, returnTargetId: number) {
	// 	bom.confirm('반품 신청을 철회하시겠습니까?', async (flag) => {
	// 		if (!flag) {
	// 			return;
	// 		}

	// 		loading.show();
	// 		try {
	// 			await cancelReturn(returnId, returnTargetId);
	// 			await getReturnOrders();
	// 		}
	// 		// catch (e) {
	// 		// 	useErrorAlert(e);
	// 		// }
	// 		finally {
	// 			loading.hide();
	// 		}
	// 	});
	// }

	/** [반품] 주문 리스트 조회. 날짜 검색필터 값 따라 재조회 */
	await getReturnOrders();
	watch(filter.value, getReturnOrders);
</script>