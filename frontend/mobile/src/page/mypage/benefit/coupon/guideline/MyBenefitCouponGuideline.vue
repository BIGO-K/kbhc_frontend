<template>
	<!-- 상품목록 -->
	<div class="m_mycoupon">
		<!-- 상품 -->
		<template v-if="coupon.apply_range_type === 'goods'">
			<table>
				<colgroup>
					<col style="width:76px;">
					<col style="width:19.57186%;">
					<col style="width:19.57186%;">
					<col>
				</colgroup>
				<thead>
					<tr>
						<th scope="col">
							<b>상품</b>
						</th>
						<th scope="col">
							<b>브랜드명</b>
						</th>
						<th scope="col">
							<b>상품명</b>
						</th>
						<th scope="col">
							<b>적용 제한사항</b>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="goods in goodsPaginator.data"
						:key="goods.id"
					>
						<td>
							<lazyload
								class="mm_bg-cover image_product"
								:src="goods.thumbnail_url"
							></lazyload>
						</td>
						<td>{{ goods.brand_name }}</td>
						<td>
							<p class="text_product">
								{{ goods.name }}
							</p>
						</td>
						<td>
							<p>
								최대 할인금액: <br><strong class="mm_text-variable">
									{{ coupon.maximum_discount_amount > 0 ? `${number(coupon.maximum_discount_amount)}원` : '제한없음' }}
								</strong>
							</p>
							<p>최저 금액조건: <br>{{ number(coupon.min_sell_price) }}원</p>
						</td>
					</tr>
				</tbody>
			</table>
			<pagination
				v-bind="{
					currentPage: goodsPaginator.current_page,
					itemsPerPage: goodsPaginator.per_page,
					totalCount: goodsPaginator.total
				}"
				@move:page="fetchUsableGoods"
			></pagination>
		</template>

		<!-- 브랜드 -->
		<template v-else-if="coupon.apply_range_type === 'brand'">
			<table>
				<colgroup>
					<col style="width:37.92048%;">
					<col>
				</colgroup>
				<thead>
					<tr>
						<th scope="col">
							<b>브랜드명</b>
						</th>
						<th scope="col">
							<b>적용 제한사항</b>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="brand in brandPaginator.data"
						:key="brand.id"
					>
						<td>{{ brand.name }}</td>
						<td>
							<p>
								최대 할인금액: <strong class="mm_text-variable">
									{{ coupon.maximum_discount_amount > 0 ? `${number(coupon.maximum_discount_amount)}원` : '제한 없음' }}
								</strong>
							</p>
							<p>최저 금액조건: {{ number(coupon.min_sell_price) }}원</p>
						</td>
					</tr>
				</tbody>
			</table>
			<pagination
				v-bind="{
					currentPage: brandPaginator.current_page,
					itemsPerPage: brandPaginator.per_page,
					totalCount: brandPaginator.total
				}"
				@move:page="fetchUsableBrands"
			></pagination>
		</template>

		<!-- 모든 상품 -->
		<table v-else>
			<thead>
				<tr>
					<th scope="col">
						<b>적용 제한사항</b>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						<p>
							최대 할인금액: <strong class="mm_text-variable">
								{{ coupon.maximum_discount_amount > 0 ? `${number(coupon.maximum_discount_amount)}원` : '제한 없음' }}
							</strong>
						</p>
						<p>최저 금액조건: {{ number(coupon.min_sell_price) }}원</p>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyCoupon } from '$/composables/useMyCoupon';
	import Lazyload from '@/component/Lazyload.vue';
	import Pagination from '@/component/Pagination.vue';

	const props = defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		coupon: RegistedCoupon;
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `사용 조건`,
	});

	const { number } = useFormatter();
	const { loading } = useGlobalPageContext();
	const { getUsableBrandPaginator, getUsableGoodsPaginator } = useMyCoupon();

	const coupon = ref(props.coupon);
	const goodsPaginator = ref<Paginator<CouponUsableGoods>>({
		total: 0,
		per_page: 20,
		current_page: 1,
		data: [],
	});
	const brandPaginator = ref<Paginator<CouponUsableBrand>>({
		total: 0,
		per_page: 20,
		current_page: 1,
		data: [],
	});

	async function fetchUsableGoods(page: number = 1) {
		loading.show();
		try {
			goodsPaginator.value = await getUsableGoodsPaginator(coupon.value.id, page);
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}

	async function fetchUsableBrands(page: number = 1) {
		loading.show();
		try {
			brandPaginator.value = await getUsableBrandPaginator(coupon.value.id, page);
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}

	(async () => {
		if (coupon.value.apply_range_type == 'goods') {
			await fetchUsableGoods();
		}
		else if (coupon.value.apply_range_type == 'brand') {
			await fetchUsableBrands();
		}
	})();
</script>