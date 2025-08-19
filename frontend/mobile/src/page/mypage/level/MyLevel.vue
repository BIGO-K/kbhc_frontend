<template>
	<layout
		title="등급 혜택 안내"
		layout="popup"
	>
		<section
			v-if="member"
			:class="`m_mymember T=level${member.grade.id || ''}`"
		>
			<h2>
				<lazyload
					class="mm_bg-contain image_grade"
					:src="member.grade.image_url"
					:is-error-image="false"
				></lazyload>
				<b>{{ member.name }}님은 <strong>{{ member.grade.name }}</strong>입니다</b>
			</h2>

			<!-- 등급 구매정보 -->
			<div class="m_mymember-amount">
				<!-- 구매금액 -->
				<div class="m...amount-progress">
					<dl class="mm_flex">
						<dt class="mm_flex-equal">
							구매금액<small>최근 {{ gradeUpCondition.condition.grade_up_calculation_period_month }}개월</small>
						</dt>
						<dd class="text_price">
							<strong>{{ number(gradeUpCondition.condition.order_amount) }}</strong>
						</dd>
					</dl>
					<!-- (D) 'm...amount-progress-bar > i'의 title, width 값에 목표 금액 대비 현재 구매액의 비율값을 추가합니다. -->
					<b class="m...amount-progress-bar">
						<i
							:title="`${gradeUpCondition.progress.order_amount}%`"
							:style="`width:${gradeUpCondition.progress.order_amount}%;`"
						></i>
					</b>
					<p class="text_price">
						<strong class="text_min">{{ 0 }}</strong>
						<strong class="text_max">{{ number(gradeUpCondition.condition.grade_up_order_amount_condition) }}</strong>
					</p>
				</div>

				<!-- 구매횟수 -->
				<div class="m...amount-progress">
					<dl class="mm_flex">
						<dt class="mm_flex-equal">
							구매횟수<small>최근 {{ gradeUpCondition.condition.grade_up_calculation_period_month }}개월</small>
						</dt>
						<dd><strong>{{ number(gradeUpCondition.condition.order_count) }}</strong><sub>건</sub></dd>
					</dl>
					<!-- (D) 'm...amount-progress-bar > i'의 title, width 값에 목표 금액 대비 현재 구매액의 비율값을 추가합니다. -->
					<b class="m...amount-progress-bar">
						<i
							:title="`${gradeUpCondition.progress.order_count}%`"
							:style="`width:${gradeUpCondition.progress.order_count}%;`"
						></i>
					</b>
					<p>
						<strong class="text_min">0<sub>건</sub></strong>
						<strong class="text_max">{{ number(gradeUpCondition.condition.grade_up_order_count_condition) }}<sub>건</sub></strong>
					</p>
				</div>
				<p>
					<b>추가로 <strong>{{ number(gradeUpCondition.requirement.order_amount) }}</strong>원 또는 <strong>{{ number(gradeUpCondition.requirement.order_count) }}</strong>건 더 구매하시면</b>
					<span><strong>{{ gradeUpCondition.condition.next_grade_name }}</strong>{{ gradeUpCondition.condition.is_top_level ? '등급을 유지할 수 있어요' : '혜택을 받으실 수 있어요' }}</span>
				</p>
				<div class="mm_btn_box">
					<button
						type="button"
						class="mm_btn T=light"
						@click="toBenefit"
					>
						<b>혜택 보기</b>
					</button>
				</div>
			</div>

			<!-- 등급 쿠폰정보 -->
			<div class="m_mymember-coupon">
				<ul>
					<li
						v-for="coupon in gradeCoupons"
						:key="coupon.id"
					>
						<div class="mm_coupon">
							<div class="mm_coupon-inner">
								<p class="text_percent">
									{{ coupon.discount_amount + (coupon.discount_type === 'KRW'? '원' : '%') }}
								</p>
								<b class="text_condition">
									{{ '등급 할인쿠폰' }}
								</b>
								<b :class="[ 'text_quantity', { 'T=infinity': coupon.is_unlimited }, { 'T=count': !coupon.is_unlimited } ]">
									<template v-if="coupon.is_unlimited">
										무제한
									</template>
									<span v-else>{{ coupon.download_limit }}장</span>
								</b>
							</div>
							<button
								v-if="couponDownloadable[coupon.id]"
								type="button"
								class="btn_coupon-down"
								@click="downloadCoupon(coupon.id)"
							>
								<b>쿠폰 다운받기</b><i class="ico_download"></i>
							</button>
							<b
								v-else
								class="btn_coupon-down"
							>
								쿠폰 다운받기<i class="ico_download"></i>
							</b>
						</div>
					</li>
				</ul>
			</div>

			<!-- 유의사항 -->
			<div class="mm_note">
				<dropdown
					:is-active="true"
					icon-class="T=box"
				>
					<template #button>
						<i class="ico_info"></i><b>쿠폰 유의사항</b><i class="ico_dropdown"></i>
					</template>
					<template #content>
						<ul>
							<li>회원 등급은 산정 기준에 따라 매월 1일에 확정됩니다.</li>
							<li>등급별 쿠폰은 매월 1일 자동 발급되며 해당월에 한하여 사용 가능합니다.</li>
							<li>받으신 쿠폰은 마이페이지 &#62; 혜택관리 &#62; 보유 쿠폰에서 확인할 수 있습니다.</li>
							<li>기간 내 사용하지 않은 쿠폰은 이월되지 않으며, 타쿠폰과 중복 사용 불가합니다.</li>
						</ul>
					</template>
				</dropdown>
			</div>
			<hr class="mm_line">

			<!-- 등급 혜택 안내 -->
			<div class="m_mymember-grade">
				<h3><b>등급별 혜택 안내</b></h3>
				<p>최근 {{ gradeUpCondition.condition.grade_up_calculation_period_month }}개월간 실 결제금액을 기준으로 매월 1일<br>구매등급에 반영됩니다</p>
				<div class="mm_accordion">
					<ul>
						<li
							v-for="grade in gradeList"
							:key="grade.id"
							:ref="$el => { if (grade.id == member?.grade.id) $benefit = $el as HTMLElement}"
						>
							<dropdown
								v-model:is-active="dropdownActive[grade.id]"
								tag="dl"
								group="my-level"
							>
								<template #button>
									<p class="text_grade">
										<strong>
											<lazyload
												class="mm_bg-cover image_grade"
												:src="grade.image_url"
												:is-error-image="false"
											></lazyload>
											{{ grade.name }}
										</strong>
										<b>{{ getLevelupConditionText(grade.grade_up_sell_price_condition, grade.grade_up_sell_amount_condition) }}</b>
									</p>
								</template>
								<template #content>
									<dl>
										<dt>등급별 쿠폰</dt>
										<template v-if="grade.coupons.length > 0">
											<dd
												v-for="coupon in grade.coupons"
												:key="coupon.id"
											>
												{{ coupon.discount_amount + (coupon.discount_type === 'KRW'? '원' : '%') }} 할인쿠폰 {{ coupon.is_unlimited ? '무제한' : coupon.download_limit + '개' }}
											</dd>
										</template>
										<dd v-else>
											-
										</dd>
									</dl>
									<dl>
										<dt>등급 적립율</dt>
										<dd>{{ grade.purchase_benefit_rate + '%' }}</dd>
									</dl>
								</template>
							</dropdown>
						</li>
					</ul>
				</div>
			</div>
		</section>
	</layout>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyCoupon } from '$/composables/useMyCoupon';
	import { useMyShopping } from '$/composables/useMyShopping';
	import { usePageScroller } from '$/composables/usePageScroller';
	import Layout from '@/component/layout/Layout.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';

	const { number } = useFormatter();
	const { member, loading, bom } = useGlobalPageContext();
	const { getGradeBenefitInfo, getGradeUpCondition } = useMyShopping();
	const { getGradeCouponRegistCounts, addGradeCoupon } = useMyCoupon();
	const { scrollTo } = usePageScroller();

	const [gradeUpCondition, gradeList, pCouponRegistCount] = await Promise.all([
		getGradeUpCondition(),
		getGradeBenefitInfo(),
		getGradeCouponRegistCounts(),
	]);

	const gradeCoupons = computed<MemberGradeCoupon[]>(() => gradeList.find(grade => grade.id == member.value?.grade.id)?.coupons || []);
	const couponRegistCount = ref(pCouponRegistCount || []);
	const couponDownloadable = computed(() => {
		return gradeCoupons.value.reduce<Record<string, boolean>>((acc, coupon) => ({ ...acc, [coupon.id]: isDownloadable(coupon) }), {});
	});

	const $benefit = ref<HTMLElement | null>(null);
	const dropdownActive = ref(gradeList.reduce<Record<string, boolean>>((acc, grade) => ({ ...acc, [grade.id]: grade.id == member.value?.grade.id }), {}));

	function toBenefit() {
		if ($benefit.value) scrollTo($benefit.value);
		if (member.value) dropdownActive.value[member.value.grade.id] = true;
	}

	async function downloadCoupon(couponId: number) {
		loading.show();
		try {
			await addGradeCoupon(couponId);
			couponRegistCount.value = await getGradeCouponRegistCounts();
			bom.alert('쿠폰이 발급되었습니다.');
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}

	// 등급조건문구 생성
	function getLevelupConditionText(priceCondition: number, amountCondition: number) {
		// 초기값 세팅
		let conditionLabel = '';

		// 구매금액 등급업 조건 존재하는 경우
		if (priceCondition > 0) {
			conditionLabel += `${Math.round(priceCondition / 10000)}만원 이상`;
		}

		// 구매횟수 등급업 조건 존재하는 경우
		if (amountCondition > 0) {
			conditionLabel += conditionLabel !== '' ? ', ' : ''; // 앞에서 구매금액 등급업조건 존재하는경우 , 추가
			conditionLabel += `${amountCondition}건 이상`;
		}

		// 구매금액/횟수 조건 모두 없는 경우
		return conditionLabel === '' ? '신규 회원 및 미구매' : conditionLabel;
	}

	// 등급쿠폰 다운로드 가능여부 계산
	function isDownloadable(coupon: MemberGradeCoupon) {
		if (coupon.is_unlimited) {
			return true;
		}

		const downloadCount = couponRegistCount.value.find(registCount => registCount.grade_coupon_id == coupon.id)?.coupon_regist_count || 0;

		return downloadCount < coupon.download_limit;
	}
</script>