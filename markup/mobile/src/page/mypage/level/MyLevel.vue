<template>
	<layout
		title="등급 혜택 안내"
		layout="popup"
	>
		<section class="m_mymember T=level5">
			<h2>
				<lazyload
					class="mm_bg-contain image_grade"
					src="/image/common/level5.png"
				></lazyload>
				<b>{{ '홍길동' }}님은 <strong>{{ userGrade.name }}</strong>입니다</b>
			</h2>

			<!-- 등급 구매정보 -->
			<div class="m_mymember-amount">
				<!-- 구매금액 -->
				<div class="m...amount-progress">
					<dl class="mm_flex">
						<dt class="mm_flex-equal">
							구매금액<small>최근 6개월</small>
						</dt>
						<dd class="text_price">
							<strong>{{ number(2000000) }}</strong>
						</dd>
					</dl>
					<!-- (D) 'm...amount-progress-bar > i'의 title, width 값에 목표 금액 대비 현재 구매액의 비율값을 추가합니다. -->
					<b class="m...amount-progress-bar">
						<i
							title="100%"
							style="width:100%;"
						></i>
					</b>
					<p class="text_price">
						<strong class="text_min">{{ number(1000000) }}</strong>
						<strong class="text_max">{{ number(userGrade.grade_up_sell_price_condition) }}</strong>
					</p>
				</div>

				<!-- 구매횟수 -->
				<div class="m...amount-progress">
					<dl class="mm_flex">
						<dt class="mm_flex-equal">
							구매횟수<small>최근 6개월</small>
						</dt>
						<dd><strong>{{ number(5) }}</strong><sub>건</sub></dd>
					</dl>
					<!-- (D) 'm...amount-progress-bar > i'의 title, width 값에 목표 금액 대비 현재 구매액의 비율값을 추가합니다. -->
					<b class="m...amount-progress-bar">
						<i
							title="50%"
							style="width:50%;"
						></i>
					</b>
					<p>
						<strong class="text_min">0<sub>건</sub></strong>
						<strong class="text_max">{{ number(10) }}<sub>건</sub></strong>
					</p>
				</div>
				<p>
					<b>추가로 <strong>{{ number(1000000) }}</strong>원 또는 <strong>{{ number(5) }}</strong>건 더 구매하시면</b>
					<span><strong>{{ 'DIAMOND' }}</strong>등급을 유지할 수 있어요</span>
				</p>
				<div class="mm_btn_box">
					<button
						type="button"
						class="mm_btn T=light"
					>
						<b>혜택 보기</b>
					</button>
				</div>
			</div>

			<!-- 등급 쿠폰정보 -->
			<div class="m_mymember-coupon">
				<ul>
					<li
						v-for="coupon in userGrade.coupons"
						:key="coupon.id"
					>
						<div class="mm_coupon">
							<div class="mm_coupon-inner">
								<p class="text_percent">
									{{ coupon.dc_amount + (coupon.dc_type === 'KRW'? '원' : '%') }}
								</p>
								<b class="text_condition">
									{{ '등급 할인쿠폰' }}
								</b>
								<b
									class="text_quantity"
									:class="[ { 'T=infinity': coupon.is_unlimited }, { 'T=count': !coupon.is_unlimited } ]"
								>
									<template v-if="coupon.is_unlimited">
										무제한
									</template>
									<span v-else>{{ coupon.download_limit }}장</span>
								</b>
							</div>
							<button
								type="button"
								class="btn_coupon-down"
							>
								<b>쿠폰 다운받기</b><i class="ico_download"></i>
							</button>
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
				<p>최근 6개월간 실 결제금액을 기준으로 매월 1일<br>구매등급에 반영됩니다</p>
				<div class="mm_accordion">
					<ul>
						<li
							v-for="grade in gradeItems"
							:key="grade.id"
						>
							<dropdown
								tag="dl"
								group="my-level"
							>
								<template #button>
									<p class="text_grade">
										<strong>
											<lazyload
												class="mm_bg-cover image_grade"
												:src="grade.image_url"
											></lazyload>
											{{ grade.name }}
										</strong>
										<b>{{ '100만원 이상 ~ 200만원 미만' }}</b>
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
												{{ coupon.dc_amount + (coupon.dc_type === 'KRW'? '원' : '%') }} 할인쿠폰 {{ coupon.is_unlimited ? '무제한' : coupon.download_limit + '개' }}
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
	import { ref } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import Layout from '@/component/layout/Layout.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';

	const { number } = useFormatter();

	type GradeBenefit = {
		id: number;
		name: string;
		image_url: string;
		is_default: boolean;
		order_seq: number;
		grade_up_sell_price_condition: number;
		grade_up_sell_amount_condition: number;
		purchase_benefit_rate: number;
		coupons: {
			id: number;
			dc_amount: number;
			dc_type: string;
			is_unlimited: boolean;
			download_limit: number;
		}[];
	};

	const userGradeId = 456;// XXX 회원등급 임시 변수
	const gradeList = [
		{
			id: 123,
			name: 'DIAMOND',
			image_url: '/image/common/level5.png',
			is_default: false,
			order_seq: 5,
			grade_up_sell_price_condition: 2000000,
			grade_up_sell_amount_condition: 10,
			purchase_benefit_rate: 10,
			coupons: [
				{
					id: 123,
					dc_amount: 21,
					dc_type: 'rate',
					is_unlimited: false,
					download_limit: 1,
				},
				{
					id: 456,
					dc_amount: 15,
					dc_type: 'rate',
					is_unlimited: false,
					download_limit: 1,
				},
				{
					id: 789,
					dc_amount: 5,
					dc_type: 'rate',
					is_unlimited: true,
					download_limit: 1,
				},
				{
					id: 482,
					dc_amount: 1000,
					dc_type: 'KRW',
					is_unlimited: true,
					download_limit: 1,
				},
			],
		},
		{
			id: 456,
			name: 'PLATINUM',
			image_url: '/image/common/level4.png',
			is_default: false,
			order_seq: 4,
			grade_up_sell_price_condition: 1500000,
			grade_up_sell_amount_condition: 7,
			purchase_benefit_rate: 7,
			coupons: [
				{
					id: 123,
					dc_amount: 15,
					dc_type: 'rate',
					is_unlimited: false,
					download_limit: 1,
				},
				{
					id: 123,
					dc_amount: 5,
					dc_type: 'rate',
					is_unlimited: true,
					download_limit: 1,
				},
				{
					id: 123,
					dc_amount: 1000,
					dc_type: 'KRW',
					is_unlimited: true,
					download_limit: 1,
				},
			],
		},
		{
			id: 234,
			name: 'GOLD',
			image_url: '/image/common/level3.png',
			is_default: false,
			order_seq: 3,
			grade_up_sell_price_condition: 1000000,
			grade_up_sell_amount_condition: 5,
			purchase_benefit_rate: 5,
			coupons: [
				{
					id: 123,
					dc_amount: 7,
					dc_type: 'rate',
					is_unlimited: false,
					download_limit: 1,
				},
				{
					id: 123,
					dc_amount: 5,
					dc_type: 'rate',
					is_unlimited: false,
					download_limit: 1,
				},
				{
					id: 123,
					dc_amount: 1000,
					dc_type: 'KRW',
					is_unlimited: true,
					download_limit: 1,
				},
			],
		},
		{
			id: 654,
			name: 'SILVER',
			image_url: '/image/common/level2.png',
			is_default: false,
			order_seq: 2,
			grade_up_sell_price_condition: 500000,
			grade_up_sell_amount_condition: 3,
			purchase_benefit_rate: 3,
			coupons: [
				{
					id: 123,
					dc_amount: 3,
					dc_type: 'rate',
					is_unlimited: true,
					download_limit: 1,
				},
			],
		},
		{
			id: 789,
			name: 'BRONZE',
			image_url: '/image/common/level1.png',
			is_default: false,
			order_seq: 1,
			grade_up_sell_price_condition: 200000,
			grade_up_sell_amount_condition: 1,
			purchase_benefit_rate: 3,
			coupons: [],
		},
	];

	const gradeItems = ref<GradeBenefit[]>(gradeList);
	const userGrade = gradeList.filter(grade => grade.id === userGradeId)[0];
</script>