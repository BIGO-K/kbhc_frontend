<template>
	<div class="m_product-coupon">
		<div class="m_product-coupon-head">
			<h3><b>받기 가능한 쿠폰</b><strong>{{ number(coupons.length) }}<sub>장</sub></strong></h3>
			<button
				v-if="!isAutoPublish"
				type="button"
				class="mm_btn T=secondary btn_download"
				@click="downloadAll"
			>
				<b>전체 쿠폰받기</b>
			</button>
		</div>

		<!-- 쿠폰 리스트 -->
		<ul class="m_product-coupon-list">
			<li
				v-for="coupon in coupons"
				:key="coupon.id"
			>
				<p class="text_coupon">
					{{ coupon.name }}
				</p>
				<p class="text_period">
					{{ coupon.expiration_date_message }}
				</p>
				<b
					v-if="isAutoPublish"
					class="mm_btn T=xs T=disabled btn_download"
				>자동발급</b>
				<button
					v-else
					type="button"
					class="mm_btn T=xs T=line T=secondary btn_download"
					@click="downLoadCoupons([coupon.id])"
				>
					<b>쿠폰받기</b>
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import mons from '$/utils/mons';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGoodsAdditional } from '$/composables/useGoodsAdditional';

	const props = withDefaults(defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
		coupons: DownloadableCoupon[];
		isAutoPublish?: boolean;
	}>(), {
		isAutoPublish: false,
	});

	defineExpose<OverlayComponentExpose>({
		title: `쿠폰 다운받기`,
	});

	const coupons = computed(() => props.coupons);
	const { bom, loading } = mons();
	const { number } = useFormatter();
	const { downloadCoupon } = useGoodsAdditional();

	async function downloadAll() {
		await downLoadCoupons(coupons.value.filter(coupon => coupon.downloadable).map(coupon => coupon.id));
	}

	/**
	 * 쿠폰 다운로드 처리
	 * @param {number[]} couponId: 쿠폰 ID
	*/
	async function downLoadCoupons(couponIds: number[]) {
		if (couponIds.length < 1) {
			return bom.alert('다운받을 쿠폰이 없습니다.');
		}
		loading.show();
		try {
			await downloadCoupon(couponIds);
			bom.alert('쿠폰이 발급되었습니다.');
		}
		catch (error) {
			useErrorAlert(error);
		}
		finally {
			loading.hide();
		}
	}
</script>