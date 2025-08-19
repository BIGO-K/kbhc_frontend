<template>
	<div class="m_myclaim">
		<h3>
			<b>신고 주문 수</b><strong class="mm_text-secondary">{{ number(paginator.total) }}개</strong>
		</h3>

		<!-- 신고 주문 목록 -->
		<template v-if="paginator.data.length === 0">
			<p class="mm_text-none T=sm">
				<i class="ico_text-none"></i>처리중인 품절취소 주문이 없습니다
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
									<div class="mm_product-item">
										<mm-link :to="{ name: 'ProductDetail', params: { id: orderItem.goods.id } }">
											<figure>
												<div class="mm_product-item-image">
													<lazyload
														class="mm_bg-cover image_product"
														:src="orderItem.goods.thumbnail_url"
													></lazyload>
												</div>
												<figcaption>
													<p class="text_status">
														{{ orderItem.order_status_label }}
													</p>
													<p class="text_brand">
														{{ orderItem.goods.brand_name }}
													</p>
													<p class="text_product">
														{{ orderItem.goods.name }}
													</p>
													<p class="text_price">
														<strong>{{ number(orderItem.paid_price + orderItem.star_point_used + orderItem.reward_point_used) }}</strong>
													</p>
													<p class="text_option">
														{{ `${optionText(orderItem.goods.option_name)} / 1개` }}
													</p>
												</figcaption>
											</figure>
										</mm-link>
									</div>
									<div class="mm_product-unit">
										<div class="mm_product-unit-indent">
											<p class="text_payments">
												결제방식<strong>{{ order.payment_method_label }}</strong>
											</p>
										</div>
										<div class="mm_product-unit-claim">
											<ul>
												<li><b class="mm_tag T=dark">신고접수</b><p>신고일: {{ date(orderItem.reported_at, 'YYYY.MM.DD') }}</p></li>
												<li v-if="orderItem.is_unable_to_complete || orderItem.is_complete">
													<b
														v-if="orderItem.is_unable_to_complete"
														class="mm_tag T=gray"
													>처리불가</b>
													<b
														v-if="orderItem.is_complete"
														class="mm_tag"
													>처리완료</b>
													<p>처리일: {{ date(orderItem.processed_at, 'YYYY.MM.DD') }}</p>
												</li>
											</ul>
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

		<!-- 품절취소 신고 처리 순서 -->
		<section class="m_myclaim-info">
			<h6 class="mm_strapline">
				<b>품절취소 신고 처리 순서</b>
			</h6>
			<ol>
				<li>
					<dl>
						<dt>신고접수 상태란?<b class="mm_tag T=dark">신고접수</b></dt>
						<dd>고객님께서 신고 완료한 상태</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>신고처리 상태란?<b class="mm_tag">처리완료</b><b class="mm_tag T=gray">처리불가</b></dt>
						<dd>고객센터에서 확인 후 보상적립금 지급이 처리 불가하거나 처리 완료한 상태</dd>
					</dl>
				</li>
			</ol>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useComplain } from '$/composables/useComplain';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Lazyload from '@/component/Lazyload.vue';
	import Pagination from '@/component/Pagination.vue';

	const { number, date, optionText } = useFormatter();

	const { getSoldoutCancelReportPaginator } = useComplain();

	const { loading } = useGlobalPageContext();

	const paginator = ref<Paginator<ComplainReportedOrder>>({
		total: 0,
		per_page: 20,
		current_page: 1,
		data: [],
	});

	const fetch = async (page: number = 1) => {

		loading.show();
		try {
			paginator.value = await getSoldoutCancelReportPaginator(page);
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