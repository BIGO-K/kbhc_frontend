<template>
	<layout title="선물 상세">
		<div
			v-if="order"
			class="m_myorder-detail"
		>
			<h3>
				<b>{{ order.ordered_at }}</b>
				<strong>주문번호<b>{{ order.order_id }}</b></strong>
			</h3>
			<!-- 선물 보내시는 분 -->
			<div class="m_myorder-info">
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
									<td>{{ '홍길동' }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>
				<hr class="mm_line">

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
									<td>{{ '홍길동' }}</td>
								</tr>
								<tr>
									<th scope="row">
										<b>휴대폰 번호</b>
									</th>
									<td>{{ '010-1234-1234' }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>
				<hr class="mm_line">

				<!-- 선물 메시지 -->
				<section>
					<h4 class="mm_strapline">
						<b>선물 메시지</b>
					</h4>
					<div class="m_present T=readonly">
						<div class="m_present-message">
							<lazyload
								class="image_card mm_bg-cover"
								:src="`/image/content/present_card_1.png`"
							></lazyload>
							<p class="text_readonly T=teatarea">
								<b>{{ '고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다.' }}</b>
							</p>
						</div>
					</div>
				</section>
				<hr class="mm_line">

				<!-- 배송 정보 -->
				<section class="m_myorder-detail-address">
					<h4 class="mm_strapline">
						<b>상품 받을 주소</b>
					</h4>
					<template v-if="addressList.length < 1">
						<p class="mm_text-none T=sm">
							<i class="ico_text-none"></i>등록된 배송지가 없습니다
						</p>
						<a
							v-if="!order.shipping_address_changeable"
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
							v-if="!order.shipping_address_changeable"
							class="mm_btn T=xs T=secondary btn_address-change"
							href="#"
							@click.prevent="overlayAddress"
						>
							<b>주소 변경</b>
						</a>
					</div>
				</section>
				<hr class="mm_line">
			</div>

			<!-- 개인통관 고유부호 -->
			<dropdown
				class="T=order"
				:is-active="true"
			>
				<template #button>
					<b>해외배송 개인통관 고유부호</b>
				</template>
				<template #content>
					<div class="mm_inner m_myorder-detail-unipass">
						<template v-if="orderUnipass">
							<div class="mm_form_mix-linked">
								<p class="text_readonly">
									<b>{{ 'P1123456465' }}</b>
								</p>
								<button
									type="button"
									class="mm_btn T=primary"
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
						</template>
						<template v-else>
							<div class="mm_form_mix-linked">
								<div class="mm_form_mix-linked">
									<form-text
										v-model="orderUnipass"
										maxlength="13"
										placeholder="P로 시작하는 정보를 입력하세요"
									></form-text>
									<button
										type="button"
										class="mm_btn T=primary"
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
						</template>
					</div>
				</template>
			</dropdown>
			<hr class="mm_line">

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
							v-for="pack in order.packs"
							:key="pack.shipping_rule_id"
						>
							<!-- 일반주문 -->
							<div
								v-for="seller in pack.sellers"
								:key="seller.id"
								class="mm_order-item-seller"
							>
								<div class="mm_order...seller-head">
									<h5><i class="ico_shop"></i><b>{{ seller.name }}</b></h5>
									<a
										href="#"
										@click.prevent="overlayMyInquirySellerCreate(order.order_id, seller)"
									>
										<b>판매자 문의하기</b>
										<i class="ico_link"></i>
									</a>
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
																<strong>{{ number(orderItem.paid_price) }}</strong>
															</p>
															<p class="text_option">
																{{ `${orderItem.goods.option_name} / 1개` }}
															</p>
														</figcaption>
													</figure>
												</mm-link>
											</div>
											<div class="mm_product-unit">
												<p
													v-if="orderItem.exchanged_option_name"
													class="text_changed"
												>
													<strong class="mm_text-variable">변경된 옵션</strong>
													<span>{{ orderItem.exchanged_option_name }} / 1개</span>
												</p>
												<div class="mm_btn_box">
													<div class="mm_flex T=equal">
														<mm-link
															v-if="orderItem.cancelable"
															class="mm_btn T=xs T=line"
															:to="{
																name: 'MyOrderCancelCreate',
																params: { order_id: order.order_id, item_id: orderItem.id }
															}"
														>
															<b>주문취소</b>
														</mm-link>
														<button
															v-if="orderItem.receipt_confirmable"
															type="button"
															class="mm_btn T=xs T=light"
														>
															<b>수취확인</b>
														</button>
														<mm-link
															v-if="orderItem.exchangeable"
															class="mm_btn T=xs T=line"
															:to="{
																name: 'MyOrderExchangeCreate',
																params: { order_id: order.order_id, item_id: orderItem.id }
															}"
														>
															<b>교환신청</b>
														</mm-link>
														<mm-link
															v-if="orderItem.returnable"
															class="mm_btn T=xs T=line"
															:to="{
																name: 'MyOrderReturnCreate',
																params: { order_id: order.order_id, item_id: orderItem.id }
															}"
														>
															<b>반품신청</b>
														</mm-link>
														<a
															v-if="orderItem.delivery_trackable && orderItem.delivery_tracking_url"
															class="mm_btn T=xs T=support"
															:href="orderItem.delivery_tracking_url"
															target="_blank"
															title="새 창 열림"
														>
															<b>배송조회</b>
														</a>
														<a
															v-if="orderItem.purchase_confirmable"
															class="mm_btn T=xs T=primary"
															href="#"
															@click.prevent="overlayMyOrderConfirm(seller.name, orderItem)"
														>
															<b>구매확정</b>
														</a>
														<a
															v-if="orderItem.review_writable"
															class="mm_btn T=xs T=light"
															href="#"
															@click.prevent="overlayMyReviewCreate(seller.order_items, order.order_id)"
														>
															<b>리뷰 쓰기</b>
														</a>
														<mm-link
															v-if="orderItem.review_writable"
															class="mm_btn T=xs T=light"
															:to="{ name: 'MyReviewCompleted' }"
															target="_blank"
															title="새 창 열림"
														>
															<b>작성한 리뷰 보기</b>
														</mm-link>
														<button
															v-if="orderItem.return_cancelable"
															type="button"
															class="mm_btn T=sm T=line"
														>
															<b>반품철회</b>
														</button>
														<button
															v-if="orderItem.exchange_cancelable"
															type="button"
															class="mm_btn T=sm T=line"
														>
															<b>교환철회</b>
														</button>
														<mm-link
															v-if="orderItem.to_return_switchable"
															class="mm_btn T=sm T=line"
															:to="{ name: 'MyOrderToReturnCreate' }"
														>
															<b>반품전환</b>
														</mm-link>
														<a
															v-if="orderItem.return_delivery_trackable && orderItem.return_delivery_tracking_url"
															class="mm_btn T=sm T=line T=variable"
															:href="orderItem.return_delivery_tracking_url"
															target="_blank"
															title="새 창 열림"
														>
															<b>반송조회</b>
														</a>
													</div>
												</div>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</template>

						<!-- 패키지 상품 -->
						<div class="mm_order-item-bundle">
							<div class="mm_order...bundle-head">
								<dl>
									<dt>패키지 상품명</dt>
									<dd>{{ '캐주얼 오버핏 무지 반팔' }}</dd>
								</dl>
								<dl>
									<dt>패키지 상품번호</dt>
									<dd>{{ "P123456" }}</dd>
								</dl>
							</div>
							<div class="mm_order-item-seller">
								<div class="mm_order...seller-head">
									<h5><i class="ico_shop"></i><b>{{ '엠몬스타' }}</b></h5>
									<a
										href="#"
										@click.prevent="overlayMyInquirySellerCreate('123', { id: 123, name: '엠몬스타', tel: '' })"
									>
										<b>판매자 문의하기</b>
										<i class="ico_link"></i>
									</a>
								</div>
								<div class="mm_product-list T=sm">
									<ul>
										<li>
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
												<div class="mm_btn_box">
													<div class="mm_flex T=equal">
														<mm-link
															class="mm_btn T=xs T=line"
															:to="{
																name: 'MyOrderCancelCreate',
																params: { order_id: 123, item_id: 456 }
															}"
														>
															<b>주문취소</b>
														</mm-link>
													</div>
												</div>
											</div>
										</li>
										<li>
											<div class="mm_product-item">
												<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
													<figure>
														<div class="mm_product-item-image">
															<lazyload
																class="mm_bg-cover image_product"
																src="/image/_sample/prod_x1_2.png"
															></lazyload>
														</div>
														<figcaption>
															<p class="text_status">
																{{ '배송 완료' }}
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
												<div class="mm_btn_box">
													<div class="mm_flex T=equal">
														<mm-link
															class="mm_btn T=xs T=line"
															:to="{
																name: 'MyOrderExchangeCreate',
																params: { order_id: 123, item_id: 456 }
															}"
														>
															<b>교환신청</b>
														</mm-link>
														<a
															class="mm_btn T=xs T=support"
															href="#"
															target="_blank"
															title="새 창 열림"
														>
															<b>배송조회</b>
														</a>
													</div>
												</div>
											</div>
										</li>
										<li>
											<div class="mm_product-item">
												<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
													<figure>
														<div class="mm_product-item-image">
															<lazyload
																class="mm_bg-cover image_product"
																src="/image/_sample/prod_x1_2.png"
															></lazyload>
														</div>
														<figcaption>
															<p class="text_status">
																{{ '구매 확정' }}
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
												<div class="mm_btn_box">
													<div class="mm_flex T=equal">
														<mm-link
															class="mm_btn T=xs T=light"
															:to="{ name: 'MyReviewCompleted' }"
															target="_blank"
															title="새 창 열림"
														>
															<b>작성한 리뷰 보기</b>
														</mm-link>
													</div>
												</div>
											</div>
										</li>
										<li>
											<div class="mm_product-item">
												<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
													<figure>
														<div class="mm_product-item-image">
															<lazyload
																class="mm_bg-cover image_product"
																src="/image/_sample/prod_x1_2.png"
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
												<div class="mm_btn_box">
													<div class="mm_flex T=equal">
														<a
															class="mm_btn T=xs T=line"
															href="#"
															@click.prevent="modalOrderVoucherDetail"
														>
															<b>반품 정보</b>
														</a>
													</div>
												</div>
											</div>
										</li>
										<li>
											<div class="mm_product-item">
												<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
													<figure>
														<div class="mm_product-item-image">
															<lazyload
																class="mm_bg-cover image_product"
																src="/image/_sample/prod_x1_2.png"
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
										</li>
									</ul>
								</div>
							</div>
						</div>

						<!-- 기프티콘 -->
						<div class="mm_order-item-seller">
							<div class="mm_order...seller-head">
								<h5><i class="ico_shop"></i><b>{{ '엠몬스타' }}</b></h5>
								<a
									href="#"
									@click.prevent="overlayMyInquirySellerCreate('123', { id: 123, name: '엠몬스타', tel: '' })"
								>
									<b>판매자 문의하기</b>
									<i class="ico_link"></i>
								</a>
							</div>
							<div class="mm_product-list T=sm">
								<ul>
									<li>
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
											<div class="mm_btn_box">
												<div class="mm_flex T=equal">
													<mm-link
														class="mm_btn T=xs T=line"
														:to="{
															name: 'MyOrderCancelCreate',
															params: { order_id: 123, item_id: 456 }
														}"
													>
														<b>주문취소</b>
													</mm-link>
												</div>
											</div>
										</div>
									</li>
									<li>
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
															{{ '배송 완료' }}
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
									</li>
								</ul>
							</div>
						</div>

						<!-- 바우처 -->
						<div class="mm_order-item-seller">
							<div class="mm_order...seller-head">
								<h5><i class="ico_shop"></i><b>{{ '엠몬스타' }}</b></h5>
								<a
									href="#"
									@click.prevent="overlayMyInquirySellerCreate('123', { id: 123, name: '엠몬스타', tel: '' })"
								>
									<b>판매자 문의하기</b>
									<i class="ico_link"></i>
								</a>
							</div>
							<div class="mm_product-list T=sm">
								<ul>
									<li>
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
											<div class="mm_btn_box">
												<div class="mm_flex T=equal">
													<mm-link
														class="mm_btn T=xs T=line"
														:to="{
															name: 'MyOrderCancelCreate',
															params: { order_id: 123, item_id: 456 }
														}"
													>
														<b>주문취소</b>
													</mm-link>
												</div>
												<div class="mm_flex T=equal">
													<a
														class="mm_btn T=xs T=support"
														href="#"
														@click.prevent="modalVoucherCode"
													>
														<b>일련번호 확인하기</b>
													</a>
													<button
														type="button"
														class="mm_btn T=xs T=primary"
													>
														<b>바로 사용하기</b>
													</button>
												</div>
											</div>
										</div>
									</li>
									<li>
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
															{{ '배송 완료' }}
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
											<div class="mm_btn_box">
												<div class="mm_flex T=equal">
													<a
														class="mm_btn T=xs T=support"
														href="#"
														@click.prevent="modalVoucherCode"
													>
														<b>일련번호 확인하기</b>
													</a>
													<b class="mm_btn T=xs T=disabled">사용 완료</b>
												</div>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</div>

						<mm-link
							v-if="order.original_order_id"
							class="btn_order-origin"
							:to="{ name: 'MyOrderDetail', params: { id: order.original_order_id } }"
						>
							<b>원 주문 상세보기<i class="ico_link"></i></b>
						</mm-link>
					</div>
				</template>
			</dropdown>
			<hr class="mm_line">
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
	import { defineAsyncComponent, ref } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormText from '@/component/form/FormText.vue';

	const { openOverlay, openModal } = useGlobalPageContext();
	const { number } = useFormatter();

	const orderDetail: OrderDetail = {
		'order': {
			'order_id': '20051411421512334562',
			'ordered_at': '2023.08.23',
			'original_order_id': null,
			'shipping_address_changeable': false,
			'shipping_address': {
				'name': '홍길동',
				'tel': '010-1234-1234',
				'zip_code': '06616',
				'base_address': '서울특별시 도봉구 창2동 647-12 창동 북한산 현대홈시티3차',
				'detail_address': '302동 101호',
				'message': '문옆 소화전이요',
			},
			'orderer_info': {
				'name': '홍길동',
				'tel': '010-1234-1234',
				'email': 'mmonstar@mmonstar.co.kr',
				'personal_clearance_code': 'P1234567890',
				// 'personal_clearance_code': '',
			},
			'payment_info': {
				'label': '신용카드',
				'buy_point': 0,
				'except_buy_point': 0,
				'card': null,
				'bank_account': {
					'bank_name': '기업은행',
					'account_number': 'T0309260001543',
					'input_expire_at': '2023-11-14T14:59:59.000000Z',
				},
				'mobile': null,
			},
			'payment_summary': {
				'total_goods_price': 300000,
				'total_shipping_price': 2500,
				'discounts': {
					'member': 8550,
					'night_sale': 10000,
					'immediately_sale': 5000,
				},
				'used_coupon_amount': 0,
				'used_points': 0,
				'total_price': 235000,
			},
			'packs': [
				{
					'shipping_rule_id': 2,
					'paid_shipping_price': 0,
					'sellers': [
						{
							'id': 1,
							'name': 'M.Monstar',
							'tel': '01095214842',
							'order_items': [
								{
									'id': 199,
									'cancel_id': '',
									'return_id': '',
									'return_target_id': 0,
									'exchange_id': '',
									'exchange_target_id': 0,
									'order_status_label': '배송중',
									'refund_status_label': null,
									'earnable_point': 0,
									'paid_price': 99000,
									'point_used': 0,
									'cancelable': false,
									'delivery_trackable': true,
									'delivery_tracking_url': 'https://test3.goodsflow.com/zkm/V1/whereis/triz/REL59',
									'receipt_confirmable': true,
									'returnable': false,
									'exchangeable': false,
									'purchase_confirmable': false,
									'review_writable': false,
									'return_cancelable': false,
									'return_delivery_trackable': false,
									'return_delivery_tracking_url': '',
									'exchanged_option_name': '',
									'exchange_cancelable': false,
									'to_return_switchable': false,
									'goods': {
										'id': 20,
										'name': '캐주얼 오버핏 무지 반팔 레이어드 티셔츠 캐주얼 오버핏 무지 반팔 레이어드 티셔츠',
										'brand_name': 'M.Mon 엠몬스타',
										'thumbnail_url': 'https://img.kbhc.kr/kbhc_mall_shop/develop/goods/00/00/00/00/00/20/1.jpg?',
										'option_name': '화이트 FREE',
										'option_id': 46,
									},
								},
								{
									'id': 198,
									'cancel_id': '',
									'return_id': '',
									'return_target_id': 0,
									'exchange_id': '',
									'exchange_target_id': 0,
									'order_status_label': '배송완료',
									'refund_status_label': null,
									'earnable_point': 0,
									'paid_price': 99000,
									'point_used': 0,
									'cancelable': false,
									'delivery_trackable': true,
									'delivery_tracking_url': 'https://test3.goodsflow.com/zkm/V1/whereis/triz/REL59',
									'receipt_confirmable': false,
									'returnable': true,
									'exchangeable': true,
									'purchase_confirmable': true,
									'review_writable': false,
									'return_cancelable': false,
									'return_delivery_trackable': false,
									'return_delivery_tracking_url': '',
									'exchanged_option_name': '',
									'exchange_cancelable': false,
									'to_return_switchable': false,
									'goods': {
										'id': 21,
										'name': '[엠몬스타 제작] Overfit Nylon Varsity Man 오버핏 나일론 바시티 맨투맨',
										'brand_name': 'M.Mon 엠몬스타',
										'thumbnail_url': 'https://img.kbhc.kr/kbhc_mall_shop/develop/goods/00/00/00/00/00/20/1.jpg?',
										'option_name': '화이트 FREE',
										'option_id': 46,
									},
								},
							],
						},
					],
				},
				{
					'shipping_rule_id': 2,
					'paid_shipping_price': 0,
					'sellers': [
						{
							'id': 1,
							'name': 'M.Monstar',
							'tel': '01095214842',
							'order_items': [
								{
									'id': 196,
									'cancel_id': '',
									'return_id': '',
									'return_target_id': 0,
									'exchange_id': '',
									'exchange_target_id': 0,
									'order_status_label': '구매확정',
									'refund_status_label': null,
									'earnable_point': 0,
									'paid_price': 99000,
									'point_used': 0,
									'cancelable': false,
									'delivery_trackable': false,
									'delivery_tracking_url': 'https://test3.goodsflow.com/zkm/V1/whereis/triz/REL59',
									'receipt_confirmable': false,
									'returnable': false,
									'exchangeable': false,
									'purchase_confirmable': false,
									'review_writable': true,
									'return_cancelable': false,
									'return_delivery_trackable': false,
									'return_delivery_tracking_url': '',
									'exchanged_option_name': '',
									'exchange_cancelable': false,
									'to_return_switchable': false,
									'goods': {
										'id': 20,
										'name': '캐주얼 오버핏 무지 반팔 레이어드 티셔츠 캐주얼 오버핏 무지 반팔 레이어드 티셔츠',
										'brand_name': 'M.Mon 엠몬스타',
										'thumbnail_url': 'https://img.kbhc.kr/kbhc_mall_shop/develop/goods/00/00/00/00/00/20/1.jpg?',
										'option_name': '화이트 FREE 옵션명이 길 경우에 두줄까지 가능합니다',
										'option_id': 46,
									},
								},
								{
									'id': 197,
									'cancel_id': '',
									'return_id': '',
									'return_target_id': 0,
									'exchange_id': '',
									'exchange_target_id': 0,
									'order_status_label': '구매확정',
									'refund_status_label': null,
									'earnable_point': 0,
									'paid_price': 99000,
									'point_used': 0,
									'cancelable': true,
									'delivery_trackable': false,
									'delivery_tracking_url': 'https://test3.goodsflow.com/zkm/V1/whereis/triz/REL59',
									'receipt_confirmable': false,
									'returnable': false,
									'exchangeable': false,
									'purchase_confirmable': false,
									'review_writable': false,
									'return_cancelable': false,
									'return_delivery_trackable': false,
									'return_delivery_tracking_url': '',
									'exchanged_option_name': '',
									'exchange_cancelable': false,
									'to_return_switchable': false,
									'goods': {
										'id': 20,
										'name': '캐주얼 오버핏 무지 반팔 레이어드 티셔츠 캐주얼 오버핏 무지 반팔 레이어드 티셔츠',
										'brand_name': 'M.Mon 엠몬스타',
										'thumbnail_url': 'https://img.kbhc.kr/kbhc_mall_shop/develop/goods/00/00/00/00/00/20/1.jpg?',
										'option_name': '화이트 FREE 옵션명이 길 경우에 두줄까지 가능합니다',
										'option_id': 46,
									},
								},
							],
						},
					],
				},
			],
			'receipt_viewable': true,
			'giveaways': [],
		},
		'cancel_ids': [],
		'return_ids': [],
		'exchange_ids': [],
	};

	const myAddresses: MyShippingAddressDetail[] = [];
	const addressList = ref<MyShippingAddressDetail[]>(myAddresses);

	/** 주문상세 */
	const order = ref<OrderDetail['order']>(orderDetail.order);

	function overlayAddress() {
		const component = defineAsyncComponent(() => import('@/page/address/Address.vue'));

		return openOverlay(component);
	}

	function overlayMyOrderConfirm(sellerName: string, orderItem: NormalStepOrderItem) {
		const component = defineAsyncComponent(() => import('@/page/mypage/order/confirm/MyOrderConfirm.vue'));

		return openOverlay(component, {
			props: {
				sellerName,
				orderItem,
			},
			// onClose: fetch,
		});
	}

	function overlayMyInquirySellerCreate(orderId: string, seller: QnaSeller) {
		const component = defineAsyncComponent(() => import('@/page/mypage/inquiry/seller/create/MyInquirySellerCreate.vue'));

		return openOverlay(component, {
			props: {
				orderId,
				seller: {
					id: seller.id,
					name: seller.name,
					tel: seller.tel,
				},
			},
		});
	}

	function overlayMyReviewCreate(orderItems: NormalStepOrderItem[], orderId: string) {
		const component = defineAsyncComponent(() => import('@/page/mypage/review/create/MyReviewCreate.vue'));

		return openOverlay(component, {
			props: {
				orderItems,
				orderId,
			},
			// onClose: getOrders,
		});
	}

	function modalVoucherCode() {
		const component = defineAsyncComponent(() => import('@/page/mypage/order/voucher/code/VoucherCode.vue'));

		return openModal(component);
	}

	function overlayOrderUnipass() {
		const component = defineAsyncComponent(() => import('@/page/order/unipass/OrderUnipass.vue'));

		return openOverlay(component);
	}

	const orderUnipass = ref('');
	const unipassCollectAgree = ref(false);
	const unipassSellerAgree = ref(false);
</script>