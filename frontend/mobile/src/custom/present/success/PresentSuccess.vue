<template>
	<layout
		title="선물받기 완료"
		layout="popup"
		class="L=present"
	>
		<div class="m_present-success">
			<div class="m_present-success-head">
				<div class="mm_inner">
					<h2 class="mm_title">
						<i class="ico_present-success"></i>
						<b>{{ gift.receiver_name }}님에게 보내신<br> 소중한 선물을 받았어요!</b>
					</h2>
					<dl>
						<dt>선물코드</dt>
						<dd>{{ gift.gift_code }}</dd>
					</dl>
					<div class="mm_note T=bg">
						<ul>
							<li>받으신 선물의 취소/반품/교환의 경우 고객센터를 통해 문의해 주시거나 구매자분이 직접 신청해주세요.</li>
							<li>주소 입력 이후 변경이 필요하시면 고객센터에 문의해주세요. (고객센터: {{ shop.cs_tel }}, 운영시간: 월~금 {{ shop.cs_time }}시)</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- 선물 메시지 -->
			<section>
				<div class="mm_inner">
					<template v-if="gift.gift_info">
						<h4><b>선물 메시지</b></h4>
						<div class="m_present-message">
							<lazyload
								class="image_card mm_bg-cover"
								:src="gift.gift_info.background_image_url"
							></lazyload>
							<p class="text_readonly T=teatarea">
								<b>{{ gift.gift_info.message }}</b>
							</p>
						</div>
					</template>
					<dl class="m_present-sender">
						<dt>보낸 사람</dt>
						<dd>{{ gift.sender_name }}</dd>
					</dl>
				</div>
			</section>

			<!-- 배송정보 -->
			<section v-if="gift.shipping_address?.base_address">
				<div class="mm_inner">
					<h4><b>배송정보</b></h4>
					<div class="mm_order-info">
						<table>
							<tbody>
								<tr>
									<th scope="row">
										<b>받는 사람</b>
									</th>
									<td>{{ gift.shipping_address.name }}</td>
								</tr>
								<tr>
									<th scope="row">
										<b>휴대폰 번호</b>
									</th>
									<td>{{ phone(gift.shipping_address.tel) }}</td>
								</tr>
								<tr>
									<th scope="row">
										<b>주소</b>
									</th>
									<td>{{ gift.shipping_address.zip_code }}<br>{{ gift.shipping_address.base_address }}  {{ gift.shipping_address.detail_address }}</td>
								</tr>
								<tr v-if="gift.shipping_address.message">
									<th scope="row">
										<b>배송메모</b>
									</th>
									<td>{{ gift.shipping_address.message }}</td>
								</tr>
								<tr v-if="gift.personal_clearance_code">
									<th scope="row">
										<b>개인통관 고유번호</b>
									</th>
									<td>{{ gift.personal_clearance_code }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</section>

			<!-- 선물 정보 -->
			<section>
				<div class="mm_inner">
					<h4><b>선물 정보</b></h4>
					<div class="mm_product-list T=sm">
						<ul>
							<li
								v-for="item in gift.order_items"
								:key="item.id"
								:class="{ 'T=item-giftcard': item.voucher_code }"
							>
								<my-order-item
									:order-item="item"
									disable-link
								></my-order-item>
								<div
									v-if="item.voucher_code"
									class="mm_product-unit"
								>
									<div class="mm_btn_box">
										<button
											v-if="item.voucher_code"
											type="button"
											class="mm_btn T=xs T=primary"
											@click="_e => modalVoucherCode(_e, item.voucher_code || '')"
										>
											<b>상품 이용권 확인하기</b>
										</button>
									</div>
								</div>
							</li>
						</ul>
					</div>
					<div class="mm_note T=bg">
						<ul>
							<li>취소 가능 기간 내 취소를 하시면 결제하신 금액의 100%가 구매자에게 환불됩니다.</li>
							<li>취소 가능 기간이 지난 후 취소 및 환불 시 상품 구매금액의 10%를 차감한 금액이 구매자에서 환불됩니다.</li>
							<li>문의사항은 고객센터에 문의해주세요. (고객센터: 1234-5678, 운영시간: 월~금 09시~18시, 점심시간: 12시~13시)</li>
						</ul>
					</div>
				</div>
			</section>
			<div class="mm_btn_box">
				<div class="mm_inline">
					<button
						class="mm_btn T=line btn_close"
						type="button"
						@click="router.go(-1)"
					>
						<b>닫기</b>
						<i class="ico_popup-close"></i>
					</button>
				</div>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { defineAsyncComponent } from 'vue';
	import config from '$/utils/config';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import MyOrderItem from '@/page/mypage/order/component/MyOrderItem.vue';

	defineProps<{
		gift: Gift;
	}>();

	const { phone } = useFormatter();
	const shop = config('shop');
	const { router, openModal } = useGlobalPageContext();

	const modalVoucherCode = (_e: MouseEvent, voucherCode: string) => {
		openModal(defineAsyncComponent(() => import('@/page/mypage/order/voucher/code/VoucherCode.vue')), {
			clickElement: _e.currentTarget,
			props: {
				showVoucherUseButton: true,
				voucherCode,
			},
		});
	};
</script>