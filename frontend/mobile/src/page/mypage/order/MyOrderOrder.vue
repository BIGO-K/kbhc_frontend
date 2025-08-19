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

		<!-- (D) 주문 필터가 [전체, 배송중, 배송완료] 상태 일때만 노출합니다. -->
		<div
			v-if="showReviewGuide"
			class="mm_note T=bg"
		>
			<ul>
				<li>리뷰는 구매확정 시점부터 바로 작성할 수 있습니다.</li>
				<li>구매확정 후 30일 경과 시 리뷰를 작성할 수 없습니다.</li>
				<li>미작성 리뷰는 마이페이지 &#62; 리뷰관리에서 작성하실 수 있습니다.</li>
			</ul>
		</div>
	</div>

	<!-- 주문목록 -->
	<p
		v-if="normalOrders.length === 0"
		class="mm_text-none"
	>
		<i class="ico_text-none"></i>주문 내역이 없습니다
	</p>
	<div
		v-else
		class="mm_order-list"
	>
		<div
			v-for="order in normalOrders"
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
				v-for="bundle in order.bundles"
				:key="bundle.bundle_goods_id"
			>
				<!-- 패키지상품 -->
				<template v-if="bundle.bundle_goods_id != null">
					<div class="mm_order-item-bundle">
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
								@refresh="getOrders"
							>
							</my-order-seller>
						</template>
					</div>
				</template>
				<!-- 일반상품 -->
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
							@refresh="getOrders"
						>
						</my-order-seller>
					</template>
				</template>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, watch } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyOrder } from '$/composables/useMyOrder';
	import FormSelect from '@/component/form/FormSelect.vue';
	import MyOrderSeller from '@/page/mypage/order/component/MyOrderSeller.vue';

	const { date } = useFormatter();
	const { loading, router, route } = useGlobalPageContext();
	const { monthTabs, getNormalStepStates, getNormalStepOrders } = useMyOrder();

	/** 검색 필터 */
	const filter = ref<{
		statusCode: number | null;
		month: number;
	}>({
		statusCode: route.query.status_code ? Number(route.query.status_code) : null,
		month: monthTabs[0].value,
	});

	/** 주문상태코드 리스트 */
	const statusCodes = await getNormalStepStates();

	// 리뷰 관련 안내 문구 노출 여부
	const showReviewGuide = computed(() => {
		if (normalOrders.value.length < 1) {
			return false;
		}
		const selected = statusCodes.find(status => status.code == filter.value.statusCode);

		return selected?.need_review_guide === undefined ? true : selected.need_review_guide;
	});

	const normalOrders = ref<NormalStepOrder[]>([]);

	/** 주문 조회 */
	const getOrders = async () => {
		loading.show();
		try {
			normalOrders.value = await getNormalStepOrders(filter.value.month, filter.value.statusCode);
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
	};

	/** 주문 리스트 조회. 날짜 검색필터 값 따라 재조회 */
	await getOrders();
	watch(filter, getOrders, { deep: true });
</script>