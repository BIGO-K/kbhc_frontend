<template>
	<layout
		title="반품 전환"
		layout="popup"
	>
		<div
			ref="$process"
			class="mm_process"
		>
			<!-- 상품 선택 -->
			<div class="mm_process-item">
				<!-- 주문목록 -->
				<article class="mm_order-item">
					<h5>
						<b>{{ '2023.00.00' }}</b>
						<strong>주문번호<b>{{ '2005141142151234562' }}</b></strong>
					</h5>
					<div class="mm_order-item-seller">
						<div class="mm_order...seller-head">
							<p class="text_ship">
								<i class="ico_ship"></i><span class="text_price"><strong>{{ number(2500) }}</strong></span>
							</p>
						</div>
						<div class="mm_product-list T=sm">
							<ul>
								<li>
									<form-check
										v-model="selectedItems"
										:value="returnItems[0]"
										label="상품 선택"
										:label-on-blind="true"
									></form-check>
									<p class="text_seller">
										<i class="ico_shop"></i>{{ '엠몬스타' }}
									</p>
									<div class="mm_product-item">
										<a>
											<figure>
												<div class="mm_product-item-image">
													<lazyload
														class="mm_bg-cover image_product"
														src="/image/_sample/prod_x1_1.png"
													></lazyload>
												</div>
												<figcaption>
													<p class="text_status">
														{{ '교환 신청' }}
													</p>
													<p class="text_brand">
														{{ '엠몬스타' }}
													</p>
													<p class="text_product">
														{{ '[매긴나잇브릿지]플리츠 디테일 드레스' }}
													</p>
													<p class="text_price">
														<strong>{{ number(54800) }}</strong>
													</p>
													<p class="text_option">
														{{ '베이지 FREE / 1개' }}
													</p>
												</figcaption>
											</figure>
										</a>
									</div>
									<div class="mm_product-unit">
										<div class="mm_product-unit-point">
											<dl class="mm_flex">
												<dt><i class="ico_star-point"></i>사용 스타포인트</dt>
												<dd>
													<p class="text_price">
														<strong class="mm_text-secondary">{{ number(0) }}</strong>
													</p>
												</dd>
											</dl>
											<dl class="mm_flex">
												<dt><i class="ico_reward-point"></i>사용 리워드포인트</dt>
												<dd>
													<p class="text_price">
														<strong class="mm_text-secondary">{{ number(2500) }}</strong>
													</p>
												</dd>
											</dl>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
					<div class="mm_order-item-seller">
						<div class="mm_order...seller-head">
							<p class="text_ship">
								<i class="ico_ship"></i><span class="text_price"><strong>{{ number(2500) }}</strong></span>
							</p>
						</div>
						<div class="mm_product-list T=sm">
							<ul>
								<li>
									<form-check
										v-model="selectedItems"
										:value="returnItems[1]"
										label="상품 선택"
										:label-on-blind="true"
									></form-check>
									<p class="text_seller">
										<i class="ico_shop"></i>{{ '엠몬스타' }}
									</p>
									<div class="mm_product-item">
										<a>
											<figure>
												<div class="mm_product-item-image">
													<lazyload
														class="mm_bg-cover image_product"
														src="/image/_sample/prod_x1_2.png"
													></lazyload>
												</div>
												<figcaption>
													<p class="text_status">
														{{ '교환 신청' }}
													</p>
													<p class="text_brand">
														{{ '엠몬스타' }}
													</p>
													<p class="text_product">
														{{ '[매긴나잇브릿지]플리츠 디테일 드레스' }}
													</p>
													<p class="text_price">
														<strong>{{ number(54800) }}</strong>
													</p>
													<p class="text_option">
														{{ '베이지 FREE / 4개' }}
													</p>
												</figcaption>
											</figure>
										</a>
									</div>
									<div class="mm_product-unit">
										<div class="mm_product-unit-indent">
											<p class="text_amount">
												<b>반품 수량: 2개</b>
												<a
													class="mm_btn T=xs T=secondary"
													href="#"
													@click.prevent="overlayMyReturnChoice"
												>
													<b>부분선택</b>
												</a>
											</p>
										</div>
										<div class="mm_product-unit-point">
											<dl class="mm_flex">
												<dt><i class="ico_star-point"></i>사용 스타포인트</dt>
												<dd>
													<p class="text_price">
														<strong class="mm_text-secondary">{{ number(0) }}</strong>
													</p>
												</dd>
											</dl>
											<dl class="mm_flex">
												<dt><i class="ico_reward-point"></i>사용 리워드포인트</dt>
												<dd>
													<p class="text_price">
														<strong class="mm_text-secondary">{{ number(2500) }}</strong>
													</p>
												</dd>
											</dl>
										</div>
									</div>
								</li>
								<li>
									<form-check
										v-model="selectedItems"
										:value="returnItems[2]"
										label="상품 선택"
										:label-on-blind="true"
									></form-check>
									<p class="text_seller">
										<i class="ico_shop"></i>엠몬스타
									</p>
									<div class="mm_product-item">
										<a>
											<figure>
												<div class="mm_product-item-image">
													<lazyload
														class="mm_bg-cover image_product"
														src="/image/_sample/prod_x1_3.png"
													></lazyload>
												</div>
												<figcaption>
													<p class="text_status">
														{{ '교환 신청' }}
													</p>
													<p class="text_brand">
														{{ '엠몬스타' }}
													</p>
													<p class="text_product">
														{{ '[매긴나잇브릿지]플리츠 디테일 드레스' }}
													</p>
													<p class="text_price">
														<strong>{{ number(54800) }}</strong>
													</p>
													<p class="text_option">
														{{ '베이지 FREE / 1개' }}
													</p>
												</figcaption>
											</figure>
										</a>
									</div>
									<div class="mm_product-unit">
										<div class="mm_product-unit-point">
											<dl class="mm_flex">
												<dt><i class="ico_star-point"></i>사용 스타포인트</dt>
												<dd>
													<p class="text_price">
														<strong class="mm_text-secondary">{{ number(0) }}</strong>
													</p>
												</dd>
											</dl>
											<dl class="mm_flex">
												<dt><i class="ico_reward-point"></i>사용 리워드포인트</dt>
												<dd>
													<p class="text_price">
														<strong class="mm_text-secondary">{{ number(2500) }}</strong>
													</p>
												</dd>
											</dl>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</article>

				<!-- 반품신청 -->
				<div class="mm_inner">
					<div class="mm_foot">
						<div class="mm_btn_box">
							<button
								type="button"
								class="mm_btn T=primary"
								@click="index++"
							>
								<b>다음 단계로</b>
							</button>
						</div>
					</div>
					<div class="mm_note">
						<dropdown
							:is-active="true"
							icon-class="T=sm"
						>
							<template #button>
								<i class="ico_info"></i><b>반품 전환 주의사항</b>
							</template>
							<template #content>
								<ul>
									<li>반품 전환하신 상품은 바로 반품 완료 처리가 진행됩니다.</li>
								</ul>
							</template>
						</dropdown>
					</div>
				</div>
			</div>

			<!-- 반품 사유 -->
			<div class="mm_process-item">
				<div class="mm_inner">
					<h3 class="mm_heading m_myclaim-title">
						<b><strong class="mm_text-secondary">반품 사유</strong>를 확인하세요</b>
					</h3>
					<div class="m_myclaim-reason">
						<ul>
							<li>
								<form-radio
									v-model="claimReason"
									name="dev_radio-reason"
									value=""
									disabled
								>
									<b class="mm_block">
										<i class="ico_form-radio"></i>
										<i class="ico_my-change"></i>
										<strong>상품을 받고 마음이 변했어요</strong>
										<span>구매자 반품비용 부담</span>
									</b>
								</form-radio>
							</li>
							<li>
								<form-radio
									v-model="claimReason"
									name="dev_radio-reason"
									value="defects"
									disabled
								>
									<b class="mm_block">
										<i class="ico_form-radio"></i>
										<i class="ico_my-defects"></i>
										<strong>상품에 하자가 있어요</strong>
										<span>판매자 반품비용 부담</span>
									</b>
								</form-radio>
							</li>
							<li>
								<form-radio
									v-model="claimReason"
									name="dev_radio-reason"
									value="other"
									disabled
								>
									<b class="mm_block">
										<i class="ico_form-radio"></i>
										<i class="ico_my-delivery"></i>
										<strong>다른 상품이 배송됐어요</strong>
										<span>판매자 반품비용 부담</span>
									</b>
								</form-radio>
							</li>
						</ul>
						<div
							class="m_myclaim-reason-write"
							:class="{ 'S=on': claimReason }"
						>
							<h6 class="mm_strapline">
								<b>상세사유</b><strong>(필수)</strong>
							</h6>
							<p class="text_readonly T=teatarea">
								<b>{{ '옷이 다 찢어져서 왔어요' }}</b>
							</p>
						</div>
					</div>
					<div class="mm_foot">
						<div class="mm_btn_box">
							<div class="mm_flex T=auto">
								<button
									type="button"
									class="mm_btn T=light btn_back"
									@click="index--"
								>
									<i class="ico_back"></i><b>이전으로</b>
								</button>
								<button
									type="button"
									class="mm_btn T=primary"
									@click="index++"
								>
									<b>다음으로</b>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 환불관련정보 -->
			<div class="mm_process-item">
				<div class="m_myclaim-refund">
					<h3 class="mm_heading m_myclaim-title">
						<b><strong class="mm_text-secondary">예상 환불금액</strong>을 확인하세요</b>
					</h3>
					<hr class="mm_line">
					<div class="m_myorder-info">
						<section>
							<h6 class="mm_strapline">
								<b>환불 예상금액</b>
							</h6>
							<div class="mm_cost">
								<table>
									<tbody>
										<tr>
											<th scope="row">
												<b>반품 상품 주문 금액</b>
											</th>
											<td>
												<p class="text_price">
													<strong>{{ number(210000) }}</strong>
												</p>
											</td>
										</tr>
										<tr>
											<th scope="row">
												<b>면제 배송비</b>
											</th>
											<td>
												<p class="text_price">
													- <strong>{{ number(2500) }}</strong>
												</p>
											</td>
										</tr>
										<tr>
											<th scope="row">
												<b>반품 배송비</b>
											</th>
											<td>
												<p class="text_price">
													+ <strong>{{ number(2500) }}</strong>
												</p>
											</td>
										</tr>
									</tbody>
									<tfoot>
										<tr>
											<th scope="row">
												<b>환불 예상 금액</b>
											</th>
											<td>
												<p class="text_price">
													<strong class="mm_text-secondary">{{ number(210000) }}</strong>
												</p>
											</td>
										</tr>
									</tfoot>
								</table>
							</div>
						</section>

						<hr class="mm_line">
						<section>
							<h6 class="mm_strapline">
								<b>환불 정보</b>
							</h6>
							<div class="mm_cost">
								<table>
									<tbody>
										<tr>
											<th scope="row">
												<b>신용카드 환불</b>
											</th>
											<td>
												<p class="text_price">
													<strong>{{ number(210000) }}</strong>
												</p>
											</td>
										</tr>
										<tr>
											<th scope="row">
												<b>적립금 환불</b>
											</th>
											<td>
												<p class="text_point">
													<strong>2,000</strong><sub>원</sub>
												</p>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div class="mm_note T=bg">
								<ul>
									<li>최종적으로 환불 받으실 금액은 상이할 수 있습니다.</li>
								</ul>
							</div>
						</section>

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
									{{ refundAccount.bankName }}
								</p>
								<p class="text_name">
									{{ refundAccount.ownerName }}
								</p>
								<p>{{ refundAccount.accountNumber }}</p>
								<a
									class="mm_btn T=xs T=secondary"
									:to="{ name: '' }"
									@click.prevent="overlayMyRefundUpdate"
								>
									<b>변경</b>
								</a>
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
							<div class="mm_note T=bg">
								<ul>
									<li>입력하신 계좌 정보는 환불 목적으로만 이용되고 있습니다.</li>
								</ul>
							</div>
						</section>
					</div>
					<div class="mm_inner">
						<div class="mm_foot">
							<div class="mm_btn_box">
								<div class="mm_flex T=auto">
									<button
										type="button"
										class="mm_btn T=light btn_back"
										@click="index--"
									>
										<i class="ico_back"></i><b>이전으로</b>
									</button>
									<a
										class="mm_btn T=primary"
										href="#"
										@click.prevent="$router.push({ name: 'MyOrderToReturnSuccess' })"
									>
										<b>반품 전환하기</b>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, watch, defineAsyncComponent } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormRadio from '@/component/form/FormRadio.vue';

	const { number } = useFormatter();
	const { openOverlay } = useGlobalPageContext();

	const $process = ref<HTMLElement>();
	const index = ref(0);

	const bankCodes = [
		{
			'code': 706,
			'label': 'KDB산업은행',
		},
		{
			'code': 101,
			'label': '기업은행',
		},
		{
			'code': 100,
			'label': '국민은행',
		},
		{
			'code': 701,
			'label': '수협',
		},
		{
			'code': 200,
			'label': '농협',
		},
		{
			'code': 201,
			'label': '지역농축협',
		},
		{
			'code': 801,
			'label': '우리은행',
		},
		{
			'code': 1500,
			'label': 'SC제일은행',
		},
		{
			'code': 705,
			'label': '한국씨티은행',
		},
		{
			'code': 300,
			'label': '대구은행',
		},
		{
			'code': 600,
			'label': '부산은행',
		},
		{
			'code': 103,
			'label': '광주은행',
		},
		{
			'code': 900,
			'label': '제주은행',
		},
		{
			'code': 901,
			'label': '전북은행',
		},
		{
			'code': 102,
			'label': '경남은행',
		},
		{
			'code': 702,
			'label': '새마을금고',
		},
		{
			'code': 712,
			'label': '신협',
		},
		{
			'code': 902,
			'label': '상호저축은행',
		},
		{
			'code': 1501,
			'label': 'HSBC은행',
		},
		{
			'code': 301,
			'label': '도이치은행',
		},
		{
			'code': 1509,
			'label': 'JP모건',
		},
		{
			'code': 1508,
			'label': 'BOA(Bank Of America)',
		},
		{
			'code': 602,
			'label': '비엔피파리바은행',
		},
		{
			'code': 711,
			'label': '산림조합',
		},
		{
			'code': 800,
			'label': '우체국',
		},
		{
			'code': 1400,
			'label': '하나은행',
		},
		{
			'code': 700,
			'label': '신한은행',
		},
		{
			'code': 1101,
			'label': '케이뱅크',
		},
		{
			'code': 1102,
			'label': '카카오뱅크',
		},
		{
			'code': 1200,
			'label': '토스뱅크',
		},
		{
			'code': 807,
			'label': '유안타증권',
		},
		{
			'code': 1506,
			'label': 'KB증권',
		},
		{
			'code': 500,
			'label': '미래에셋대우',
		},
		{
			'code': 708,
			'label': '삼성증권',
		},
		{
			'code': 1404,
			'label': '한국투자증권',
		},
		{
			'code': 1504,
			'label': 'NH투자증권',
		},
		{
			'code': 1403,
			'label': '하이투자증권',
		},
		{
			'code': 1405,
			'label': '현대차증권',
		},
		{
			'code': 1502,
			'label': 'SK증권',
		},
		{
			'code': 303,
			'label': '대신증권',
		},
		{
			'code': 1401,
			'label': '한화투자증권',
		},
		{
			'code': 1402,
			'label': '하나금융투자',
		},
		{
			'code': 707,
			'label': '신한금융투자',
		},
		{
			'code': 304,
			'label': 'DB금융투자',
		},
		{
			'code': 803,
			'label': '유진투자증권',
		},
		{
			'code': 501,
			'label': '메리츠증권',
		},
		{
			'code': 709,
			'label': '신영증권',
		},
	];

	function overlayMyReturnChoice() {
		const component = defineAsyncComponent(() => import('@/page/mypage/order/pick/MyOrderPick.vue'));

		return openOverlay(component);
	}

	function overlayMyRefundCreate() {
		const component = defineAsyncComponent(() => import('@/page/mypage/refund/create/MyRefundCreate.vue'));

		return openOverlay(component, {
			props: {
				bankCodes,
			},
		});
	}

	function overlayMyRefundUpdate() {
		const component = defineAsyncComponent(() => import('@/page/mypage/refund/update/MyRefundUpdate.vue'));

		return openOverlay(component, {
			props: {
				bankCodes,
			},
		});
	}

	watch([$process, index], () => {
			if ($process.value == null) return;

			const $items = Object.values($process.value.children);
			for (const [i, $el] of $items.entries()) $el.classList[i === index.value ? 'add' : 'remove']('S=process-on');
		},
		{ immediate: true, flush: 'post' }
	);

	const claimReason = ref('defects');

	type RefundAccount = {
		ownerName: string;
		accountNumber: string;
		bankCode: string;
		bankName?: string;
	};

	const refundAccount = ref<RefundAccount>({
		ownerName: '홍길동',
		accountNumber: '13278943428749',
		bankCode: '101',
		bankName: '기업은행',
	});

	// XXX 임시 인터페이스
	interface test {
		id: string;
	}
	const returnItems = ref<test[]>([
		{ id: '1' },
		{ id: '2' },
		{ id: '3' },
	]);
	const selectedItems = ref<test[]>(returnItems.value.filter(_item => !_item.id));
</script>