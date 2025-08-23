<template>
	<div class="mm_inner">
		<!-- 주문목록 정렬 -->
		<div class="m_myorder-sort">
			<form-select
				v-model="filter.month"
			>
				<option
					v-for="month in [1,3,5,12]"
					:key="month"
				>
					{{ month < 12 ? `최근 ${month}개월` : '최근 1년' }}
				</option>
			</form-select>
			<form-select
				v-model="filter.statusCode"
			>
				<option value="review">
					주문상태 전체
				</option>
				<option
					v-for="status in statusCodes"
					:key="status.code"
					:value="status.code"
				>
					{{ status.label }}
				</option>
			</form-select>
		</div>

		<!-- (D) 주문 필터가 [전체, 배송중, 배송완료] 상태 일때만 노출합니다. -->
		<div
			v-if="showReviewGuide"
			class="mm_note T=bg"
		>
			<ul>
				<li>리뷰는 구매확정 시점부터 바로 작성할 수 있습니다.</li>
				<li>구매확정 후 30일 경과 시 리뷰를 작성할 수 없습니다.</li>
				<li>미작성 리뷰는 마이페이지 &#62; 리뷰관리에서 작성하실 수 있습니다.</li>
			</ul>
		</div>
	</div>

	<!-- 주문목록 -->
	<p
		v-if="normalOrders.length < 1"
		class="mm_text-none"
	>
		<i class="ico_text-none"></i>주문 내역이 없습니다
	</p>
	<div
		v-else
		class="mm_order-list"
	>
		<article
			v-for="order in normalOrders"
			:key="order.order_id"
			class="mm_order-item"
		>
			<h5>
				<b>{{ order.ordered_at }}</b>
				<strong>주문번호<b>{{ order.order_id }}</b></strong>
			</h5>
			<mm-link
				class="btn_detail"
				:to="{ name: 'MyOrderDetail', params: { id: order.order_id } }"
			>
				<b>주문상세</b><i class="ico_link"></i>
			</mm-link>

			<template
				v-for="pack in order.packs"
				:key="pack.shipping_rule_id"
			>
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
													<strong>{{ number(orderItem.paid_price + orderItem.point_used) }}</strong>
												</p>
												<p class="text_option">
													<!-- {{ `${optionText(orderItem.goods.option_name)} / 1개` }} -->
													{{ `${orderItem.goods.option_name} / 1개` }}
												</p>
											</figcaption>
										</figure>
									</mm-link>
								</div>
								<div class="mm_product-unit">
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
												v-if="orderItem.review_written"
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
						</ul>
					</div>
				</div>
			</template>
		</article>

		<!-- 바우처 -->
		<article class="mm_order-item">
			<h5>
				<b>{{ '2023.00.00' }}</b>
				<strong>주문번호<b>{{ '2005141142151234562' }}</b></strong>
			</h5>
			<mm-link
				class="btn_detail"
				:to="{ name: 'MyOrderDetail', params: { id: 123 } }"
			>
				<b>주문상세</b><i class="ico_link"></i>
			</mm-link>
			<div class="mm_order-item-bundle">
				<div class="mm_order...bundle-head">
					<dl>
						<dt>패키지 상품명</dt>
						<dd>{{ '캐주얼 오버핏 무지 반팔' }}</dd>
					</dl>
					<dl>
						<dt>패키지 상품번호</dt>
						<dd>{{ 'P123456' }}</dd>
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
													src="/image/_sample/prod_x1_2.png"
												></lazyload>
												<p class="text_voucher">
													<b>{{ '사용 완료' }}</b>
												</p>
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
												<p class="text_voucher">
													<b>{{ '사용 종료' }}</b>
												</p>
											</div>
											<figcaption>
												<p class="text_status">
													{{ '취소 완료' }}
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
		</article>

		<!-- 패키지 상품 -->
		<article class="mm_order-item">
			<h5>
				<b>{{ '2023.00.00' }}</b>
				<strong>주문번호<b>{{ '2005141142151234562' }}</b></strong>
			</h5>
			<mm-link
				class="btn_detail"
				:to="{ name: 'MyOrderDetail', params: { id: 123 } }"
			>
				<b>주문상세</b><i class="ico_link"></i>
			</mm-link>
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
					</ul>
				</div>
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
					</ul>
				</div>
			</div>
		</article>
	</div>
</template>

