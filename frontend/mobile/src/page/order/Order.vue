<template>
	<page-move
		v-if="payingStart"
		@complete="endProcess"
	></page-move>
	<layout
		v-else
		title="주문/결제"
		layout="popup"
		class="L=lowbtn"
	>
		<template #title>
			주문/결제
		</template>

		<template #default>
			<div class="m_order">
				<!-- 주문자 정보 -->
				<dropdown
					class="T=order"
					:is-active="true"
				>
					<template #button>
						<b>주문자 정보</b>
					</template>
					<template #content>
						<div class="mm_inner">
							<h6 class="mm_text-label">
								<b>이메일 주소</b>
							</h6>
							<form-text
								v-model="form.orderer_info.email"
								placeholder="이메일을 입력하세요"
							></form-text>
						</div>
					</template>
				</dropdown>
				<hr class="mm_line">

				<!-- 받는 분 정보 -->
				<dropdown
					class="T=order"
					:is-active="true"
				>
					<template #button>
						<b>{{ isPresent? '선물 ': '' }}받는 분 정보</b>
						<b class="text_contraction">{{ isPresent? form.gift_info.receiver_name : selectedAddress?.shipping_name || '' }}</b>
					</template>
					<template #content>
						<div class="mm_inner">
							<template v-if="isPresent">
								<h6 class="mm_text-label">
									<b>이름</b>
								</h6>
								<form-text
									v-model="form.gift_info.receiver_name"
									maxlength="5"
									placeholder="이름을 입력하세요"
								></form-text>
								<h6 class="mm_text-label">
									<b>휴대폰 번호</b>
								</h6>
								<form-text
									v-model="form.gift_info.receiver_phone"
									maxlength="11"
									type="tel"
									input-mode="number"
									placeholder="휴대폰 번호를 입력하세요(필수·숫자만입력)"
								></form-text>
							</template>
							<template v-else-if="isNotNeedReceiveAddress">
								<h6 class="mm_text-label">
									<b>이름</b>
								</h6>
								<p class="text_readonly">
									<b>{{ member?.name }}</b>
								</p>
								<h6 class="mm_text-label">
									<b>휴대폰 번호</b>
								</h6>
								<p class="text_readonly">
									<b>{{ sheet.orderer_information.phone }}</b>
								</p>
							</template>
							<template v-else>
								<h6 class="text_address-info">
									<b>배송지 정보</b>
								</h6>
								<div class="mm_address-list T=scroller">
									<div class="mm_scroller T=x">
										<ul>
											<li
												v-for="address in addresses"
												:key="address.id"
											>
												<input
													v-model="form.receive_address.id"
													type="radio"
													name="radio-address"
													:value="address.id"
													:checked="form.receive_address.id === address.id"
													:title="address.name"
												>
												<div class="mm_address-item">
													<i class="ico_form-radio T=check"></i>
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
													@click="removeAddress(address)"
												>
													<b>삭제</b>
												</button>
											</li>
											<li>
												<a
													class="mm_address-item"
													href="#"
													@click.prevent="_e => overlayAddressCreate(_e)"
												>
													<i class="ico_plus"></i><b>신규 배송지 등록</b>
												</a>
											</li>
										</ul>
									</div>
								</div>

								<form-select
									v-model="selectedShippingMessageTemplate"
									title="배송메모"
									:use-overlay="true"
									need-overlay-hide-first-option
								>
									<option
										v-for="template in shippingMessageTemplates"
										:key="template"
										:value="template"
									>
										{{ template }}
									</option>
								</form-select>
								<div
									v-if="selectedShippingMessageTemplate.trim() === '직접 입력'"
									class="m_address_note"
								>
									<form-text
										v-model="shippingMessage"
										maxlength="20"
										placeholder="배송메모를 입력하세요"
									></form-text>
								</div>
							</template>

							<template v-if="sheet.need_personal_clearance_code && !isPresent">
								<!-- 해외배송 개인통관고유부호 -->
								<section class="m_order-unipass">
									<h6 class="mm_text-label">
										<b>해외배송 개인통관 고유부호</b>
									</h6>
									<template v-if="memberHasPersonClearanceCode && !editAblePersonalClearanceCode">
										<p class="text_readonly">
											<b>{{ sheet.orderer_information.personal_clearance_code }}</b>
										</p>
										<button
											type="button"
											class="mm_btn T=xs T=secondary btn_modify"
											@click="() => editAblePersonalClearanceCode = true"
										>
											<b>수정</b>
										</button>
										<div class="mm_check-list">
											<ul>
												<li>
													<div class="mm_flex">
														<form-check
															v-model="form.orderer_info.is_agree_provide_personal_clearance_code"
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
									</template>
									<template v-else>
										<form-text
											v-model="form.orderer_info.personal_clearance_code"
											maxlength="13"
											placeholder="P로 시작하는 정보를 입력하세요"
										></form-text>
										<form-check
											v-model="form.orderer_info.is_remember_personal_clearance_code"
											icon-class="T=sm"
											label="다음 주문 시에도 계속 사용"
										></form-check>
										<div class="mm_note T=bg">
											<ul>
												<li>해외배송 상품은 관세청 통관을 위해 구매 고객의 고유식별정보를 판매자에게 제공합니다.</li>
												<li>개인통관고유부호는 통관 시 주민등록번호 대신 사용 가능한 번호로, 관세청 사이트에서 발급 받으실 수 있습니다.</li>
											</ul>
										</div>
										<a
											class="btn_unipass"
											href="#"
											@click.prevent="openBrowser('https://unipass.customs.go.kr/csp/persIndexRectOnslCrtf.do?qryIssTp=1')"
										>
											<b>개인통관고유부호 발급/확인하기</b><i class="ico_link"></i>
										</a>
										<div class="mm_check-list">
											<ul>
												<li v-if="!memberHasPersonClearanceCode">
													<div class="mm_flex">
														<form-check
															v-model="form.orderer_info.is_agree_collect_personal_clearance_code"
															icon-class="T=sm"
														>
															<span class="text_label">해외배송 상품의 수입신고를 위한 개인통관고유부호 수집에 동의합니다.</span>
														</form-check>
														<button
															type="button"
															class="btn_detail"
															@click="_e => overlayOrderUnipass(_e)"
														>
															<b>자세히</b>
														</button>
													</div>
												</li>
												<li>
													<div class="mm_flex">
														<form-check
															v-model="form.orderer_info.is_agree_provide_personal_clearance_code"
															icon-class="T=sm"
														>
															<span class="text_label">해외배송 상품의 수입신고를 위한 개인통관고유부호 판매자 제공 동의합니다.</span>
														</form-check>
														<button
															type="button"
															class="btn_detail"
															@click="_e => overlayOrderUnipass(_e)"
														>
															<b>자세히</b>
														</button>
													</div>
												</li>
											</ul>
										</div>
									</template>
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
										:style="`background-image: url(${presentImageBasePath}_${selectedThumbnail}.png)`"
									></i>
									<form-textarea
										v-model="form.gift_info.message"
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
													:src="`${presentImageBasePath}_thumbnail_${thumbnail}.png`"
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
						<b class="text_contraction"><span class="text_count"><strong>{{ sheet.packs.length }}</strong><sub>건</sub></span><span class="text_price"><strong>{{ number(priceContext.goodsUnitPrice) }}</strong></span></b>
					</template>
					<template #content>
						<div class="mm_order-item">
							<form-check
								v-model="applyMaximumDiscount"
								label="최대할인 적용"
								icon-class="T=sm"
							></form-check>
							<div
								v-for="pack, index in sheet.packs"
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
															<p class="text_price">
																<span
																	v-if="item.list.some(item => item.appliable_immediately_sale)"
																	class="text_price-sale"
																>즉시할인 적용가</span>
																<del v-if="item.goods.price > item.goods.base_discounted_price"><span>{{ number(item.goods.price) }}</span></del>
																<strong>{{ number(totalDiscountedPriceByItemSet[item.key]) }}</strong>
															</p>
															<p class="text_option">{{ item.option.name }} / {{ item.ea }}개</p>
														</figcaption>
													</figure>
												</a>
											</div>
											<div class="mm_product-unit">
												<div class="mm_product-unit-indent">
													<template v-if="usableCouponRegists(item).length < 1">
														<p class="text_coupon">
															<b>쿠폰 적용: {{ '0' }}개</b>
															<b class="mm_btn T=xs">쿠폰적용</b>
														</p>
													</template>
													<template v-else>
														<p class="text_coupon">
															<b>쿠폰 적용: {{ number(appliedCouponCountByItemSet[item.key]) }}개</b>
															<b
																v-if="item.goods.bundle_goods_id"
																class="mm_btn T=xs"
															>쿠폰적용</b>
															<button
																v-else
																type="button"
																class="mm_btn T=xs"
																:class="true ? 'T=primary' : 'T=support'"
																@click="_e => overlayOrderCoupon(_e)"
															>
																<b>쿠폰적용</b>
															</button>
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
				<template v-if="sheet.usable_points.reward_point || sheet.usable_points.star_point">
					<dropdown
						class="T=order m_order-point"
						:is-active="true"
					>
						<template #button>
							<b>포인트 사용</b>
							<b class="text_contraction"><span class="text_point"><strong>{{ number(form.payment_info.using_star_point + form.payment_info.using_reward_point) }}</strong><sub>원</sub></span></b>
						</template>
						<template #content>
							<div class="mm_inner">
								<section v-if="sheet.usable_points.star_point">
									<h6 class="text_point">
										<b>사용가능 스타포인트: <strong>{{ number(sheet.orderer_information.star_point_balance) }}</strong><sub>P</sub></b>
									</h6>
									<div class="mm_form_mix-linked">
										<template v-if="paymentPriceBeforePointWithoutShippingPrice === form.payment_info.using_reward_point">
											<p class="text_readonly">
												스타포인트를 입력해주세요
											</p>
										</template>
										<form-text
											v-else
											v-model="form.payment_info.using_star_point"
											:max="usableStarPointAmount"
											:default="0"
											input-mode="number"
											maxlength="50"
											:regexp="REGEXP.NUMBER"
											placeholder="스타포인트 입력"
										></form-text>
										<button
											type="button"
											class="mm_btn T=lg T=primary btn_all"
											:disabled="usableStarPointAmount === 0 || paymentPriceBeforePointWithoutShippingPrice === form.payment_info.using_reward_point"
											@click="form.payment_info.using_star_point = usableStarPointAmount"
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
								<section v-if="sheet.usable_points.reward_point">
									<h6 class="text_point">
										<b>사용가능 리워드포인트: <strong>{{ number(sheet.orderer_information.reward_point_balance) }}</strong><sub>P</sub></b>
									</h6>
									<div class="mm_form_mix-linked">
										<template v-if="paymentPriceBeforePointWithoutShippingPrice === form.payment_info.using_star_point">
											<p class="text_readonly">
												리워드포인트를 입력해주세요
											</p>
										</template>
										<form-text
											v-else
											v-model="form.payment_info.using_reward_point"
											:max="usableRewardPointAmount"
											:default="0"
											input-mode="number"
											maxlength="50"
											:regexp="REGEXP.NUMBER"
											placeholder="리워드포인트 입력"
										></form-text>
										<button
											type="button"
											class="mm_btn T=lg T=primary btn_all"
											:disabled="usableRewardPointAmount === 0 || paymentPriceBeforePointWithoutShippingPrice === form.payment_info.using_star_point"
											@click="form.payment_info.using_reward_point = usableRewardPointAmount"
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
				</template>

				<!-- 최종 결제금액 -->
				<dropdown
					class="T=order m_order-cost"
					:is-active="true"
				>
					<template #button>
						<b>최종 결제금액</b>
						<b class="text_contraction"><span class="text_price"><strong class="mm_text-variable">{{ number(finalPaymentPrice) }}</strong></span></b>
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
												<strong>{{ number(priceContext.goodsUnitPrice) }}</strong>
											</p>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<b>총 배송비 금액</b>
										</th>
										<td>
											<p class="text_price">
												+ <strong>{{ number(totalShippingPrice) }}</strong>
											</p>
										</td>
									</tr>
									<tr>
										<th scope="row">
											<b>총 할인금액</b>
										</th>
										<td>
											<p class="text_price">
												- <strong>{{ number(totalDiscountedPrice) }}</strong>
											</p>
										</td>
									</tr>
									<tr v-if="sheet.usable_points.star_point">
										<th scope="row">
											<b>스타포인트 사용금액</b>
										</th>
										<td>
											<p class="text_point">
												- <strong>{{ number(form.payment_info.using_star_point) }}</strong><sub>원</sub>
											</p>
										</td>
									</tr>
									<tr v-if="sheet.usable_points.reward_point">
										<th scope="row">
											<b>리워드포인트 사용금액</b>
										</th>
										<td>
											<p class="text_point">
												- <strong>{{ number(form.payment_info.using_reward_point) }}</strong><sub>원</sub>
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
												<strong class="mm_text-variable">{{ number(finalPaymentPrice) }}</strong>
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
						<b class="text_contraction">{{ selectedPayMethodLabel }}</b>
					</template>
					<template #content>
						<ul>
							<li>
								<div class="m_order-payment-other">
									<!-- 결제수단 목록 -->
									<div
										class="m_order-payment-method"
										:data-payall="isPayAllPoint"
										:data-onlypoint="payTypeOnlyPoint"
										:data-cd="paymentPointTypeLabel || 'null'"
									>
										<ul>
											<template v-if="isPayAllPoint && (payTypeOnlyPoint || paymentPointTypeLabel)">
												<template v-if="paymentPointTypeLabel === 'star'">
													<li>
														<form-radio
															:model-value="paymentPointTypeLabel"
															name="radio-payment"
															:value="`star`"
														>
															<b class="text_label">스타포인트 결제</b>
														</form-radio>
													</li>
												</template>
												<template v-else-if="paymentPointTypeLabel === 'reward'">
													<li>
														<form-radio
															:model-value="paymentPointTypeLabel"
															name="radio-payment"
															:value="`reward`"
														>
															<b class="text_label">리워드포인트 결제</b>
														</form-radio>
													</li>
												</template>
												<template v-else-if="paymentPointTypeLabel === 'starReward'">
													<li>
														<form-radio
															:model-value="paymentPointTypeLabel"
															name="radio-payment"
															:value="`starReward`"
														>
															<b class="text_label">스타포인트, 리워드포인트 결제</b>
														</form-radio>
													</li>
												</template>
											</template>
											<template v-else>
												<li
													v-for="payMethod in payMethods"
													:key="payMethod.label"
												>
													<form-radio
														v-model="form.payment_info.method"
														name="radio-payment"
														:value="payMethod.code"
													>
														<b class="text_label">{{ payMethod.label }}</b>
													</form-radio>
												</li>
											</template>
										</ul>
									</div>

									<!-- 신용/체크카드 -->
									<template v-if="!paymentPointTypeLabel">
										<div
											v-if="paymentMethodEngLabel === 'credit_card' || paymentMethodEngLabel === 'subscribe_credit_card'"
											class="m_method-card"
										>
											<div class="mm_inner">
												<template v-if="isSubscription">
													<div class="mm_note T=bg">
														<ul>
															<li>정기구독은 신용/체크 카드 결제만 가능합니다.</li>
															<li>결제하신 신용/체크 카드로 정기구독 자동 결제 진행됩니다.</li>
														</ul>
													</div>
												</template>
												<form-select
													v-model="form.payment_info.card_code"
													title="카드사"
													:use-overlay="true"
													need-overlay-hide-first-optionf
												>
													<option :value="undefined">
														카드를 선택하세요
													</option>
													<option
														v-for="creditCard in creditCards"
														:key="creditCard.code"
														:value="creditCard.code"
													>
														{{ creditCard.label }}
													</option>
												</form-select>
												<form-select
													v-model="form.payment_info.interest_month"
													title="할부기간"
													:use-overlay="true"
												>
													<option
														v-for="installMent in interest"
														:key="installMent.value"
														:disabled="installMent.disabled"
														:value="installMent.value"
													>
														{{ installMent.label }}
													</option>
												</form-select>
												<button
													type="button"
													class="btn_card-info"
													@click="_e => overlayCardBenefit(_e)"
												>
													<b>무이자할부 안내</b><i class="ico_link"></i>
												</button>
											</div>
										</div>

										<easypay-order-payments-note :payment-method="paymentMethodEngLabel"></easypay-order-payments-note>
									</template>
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

					<raffle-order-note v-if="false"></raffle-order-note>
				</div>
			</div>
		</template>

		<template #button>
			<div class="mm_btn_box T=fixed">
				<button
					type="button"
					class="mm_btn T=primary btn_order"
					@click="startProcess"
				>
					<b><strong>{{ number(finalPaymentPrice) }}</strong>원 결제하기</b>
				</button>
			</div>
		</template>
	</layout>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref, computed, watch } from 'vue';
	import { useStorage } from '@vueuse/core';
	import { useRouteParams } from '@vueuse/router';
	import { useOrderStore } from '$/stores/useOrderStore';
	import { usePayingProcessContextStore } from '$/stores/usePayingProcessContextStore';
	import { useAddress } from '$/composables/useAddress';
	import { useAppBridge } from '$/composables/useAppBridge';
	import { useCardInstallment } from '$/composables/useCardInstallment';
	import { useCreditCardInstallMentUtil } from '$/composables/useCreditCardInstallMentUtil';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useForm } from '$/composables/useForm';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyAddress } from '$/composables/useMyAddress';
	import { useOrderSheet } from '$/composables/useOrderSheet';
	import { usePopupWindow } from '$/composables/usePopupWindow';
	import { STORE_BASE_KEY, STORE_PAY_PROCESS_CONTEXT_KEY } from '$/constants';
	import { REGEXP } from '$/constants/REGEXP';
	import Layout from '@/component/layout/Layout.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import PageMove from '@/component/PageMove.vue';
	import Toggle from '@/component/Toggle.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormRadio from '@/component/form/FormRadio.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import FormText from '@/component/form/FormText.vue';
	import FormTextarea from '@/component/form/FormTextarea.vue';
	import EasypayOrderPaymentsNote from '@/feature/easypay/component/EasypayOrderPaymentsNote.vue';
	import RaffleOrderNote from '@/feature/raffle/component/RaffleOrderNote.vue';

	const { number } = useFormatter();
	const { openOverlay, router, bom, loading, member } = useGlobalPageContext();
	const orderId = useRouteParams<string>('id');
	const orderStore = useOrderStore();

	const orderProcessContextStore = usePayingProcessContextStore();
	const payingStart = ref<boolean>(false);

	const sheet = ref<OrderSheet>(await orderStore.getSheet(orderId.value));
	/** 정기구독 상품 여부 */
	const isSubscription = sheet.value.for_subscribe;
	const {
		shippingMessageTemplates,
		usableCouponRegists,
		appliedCouponCountByItemSet,
		applyMaximumDiscount,
		appliedCouponRegist,
		priceContext,
		getPayMethods,
		totalDiscountedPriceByItemSet,
		discountsByItem,
	} = useOrderSheet(sheet.value);


	const sate = useStorage(
		`${STORE_BASE_KEY}${STORE_PAY_PROCESS_CONTEXT_KEY}`,
		{ payingProcessContext: null, isCurrentProcessEnded: false },
		localStorage,
		{
			listenToStorageChanges: true,
		});

	const inAppProcessWatcherStop = watch(sate, (to) => {
		if (to.payingProcessContext && to.isCurrentProcessEnded) {
			router.replace({
				name: 'OrderResult',
				params: {
					id: orderId.value,
				},
			}).then(() => {
				loading.hide();
			});
		}
	}, {
		deep: true,
	});

	const { openWebview, isAppUser, openBrowser } = useAppBridge();
	if (!isAppUser) {
		inAppProcessWatcherStop();
	}
	/** 선물주문 여부 체크 필요 */
	const isPresent = computed(() => sheet.value.for_gift);
	const presentImageBasePath = `https://img-commerce.kbocare.co.kr/kbhc/gift_background_images/present_card`;
	/** 배송정보 필요없는 주문 관련 */
	const isNotNeedReceiveAddress = !sheet.value.need_delivery_info;
	/** 고유 통관 부호 처리  * */
	const memberHasPersonClearanceCode = sheet.value.orderer_information.personal_clearance_code !== null;
	const editAblePersonalClearanceCode = ref<boolean>(false);
	/** 회원 주소정보 */
	const myAddress = useMyAddress();
	const [pPayMethods, pMyAddress] = await Promise.all([
		getPayMethods(),
		myAddress.all(),
	]);
	/** 스타/리워드 포인트 지불 타입  관련 * */
	const paymentPointType = ref('');

	/** 실제 사용 가능한 결제수단 코드 */
	const goodsUsablePayTypeCode = computed(() => sheet.value.packs[0].items[0].goods_pay_type);
	/** 결제수단 포인트 수단 여부 체크 */
	const payTypeOnlyPoint = computed(() => [2, 4, 6].includes(goodsUsablePayTypeCode.value));
	/** 전체 주문서의 배송비 정보 */
	const totalShippingPrice = computed(() => {
		if (isExtraAreaShipping.value) {
			return priceContext.value.shippingPrice + priceContext.value.extraShippingPrice;
		}

		return priceContext.value.shippingPrice;
	});


	/** 결제수단별 라벨 처리 */
	if (payTypeOnlyPoint.value) {
		if (goodsUsablePayTypeCode.value === 2) paymentPointType.value = 'star';
		else if (goodsUsablePayTypeCode.value === 4) paymentPointType.value = 'reward';
		else paymentPointType.value = 'starReward';
	}
	const usableAllPayMethods = pPayMethods;
	const payMethods = computed<PayMethod[]>(() => {
		if (payTypeOnlyPoint.value && totalShippingPrice.value === 0) {
			return [];
		}
		if (isSubscription) {
			return usableAllPayMethods.filter(payMethod => payMethod.eng_label === 'subscribe_credit_card');
		}

		return usableAllPayMethods.filter(payMethod => payMethod.eng_label !== 'subscribe_credit_card');
	});

	/** 선택된 결제수단 라벨 */

	const selectedPayMethodLabel = computed(() => {
		if (totalShippingPrice.value === 0
			&& (payTypeOnlyPoint.value || (paymentPointTypeLabel.value && goodsUsablePayTypeCode.value === 7))
		) {
			if (paymentPointTypeLabel.value === 'star') {
				return '스타포인트';
			}
			else if (paymentPointTypeLabel.value === 'reward') {
				return '리워드포인트';
			}

			return '스타+리워드';
		}

		return payMethods.value.find((method) => {
			return method.code === form.value.payment_info.method;
		})?.label || '신용/체크카드';
	});
	/** 주소정보 */
	const addresses = ref(pMyAddress);
	const usablePayMethodCodes = computed(() => payMethods.value.flatMap(method => method.code));
	const { form, validate } = useForm<OrderForm>({
			orderer_info: {
				email: sheet.value.orderer_information.email || '',
				personal_clearance_code: sheet.value.orderer_information.personal_clearance_code || '',
				is_agree_collect_personal_clearance_code: sheet.value.orderer_information.personal_clearance_code === null ? false : true,
				is_agree_provide_personal_clearance_code: false,
				is_remember_personal_clearance_code: sheet.value.orderer_information.personal_clearance_code === null ? false : true,
				name: member?.value?.name || '',
				phone: sheet.value.orderer_information.phone,
			},
			for_gift: isPresent.value,
			receive_address: {
				id: addresses.value.length < 1 ? undefined : addresses.value.find(address => address.is_recent)?.id || addresses.value[0].id,
				name: '',
				phone: '',
				zip_code: '',
				base_address: '',
				detail_address: '',
				is_extra_area: false,
				message: '',
			},
			gift_info: {
				message: '',
				background_image_url: '',
				receiver_name: '',
				receiver_phone: '',
			},
			payment_info: {
				method: sheet.value.orderer_information.latest_payment_method_code
					? sheet.value.orderer_information.latest_payment_method_code
					: payMethods.value[0].code,
				eng_label: '',
				using_reward_point: 0,
				using_star_point: 0,
				card_code: sheet.value.orderer_information.latest_payment_card_code || undefined,
				interest_month: 0,
				is_interest_free: false,
				is_partial_interest: false,
				bank_code: sheet.value.orderer_information.latest_payment_bank_code || undefined,
				depositor_name: sheet.value.orderer_information.latest_payment_depositor_name || '',
				cash_receipt_apply_type: 3,
				cash_receipt_apply_key: '',
				cash_receipt_phone_number: '',
				cash_receipt_business_number: '',
				for_payment_price: 0,
			},
			refund_account: null,
			packs: [],
			giveaways: sheet.value.giveaway_groups.map(giveAwayGroup => {
				return {
					goods_id: giveAwayGroup.goods_id,
					giveaway_id: null,
				};
			}),
			need_delivery_info: sheet.value.need_delivery_info,
			need_personal_clearance_code: !isPresent.value && sheet.value.need_personal_clearance_code,
			my_pay_virtual_id: null,
		},
		{
			rule: {
				'orderer_info.email(이메일)': ['required', 'usableEmail'],
				'receive_address.id(배송지)': ['requiredIf:need_delivery_info,true'],
				'orderer_info.personal_clearance_code(개인통관 고유부호)': ['requiredIf:need_personal_clearance_code', 'validCode'],
				'orderer_info.is_agree_collect_personal_clearance_code(개인통관고유부호 수집에 동의)': ['validIsAgree'],
				'orderer_info.is_agree_provide_personal_clearance_code(개인통관고유부호 판매자 제공에 동의)': ['validIsAgree'],
				'giveaways.*.giveaway_id(사은품)': ['required'],
				'gift_info.receiver_name(선물 받으시는분 이름)': ['requiredIf:for_gift,true'],
				'gift_info.receiver_phone(선물 받으시는분 휴대폰 번호)': ['requiredIf:for_gift,true', 'validPhoneNumber:nullable'],
				'payment_info.method(결제수단)': ['required'],
				'payment_info.card_code(결제 카드)': ['requiredIf:payment_info.eng_label,credit_card'],
				'payment_info.bank_code(은행)': ['requiredIf:payment_info.eng_label,virtual_account'],
				'payment_info.depositor_name(입금자명)': ['requiredIf:payment_info.eng_label,virtual_account'],
				'payment_info.cash_receipt_apply_type(현금영수증 발급 신청 종류)': ['requiredIf:payment_info.eng_label,virtual_account', 'in:1,2,3'],
				'payment_info.cash_receipt_phone_number(현금영수증-휴대폰 번호)': ['validReceiptPhone'],
				'payment_info.cash_receipt_business_number(현금영수증-사업자 등록번호)': ['validReceiptBusinessNumber'],
			},
			message: {
				'orderer_info.email.required': ':param(을/를) 입력해주세요.',
				'receive_address.id.required': ':param(을/를) 설정해주세요.',
				'orderer_info.personal_clearance_code.requiredIf': ':param(을/를) 입력해주세요.',
				'orderer_info.personal_clearance_code.validCode': ':param(을/를) 확인해주세요.',
				'giveaways.*.giveaway_id.required': ':param(을/를) 선택해주세요.',
				'payment_info.card_code.requiredIf': ':param(을/를) 선택해주세요.',
				'payment_info.bank_code.requiredIf': ':param(을/를) 선택해주세요.',
				'payment_info.depositor_name.requiredIf': ':param(을/를) 입력해주세요.',
				'payment_info.cash_receipt_apply_type.requiredIf': ':param(을/를) 선택해주세요.',
				'payment_info.cash_receipt_apply_type.in': ':param(을/를) 선택해주세요.',
			},
			testers: [
				{
					name: 'validCode',
					defaultMessageOnFailure: ':param(을/를) 확인해주세요',
					handler: (): boolean => {
						if (sheet.value && !sheet.value.need_personal_clearance_code || isPresent.value) {
							return true;
						}

						return form.value.orderer_info.personal_clearance_code !== '' && /^[Pp][0-9]{12}$/g.test(form.value.orderer_info.personal_clearance_code);
					},
				},
				{
					name: 'validReceiptPhone',
					defaultMessageOnFailure: '올바른 휴대폰 번호를 입력해주세요',
					handler: (value): boolean => {
						if (form.value.payment_info.eng_label === 'virtual_account' && form.value.payment_info.cash_receipt_apply_type === 1) {
							const phoneNumberRegExp = /^010[0-9]{4}[0-9]{4}$/g;

							return `${value}`.match(phoneNumberRegExp) !== null;
						}

						return true;
					},
				},
				{
					name: 'validReceiptBusinessNumber',
					defaultMessageOnFailure: '올바른 사업자 번호를 입력해주세요.',
					handler: (value): boolean => {
						if (form.value.payment_info.eng_label === 'virtual_account' && form.value.payment_info.cash_receipt_apply_type === 2) {
							return value !== '' && `${value}`.match(/^[0-9]*$/g) !== null && `${value}`.length >= 10;
						}

						return true;
					},
				},
				{
					name: 'validIsAgree',
					defaultMessageOnFailure: ':param(을/를) 동의해주세요',
					handler: (value): boolean => {
						if (form.value.need_personal_clearance_code) {
							return `${value}` == 'true';
						}

						return true;
					},
				},
			],

		}
	);
	/** 포인트로 전액 결제 여부 */
	const isPayAllPoint = computed(() => {
		if (totalShippingPrice.value > 0) {
			return false;
		}

		if (payTypeOnlyPoint.value) {
			return true;
		}

		if (goodsUsablePayTypeCode.value !== 1) {
			return paymentPriceBeforePoint.value === form.value.payment_info.using_star_point + form.value.payment_info.using_reward_point;
		}

		return false;
	});

	/** 배송비를 제외한 결제지불금액 */
	const paymentPriceBeforePointWithoutShippingPrice = computed(() => paymentPriceBeforePoint.value - totalShippingPrice.value);

	/** 리워드 포인트 사용 가능 금액 */
	const usableRewardPointAmount = computed<number>(() => {
		const balance = sheet.value.orderer_information.reward_point_balance;
		if (balance < 1) {
			return 0;
		}

		return Math.min(
			paymentPriceBeforePointWithoutShippingPrice.value - form.value.payment_info.using_star_point,
			balance
		);
	});
	/** 스타 포인트 사용 가능 금액 처리 */
	const usableStarPointAmount = computed<number>(() => {
		const balance = sheet.value.orderer_information.star_point_balance;
		if (balance < 1) {
			return 0;
		}

		return Math.min(
			paymentPriceBeforePointWithoutShippingPrice.value - form.value.payment_info.using_reward_point,
			balance
		);
	});

	/** 총 할인 금액 */
	const totalDiscountedPrice = computed(() => {
		return priceContext.value.baseDiscountAmount
			+ priceContext.value.nightSaleAmount
			+ priceContext.value.couponDiscountAmount
			+ priceContext.value.immediatelySaleAmount;
	});
	/** 포인트 사용전 지불 금액 */
	const paymentPriceBeforePoint = computed(() => priceContext.value.goodsUnitPrice + totalShippingPrice.value - totalDiscountedPrice.value);
	/** 실제 지불해야할 금액 */
	const finalPaymentPrice = computed(() => paymentPriceBeforePoint.value - form.value.payment_info.using_reward_point - form.value.payment_info.using_star_point);
	/** 결제수단 영문명 */
	const paymentMethodEngLabel = computed(() => payMethods.value.find(method => method.code === form.value.payment_info.method)?.eng_label);
	/** 신용카드 관련  */
	const creditCards = computed(() => {
		return usableAllPayMethods.find(payMethod => {
			return payMethod.eng_label === 'credit_card';
		})?.child_methods || [];
	});

	/** 무이자 할부 처리  */
	const overlayCardBenefit = async (_e: MouseEvent) => {
		if (!cardInstallmentInfo.value) {
			cardInstallmentInfo.value = await getCardInterest();
		}
		openOverlay(defineAsyncComponent(() => import('@/page/card-benefit/CardBenefit.vue')), {
			props: {
				cardInstallmentInfo: cardInstallmentInfo.value,
			},
			clickElement: _e.currentTarget,
		});
	};
	/** [START] 배송지  */
	const isExtraAreaShipping = computed(() => {
		if (!form.value.receive_address.id || !form.value.need_delivery_info) {
			return false;
		}

		return addressExtraInfo.value[form.value.receive_address.id]?.is_extra || false;
	});
	/** 도서산간 배송지 정보 */
	const addressExtraInfo = ref <Record<number, { is_extra: boolean }>>({});
	/** 선택 배송지  */
	const selectedAddress = computed(() => addresses.value.find(address => address.id === form.value.receive_address.id));
	const { isExtraAreaCheck } = useAddress();

	watch(selectedAddress, async (to) => {
		if (!to || isPresent.value) {
			return;
		}

		if (addressExtraInfo.value[to.id]) {
			return;
		}

		addressExtraInfo.value[to.id] = {
			is_extra: form.value.need_delivery_info ? await isExtraAreaCheck(to.zip_code, to.base_address) : false,
		};
	}, {
		immediate: true,
	});

	const cardInstallmentInfo = ref<Nullable<CardInstallment>>(null);
	const isInterestDisabled = computed(() => {
		if (!form.value.payment_info.card_code) {
			return true;
		}

		return finalPaymentPrice.value <= 50000;
	});
	const { get: getCardInterest } = useCardInstallment();
	const { getUsableInstallMents } = useCreditCardInstallMentUtil(isInterestDisabled);
	const interest = ref<UsableInstallMentInfo[]>([]);
	/** 카드별 무이자 할부 정보 셋팅 */
	watch(() => form.value.payment_info.card_code, (newCardCode) => {
		interest.value = getUsableInstallMents(newCardCode);
	}, {
		immediate: true,
	});
	/** 배송 메세지 */
	const shippingMessage = ref(sheet.value.orderer_information.latest_shipping_message || '');
	/** 배송 메시지 템플릿 */
	const selectedShippingMessageTemplate = ref(shippingMessageTemplates.includes(shippingMessage.value) ? shippingMessage.value : '배송메모를 선택하세요');
	/** 배송지 삭제  */
	async function removeAddress(address: MyShippingAddressDetail) {
		loading.show();
		try {
			await myAddress.remove(address.id);
			addresses.value = await myAddress.all();
			if (form.value.receive_address.id && form.value.receive_address.id == address.id) {
				form.value.receive_address = {
					id: undefined,
					name: '',
					phone: '',
					zip_code: '',
					base_address: '',
					detail_address: '',
					is_extra_area: false,
					message: '',
				};
			}
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}
	/** 배송지 등록 처리 */
	const overlayAddressCreate = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/address/create/AddressCreate.vue')), {
			clickElement: _e.currentTarget,
			onClose: async (hasNewAddress) => {
				if (hasNewAddress) {
					addresses.value = await myAddress.all();
					if (!selectedAddress.value && addresses.value.length > 0) {
						form.value.receive_address.id = addresses.value[0].id;
					}

				}
			},
		});
	};
	/** [END] 배송지  */

	const overlayOrderUnipass = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/order/unipass/OrderUnipass.vue')), {
			clickElement: _e.currentTarget,
		});
	};

	const overlayOrderCoupon = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/order/coupon/OrderCoupon.vue')), {
			props: {
				sheet,
				appliedCouponRegist,
			},
			clickElement: _e.currentTarget,
			onClose: (newApply?: OrderSheetAppliedCouponRegist) => {
				if (!newApply) {
					return;
				}
				appliedCouponRegist.value = newApply;
			},
		});
	};
	/** 선물 관련 처리  */
	const thumbnailList = [1, 2, 3, 4, 5];
	const selectedThumbnail = ref(1);


	const paymentPointTypeLabel = computed(() => {
		if (![2, 4, 6, 7].includes(goodsUsablePayTypeCode.value)) {
			return null;
		}

		if (totalShippingPrice.value > 0) {
			return null;
		}

		if (goodsUsablePayTypeCode.value === 2) {
			return 'star';
		}
		else if (goodsUsablePayTypeCode.value === 4) {
			return 'reward';
		}
		else if (goodsUsablePayTypeCode.value === 6) {
			return 'starReward';
		}

		if (paymentPriceBeforePointWithoutShippingPrice.value === form.value.payment_info.using_star_point) {
			return 'star';
		}
		else if (paymentPriceBeforePointWithoutShippingPrice.value === form.value.payment_info.using_reward_point) {
			return 'reward';
		}

		if (form.value.payment_info.using_star_point < 1 || form.value.payment_info.using_reward_point < 1) {
			return null;
		}

		return 'starReward';
	});

	async function startProcess() {
		orderProcessContextStore.clearContext();
		/** 이메일 공백 제거 */
		form.value.orderer_info.email = form.value.orderer_info.email.trim();
		/** 결제수단 재선택 */
		if (paymentPointTypeLabel.value && isPayAllPoint.value) {
			form.value.payment_info.method = 80;
		}
		/** 결제수단에 없고, 이전결제가 포인트 | 정기구독 일때, 포인트 결제가 아니면 카드결제로 돌려준다. */
		if (!usablePayMethodCodes.value.includes(form.value.payment_info.method) && !isPayAllPoint.value) {
			form.value.payment_info.method = payMethods.value[0].code;
		}
		/** 포인트 지불 결제인 경우 배송비를 제외한이 포인트로 처리되었는지 체크가 필요하다. */
		if (payTypeOnlyPoint.value && paymentPriceBeforePointWithoutShippingPrice.value > (form.value.payment_info.using_star_point + form.value.payment_info.using_reward_point)) {
			if (paymentPointType.value === 'star') {
				return bom.alert('스타포인트를 입력해주세요.');
			}
			else if (paymentPointType.value === 'reward') {
				return bom.alert('리워드포인트를 입력해주세요.');
			}

			return bom.alert('보유하신 스타/리워드 포인트가 부족합니다.');
		}
		form.value.payment_info.eng_label = paymentMethodEngLabel.value || '';
		if (!sheet.value) {
			return;
		}

		const packs: PackForOrder[] = sheet.value.packs.map((pack) => {
			const packItems = pack.items.map(item => {
				const discountByItem = discountsByItem.value[item.uuid];

				return {
					bundle_uuid: item.bundle_uuid,
					bundle_goods_id: item.bundle_goods_id,
					brand_id: item.brand_id,
					goods_id: item.goods_id,
					goods_base_discounted_price: item.goods_base_discounted_price,
					option_id: item.option_id,
					option_extra_amount: item.option_extra_amount,
					night_sale_id: item.night_sale_id,
					night_sale_amount: item.night_sale_amount,
					regist_coupon_id: appliedCouponRegist.value[item.uuid] ? appliedCouponRegist.value[item.uuid]?.regist_id : null,
					regist_coupon_amount: discountByItem ? discountByItem.couponDiscountAmount : 0,
					immediately_sale_id: item.appliable_immediately_sale ? item.appliable_immediately_sale.id : null,
					immediately_sale_amount: discountByItem ? discountByItem.immediatelySaleAmount : 0,
					goods_applied_all_discounted_price: discountByItem.totalDiscountedPrice,
				};
			});

			return {
				charged_shipping_price: pack.charged_shipping_price,
				extra_shipping_price: isExtraAreaShipping.value ? pack.extra_shipping_price : 0,
				shipping_rule_id: pack.shipping_rule_id,
				items: packItems,
			} as PackForOrder;
		});

		form.value.payment_info.for_payment_price = finalPaymentPrice.value;
		// form.value.payment_info.method = isPayAllPoint.value ? 80 : form.value.payment_info.method;

		if (form.value.payment_info.cash_receipt_apply_type === 1) {
			form.value.payment_info.cash_receipt_apply_key = form.value.payment_info.cash_receipt_phone_number;
		}
		else if (form.value.payment_info.cash_receipt_apply_type === 2) {
			form.value.payment_info.cash_receipt_apply_key = form.value.payment_info.cash_receipt_business_number;
		}
		else if (form.value.payment_info.cash_receipt_apply_type === 3) {
			form.value.payment_info.cash_receipt_apply_key = '';
		}

		form.value.refund_account = null;
		loading.show();

		try {
			await validate();
			const orderData: OrderPrePareForm = {
				orderer_info: form.value.orderer_info,
				refund_account: null,
				packs: packs,
				gift_info: isPresent.value ? {
					message: form.value.gift_info.message || null,
					background_image_url: `${presentImageBasePath}_${selectedThumbnail.value}.png`,
				} : undefined,
				receive_address: isPresent.value ? null : Object.assign({
					phone: selectedAddress.value?.tel || '',
					message: selectedShippingMessageTemplate.value === '직접 입력'
						? shippingMessage.value
						: selectedShippingMessageTemplate.value === '배송메모를 선택하세요' ? '' : selectedShippingMessageTemplate.value,
					is_extra_area: isExtraAreaShipping.value,
				}, selectedAddress.value),
				payment_info: form.value.payment_info,
				giveaways: form.value.giveaways,
				my_pay_virtual_id: null,
			};

			if (isPresent.value && form.value.gift_info) {
				orderData.receive_address = {
					name: form.value.gift_info.receiver_name,
					phone: form.value.gift_info.receiver_phone,
					zip_code: '',
					base_address: '',
					detail_address: '',
					is_extra_area: false,
					message: '',
				};
			}

			if (!isPresent.value && isNotNeedReceiveAddress) {
				orderData.receive_address = {
					name: member.value?.name || '',
					phone: sheet.value.orderer_information.phone,
					zip_code: '',
					base_address: '',
					detail_address: '',
					is_extra_area: false,
					message: '',
				};
			}
			/** 선물주문의 경우 컨펌창 */
			if (!isPresent.value) {
				return payingPopupOpen(orderData);
			}

			return bom.confirm(`선물받으실 분의 정보가 맞는지 한번 더 확인해 주세요.\n 이름: ${form.value.gift_info.receiver_name}\n 휴대폰 번호: ${form.value.gift_info.receiver_phone}`, (flag) => {
				if (!flag) {
					loading.hide();

					return;
				}
				payingPopupOpen(orderData);
			});

		}
		catch (e) {
			useErrorAlert(e);
			loading.hide();
		}
	}

	const enterUrl = ref<string | undefined>(undefined);

	const payingPopupOpen = async (orderData: OrderPrePareForm) => {
		// /** 실제 인앱 결제 프로세스에 해당하는 블록 */
		try {
			const redirectPath = `${location.origin}${router.resolve({
				name: 'OrderBridge',
				params: {
					id: orderId.value,
				},
			}).fullPath}`;

			payingStart.value = true;
			if (isAppUser) {
				const payingUrl = await orderStore.getPayingUrl(orderId.value, orderData, redirectPath);
				openWebview(`${router.resolve({
					name: 'OrderStart',
					params: {
						id: orderId.value,
					},
					query: {
						paying_url: payingUrl,
					},
				}).fullPath}`);
				loading.hide();

				return;
			}
			else {
				const popupWindow = usePopupWindow(`order-action_${orderId}`, enterUrl);
				try {
					const popupPromise = popupWindow.open();
					const payingUrl = await orderStore.getPayingUrl(orderId.value, orderData, redirectPath);
					enterUrl.value = `${router.resolve({
						name: 'OrderStart',
						params: {
							id: orderId.value,
						},
						query: {
							paying_url: payingUrl,
						},
					}).fullPath}`;
					const { popupWindowClosed } = await popupPromise;

					if (popupWindowClosed) {
						loading.hide();
						router.replace({
							name: 'OrderResult',
							params: {
								id: orderId.value,
							},
						});
					}
				}
				catch (e) {
					loading.hide();
					if (!isAppUser) {
						popupWindow.close();
						router.replace({
							name: 'OrderResult',
							params: {
								id: orderId.value,
							},
							replace: true,
						});
					}
				}
			}
		}
		catch (e) {
			useErrorAlert(e);
			loading.hide();
		}
	};

	function endProcess() {
		payingStart.value = false;
		loading.show();
		if (isAppUser) {
			orderProcessContextStore.endProcessContext(orderId.value);
			router.replace({
				name: 'OrderResult',
				params: {
					id: orderId.value,
				},
			}).then(() => loading.hide());
		}

	}
</script>