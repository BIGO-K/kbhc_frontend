<template>
	<layout title="선물 상세">
		<div
			v-if="order"
			class="m_myorder-detail"
		>
			<div class="m_myorder-detail-head">
				<p class="text_date">
					{{ date(order.ordered_at, 'YYYY.MM.DD') }}
				</p>
				<dl><dt>주문번호</dt><dd>{{ order.order_id }}</dd></dl>
			</div>

			<!-- 선물 보내시는 분 -->
			<div class="m_myorder-info">
				<template v-if="isReceive">
					<section>
						<h4 class="mm_strapline">
							<b>선물 보내시는 분</b>
						</h4>
						<div class="mm_order-info">
							<table>
								<tbody>
									<tr>
										<th scope="row">
											<b>보낸 사람</b>
										</th>
										<td>{{ order.sender_name }}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</section>
					<hr class="mm_line">
				</template>

				<section>
					<h4 class="mm_strapline">
						<b>선물 받는분 정보</b>
					</h4>
					<div class="mm_order-info">
						<table>
							<tbody>
								<tr>
									<th scope="row">
										<b>받는 사람</b>
									</th>
									<td>{{ order.recipient.name }}</td>
								</tr>
								<tr>
									<th scope="row">
										<b>휴대폰 번호</b>
									</th>
									<td>{{ order.recipient.tel }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>
				<hr class="mm_line">

				<!-- 선물 메시지 -->
				<template v-if="order.gift_info">
					<section>
						<h4 class="mm_strapline">
							<b>선물 메시지</b>
						</h4>
						<div class="m_present T=readonly">
							<div class="m_present-message">
								<lazyload
									class="image_card mm_bg-cover"
									:src="order.gift_info.background_image_url"
								></lazyload>
								<p class="text_readonly T=teatarea">
									<b>{{ order.gift_info.message }}</b>
								</p>
							</div>
						</div>
					</section>
					<hr class="mm_line">
				</template>

				<!-- 배송 정보 -->
				<template v-if="isReceive && (order.shipping_address_required || order.shipping_address)">
					<section
						class="m_myorder-detail-address"
					>
						<h4 class="mm_strapline">
							<b>상품 받을 주소</b>
						</h4>
						<template v-if="!order.shipping_address">
							<p class="mm_text-none T=sm">
								<i class="ico_text-none"></i>등록된 배송지가 없습니다
							</p>
							<a
								class="mm_btn T=xs T=secondary btn_address-register"
								href="#"
								@click.prevent="overlayAddress"
							>
								<b>주소 등록</b>
							</a>
						</template>
						<div
							v-else
							class="mm_order-info"
						>
							<table>
								<tbody>
									<tr>
										<th scope="row">
											<b>받는 사람</b>
										</th>
										<td>{{ order.shipping_address.name }}</td>
									</tr>
									<tr>
										<th scope="row">
											<b>휴대폰 번호</b>
										</th>
										<td>{{ order.shipping_address.tel }}</td>
									</tr>
									<tr>
										<th scope="row">
											<b>주소</b>
										</th>
										<td>{{ order.shipping_address.zip_code }}<br>{{ order.shipping_address.base_address }} {{ order.shipping_address.detail_address }}</td>
									</tr>
									<tr v-if="order.shipping_address.message">
										<th scope="row">
											<b>배송메모</b>
										</th>
										<td>{{ order.shipping_address.message }}</td>
									</tr>
								</tbody>
							</table>
							<!-- (D) '입금 대기, 결제 완료' 주문일 경우 '주소변경' 버튼을 노출합니다. -->
							<a
								v-if="order.shipping_address_changeable"
								class="mm_btn T=xs T=secondary btn_address-change"
								href="#"
								@click.prevent="overlayAddress"
							>
								<b>주소 변경</b>
							</a>
						</div>
					</section>
					<hr class="mm_line">
				</template>
			</div>

			<!-- 개인통관 고유부호 -->
			<template v-if="isReceive && (order.personal_clearance_code_required || order.recipient.personal_clearance_code)">
				<dropdown
					class="T=order"
					:is-active="true"
				>
					<template #button>
						<b>해외배송 개인통관 고유부호</b>
					</template>
					<template #content>
						<div class="mm_inner m_myorder-detail-unipass">
							<template v-if="!uniPassEditable && order.recipient.personal_clearance_code">
								<div class="mm_form_mix-linked">
									<p class="text_readonly">
										<b>{{ order.recipient.personal_clearance_code }}</b>
									</p>
									<button
										type="button"
										class="mm_btn T=primary"
										@click="uniPassEditable = true"
									>
										<b>수정</b>
									</button>
								</div>
								<div class="mm_note T=bg">
									<ul>
										<li>상품을 받는 분의 명의로 통관이 진행되므로 수취인의 개인통관고유부호를 입력해주세요.</li>
										<li>해외배송 상품은 관세청 통관을 위해 구매 고객의 고유식별정보를 판매자에게 제공합니다.</li>
										<li>개인통관고유부호는 통관사 주민등록번호 대신 사용 가능한 번호로, 관세청 사이트에서 발급 받으실 수 있습니다.</li>
									</ul>
								</div>
								<div class="mm_check-list">
									<ul>
										<li>
											<div class="mm_flex">
												<form-check
													v-model="personalClearanceCodeForm.sellerCollectAgree"
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
							</template>
							<template v-else>
								<div class="mm_form_mix-linked">
									<div class="mm_form_mix-linked">
										<form-text
											v-model="personalClearanceCodeForm.personalClearanceCode"
											maxlength="13"
											placeholder="P로 시작하는 정보를 입력하세요"
										></form-text>
										<button
											type="button"
											class="mm_btn T=primary"
											@click="updateUnipass"
										>
											<b>확인</b>
										</button>
									</div>
								</div>
								<div class="mm_note T=bg">
									<ul>
										<li>상품을 받는 분의 명의로 통관이 진행되므로 수취인의 개인통관고유부호를 입력해주세요.</li>
										<li>해외배송 상품은 관세청 통관을 위해 구매 고객의 고유식별정보를 판매자에게 제공합니다.</li>
										<li>개인통관고유부호는 통관사 주민등록번호 대신 사용 가능한 번호로, 관세청 사이트에서 발급 받으실 수 있습니다.</li>
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
													v-model="personalClearanceCodeForm.collectAgree"
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
													v-model="personalClearanceCodeForm.sellerCollectAgree"
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
							</template>
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
				</template>
				<template #content>
					<div class="mm_order-item">
						<template
							v-for="bundle, _i in order.bundles"
							:key="`${_i}_${bundle.bundle_goods_id}`"
						>
							<div
								v-if="bundle.bundle_goods_id"
								class="mm_order-item-bundle"
							>
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
										show-voucher-code
										@refresh="fetch"
									></my-order-seller>
								</template>
							</div>
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
										show-voucher-code
										@refresh="fetch"
									></my-order-seller>
								</template>
							</template>
						</template>
						<mm-link
							v-if="order.original_order_id"
							class="btn_order-origin"
							:to="{ name: 'PresentDetail', params: { id: order.original_order_id } }"
						>
							<b>원 주문 상세보기<i class="ico_link"></i></b>
						</mm-link>
					</div>
					<!-- 정기구독 -->
					<!-- 정기구독 결제 예정일 -->
					<section
						v-if="order.subscription_info && order.subscription_info.length > 0"
						class="mm_inner m_myorder-subscription"
					>
						<h4 class="mm_strapline">
							<b>정기구독 결제 예정일</b>
						</h4>
						<ol class="m_order-subscription">
							<li
								v-for="subscription in order.subscription_info"
								:key="subscription.sequence"
								:class="isAfter(subscription.for_payment_date) ? 'T=on' : ''"
							>
								<p>{{ `${subscription.sequence}차 주문` }}</p>
								<p>
									{{ date(subscription.for_payment_date, 'YYYY-MM-DD') }} <b
										v-if="subscription.is_ordered"
										class="mm_tag"
									>주문생성완료</b>
								</p>
							</li>
						</ol>
					</section>
					<section
						v-if="!isReceive && order.payment_summary && order.payment_info"
						class="m_myorder-detail-cost"
					>
						<!-- 최종 결제금액 -->
						<div class="mm_costbox">
							<h4 class="mm_strapline">
								<b>최종 결제금액</b>
							</h4>
							<div class="mm_cost">
								<table>
									<tbody>
										<tr>
											<th scope="row">
												<b>총 상품금액</b>
											</th>
											<td>
												<p class="text_price">
													<strong>{{ number(order.payment_summary.total_goods_price) }}</strong>
												</p>
											</td>
										</tr>
										<tr>
											<th scope="row">
												<b>총 배송비 금액</b>
											</th>
											<td>
												<p class="text_price">
													+ <strong>{{ number(order.payment_summary.total_shipping_price) }}</strong>
												</p>
											</td>
										</tr>
										<tr v-if="order.payment_summary.discounts.member > 0">
											<th scope="row">
												<b>1차 쿠폰</b>
											</th>
											<td>
												<p class="text_point">
													- <strong>{{ number(order.payment_summary.discounts.member) }}</strong><sub>원</sub>
												</p>
											</td>
										</tr>
										<tr v-if="order.payment_summary.used_coupon_amount > 0">
											<th scope="row">
												<b>중복쿠폰</b>
											</th>
											<td>
												<p class="text_point">
													- <strong>{{ number(order.payment_summary.used_coupon_amount) }}</strong><sub>원</sub>
												</p>
											</td>
										</tr>
										<tr v-if="order.payment_summary.discounts.night_sale > 0">
											<th scope="row">
												<b>심야할인</b>
											</th>
											<td>
												<p class="text_price">
													- <strong>{{ number(order.payment_summary.discounts.night_sale) }}</strong>
												</p>
											</td>
										</tr>
										<tr v-if="order.payment_summary.discounts.immediately_sale > 0">
											<th scope="row">
												<b>즉시할인</b>
											</th>
											<td>
												<p class="text_price">
													- <strong>{{ number(order.payment_summary.discounts.immediately_sale) }}</strong>
												</p>
											</td>
										</tr>
										<tr v-if="order.payment_summary.used_points.star_point > 0">
											<th scope="row">
												<b>스타포인트 사용금액</b>
											</th>
											<td>
												<p class="text_point">
													- <strong>{{ number(order.payment_summary.used_points.star_point) }}</strong><sub>원</sub>
												</p>
											</td>
										</tr>
										<tr v-if="order.payment_summary.used_points.reward_point > 0">
											<th scope="row">
												<b>리워드포인트 사용금액</b>
											</th>
											<td>
												<p class="text_point">
													- <strong>{{ number(order.payment_summary.used_points.reward_point) }}</strong><sub>원</sub>
												</p>
											</td>
										</tr>
									</tbody>
									<tfoot>
										<tr>
											<th scope="row">
												<b>최종 결제금액</b>
											</th>
											<td>
												<p class="text_purchase-price">
													<strong>{{ number(order.payment_summary.total_price) }}</strong><sub>원</sub>
												</p>
											</td>
										</tr>
									</tfoot>
								</table>
							</div>
							<div class="mm_costbox-unit">
								<table>
									<tbody>
										<tr>
											<th scope="row">
												<b>결제 수단</b>
											</th>
											<td>
												{{ order.payment_info.label }}
											</td>
										</tr>
										<template v-if="order.payment_info.card">
											<tr>
												<th scope="row">
													<b>카드사</b>
												</th>
												<td>
													{{ order.payment_info.card.label }}
												</td>
											</tr>
											<tr>
												<th scope="row">
													<b>카드 번호</b>
												</th>
												<td>
													{{ order.payment_info.card.masking_number }}
												</td>
											</tr>
											<tr>
												<th scope="row">
													<b>결제 승인일</b>
												</th>
												<td>
													{{ date(order.payment_info.card.approved_at, "YYYY.MM.DD HH:mm:ss") }}
												</td>
											</tr>
										</template>
										<template v-if="order.payment_info.bank_account">
											<tr>
												<th scope="row">
													<b>이체은행</b>
												</th>
												<td>
													{{ order.payment_info.bank_account.bank_name }}
												</td>
											</tr>
											<tr>
												<th scope="row">
													<b>예금주</b>
												</th>
												<td>
													{{ bankOwnerName }}
												</td>
											</tr>
											<tr>
												<th scope="row">
													<b>계좌번호</b>
												</th>
												<td>
													{{ order.payment_info.bank_account.account_number }}
												</td>
											</tr>
											<tr>
												<th scope="row">
													<b>입금기한</b>
												</th>
												<td>
													{{ date(order.payment_info.bank_account.input_expire_at, 'YYYY.MM.DD HH:mm:ss') }}
												</td>
											</tr>
										</template>
										<template v-if="order.payment_info.mobile">
											<tr>
												<th scope="row">
													<b>결제 승인일</b>
												</th>
												<td>
													{{ date(order.payment_info.mobile.approved_at, 'YYYY.MM.DD HH:mm:ss') }}
												</td>
											</tr>
										</template>
									</tbody>
								</table>
							</div>
							<button
								v-if="order.receipt_viewable"
								type="button"
								class="mm_btn T=xs T=secondary btn_receipt"
								@click="overlayMyOrderDetailReceipt"
							>
								<i class="ico_receipt"></i><b>영수증 보기</b>
							</button>
						</div>
					</section>
					<!-- 적립금 적립 혜택 -->
					<section
						v-if="!isReceive && order.payment_summary && order.payment_info"
						class="m_myorder-detail-point"
					>
						<h4 class="mm_strapline">
							<b>적립금 혜택</b>
						</h4>
						<div class="mm_cost">
							<table>
								<tbody>
									<tr>
										<th scope="row">
											<b>리워드포인트</b>
										</th>
										<td>
											<p class="text_point">
												<strong>{{ number(order.payment_info.buy_point - order.payment_info.except_buy_point) }}</strong><sub>원</sub>
											</p>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="mm_note T=bg">
							<ul>
								<li>취소완료/반품완료 된 상품의 적립금은 차감되어 구매적립금이 표시 됩니다.</li>
							</ul>
						</div>
					</section>
				</template>
			</dropdown>
			<hr class="mm_line">

			<!-- 취소 주문번호 -->
			<template
				v-for="cancelDetail in cancelDetails"
				:key="cancelDetail.id"
			>
				<dropdown
					v-model:is-active="cancelDetail.isOpened"
					class="T=order"
					@click="() => cancelDetail.data == null ? cancelDetail.fetch() : undefined"
				>
					<template #button>
						<b>취소 주문번호</b><b class="text_contraction">{{ cancelDetail.id }}</b>
					</template>
					<template
						v-if="cancelDetail.data"
						#content
					>
						<!-- 취소상품 -->
						<div class="mm_order-item">
							<template
								v-for="pack in cancelDetail.data.packs"
								:key="pack.shipping_rule_id"
							>
								<div class="mm_order-item-seller">
									<div class="mm_order...seller-head">
										<p class="text_ship">
											<i class="ico_ship"></i>
											<span :class="{'text_price': pack.paid_shipping_price > 0}">
												<strong>{{ pack.paid_shipping_price === 0 ? '무료배송' : number(pack.paid_shipping_price) }}</strong>
											</span>
										</p>
									</div>
									<div class="mm_product-list T=sm">
										<ul>
											<li
												v-for="orderItem in pack.order_items"
												:key="orderItem.id"
											>
												<p class="text_seller">
													<i class="ico_shop"></i>{{ orderItem.seller_name }}
												</p>
												<my-order-item :order-item="orderItem"></my-order-item>
											</li>
										</ul>
									</div>
								</div>
							</template>
						</div>

						<!-- 취소정보 -->
						<div class="m_myorder-info">
							<section>
								<h4 class="mm_strapline">
									<b>취소 사유</b>
								</h4>
								<h6 class="mm_text-label T=sm">
									<b>취소사유</b>
								</h6>
								<p class="text_readonly T=select">
									<b>{{ cancelDetail.data.reason.label }}</b>
									<i class="ico_form-select"></i>
								</p>
								<template v-if="cancelDetail.data.reason.detail">
									<h6 class="mm_text-label T=sm">
										<b>상세 사유</b>
									</h6>
									<p class="text_readonly T=textarea">
										<b v-html="newLineToBr(cancelDetail.data.reason.detail)"></b>
										<b class="text_byte">
											<strong>{{ number(0) }}</strong>/{{ number(5000) }}
										</b>
									</p>
								</template>
							</section>
							<div
								v-if="!isReceive"
								class="m_myorder-detail-refund"
							>
								<section v-if="cancelDetail.data.refund_account">
									<h4 class="mm_strapline">
										<b>환불 계좌 정보</b>
									</h4>
									<div class="mm_order-info">
										<table>
											<tbody>
												<tr>
													<th scope="row">
														<b>예금주</b>
													</th>
													<td>{{ cancelDetail.data.refund_account.owner_name }}</td>
												</tr>
												<tr>
													<th scope="row">
														<b>환불 은행</b>
													</th>
													<td>{{ cancelDetail.data.refund_account.bank_name }}</td>
												</tr>
												<tr>
													<th scope="row">
														<b>환불 계좌</b>
													</th>
													<td>{{ cancelDetail.data.refund_account.account_number }}</td>
												</tr>
											</tbody>
										</table>
									</div>
								</section>
								<section v-if="cancelDetail.data.refund_info && !cancelDetail.data.is_cancel_before_paid">
									<h4 class="mm_strapline">
										<b>환불 정보</b>
									</h4>
									<div class="mm_cost">
										<table>
											<tbody>
												<tr>
													<th scope="row">
														<b>{{ order.payment_info?.label }} 환불</b>
													</th>
													<td>
														<p class="text_price">
															<strong>{{ number(getRefundCalculations(cancelDetail.data.refund_info).totalRefund) }}</strong>
														</p>
													</td>
												</tr>
												<tr
													v-for="detail in cancelDetail.data.refund_info.calculate_details"
													:key="detail.label"
												>
													<template v-if="detail.amount !== 0">
														<th scope="row">
															<strong>{{ detail.label }}</strong>
														</th>
														<td>
															<p class="text_price">
																{{ detail.is_substracted ? '-' : '+' }}
																<strong>{{ number(detail.amount) }}</strong>
															</p>
														</td>
													</template>
												</tr>
												<tr>
													<th scope="row">
														<b>스타포인트 환불</b>
													</th>
													<td>
														<p class="text_point">
															<strong>{{ number(cancelDetail.data.refund_info.refund_star_point) }}</strong><sub>원</sub>
														</p>
													</td>
												</tr>
												<tr>
													<th scope="row">
														<b>리워드포인트 환불</b>
													</th>
													<td>
														<p class="text_point">
															<strong>{{ number(cancelDetail.data.refund_info.refund_reward_point) }}</strong><sub>원</sub>
														</p>
													</td>
												</tr>
												<tr>
													<th scope="row">
														<b>환불 예상금액</b>
													</th>
													<td>
														<p class="text_price">
															<strong class="mm_text-secondary">
																{{
																	number(
																		cancelDetail.data.refund_info.refund_price
																			+ cancelDetail.data.refund_info.refund_star_point
																			+ cancelDetail.data.refund_info.refund_reward_point
																	)
																}}
															</strong>
														</p>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</section>
							</div>
						</div>
					</template>
				</dropdown>
				<hr class="mm_line">
			</template>

			<!-- 반품 주문번호 -->
			<template
				v-for="returnDetail in returnDetails"
				:key="returnDetail.id"
			>
				<dropdown
					v-model:is-active="returnDetail.isOpened"
					class="T=order"
					@click="() => returnDetail.data == null ? returnDetail.fetch() : undefined"
				>
					<template #button>
						<b>반품 주문번호</b><b class="text_contraction">{{ returnDetail.id }}</b>
					</template>
					<template
						v-if="returnDetail.data"
						#content
					>
						<!-- 반품상품 -->
						<div class="mm_order-item">
							<div class="mm_order-item-seller">
								<div class="mm_order...seller-head">
									<p class="text_ship">
										<i class="ico_ship"></i>
										<span :class="{'text_price': returnDetail.data.pack.paid_shipping_price > 0}">
											<strong>{{ returnDetail.data.pack.paid_shipping_price === 0 ? '무료배송' : number(returnDetail.data.pack.paid_shipping_price) }}</strong>
										</span>
									</p>
								</div>

								<div class="mm_product-list T=sm">
									<ul>
										<li
											v-for="orderItem in returnDetail.data.pack.order_items"
											:key="orderItem.id"
										>
											<p class="text_seller">
												<i class="ico_shop"></i>{{ orderItem.seller_name }}
											</p>
											<my-order-item :order-item="orderItem"></my-order-item>
										</li>
									</ul>
								</div>
							</div>
						</div>

						<!-- 반품정보 -->
						<div class="m_myorder-info">
							<section>
								<h4 class="mm_strapline">
									<b>반품 사유 및 회수 방법</b>
								</h4>
								<h6 class="mm_text-label T=sm">
									<b>반품 사유</b>
								</h6>
								<p class="text_readonly T=select">
									<b>{{ returnDetail.data.reason.label }}</b>
									<i class="ico_form-select"></i>
								</p>
								<template v-if="returnDetail.data.reason.detail">
									<h6 class="mm_text-label T=sm">
										<b>상세 사유</b>
									</h6>
									<p class="text_readonly T=textarea">
										<b v-html="newLineToBr(returnDetail.data.reason.detail)"></b>
										<b class="text_byte">
											<strong>{{ number(0) }}</strong>/{{ number(5000) }}
										</b>
									</p>
								</template>
								<template v-if="isReceive">
									<div class="m_myorder-info-invoice">
										<h6 class="mm_text-label T=sm">
											<b>반품 송장번호</b>
										</h6>
										<template v-if="returnDetail.data.retrieve_invoice">
											<div class="text_readonly">
												<b>{{ returnDetail.data.retrieve_invoice.delivery_company_name }}</b>
											</div>
											<div class="text_readonly">
												<b>{{ returnDetail.data.retrieve_invoice.invoice_number }}</b>
											</div>
											<button
												class="mm_btn T=xs T=secondary btn_modify"
												type="button"
												@click.prevent="bomShipNumberUpdate(returnDetail.id, 'return', returnDetail.data.retrieve_invoice)"
											>
												<b>수정하기</b>
											</button>
										</template>
										<div
											v-else
											class="mm_btn_box"
										>
											<a
												class="mm_btn T=xs T=support"
												href="#"
												@click.prevent="bomShipNumberCreate(returnDetail.id, 'return')"
											>
												<b>입력하기</b>
											</a>
										</div>
									</div>
								</template>
							</section>
							<section v-if="isReceive && returnDetail.data.retrieve_address">
								<h4 class="mm_strapline">
									<b>반품 수거지 정보</b>
								</h4>
								<div class="mm_order-info">
									<table>
										<tbody>
											<tr>
												<th scope="row">
													<b>보내는 분</b>
												</th>
												<td>{{ returnDetail.data.retrieve_address.name }}</td>
											</tr>
											<tr>
												<th scope="row">
													<b>휴대폰 번호</b>
												</th>
												<td>{{ phone(returnDetail.data.retrieve_address.tel) }}</td>
											</tr>
											<tr>
												<th scope="row">
													<b>주소</b>
												</th>
												<td>
													{{ returnDetail.data.retrieve_address.zip_code }}<br>
													{{ returnDetail.data.retrieve_address.base_address }} {{ returnDetail.data.retrieve_address.detail_address }}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</section>
							<div
								v-if="isReceive"
								class="m_myorder-detail-refund"
							>
								<section v-if="returnDetail.data.refund_account">
									<h4 class="mm_strapline">
										<b>환불 계좌 정보</b>
									</h4>
									<div class="mm_order-info">
										<table>
											<tbody>
												<tr>
													<th scope="row">
														<b>예금주</b>
													</th>
													<td>{{ returnDetail.data.refund_account.owner_name }}</td>
												</tr>
												<tr>
													<th scope="row">
														<b>환불 은행</b>
													</th>
													<td>{{ returnDetail.data.refund_account.bank_name }}</td>
												</tr>
												<tr>
													<th scope="row">
														<b>환불 계좌</b>
													</th>
													<td>{{ returnDetail.data.refund_account.account_number }}</td>
												</tr>
											</tbody>
										</table>
									</div>
								</section>
								<section v-if="returnDetail.data.refund_info">
									<h4 class="mm_strapline">
										<b>환불 예상 금액</b>
									</h4>
									<div class="mm_cost">
										<table>
											<tbody>
												<tr>
													<th scope="row">
														<b>총 결제금액</b>
													</th>
													<td>
														<p class="text_price">
															<strong>
																{{
																	number(
																		returnDetail.data.refund_info.total_paid_price
																			+ returnDetail.data.refund_info.refund_reward_point
																			+ (returnDetail.data.refund_info.refund_star_point || 0)
																	)
																}}
															</strong>
														</p>
													</td>
												</tr>

												<tr
													v-for="detail in returnDetail.data.refund_info.calculate_details"
													:key="detail.label"
												>
													<th scope="row">
														<b>{{ detail.label }}</b>
													</th>
													<td>
														<p class="text_price">
															{{ detail.is_substracted ? '-' : '+' }} <strong>{{ number(detail.amount) }}</strong>
														</p>
													</td>
												</tr>
											</tbody>
											<tfoot>
												<tr>
													<th scope="row">
														<b>환불 예상금액</b>
													</th>
													<td>
														<p class="text_price">
															<strong class="mm_text-secondary">
																{{
																	number(
																		returnDetail.data.refund_info.refund_price
																			+ returnDetail.data.refund_info.refund_reward_point
																			+ (returnDetail.data.refund_info.refund_star_point || 0)
																	)
																}}
															</strong>
														</p>
													</td>
												</tr>
											</tfoot>
										</table>
									</div>
									<div class="mm_note T=bg">
										<ul>
											<li>최종적으로 환불 받으실 금액은 상이할 수 있습니다.</li>
										</ul>
									</div>
								</section>
								<section>
									<h4 class="mm_strapline">
										<b>환불 정보</b>
									</h4>
									<div class="mm_cost">
										<table>
											<tbody>
												<tr>
													<th scope="row">
														<b>{{ order.payment_info?.label }} 환불</b>
													</th>
													<td>
														<p class="text_price">
															<strong>{{ number(returnDetail.data.refund_info.refund_price) }}</strong>
														</p>
													</td>
												</tr>
												<tr>
													<th scope="row">
														<b>스타포인트 환불</b>
													</th>
													<td>
														<p class="text_point">
															<strong>{{ number(returnDetail.data.refund_info.refund_star_point) }}</strong><sub>원</sub>
														</p>
													</td>
												</tr>
												<tr>
													<th scope="row">
														<b>리워드포인트 환불</b>
													</th>
													<td>
														<p class="text_point">
															<strong>{{ number(returnDetail.data.refund_info.refund_reward_point) }}</strong><sub>원</sub>
														</p>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</section>
							</div>
						</div>
					</template>
				</dropdown>
				<hr class="mm_line">
			</template>

			<!-- 교환 주문번호 -->

			<template
				v-for="exchangeDetail in exchangeDetails"
				:key="exchangeDetail.id"
			>
				<dropdown
					v-model:is-active="exchangeDetail.isOpened"
					class="T=order"
					@click="() => exchangeDetail.data == null ? exchangeDetail.fetch() : undefined"
				>
					<template #button>
						<b>교환 주문번호</b><b class="text_contraction">{{ exchangeDetail.id }}</b>
					</template>
					<template
						v-if="exchangeDetail.data"
						#content
					>
						<!-- 교환상품 -->
						<div class="mm_order-item">
							<div class="mm_order-item-seller">
								<div class="mm_order...seller-head">
									<p class="text_ship">
										<i class="ico_ship"></i>
										<span :class="{'text_price': exchangeDetail.data.pack.paid_shipping_price > 0}">
											<strong>{{ exchangeDetail.data.pack.paid_shipping_price === 0 ? '무료배송' : number(exchangeDetail.data.pack.paid_shipping_price) }}</strong>
										</span>
									</p>
								</div>
								<div class="mm_product-list T=sm">
									<ul>
										<li
											v-for="orderItem in exchangeDetail.data.pack.order_items"
											:key="orderItem.id"
										>
											<p class="text_seller">
												<i class="ico_shop"></i>{{ orderItem.seller_name }}
											</p>
											<my-order-item :order-item="orderItem"></my-order-item>
											<div class="mm_product-unit">
												<p class="text_changed">
													<strong class="mm_text-variable">변경된 옵션</strong>
													<span>{{ optionText(orderItem.exchanged_option_name) }} / 1개</span>
												</p>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>

						<!-- 교환정보 -->
						<div class="m_myorder-info">
							<section>
								<h4 class="mm_strapline">
									<b>교환 사유 및 회수 방법</b>
								</h4>
								<h6 class="mm_text-label T=sm">
									<b>교환 사유</b>
								</h6>
								<p class="text_readonly T=select">
									<b>{{ exchangeDetail.data.reason.label }}</b>
									<i class="ico_form-select"></i>
								</p>
								<template v-if="exchangeDetail.data.reason.detail">
									<h6 class="mm_text-label T=sm">
										<b>상세 사유</b>
									</h6>
									<p class="text_readonly T=textarea">
										<b v-html="newLineToBr(exchangeDetail.data.reason.detail)"></b>
										<b class="text_byte">
											<strong>{{ number(0) }}</strong>/{{ number(5000) }}
										</b>
									</p>
								</template>
								<template v-if="isReceive">
									<div
										v-if="exchangeDetail.data.exchange_address"
										class="mm_form_mix-address"
									>
										<h6 class="mm_text-label T=sm">
											<b>교환 상품 받을 주소</b>
										</h6>
										<div class="mm_form_mix-linked">
											<p class="text_readonly">
												<b>{{ exchangeDetail.data.exchange_address.zip_code }}</b>
											</p>
										</div>
										<p class="text_readonly">
											<b>{{ exchangeDetail.data.exchange_address.base_address }}</b>
										</p>
										<p class="text_readonly">
											<b>{{ exchangeDetail.data.exchange_address.detail_address }}</b>
										</p>
									</div>
									<div class="m_myorder-info-invoice">
										<h6 class="mm_text-label T=sm">
											<b>교환 송장번호</b>
										</h6>
										<template v-if="exchangeDetail.data.retrieve_invoice">
											<p class="text_readonly">
												<b>{{ exchangeDetail.data.retrieve_invoice.delivery_company_name }}</b>
											</p>
											<p class="text_readonly">
												<b>{{ exchangeDetail.data.retrieve_invoice.invoice_number }}</b>
											</p>
											<button
												class="mm_btn T=xs T=secondary btn_modify"
												type="button"
												@click.prevent="bomShipNumberUpdate(exchangeDetail.id, 'exchange', exchangeDetail.data.retrieve_invoice)"
											>
												<b>수정하기</b>
											</button>
										</template>
										<div
											v-else
											class="mm_btn_box"
										>
											<a
												class="mm_btn T=xs T=support"
												href="#"
												@click.prevent="bomShipNumberCreate(exchangeDetail.id, 'exchange')"
											>
												<b>입력하기</b>
											</a>
										</div>
									</div>
								</template>
							</section>
							<section v-if="isReceive && exchangeDetail.data.retrieve_address">
								<h4 class="mm_strapline">
									<b>교환 수거지 정보</b>
								</h4>
								<div class="mm_order-info">
									<table>
										<tbody>
											<tr>
												<th scope="row">
													<b>보내는 분</b>
												</th>
												<td>{{ exchangeDetail.data.retrieve_address.name }}</td>
											</tr>
											<tr>
												<th scope="row">
													<b>휴대폰</b>
												</th>
												<td>{{ phone(exchangeDetail.data.retrieve_address.tel) }}</td>
											</tr>
											<tr>
												<th scope="row">
													<b>주소</b>
												</th>
												<td>
													{{ exchangeDetail.data.retrieve_address.zip_code }}
													<br>{{ exchangeDetail.data.retrieve_address.base_address }} {{ exchangeDetail.data.retrieve_address.detail_address }}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</section>
							<section v-if="isReceive && exchangeDetail.data.additional_payment_price">
								<h4 class="mm_strapline">
									<b>추가 결제정보</b>
								</h4>
								<div class="mm_costbox">
									<div class="mm_cost">
										<table>
											<tbody>
												<tr>
													<th scope="row">
														<b>결제방법</b>
													</th>
													<td>{{ exchangeDetail.data.additional_payment_price.pay_type_label }}</td>
												</tr>
												<tr
													v-for="detail in exchangeDetail.data.additional_payment_price.calculate_details"
													:key="detail.label"
												>
													<th scope="row">
														<strong>{{ detail.label }}</strong>
													</th>
													<td>
														<p class="text_price">
															+ <strong>{{ number(detail.amount) }}</strong>
														</p>
													</td>
												</tr>
											</tbody>
											<tfoot>
												<tr>
													<th scope="row">
														<b>최종 결제금액</b>
													</th>
													<td>
														<p class="text_price">
															<strong>{{ number(exchangeDetail.data.additional_payment_price.total_price) }}</strong>
														</p>
													</td>
												</tr>
											</tfoot>
										</table>
									</div>
									<div
										v-if="exchangeDetail.data.payment_info"
										class="mm_costbox-unit"
									>
										<table>
											<tbody>
												<tr>
													<th scope="row">
														<b>결제 수단</b>
													</th>
													<td>{{ exchangeDetail.data.payment_info.label }}</td>
												</tr>
												<template v-if="exchangeDetail.data.payment_info.card">
													<tr>
														<th scope="row">
															<b>카드사</b>
														</th>
														<td>{{ exchangeDetail.data.payment_info.card.label }}</td>
													</tr>
													<tr>
														<th scope="row">
															<b>카드 번호</b>
														</th>
														<td>{{ exchangeDetail.data.payment_info.card.masking_number }}</td>
													</tr>
													<tr>
														<th scope="row">
															<b>결제 승인일</b>
														</th>
														<td>{{ date(exchangeDetail.data.payment_info.card.approved_at, 'YYYY.MM.DD HH:mm:ss') }}</td>
													</tr>
												</template>
											</tbody>
										</table>
									</div>
								</div>
							</section>
						</div>
					</template>
				</dropdown>
				<hr class="mm_line">
			</template>
			<div class="mm_inner">
				<div class="mm_note">
					<dropdown
						:is-active="true"
						icon-class="T=sm"
					>
						<template #button>
							<i class="ico_info"></i><b>교환/환불 안내</b>
						</template>
						<template #content>
							<ul>
								<li>취소 신청은 구매자만 진행 가능합니다.</li>
								<li>반품, 교환 신청은 수신자만 진행 가능합니다.</li>
								<li>반품 완료 시 환불금액은 구매자에게 전달됩니다.</li>
							</ul>
						</template>
					</dropdown>
				</div>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref, watch } from 'vue';
	import config from '$/utils/config';
	import monsDate from '$/utils/date';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useForm } from '$/composables/useForm';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGift } from '$/composables/useGift';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyOrder } from '$/composables/useMyOrder';
	import Layout from '@/component/layout/Layout.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormText from '@/component/form/FormText.vue';
	import MyOrderItem from '@/page/mypage/order/component/MyOrderItem.vue';
	import MyOrderSeller from '@/page/mypage/order/component/MyOrderSeller.vue';

	/** 취소/반품/교환 상세 객체 */
	interface ClaimDetail<Detail extends CancelOrderDetail | ReturnOrderDetail | ExchangeOrderDetail> {
		id: string;
		fetch: () => Promise<void>;
		data: Nullable<Detail>;
		isOpened: boolean;
	}

	const props = defineProps<{
		orderId: string;
		isReceive: boolean;
	}>();

	const { router, loading, bom, openOverlay } = useGlobalPageContext();
	const { date, number, newLineToBr, phone, optionText } = useFormatter();
	const { isAfter } = monsDate();

	const { getDetail, updatePersonalClearanceCode } = useGift();
	const {
		getCancelDetail,
		getReturnDetail,
		getExchangeDetail,
		updateShippingAddressId,
		getRefundCalculations,
		getDeliveryCompanies,
		validateInvoice,
		updateReturnRetrieveInvoice,
		updateExchangeRetrieveInvoice,
	} = useMyOrder();

	/** 주문상세 */
	const order = ref<MyGiftDetail['order']>();
	/** [취소] 주문상세 */
	const cancelDetails = ref<ClaimDetail<CancelOrderDetail>[]>([]);
	/** [반품] 주문상세 */
	const returnDetails = ref<ClaimDetail<ReturnOrderDetail>[]>([]);
	/** [교환] 주문상세 */
	const exchangeDetails = ref<ClaimDetail<ExchangeOrderDetail>[]>([]);
	/** 쇼핑몰 예금주명 */
	const bankOwnerName = ref<string>(config('shop.bank_owner_name'));

	/** 택배사 */
	const deliveryCompanyOptions = (await getDeliveryCompanies()).map(({ name, code }) => ({ text: name, value: `${code}` }));

	const { form: returnInvoiceForm, validate: returnInvoiceValidate } = useForm<ReturnRetrieveInvoiceUpdateForm>(
		{
			return_id: '',
			delivery_company_code: '',
			invoice_no: '',
		},
		{
			rule: {
				'return_id(반품주문번호)': ['required'],
				'delivery_company_code(택배사)': ['required'],
				'invoice_no(송장번호)': ['required'],
			},
		}
	);

	const { form: exchangeInvoiceForm, validate: exchangeInvoiceValidate } = useForm<ExchangeRetrieveInvoiceUpdateForm>(
		{
			exchange_id: '',
			delivery_company_code: '',
			invoice_no: '',
		},
		{
			rule: {
				'exchange_id(반품주문번호)': ['required'],
				'delivery_company_code(택배사)': ['required'],
				'invoice_no(송장번호)': ['required'],
			},
		}
	);

	/** 주문상세 조회 */
	await fetch();

	const uniPassEditable = ref(!order.value?.recipient.personal_clearance_code);
	const { form: personalClearanceCodeForm, validate: validatePersonalClearanceCode } = useForm<{
		personalClearanceCode: string;
		collectAgree: boolean;
		sellerCollectAgree: boolean;
	}>({
		personalClearanceCode: '',
		collectAgree: false,
		sellerCollectAgree: false,
	}, {
		rule: {
			'personalClearanceCode(개인통관 고유부호)': ['required', 'validCode'],
			'collectAgree(개인통관 고유부호 관련 약관)': ['in:true'],
			'sellerCollectAgree(개인통관 고유부호 관련 약관)': ['in:true'],
		},
		message: {
			'collectAgree.in': ':param(을/를) 동의해주세요.',
			'sellerCollectAgree.in': ':param(을/를) 동의해주세요.',
		},
		testers: [
			{
				name: 'validCode',
				defaultMessageOnFailure: ':param(을/를) 확인해주세요',
				handler: (value): boolean => {
					if (!value) {
						return true;
					}

					return value !== '' && /^[Pp][0-9]{12}$/g.test(`${value}`);
				},
			},
		],
	});

	const overlayAddress = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/address/Address.vue')), {
			clickElement: _e.currentTarget,
			onClose: async (_value: { newAddress: MyShippingAddressDetail }) => {
				const newAddress = _value.newAddress;
				if (!newAddress) {
					return;
				}

				loading.show();
				try {
					await updateShippingAddressId(props.orderId, newAddress.id);
					order.value!.shipping_address = {
						...newAddress,
						message: order.value?.shipping_address?.message || '',
					};
				}
				catch (e) {
					useErrorAlert(e);
				}
				finally {
					loading.hide();
				}
			},
		});
	};

	const overlayOrderUnipass = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/order/unipass/OrderUnipass.vue')), {
			clickElement: _e.currentTarget,
		});
	};

	const overlayMyOrderDetailReceipt = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/mypage/order/detail/receipt/MyOrderDetailReceipt.vue')), {
			clickElement: _e.currentTarget,
			props: {
				orderId: props.orderId,
				ordererName: order.value?.sender_name,
				payMethodLabel: order.value?.payment_info?.label,
				productName: order.value?.bundles[0]?.packs[0]?.sellers[0]?.order_items[0]?.goods?.name || '',
			},
		});
	};

	/** 교환/반품 송장번호 입력 BOM OPEN */
	function bomShipNumberCreate(id: string, target: 'return' | 'exchange') {
		bom.prompt(
			'회수 시 발급된 송장번호를 입력하세요',
			async (_is: boolean, _values: Record<string, string>) => {
				if (!_is) {
					return;
				}
				try {
					loading.show();
					if (target == 'return') {
						returnInvoiceForm.value = {
							return_id: id,
							delivery_company_code: _values.delivery_company_code,
							invoice_no: _values.invoice_no,
						};
						await returnInvoiceValidate();
						await validateInvoice({
							delivery_company: _values.delivery_company_code,
							invoice_number: _values.invoice_no,
						});
						await updateReturnRetrieveInvoice(returnInvoiceForm.value);
						await returnDetails.value.find(detail => detail.id == id)?.fetch();
					}
					else if (target == 'exchange') {
						exchangeInvoiceForm.value = {
							exchange_id: id,
							delivery_company_code: _values.delivery_company_code,
							invoice_no: _values.invoice_no,
						};
						await exchangeInvoiceValidate();
						await validateInvoice({
							delivery_company: _values.delivery_company_code,
							invoice_number: _values.invoice_no,
						});
						await updateExchangeRetrieveInvoice(exchangeInvoiceForm.value);
						await exchangeDetails.value.find(detail => detail.id == id)?.fetch();
					}

					bom.alert('송장정보가 적용되었습니다.');
				}
				catch (e) {
					useErrorAlert(e);
				}
				finally {
					loading.hide();
				}
			},
			{
				title: '송장번호 입력',
				forms: [
					{ type: 'select', name: 'delivery_company_code', options: [{ text: '택배사를 선택하세요', value: '' }].concat(deliveryCompanyOptions), value: '' },
					{ type: 'number', name: 'invoice_no', maxLength: 50, placeholder: '송장번호를 입력하세요', value: '' },
				],
			}
		);
	}

	/** 교환/반품 송장번호 수정 BOM OPEN */
	function bomShipNumberUpdate(
		id: string,
		target: 'return' | 'exchange',
		legacyValue: { delivery_company_code: string; invoice_number: string }
	) {
		bom.prompt(
			'회수 시 발급된 송장번호를 입력하세요',
			async (_is: boolean, _values: Record<string, string>) => {
				if (!_is) {
					return;
				}
				try {
					loading.show();
					if (target == 'return') {
						returnInvoiceForm.value = {
							return_id: id,
							delivery_company_code: _values.delivery_company_code,
							invoice_no: _values.invoice_no,
						};
						await returnInvoiceValidate();
						await validateInvoice({
							delivery_company: _values.delivery_company_code,
							invoice_number: _values.invoice_no,
						});
						await updateReturnRetrieveInvoice(returnInvoiceForm.value);
						await returnDetails.value.find(detail => detail.id == id)?.fetch();
					}
					else if (target == 'exchange') {
						exchangeInvoiceForm.value = {
							exchange_id: id,
							delivery_company_code: _values.delivery_company_code,
							invoice_no: _values.invoice_no,
						};
						await exchangeInvoiceValidate();
						await validateInvoice({
							delivery_company: _values.delivery_company_code,
							invoice_number: _values.invoice_no,
						});
						await updateExchangeRetrieveInvoice(exchangeInvoiceForm.value);
						await exchangeDetails.value.find(detail => detail.id == id)?.fetch();
					}

					bom.alert('송장정보가 적용되었습니다.');
				}
				catch (e) {
					useErrorAlert(e);
				}
				finally {
					loading.hide();
				}
			},
			{
				title: '송장번호 입력',
				forms: [
					{
						type: 'select',
						name: 'delivery_company_code',
						options: [{ text: '택배사를 선택하세요', value: '' }].concat(deliveryCompanyOptions),
						value: legacyValue.delivery_company_code,
					},
					{
						type: 'number',
						name: 'invoice_no',
						maxLength: 50,
						placeholder: '송장번호를 입력하세요',
						value: legacyValue.invoice_number,
					},
				],
			}
		);
	}

	const updateUnipass = async () => {
		loading.show();
		try {
			await validatePersonalClearanceCode();
			await updatePersonalClearanceCode(props.orderId, personalClearanceCodeForm.value.personalClearanceCode);
			uniPassEditable.value = false;
			order.value!.recipient.personal_clearance_code = personalClearanceCodeForm.value.personalClearanceCode;
			personalClearanceCodeForm.value.personalClearanceCode = '';
			personalClearanceCodeForm.value.collectAgree = false;
			personalClearanceCodeForm.value.sellerCollectAgree = false;
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	};

	/** 주문상세 조회 */
	async function fetch() {
		try {
			const orderDetailSheet = await getDetail(props.orderId, props.isReceive);
			order.value = orderDetailSheet.order;

			/** 취소 상세 */
			cancelDetails.value = orderDetailSheet.cancel_ids.map((id) => {
				return {
					id: id,
					fetch: async () => {
						try {
							cancelDetails.value.find(cancelDetail => cancelDetail.id == id)!.data = await getCancelDetail(id);
						}
						catch (e) {
							useErrorAlert(e, {
								httpCatcher: {
									404: '존재하지 않는 취소주문입니다.',
								},
							});
						}
					},
					data: null,
					isOpened: false,
				};
			});

			/** 반품 상세 */
			returnDetails.value = orderDetailSheet.return_ids.map((id) => {
				return {
					id: id,
					fetch: async () => {
						try {
							returnDetails.value.find(returnDetail => returnDetail.id == id)!.data = await getReturnDetail(id);
						}
						catch (e) {
							useErrorAlert(e, {
								httpCatcher: {
									404: '존재하지 않는 반품주문입니다.',
								},
							});
						}
					},
					data: null,
					isOpened: false,
				};
			});

			/** 교환 상세 */
			exchangeDetails.value = orderDetailSheet.exchange_ids.map((id) => {
				return {
					id: id,
					fetch: async () => {
						try {
							exchangeDetails.value.find(exchangeDetail => exchangeDetail.id == id)!.data = await getExchangeDetail(id);
						}
						catch (e) {
							useErrorAlert(e, {
								httpCatcher: {
									404: '존재하지 않는 교환주문입니다.',
								},
							});
						}
					},
					data: null,
					isOpened: false,
				};
			});
		}
		catch (e) {
			useErrorAlert(e, {
				alertCallback: () => {
					router.go(-1);
				},
			});
		}
	}
	/** 원주문 상세보기 클릭시 주문번호 변경되는 이슈로 인해 watch 처리  */
	watch(() => props.orderId, async () => {
		await fetch();
		const scroller = document.querySelector('.mm_scroller');
		if (scroller) {
			scroller.scrollTop = 0;
		}
	});
</script>