<script setup lang="ts">
	import { ref, defineAsyncComponent, computed } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Lazyload from '@/component/Lazyload.vue';
	import FormSelect from '@/component/form/FormSelect.vue';

	const { number } = useFormatter();
	const { openOverlay, openModal } = useGlobalPageContext();

	/** 검색 필터 */
	const filter = ref<{
		statusCode: number | null;
		month: number;
	}>({
		statusCode: null,
		month: 1,
	});

	// 리뷰 관련 안내 문구 노출 여부
	const showReviewGuide = computed(() => {
		if (normalOrders.value.length < 1) {
			return false;
		}
		const selected = statusCodes.find(status => status.code == filter.value.statusCode);

		return selected?.need_review_guide === undefined ? true : selected.need_review_guide;
	});

	const orders: NormalStepOrder[] = [
		{
			'order_id': '20051411421512334562',
			'ordered_at': '2023.08.23',
			'packs': [
				{
					'shipping_rule_id': 1,
					'paid_shipping_price': 3000,
					'sellers': [
						{
							'id': 1,
							'name': 'M.Mon 엠몬스타',
							'tel': '01095214842',
							'order_items': [
								{
									'id': 374,
									'order_status_label': '구매 확정',
									'cancelable': false,
									'delivery_trackable': false,
									'receipt_confirmable': false,
									'returnable': false,
									'exchangeable': false,
									'purchase_confirmable': false,
									'review_writable': false,
									// 'review_written': false,
									'paid_price': 41800,
									'delivery_tracking_url': 'null',
									'goods': {
										'id': 2,
										'name': '드시온 귀리렌틸콩 곤약밥',
										'brand_name': '마이해빗',
										'thumbnail_url': 'https://img.kbhc.kr/kbhc_mall_shop/develop/goods/00/00/00/00/00/02/1.jpg?',
										'option_name': '(22% 할인) 귀리 렌탈콩 곤약밥 20개입 (+24000원) / -',
										'option_id': 4,
									},
									'earnable_point': 0,
									'point_used': 0,
								},
								{
									'id': 375,
									'order_status_label': '구매 확정',
									'cancelable': false,
									'delivery_trackable': true,
									'receipt_confirmable': true,
									'returnable': false,
									'exchangeable': false,
									'purchase_confirmable': false,
									'review_writable': false,
									// 'review_written': false,
									'paid_price': 41800,
									'delivery_tracking_url': 'asdf',
									'goods': {
										'id': 2,
										'name': '드시온 귀리렌틸콩 곤약밥',
										'brand_name': '마이해빗',
										'thumbnail_url': 'https://img.kbhc.kr/kbhc_mall_shop/develop/goods/00/00/00/00/00/02/1.jpg?',
										'option_name': '(22% 할인) 귀리 렌탈콩 곤약밥 20개입 (+24000원) / -',
										'option_id': 4,
									},
									'earnable_point': 0,
									'point_used': 0,
								},
								{
									'id': 376,
									'order_status_label': '구매 확정',
									'cancelable': false,
									'delivery_trackable': true,
									'receipt_confirmable': false,
									'returnable': true,
									'exchangeable': true,
									'purchase_confirmable': true,
									'review_writable': false,
									// 'review_written': false,
									'paid_price': 41800,
									'delivery_tracking_url': 'asdf',
									'goods': {
										'id': 2,
										'name': '드시온 귀리렌틸콩 곤약밥',
										'brand_name': '마이해빗',
										'thumbnail_url': 'https://img.kbhc.kr/kbhc_mall_shop/develop/goods/00/00/00/00/00/02/1.jpg?',
										'option_name': '(22% 할인) 귀리 렌탈콩 곤약밥 20개입 (+24000원) / -',
										'option_id': 4,
									},
									'earnable_point': 0,
									'point_used': 0,
								},
							],
						},
					],
				},
			],
		},
	];
	const normalOrders = ref<NormalStepOrder[]>(orders);

	const statusCodes: OrderState[] = [
		{
			'code': 200,
			'label': '입금 대기',
			'need_review_guide': false,
		},
		{
			'code': 210,
			'label': '결제 완료',
			'need_review_guide': false,
		},
		{
			'code': 230,
			'label': '배송 준비 중',
			'need_review_guide': false,
		},
		{
			'code': 240,
			'label': '배송 중',
			'need_review_guide': true,
		},
		{
			'code': 280,
			'label': '배송 완료',
			'need_review_guide': true,
		},
		{
			'code': 900,
			'label': '구매 확정',
			'need_review_guide': false,
		},
	];


	function overlayMyOrderConfirm(sellerName: string, orderItem: NormalStepOrderItem) {
		const component = defineAsyncComponent(() => import('@/page/mypage/order/confirm/MyOrderConfirm.vue'));

		return openOverlay(component, {
			props: {
				sellerName,
				orderItem,
			},
			// onClose: getOrders,
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

	function modalOrderVoucherDetail() {
		const component = defineAsyncComponent(() => import('@/page/mypage/order/voucher/detail/OrderVoucherDetail.vue'));

		return openModal(component);
	}
</script>