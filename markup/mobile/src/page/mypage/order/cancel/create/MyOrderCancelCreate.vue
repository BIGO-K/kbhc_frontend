<template>
	<layout
		title="주문 취소"
		layout="popup"
	>
		<div class="m_myclaim-cancel">
			<!-- 주문목록 -->
			<!-- (D) '입금 대기' 상태일 경우 상단에 상품선택 체크박스는 노출하지 않습니다. -->
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
								<p class="text_seller">
									<i class="ico_shop"></i>{{ '엠몬스타' }}
								</p>
								<div class="mm_product-item">
									<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													src="/image/_sample/prod_x1_1.png"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_status">
													{{ '입금 대기' }}
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
									</mm-link>
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
									:value="cancelItems[0]"
									label="상품 선택"
									:label-on-blind="true"
								></form-check>
								<p class="text_seller">
									<i class="ico_shop"></i>{{ '엠몬스타' }}
								</p>
								<div class="mm_product-item">
									<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													src="/image/_sample/prod_x1_1.png"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_status">
													{{ '배송 준비중' }}
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
													{{ '베이지 FREE / 10개' }}
												</p>
											</figcaption>
										</figure>
									</mm-link>
								</div>
								<div class="mm_product-unit">
									<div class="mm_product-unit-indent">
										<p class="text_amount">
											<b>취소 수량: {{ number(2) }}개</b>
											<a
												class="mm_btn T=xs T=secondary"
												href="#"
												@click.prevent="overlayMyCancelChoice"
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
													<strong class="mm_text-secondary">{{ number(0) }}</strong>
												</p>
											</dd>
										</dl>
									</div>
								</div>
							</li>
							<li>
								<form-check
									v-model="selectedItems"
									:value="cancelItems[1]"
									label="상품 선택"
									:label-on-blind="true"
								></form-check>
								<p class="text_seller">
									<i class="ico_shop"></i>{{ '엠몬스타' }}
								</p>
								<div class="mm_product-item">
									<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													src="/image/_sample/prod_x1_3.png"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_status">
													{{ '결제 완료' }}
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
													{{ '베이지 FREE / 10개' }}
												</p>
											</figcaption>
										</figure>
									</mm-link>
								</div>
								<div class="mm_product-unit">
									<div class="mm_product-unit-indent">
										<p class="text_amount">
											<b>취소 수량: {{ number(2) }}개</b>
											<a
												class="mm_btn T=xs T=secondary"
												href="#"
												@click.prevent="overlayMyCancelChoice"
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
													<strong class="mm_text-secondary">{{ number(0) }}</strong>
												</p>
											</dd>
										</dl>
									</div>
								</div>
							</li>
							<li>
								<form-check
									v-model="selectedItems"
									:value="cancelItems[2]"
									label="상품 선택"
									:label-on-blind="true"
								></form-check>
								<p class="text_seller">
									<i class="ico_shop"></i>{{ '엠몬스타' }}
								</p>
								<div class="mm_product-item">
									<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													src="/image/_sample/prod_x1_1.png"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_status">
													{{ '결제 완료' }}
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
									</mm-link>
								</div>
								<div class="mm_product-unit">
									<div class="mm_product-unit-indent">
										<p class="text_amount">
											<b>취소 수량: {{ number(2) }}개</b>
											<a
												class="mm_btn T=xs T=secondary"
												href="#"
												@click.prevent="overlayMyCancelChoice"
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
													<strong class="mm_text-secondary">{{ number(0) }}</strong>
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
			<hr class="mm_line">

			<!-- 취소신청 -->
			<div class="m_myorder-info">
				<section>
					<h6 class="mm_strapline">
						<b>취소 사유</b>
					</h6>
					<h6 class="mm_text-label T=sm">
						<b>취소 사유</b>
					</h6>
					<div class="m_myclaim-cancel-reason">
						<form-select v-model="sortCencel">
							<option>취소 사유를 선택하세요</option>
							<option value="etc">
								기타
							</option>
						</form-select>
						<div
							class="m...reason-write"
							:class="{ 'S=on': isWriteReason }"
						>
							<form-textarea
								placeholder="취소 사유를 입력하세요(필수입력)"
								:byte="2000"
							></form-textarea>
						</div>
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
											<strong>{{ number(2000) }}</strong><sub>원</sub>
										</p>
									</td>
								</tr>
								<tr>
									<th scope="row">
										<b>환불 예상금액</b>
									</th>
									<td>
										<p class="text_price">
											<strong class="mm_text-secondary">{{ number(235450) }}</strong>
										</p>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>
				<template v-if="paymentMethod === 'deposit' || paymentMethod === 'escrow' || paymentMethod === 'bank'">
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
					</section>
				</template>
			</div>
			<div class="mm_inner">
				<div class="mm_foot">
					<div class="mm_btn_box">
						<button
							type="button"
							class="mm_btn T=primary"
						>
							<b>취소 신청하기</b>
						</button>
					</div>
				</div>
				<div class="mm_note">
					<dropdown
						:is-active="true"
						icon-class="T=sm"
					>
						<template #button>
							<i class="ico_info"></i><b>주문 취소 주의사항</b>
						</template>
						<template #content>
							<ul>
								<li>취소 시, 결제 수단의 경우 원 결제 수단 취소로 진행됩니다.</li>
								<li>휴대폰 주문은 결제한 당월이 지날 경우 원 결제 취소가 불가합니다.</li>
							</ul>
						</template>
					</dropdown>
				</div>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, defineAsyncComponent, computed } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import FormTextarea from '@/component/form/FormTextarea.vue';

	const { number } = useFormatter();
	const { openOverlay } = useGlobalPageContext();

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

	function overlayMyCancelChoice() {
		const component = defineAsyncComponent(() => import('@/page/mypage/order/pick/MyOrderPick.vue'));

		return openOverlay(component);
	}

	function overlayMyRefundUpdate() {
		const component = defineAsyncComponent(() => import('@/page/mypage/refund/update/MyRefundUpdate.vue'));

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

	const sortCencel = ref('');
	const isWriteReason = computed(() => sortCencel.value === 'etc');
	const paymentMethod = ref('deposit');

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
	const cancelItems = ref<test[]>([
		{ id: '1' },
		{ id: '2' },
		{ id: '3' },
	]);
	const selectedItems = ref<test[]>(cancelItems.value.filter(_item => !_item.id));
</script>