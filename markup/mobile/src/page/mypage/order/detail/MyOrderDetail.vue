<template>
	<layout title="주문 상세">
		<div
			v-if="order"
			class="m_myorder-detail"
		>
			<h3>
				<b>{{ order.ordered_at }}</b>
				<strong>주문번호<b>{{ order.order_id }}</b></strong>
			</h3>
			<!-- 주문자 정보 -->
			<div class="m_myorder-info">
				<section>
					<h4 class="mm_strapline">
						<b>주문자 정보</b>
					</h4>
					<div class="mm_order-info">
						<table>
							<tbody>
								<tr>
									<th scope="row">
										<b>주문자 이름</b>
									</th>
									<td>{{ order.orderer_info.name }}</td>
								</tr>
								<tr>
									<th scope="row">
										<b>휴대폰 번호</b>
									</th>
									<td>{{ order.orderer_info.tel }}</td>
								</tr>
								<tr>
									<th scope="row">
										<b>이메일 주소</b>
									</th>
									<td>{{ order.orderer_info.email }}</td>
								</tr>
								<tr v-if="order.orderer_info.personal_clearance_code">
									<th scope="row">
										<b>개인통관 고유번호</b>
									</th>
									<td>{{ order.orderer_info.personal_clearance_code }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>
				<hr class="mm_line">

				<!-- 배송 정보 -->
				<section class="m_myorder-detail-address">
					<h4 class="mm_strapline">
						<b>배송정보</b>
					</h4>
					<div class="mm_order-info">
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

			<!-- 구매 상품 -->
			<dropdown
				class="T=order"
				:is-active="true"
			>
				<template #button>
					<b>구매 상품</b>
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

					<gift-order-info
						v-if="order.giveaways && order.giveaways.length > 0"
						:giveaways="order.giveaways"
						class="mm_inner m_myorder-detail-gift"
					></gift-order-info>

					<!-- 정기구독 -->
					<!-- 정기구독 결제 예정일 -->
					<section
						v-if="isSubscription"
						class="mm_inner m_myorder-subscription"
					>
						<h4 class="mm_strapline">
							<b>정기구독 결제 예정일</b>
						</h4>
						<ol class="m_order-subscription">
							<li class="T=on">
								<p>2차 주문</p>
								<p>2023-09-25 <b class="mm_tag">주문생성완료</b></p>
							</li>
							<li class="T=on">
								<p>3차 주문</p>
								<p>2023-10-25</p>
							</li>
							<li>
								<p>4차 주문</p>
								<p>2023-11-25</p>
							</li>
							<li>
								<p>5차 주문</p>
								<p>2023-12-25</p>
							</li>
							<li>
								<p>6차 주문</p>
								<p>2024-01-25</p>
							</li>
						</ol>
					</section>

					<template v-if="!order.original_order_id">
						<section class="m_myorder-detail-cost">
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
											<tr>
												<th scope="row">
													<b>상품 할인</b>
												</th>
												<td>
													<p class="text_point">
														- <strong>{{ number(30000) }}</strong><sub>원</sub>
													</p>
												</td>
											</tr>
											<tr>
												<th scope="row">
													<b>쿠폰</b>
												</th>
												<td>
													<p class="text_point">
														- <strong>{{ number(3000) }}</strong><sub>원</sub>
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
											<tr>
												<th scope="row">
													<b>스타포인트 사용금액</b>
												</th>
												<td>
													<p class="text_point">
														- <strong>{{ number(1000) }}</strong><sub>원</sub>
													</p>
												</td>
											</tr>
											<tr>
												<th scope="row">
													<b>리워드포인트 사용금액</b>
												</th>
												<td>
													<p class="text_point">
														- <strong>{{ number(2000) }}</strong><sub>원</sub>
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
											<template v-if="true">
												<tr>
													<th scope="row">
														<b>카드사</b>
													</th>
													<td>
														{{ '국민카드' }}
													</td>
												</tr>
												<tr>
													<th scope="row">
														<b>카드 번호</b>
													</th>
													<td>
														123*-****-****-****
													</td>
												</tr>
												<tr>
													<th scope="row">
														<b>결제 승인일</b>
													</th>
													<td>
														{{ '2020. 06. 04 12:30:52' }}
													</td>
												</tr>
											</template>
										</tbody>
									</table>
								</div>
								<a
									class="mm_btn T=xs T=secondary btn_receipt"
									href="#"
									@click.prevent="overlayMyOrderDetailReceipt"
								>
									<i class="ico_receipt"></i><b>영수증 보기</b>
								</a>
							</div>
						</section>

						<!-- 적립금 적립 혜택 -->
						<section class="m_myorder-detail-point">
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
													<strong>{{ '100' }}</strong><sub>원</sub>
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
				</template>
			</dropdown>
			<hr class="mm_line">

			<!-- 취소 주문번호 -->
			<dropdown
				class="T=order"
				:is-active="true"
			>
				<template #button>
					<b>취소 주문번호</b><b class="text_contraction">{{ '2005131142151234562' }}</b>
				</template>
				<template #content>
					<!-- 취소상품 -->
					<div class="mm_order-item">
						<div class="mm_order-item-seller">
							<div class="mm_order...seller-head">
								<p class="text_ship">
									<i class="ico_ship"></i><span class="text_price"><strong>{{ number(2500) }}</strong></span>
								</p>
							</div>
							<div class="mm_product-list T=sm">
								<ul>
									<li
										v-for="item in 2"
										:key="item"
									>
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
														<p class="text_brand">
															{{ '엠몬스타' }}
														</p>
														<p class="text_product">
															{{ '캐주얼 오버핏 무지 반팔 레이어드 티셔츠 캐주얼 오버핏 무지 반팔' }}
														</p>
														<p class="text_price">
															<strong>{{ number(99000) }}</strong>
														</p>
														<p class="text_option">
															{{ '화이트 FREE / 1개' }}
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
								<b>{{ '환불' }}</b>
								<i class="ico_form-select"></i>
							</p>
							<template v-if="false">
								<h6 class="mm_text-label T=sm">
									<b>상세 사유</b>
								</h6>
								<p class="text_readonly T=textarea">
									<b>{{ '취소 상세 사유' }}</b>
									<b class="text_byte">
										<strong>{{ number(0) }}</strong>/{{ number(5000) }}
									</b>
								</p>
							</template>
						</section>
						<div class="m_myorder-detail-refund">
							<section>
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
												<td>{{ '홍길동' }}</td>
											</tr>
											<tr>
												<th scope="row">
													<b>환불 은행</b>
												</th>
												<td>{{ '신한은행' }}</td>
											</tr>
											<tr>
												<th scope="row">
													<b>환불 계좌</b>
												</th>
												<td>{{ '1103331234567' }}</td>
											</tr>
										</tbody>
									</table>
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
													<b>스타포인트 환불</b>
												</th>
												<td>
													<p class="text_point">
														<strong>{{ '2,000' }}</strong><sub>원</sub>
													</p>
												</td>
											</tr>
											<tr>
												<th scope="row">
													<b>리워드포인트 환불</b>
												</th>
												<td>
													<p class="text_point">
														<strong>{{ '2,000' }}</strong><sub>원</sub>
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
						</div>
					</div>
				</template>
			</dropdown>
			<hr class="mm_line">

			<!-- 반품 주문번호 -->
			<dropdown
				class="T=order"
				:is-active="true"
			>
				<template #button>
					<b>반품 주문번호</b><b class="text_contraction">{{ '2005131142151234562' }}</b>
				</template>
				<template #content>
					<!-- 반품상품 -->
					<div class="mm_order-item">
						<div class="mm_order-item-seller">
							<div class="mm_order...seller-head">
								<p class="text_ship">
									<i class="ico_ship"></i><span class="text_price"><strong>{{ number(2500) }}</strong></span>
								</p>
							</div>
							<div class="mm_product-list T=sm">
								<ul>
									<li
										v-for="item in 2"
										:key="item"
									>
										<p class="text_seller">
											<i class="ico_shop"></i>{{ '엠몬스타' }}
										</p>
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
														<p class="text_brand">
															{{ '엠몬스타' }}
														</p>
														<p class="text_product">
															{{ '캐주얼 오버핏 무지 반팔 레이어드 티셔츠 캐주얼 오버핏 무지 반팔' }}
														</p>
														<p class="text_price">
															<strong>{{ number(99000) }}</strong>
														</p>
														<p class="text_option">
															{{ '화이트 FREE / 1개' }}
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
								<b>{{ '상품에 하자가 있어요' }}</b>
								<i class="ico_form-select"></i>
							</p>
							<h6 class="mm_text-label T=sm">
								<b>상세 사유</b>
							</h6>
							<p class="text_readonly T=textarea">
								<b>{{ '나중에 사려구요' }}</b>
								<b class="text_byte">
									<strong>{{ number(0) }}</strong>/{{ number(5000) }}
								</b>
							</p>
							<h6 class="mm_text-label T=sm">
								<b>반품 송장번호</b>
							</h6>
							<div class="mm_btn_box">
								<a
									class="mm_btn T=xs T=support"
									href="#"
								>
									<b>입력하기</b>
								</a>
							</div>
						</section>
						<section>
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
											<td>{{ '홍길동' }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>휴대폰 번호</b>
											</th>
											<td>{{ '010-1234-1234' }}</td>
										</tr>
										<tr>
											<th scope="row">
												<b>주소</b>
											</th>
											<td>{{ '39392' }}<br>{{ '서울 서초구 명달로 17길 32, 트라움하우스 2차 아파트 301호' }}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</section>
						<div class="m_myorder-detail-refund">
							<section>
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
												<td>{{ '홍길동' }}</td>
											</tr>
											<tr>
												<th scope="row">
													<b>환불 은행</b>
												</th>
												<td>{{ '신한은행' }}</td>
											</tr>
											<tr>
												<th scope="row">
													<b>환불 계좌</b>
												</th>
												<td>{{ '1103331234567' }}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</section>
							<section>
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
							</section>
						</div>
					</div>
				</template>
			</dropdown>
			<hr class="mm_line">

			<!-- 교환 주문번호 -->
			<dropdown
				class="T=order"
				:is-active="true"
			>
				<template #button>
					<b>교환 주문번호</b><b class="text_contraction">2005131142151234562</b>
				</template>
				<template #content>
					<!-- 교환상품 -->
					<div class="mm_order-item">
						<div class="mm_order-item-seller">
							<div class="mm_order...seller-head">
								<p class="text_ship">
									<i class="ico_ship"></i><span class="text_price"><strong>{{ number(2500) }}</strong></span>
								</p>
							</div>
							<div class="mm_product-list T=sm">
								<ul>
									<li
										v-for="item in 2"
										:key="item"
									>
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
														<p class="text_brand">
															{{ '엠몬스타' }}
														</p>
														<p class="text_product">
															{{ '캐주얼 오버핏 무지 반팔 레이어드 티셔츠 캐주얼 오버핏 무지 반팔' }}
														</p>
														<p class="text_price">
															<strong>{{ number(99000) }}</strong>
														</p>
														<p class="text_option">
															{{ '화이트 FREE / 1개' }}
														</p>
													</figcaption>
												</figure>
											</mm-link>
										</div>
										<div class="mm_product-unit">
											<p class="text_changed">
												<strong class="mm_text-secondary">변경된 옵션</strong>
												<span>베이지 FREE / 1개</span>
												<span>레드 FREE / 1개</span>
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
								<b>{{ '상품에 하자가 있어요' }}</b>
								<i class="ico_form-select"></i>
							</p>
							<h6 class="mm_text-label T=sm">
								<b>상세 사유</b>
							</h6>
							<p class="text_readonly T=textarea">
								<b>{{ '나중에 사려구요' }}</b>
								<b class="text_byte">
									<strong>{{ number(0) }}</strong>/{{ number(5000) }}
								</b>
							</p>
							<div class="mm_form_mix-address">
								<h6 class="mm_text-label T=sm">
									<b>교환 상품 받을 주소</b>
								</h6>
								<div class="mm_form_mix-linked">
									<p class="text_readonly">
										<b>{{ '06616' }}</b>
									</p>
									<button
										type="button"
										class="mm_btn T=lg T=support"
									>
										<b>우편번호 찾기</b>
									</button>
								</div>
								<p class="text_readonly">
									<b>{{ '06616서울특별시 도봉구 창2동 647-12' }}</b>
								</p>
								<p class="text_readonly">
									<b>{{ '북한산 현대홈시티3차 302동 101호' }}</b>
								</p>
							</div>
							<div class="m_myorder-info-invoice">
								<h6 class="mm_text-label T=sm">
									<b>교환 송장번호</b>
								</h6>
								<p class="text_readonly">
									<b>{{ 'CJ대한통운' }}</b>
								</p>
								<p class="text_readonly">
									<b>{{ '1123456789' }}</b>
								</p>
								<a
									class="mm_btn T=xs T=secondary btn_modify"
									href="#"
								>
									<b>수정하기</b>
								</a>
							</div>
						</section>
						<section>
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
											<td>홍길동</td>
										</tr>
										<tr>
											<th scope="row">
												<b>휴대폰</b>
											</th>
											<td>010-1234-1234</td>
										</tr>
										<tr>
											<th scope="row">
												<b>주소</b>
											</th>
											<td>39392<br>서울 서초구 명달로 17길 32, 트라움하우스 2차 아파트 301호</td>
										</tr>
									</tbody>
								</table>
							</div>
						</section>
						<section>
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
												<td>즉시결제</td>
											</tr>
											<tr>
												<th scope="row">
													<b>면제 배송비</b>
												</th>
												<td>
													<p class="text_price">
														+ <strong>{{ number(2500) }}</strong>
													</p>
												</td>
											</tr>
											<tr>
												<th scope="row">
													<b>교환 배송비</b>
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
													<b>최종 결제금액</b>
												</th>
												<td>
													<p class="text_price">
														<strong class="mm_text-secondary">{{ number(5000) }}</strong>
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
												<td>{{ '신용/체크카드' }}</td>
											</tr>
											<template v-if="paymentMethod === 'deposit' || paymentMethod === 'escrow' || paymentMethod === 'bank'">
												<tr>
													<th scope="row">
														<b>이체은행</b>
													</th>
													<td>{{ '우리은행' }}</td>
												</tr>
												<tr>
													<th scope="row">
														<b>예금주</b>
													</th>
													<td>{{ '엠몬스타' }}</td>
												</tr>
												<tr>
													<th scope="row">
														<b>계좌번호</b>
													</th>
													<td>{{ '123456789' }}</td>
												</tr>
												<tr>
													<th scope="row">
														<b>입금기한</b>
													</th>
													<td>{{ '2020.06.04 12:30:12' }}</td>
												</tr>
											</template>
											<template v-else>
												<tr>
													<th scope="row">
														<b>카드사</b>
													</th>
													<td>{{ '신한카드' }}</td>
												</tr>
												<tr>
													<th scope="row">
														<b>카드 번호</b>
													</th>
													<td>{{ '911*-****-****-****' }}</td>
												</tr>
												<tr>
													<th scope="row">
														<b>결제 승인일</b>
													</th>
													<td>{{ '2020.06.04 12:30:12' }}</td>
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
	import GiftOrderInfo from '@/feature/gift/component/GiftInfo.vue';

	const { bom, openOverlay, openModal } = useGlobalPageContext();
	const { number } = useFormatter();

	const isSubscription = ref(Math.floor(Math.random() * 2) == 0 ? true : false);

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

	const paymentMethod = ref('deposit');

	/** 주문상세 */
	const order = ref<OrderDetail['order']>(orderDetail.order);

	// const bomShipNumber = () => {
	// 	bom.prompt(
	// 		'회수 시 발급된 송장번호를 입력하세요',
	// 		(_is: boolean, _values: Record<string, string>) => {
	// 			console.log(_is, _values);
	// 		},
	// 		{
	// 			title: '송장번호 입력',
	// 			forms: [
	// 				// { type: 'select', options: [{ text: '택배사를 선택하세요', value: '' }] },// FIXME 셀렉트 필요?
	// 				{ type: 'number', name: 'ship', maxLength: 50, placeholder: '송장번호를 입력하세요' },
	// 			],
	// 		}
	// 	);
	// };

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

	function overlayMyOrderDetailReceipt() {
		const component = defineAsyncComponent(() => import('@/page/mypage/order/detail/receipt/MyOrderDetailReceipt.vue'));

		return openOverlay(component);
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
</script>