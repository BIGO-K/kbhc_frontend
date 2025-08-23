<template>
	<layout
		title="주문/결제"
		layout="popup"
		class="L=lowbtn"
	>
		<template #title>
			주문/결제
		</template>

		<template #default>
			<div class="m_order">
				<!-- 받는 분 정보 -->
				<dropdown
					class="T=order"
					:is-active="true"
				>
					<template #button>
						<b>{{ isPresent? '선물 ': '' }}받는 분 정보</b>
						<b class="text_contraction">{{ isPresent? '홍길동 ': '나의자취방' }}</b>
					</template>
					<template #content>
						<div class="mm_inner">
							<template v-if="isPresent">
								<h6 class="mm_text-label">
									<b>이름</b>
								</h6>
								<form-text
									v-model="orderPresentName"
									placeholder="이름을 입력하세요"
								></form-text>
								<h6 class="mm_text-label">
									<b>휴대폰 번호</b>
								</h6>
								<form-text
									v-model="orderPresentPhone"
									placeholder="휴대폰 번호를 입력하세요"
								></form-text>
							</template>
							<template v-else-if="isGifticon">
								<h6 class="mm_text-label">
									<b>이름</b>
								</h6>
								<p class="text_readonly">
									<b>{{ '홍길동' }}</b>
								</p>
								<h6 class="mm_text-label">
									<b>휴대폰 번호</b>
								</h6>
								<p class="text_readonly">
									<b>{{ '01012345678' }}</b>
								</p>
							</template>
							<template v-else>
								<h6 class="mm_text-label">
									<b>이메일 주소</b>
								</h6>
								<form-text
									v-model="orderEmail"
									placeholder="이메일을 입력하세요"
								></form-text>
								<h6 class="text_address-info">
									<b>배송지 정보</b>
								</h6>
								<div
									v-if="testAddressList.length > 0"
									class="mm_address-list T=scroller"
								>
									<div class="mm_scroller T=x">
										<ul>
											<li
												v-for="address in testAddressList"
												:key="address.id"
											>
												<input
													type="radio"
													name="dev_radio-address"
													:value="address.id"
													:title="address.shipping_name"
													checked
												>
												<div class="mm_address-item">
													<i class="ico_form-radio T=circle"></i>
													<dl>
														<dt>
															<b>{{ address.shipping_name }}</b>
															<b
																v-if="address.is_recent"
																class="mm_tag"
															>
																최근배송지
															</b>
														</dt>
														<dd>{{ address.name }} / {{ address.tel }}</dd>
														<dd>{{ address.zip_code }}<br>{{ address.base_address }}<br>{{ address.detail_address }}</dd>
													</dl>
												</div>
												<button
													type="button"
													class="btn_remove"
												>
													<b>삭제</b>
												</button>
											</li>
											<li>
												<a
													class="mm_address-item"
													href="#"
													@click.prevent="overlayAddressCreate"
												>
													<i class="ico_plus"></i><b>신규 배송지 등록</b>
												</a>
											</li>
										</ul>
									</div>
								</div>
								<a
									v-else
									class="mm_maddress-ite"
									href="#"
									@click.prevent="overlayAddressCreate"
								>
									<i class="ico_plus"></i><b>배송지를 등록하세요</b>
								</a>

								<form-select v-model="sortDeliveryNote">
									<option>배송메모를 선택하세요</option>
									<option value="note">
										직접입력
									</option>
								</form-select>
								<div
									v-if="sortDeliveryNote === 'note'"
									class="m_address_note"
								>
									<form-text
										v-model="orderDeliveryNote"
										maxlength="20"
										placeholder="배송메모를 입력하세요"
									></form-text>
								</div>
							</template>

							<template v-if="isUnipass">
								<!-- 해외배송 개인통관고유부호 -->
								<section class="m_order-unipass">
									<h6 class="mm_text-label">
										<b>해외배송 개인통관 고유부호</b>
									</h6>
									<form-text
										v-model="orderUnipass"
										maxlength="13"
										placeholder="P로 시작하는 정보를 입력하세요"
									></form-text>
									<div class="mm_note T=bg">
										<ul>
											<li>해외배송 상품은 관세청 통관을 위해 구매 고객의 고유식별정보를 판매자에게 제공합니다.</li>
											<li>개인통관고유부호는 통관 시 주민등록번호 대신 사용 가능한 번호로, 관세청 사이트에서 발급 받으실 수 있습니다.</li>
										</ul>
									</div>
									<a
										class="btn_unipass"
										href="#"
									>
										<b>개인통관고유부호 발급/확인하기</b><i class="ico_link"></i>
									</a>
									<div class="mm_check-list">
										<ul>
											<li>
												<div class="mm_flex">
													<form-check
														v-model="unipassCollectAgree"
														icon-class="T=sm"
													>
														<span class="text_label">해외배송 상품의 수입신고를 위한 개인통관고유부호 수집에 동의합니다.</span>
													</form-check>
													<a
														class="btn_detail"
														href="#"
														@click.prevent="overlayOrderUnipass"
													>
														<b>자세히</b>
													</a>
												</div>
											</li>
											<li>
												<div class="mm_flex">
													<form-check
														v-model="unipassSellerAgree"
														icon-class="T=sm"
													>
														<span class="text_label">해외배송 상품의 수입신고를 위한 개인통관고유부호 판매자 제공 동의합니다.</span>
													</form-check>
													<a
														class="btn_detail"
														href="#"
														@click.prevent="overlayOrderUnipass"
													>
														<b>자세히</b>
													</a>
												</div>
											</li>
										</ul>
									</div>
								</section>

								<section class="m_order-unipass">
									<h6 class="mm_text-label">
										<b>해외배송 개인통관 고유부호</b>
									</h6>
									<p class="text_readonly">
										<b>{{ 'P123456789' }}</b>
									</p>
									<button
										type="button"
										class="mm_btn T=xs T=secondary btn_modify"
									>
										<b>수정</b>
									</button>
									<div class="mm_check-list">
										<ul>
											<li>
												<div class="mm_flex">
													<form-check
														v-model="overseasSellerAgree"
														icon-class="T=sm"
													>
														<span class="text_label">해외배송 상품의 수입신고를 위한 개인통관고유부호 판매자 제동 동의</span>
													</form-check>
													<a
														class="btn_detail"
														href="#"
														@click.prevent="overlayOrderUnipass"
													>
														<b>자세히</b>
													</a>
												</div>
											</li>
										</ul>
									</div>
								</section>
							</template>
						</div>
					</template>
				</dropdown>
				<hr class="mm_line">

				<template v-if="isPresent">
					<!-- 선물 메시지 -->
					<dropdown
						class="T=order m_order-present"
						:is-active="true"
					>
						<template #button>
							<b>선물 메시지</b>
						</template>
						<template #content>
							<div class="mm_inner">
								<div class="m_present-message">
									<i
										class="image_card mm_bg-cover"
										:style="`background-image: url(/image/content/present_card_${selectedThumbnail}.png)`"
									></i>
									<form-textarea
										v-model="orderPresentMessage"
										maxlength="100"
										:byte="100"
										placeholder="고마운 마음을 담아 보냅니다."
									></form-textarea>
								</div>
							</div>
							<div class="mm_scroller T=x">
								<div class="m_present-card">
									<ul>
										<li
											v-for="thumbnail in thumbnailList"
											:key="thumbnail"
										>
											<button
												type="button"
												class="btn_thumbnail"
												:class="{ 'S=on': selectedThumbnail === thumbnail }"
												@click="selectedThumbnail = thumbnail"
											>
												<lazyload
													class="mm_bg-cover"
													:src="`/image/content/present_card_thumbnail_${thumbnail}.png`"
												></lazyload>
											</button>
										</li>
									</ul>
								</div>
							</div>
						</template>
					</dropdown>
					<hr class="mm_line">
				</template>

				<!-- 상품 정보 -->
				<dropdown
					class="T=order"
					:is-active="true"
				>
					<template #button>
						<b>상품 정보</b>
						<b class="text_contraction"><span class="text_count"><strong>3</strong><sub>건</sub></span><span class="text_price"><strong>{{ number(239000) }}</strong></span></b>
					</template>
					<template #content>
						<div class="mm_order-item">
							<form-check
								v-model="maxDiscount"
								label="최대할인 적용"
								icon-class="T=sm"
							></form-check>
							<div
								v-for="pack, index in testSheet.packs"
								:key="index"
								class="mm_order-item-seller"
							>
								<div class="mm_order...seller-head">
									<p class="text_ship">
										<i class="ico_ship"></i>
										<span v-if="pack.charged_shipping_price === 0">무료배송</span>
										<span
											v-else
											class="text_price"
										>
											<strong>{{ number(pack.charged_shipping_price) }}</strong>
										</span>
									</p>
								</div>

								<div class="mm_product-list T=sm">
									<ul>
										<li
											v-for="item in pack.mergedOrderItems"
											:key="item.key"
										>
											<p class="text_seller">
												<i class="ico_shop"></i>{{ item.seller_name }}
											</p>
											<div class="mm_product-item">
												<a>
													<figure>
														<div class="mm_product-item-image">
															<lazyload
																class="mm_bg-cover image_product"
																:src="item.goods.thumbnail_url"
															></lazyload>
														</div>
														<figcaption>
															<p class="text_brand">{{ item.goods.brand_name }}</p>
															<p class="text_product">{{ item.goods.name }}</p>
															<p class="text_price"><del><span>{{ number(item.goods.base_discounted_price) }}</span></del><strong>{{ number(item.goods.sell_price) }}</strong></p>
															<p class="text_option">{{ item.option.name }} / {{ item.ea }}개</p>
														</figcaption>
													</figure>
												</a>
											</div>
											<div class="mm_product-unit">
												<div class="mm_product-unit-indent">
													<template v-if="item.usable_coupon_regists.length === 0">
														<p class="text_coupon">
															<b>쿠폰 적용: {{ '0' }}개</b>
															<b class="mm_btn T=xs">쿠폰적용</b>
														</p>
													</template>
													<template v-else>
														<p class="text_coupon">
															<b>쿠폰 적용: {{ number(1000) }}개</b>
															<a
																class="mm_btn T=xs"
																:class="true ? 'T=primary' : 'T=support'"
																href="#"
																@click.prevent="overlayOrderCoupon"
															>
																<b>쿠폰적용</b>
															</a>
														</p>
													</template>
												</div>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</template>
				</dropdown>
				<hr class="mm_line">

				<!-- 포인트 사용 -->
				<dropdown
					class="T=order m_order-point"
					:is-active="true"
				>
					<template #button>
						<b>포인트 사용</b>
						<b class="text_contraction"><span class="text_point"><strong>{{ number(12000) }}</strong><sub>원</sub></span></b>
					</template>
					<template #content>
						<div class="mm_inner">
							<section>
								<h6 class="text_point">
									<b>사용가능 스타포인트: <strong>{{ number(210000) }}</strong><sub>P</sub></b>
								</h6>
								<div class="mm_form_mix-linked">
									<form-text
										v-model="orderUseStarPoint"
										type="number"
										maxlength="50"
										placeholder="스타포인트 입력"
									></form-text>
									<div></div>
									<button
										type="button"
										class="mm_btn T=lg T=primary btn_all"
									>
										<b>모두 사용</b>
									</button>
								</div>
								<div class="mm_note T=bg">
									<ul>
										<li>사용가능 스타포인트는 전체 사용 가능합니다.</li>
									</ul>
								</div>
							</section>
							<section>
								<h6 class="text_point">
									<b>사용가능 리워드포인트: <strong>{{ number(210000) }}</strong><sub>P</sub></b>
								</h6>
								<div class="mm_form_mix-linked">
									<form-text
										v-model="orderUseRewardPoint"
										type="number"
										maxlength="50"
										placeholder="리워드포인트 입력"
									></form-text>
									<div></div>
									<button
										type="button"
										class="mm_btn T=lg T=primary btn_all"
									>
										<b>모두 사용</b>
									</button>
								</div>
								<div class="mm_note T=bg">
									<ul>
										<li>사용가능 리워드포인트는 전체 사용 가능합니다.</li>
									</ul>
								</div>
							</section>
						</div>
					</template>
				</dropdown>
				<hr class="mm_line">

				<!-- 최종 결제금액 -->
				<dropdown
					class="T=order m_order-cost"
					:is-active="true"
				>
					<template #button>
						<b>최종 결제금액</b>
						<b class="text_contraction"><span class="text_price"><strong class="mm_text-variable">{{ number(239000) }}</strong></span></b>
					</template>
					<template #content>
						<div class="mm_cost">
							<table>
								<tbody>
									<tr>
										<th scope="row">
											<b>총 상품금액</b>
										</th>
										<td>
											<p class="text_price">
												<strong>{{ number(210000) }}</strong>
											</p>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<b>총 배송비 금액</b>
										</th>
										<td>
											<p class="text_price">
												+ <strong>{{ number(2500) }}</strong>
											</p>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<b>총 할인금액</b>
										</th>
										<td>
											<p class="text_price">
												- <strong>{{ number(6200) }}</strong>
											</p>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<b>스타포인트 사용금액</b>
										</th>
										<td>
											<p class="text_point">
												- <strong>{{ number(2500) }}</strong><sub>원</sub>
											</p>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<b>리워드포인트 사용금액</b>
										</th>
										<td>
											<p class="text_point">
												- <strong>{{ number(3000) }}</strong><sub>원</sub>
											</p>
										</td>
									</tr>
								</tbody>
								<tfoot>
									<tr>
										<th scope="row">
											<b>총 결제 예상금액</b>
										</th>
										<td>
											<p class="text_price">
												<strong class="mm_text-variable">{{ number(201510) }}</strong>
											</p>
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					</template>
				</dropdown>
				<hr class="mm_line">

				<!-- 결제수단 선택 -->
				<dropdown
					class="T=order m_order-payment"
					:is-active="true"
				>
					<template #button>
						<b>결제수단 선택</b>
						<b class="text_contraction">{{ '신용/체크카드' }}</b>
					</template>
					<template #content>
						<ul>
							<li>
								<div class="m_order-payment-other">
									<!-- 결제수단 목록 -->
									<div class="m_order-payment-method">
										<ul>
											<template v-if="usePayment === 'star'">
												<li>
													<form-radio
														v-model="paymentMethod"
														name="dev_radio-payment"
														value="star"
													>
														<b class="text_label">스타포인트 결제</b>
													</form-radio>
												</li>
											</template>
											<template v-else-if="usePayment === 'reward'">
												<li>
													<form-radio
														v-model="paymentMethod"
														name="dev_radio-payment"
														value="reward"
													>
														<b class="text_label">리워드포인트 결제</b>
													</form-radio>
												</li>
											</template>
											<template v-else-if="usePayment === 'starReward'">
												<li>
													<form-radio
														v-model="paymentMethod"
														name="dev_radio-payment"
														value="reward"
													>
														<b class="text_label">스타포인트, 리워드포인트 결제</b>
													</form-radio>
												</li>
											</template>
											<template v-else>
												<li
													v-for="item in paymentItems"
													:key="item.key"
												>
													<form-radio
														v-model="paymentMethod"
														name="dev_radio-payment"
														:value="item.key"
													>
														<b class="text_label">{{ item.name }}</b>
													</form-radio>
												</li>

												<easypay-order-payments
													v-model:payment-method="paymentMethod"
												></easypay-order-payments>
											</template>
										</ul>
									</div>

									<!-- 신용/체크카드 -->
									<div
										v-if="paymentMethod === 'card'"
										class="m_method-card"
									>
										<div class="mm_inner">
											<template v-if="!isSubscription">
												<div class="mm_note T=bg">
													<ul>
														<li>정기구독은 신용/체크 카드 결제만 가능합니다.</li>
														<li>결제하신 신용/체크 카드로 정기구독 자동 결제 진행됩니다.</li>
													</ul>
												</div>
											</template>
											<template v-else>
												<form-select v-model="sortCard">
													<option>카드를 선택하세요</option>
												</form-select>
												<form-select v-model="sortInstallment">
													<option>일시불</option>
												</form-select>
												<a
													class="btn_card-info"
													href="#"
													@click.prevent="overlayCardBenefit"
												>
													<b>무이자할부 안내</b><i class="ico_link"></i>
												</a>
											</template>
										</div>
									</div>

									<easypay-order-payments-note :payment-method="paymentMethod"></easypay-order-payments-note>
								</div>
							</li>
						</ul>
					</template>
				</dropdown>
				<hr class="mm_line">

				<!-- 약관동의 안내 -->
				<div class="mm_inner m_order-agree">
					<div class="m_order-agree-inner">
						<h6><b>주문상품정보 및 서비스 이용약관에 동의</b></h6>
						<ul>
							<li><p>구매조건 확인 및 결제 진행 동의</p></li>
							<li>
								<p>개인정보 제 3자 제공 동의</p>
								<toggle
									class="btn_more"
									parent-selector=".m_order-agree"
								>
									<b>자세히</b>
								</toggle>
							</li>
						</ul>
					</div>
					<table>
						<tbody>
							<tr>
								<th scope="row">
									<b>제공 받는 자</b>
								</th>
								<td>공급사 판매자</td>
							</tr>
							<tr>
								<th scope="row">
									<b>목적</b>
								</th>
								<td>판매자와 구매자의 거래의 원활한 진행, 본인의사의확인, 고객 상담 및 불만처리, 상품과 경품 배송을 위한 배송지 확인 등</td>
							</tr>
							<tr>
								<th scope="row">
									<b>항목</b>
								</th>
								<td>이름, ID, 휴대폰번호, 이메일 주소,전 화번호, 상품 구매정보, 상품 수취인정보(성명, 주소, 전화번호)</td>
							</tr>
							<tr>
								<th scope="row">
									<b>보유 및 이용기간</b>
								</th>
								<td>이용목적 달성 시까지 보관</td>
							</tr>
						</tbody>
					</table>
					<p>위 주문 내용을 확인하였으며, 결제에 동의합니다.</p>

					<raffle-order-note v-if="isRaffle"></raffle-order-note>
				</div>
			</div>
		</template>

		<template #button>
			<div class="mm_btn_box T=fixed">
				<button
					type="button"
					class="mm_btn T=primary btn_order"
				>
					<b><strong>{{ '34,590' }}</strong>원 결제하기</b>
				</button>
			</div>
		</template>
	</layout>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import Toggle from '@/component/Toggle.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormRadio from '@/component/form/FormRadio.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import FormText from '@/component/form/FormText.vue';
	import FormTextarea from '@/component/form/FormTextarea.vue';
	import EasypayOrderPayments from '@/feature/easypay/component/EasypayOrderPayments.vue';
	import EasypayOrderPaymentsNote from '@/feature/easypay/component/EasypayOrderPaymentsNote.vue';
	import RaffleOrderNote from '@/feature/raffle/component/RaffleOrderNote.vue';

	const { number } = useFormatter();
	const { openOverlay } = useGlobalPageContext();

	function overlayCardBenefit() {
		const component = defineAsyncComponent(() => import('@/page/card-benefit/CardBenefit.vue'));

		return openOverlay(component);
	}

	function overlayAddressCreate() {
		const component = defineAsyncComponent(() => import('@/page/address/create/AddressCreate.vue'));

		return openOverlay(component);
	}

	function overlayOrderUnipass() {
		const component = defineAsyncComponent(() => import('@/page/order/unipass/OrderUnipass.vue'));

		return openOverlay(component);
	}

	function overlayOrderCoupon() {
		const component = defineAsyncComponent(() => import('@/page/order/coupon/OrderCoupon.vue'));

		return openOverlay(component);
	}

	const paymentItems = [
		{
			key: 'card',
			name: '신용/체크카드',
		},
		{
			key: 'kb',
			name: 'KB pay',
		},
	];

	const thumbnailList = [1, 2, 3, 4, 5];
	const selectedThumbnail = ref(1);

	const isSubscription = ref(Math.floor(Math.random() * 2) == 0 ? true : false);
	const sortDeliveryNote = ref('');
	const sortCard = ref('');
	const sortInstallment = ref('');
	const paymentMethod = ref('');
	const usePayment = ref('');
	const maxDiscount = ref(false);
	const orderDeliveryNote = ref('');
	const isPresent = ref(Math.floor(Math.random() * 2) == 0 ? true : false);
	const isGifticon = ref(Math.floor(Math.random() * 2) == 0 ? true : false);
	const isUnipass = ref(Math.floor(Math.random() * 2) == 0 ? true : false);
	const isRaffle = ref(Math.floor(Math.random() * 2) == 0 ? true : false);
	const orderPresentName = ref('');
	const orderPresentPhone = ref('');
	const orderPresentMessage = ref('');
	const orderEmail = ref('');
	const orderUnipass = ref('');
	const orderUseStarPoint = ref();
	const orderUseRewardPoint = ref();
	const unipassCollectAgree = ref(Math.floor(Math.random() * 2) == 0 ? true : false);
	const unipassSellerAgree = ref(Math.floor(Math.random() * 2) == 0 ? true : false);
	const overseasSellerAgree = ref(false);

	const testAddressList = ref<MyShippingAddressDetail[]>([
		{
			id: 1,
			name: '홍길동',
			shipping_name: '나의자취방',
			tel: '010-1234-1234',
			zip_code: '06616',
			base_address: '부산광역시 강서구 녹산산단382로 14번가길 10~29번지(송정동)',
			detail_address: '302동 101호',
			is_recent: true,
		},
		{
			id: 2,
			name: '홍길동',
			shipping_name: '직장',
			tel: '010-1234-1234',
			zip_code: '06616',
			base_address: '서울특별시 도봉구 창2동 647-12',
			detail_address: '람마을10단지동양엔파트월드메르디앙 302동 101호',
			is_recent: false,
		},
	]);

	const testSheet = ref<OrderSheet>({
		packs: [
			{
				charged_shipping_price: 2500,
				mergedOrderItems: [
					{
						key: '1',
						seller_name: '엠몬스타',
						usable_coupon_regists: [
							{
								regist_id: 1,
								coupon: {
									id: 1,
								},
							},
						],
						goods: {
							brand_name: 'M.Mon 엠몬스타',
							name: '플리츠 디테일 드레스_MJM1OP3140',
							thumbnail_url: `/image/_sample/prod_x1_${Math.floor(Math.random() * 4) + 1}.png`,
							base_discounted_price: 118800,
							sell_price: 54800,
						},
						option: {
							name: '네이비',
						},
						ea: 1,
					},
					{
						key: '2',
						seller_name: '엠몬스타0',
						usable_coupon_regists: [],
						goods: {
							brand_name: 'M.Mon 엠몬스타',
							name: '플리츠 디테일 드레스_MJM1OP3140',
							thumbnail_url: `/image/_sample/prod_x1_${Math.floor(Math.random() * 4) + 1}.png`,
							base_discounted_price: 118800,
							sell_price: 54800,
						},
						option: {
							name: '네이비',
						},
						ea: 2,
					},
				],
			},
			{
				charged_shipping_price: 0,
				mergedOrderItems: [
					{
						key: '1',
						seller_name: '엠몬스타',
						usable_coupon_regists: [
							{
								regist_id: 1,
								coupon: {

								},
							},
						],
						goods: {
							brand_name: 'M.Mon 엠몬스타',
							name: '플리츠 디테일 드레스_MJM1OP3140',
							thumbnail_url: `/image/_sample/prod_x1_${Math.floor(Math.random() * 4) + 1}.png`,
							base_discounted_price: 118800,
							sell_price: 54800,
						},
						option: {
							name: '네이비',
						},
						ea: 1,
					},
				],
			},
		],
	} as unknown as OrderSheet);
</script>