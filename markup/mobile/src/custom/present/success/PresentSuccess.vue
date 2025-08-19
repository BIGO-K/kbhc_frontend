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
						<b>홍길동님에게 보내신<br> 소중한 선물을 받았어요!</b>
					</h2>
					<dl>
						<dt>선물코드</dt>
						<dd>{{ '20051411421512334562' }}</dd>
					</dl>
					<div class="mm_note T=bg">
						<ul>
							<li>받으신 선물의 취소/반품/교환의 경우 고객센터를 통해 문의해 주시거나 구매자분이 직접 신청해주세요.</li>
							<li>주소 입력 이후 변경이 필요하시면 고객센터에 문의해주세요. (고객센터: 1234-5678, 운영시간: 월~금 09시~18시, 점심시간: 12시~13시)</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- 선물 메시지 -->
			<section>
				<div class="mm_inner">
					<h4><b>선물 메시지</b></h4>
					<div class="m_present-message">
						<lazyload
							class="image_card mm_bg-cover"
							:src="`/image/content/present_card_1.png`"
						></lazyload>
						<p class="text_readonly T=teatarea">
							<b>{{ '고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다. 고마운 마음을 담아 보냅니다.' }}</b>
						</p>
					</div>
					<dl class="m_present-sender">
						<dt>보낸 사람</dt>
						<dd>{{ '홍길동' }}</dd>
					</dl>
				</div>
			</section>

			<!-- 배송정보 -->
			<section>
				<div class="mm_inner">
					<h4><b>배송정보</b></h4>
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
								<tr>
									<th scope="row">
										<b>주소</b>
									</th>
									<td>{{ '06616' }}<br>{{ '서울특별시 도봉구 창2동 647-12 창동 북한산 현대홈시티3차' }} {{ '302동 101호' }}</td>
								</tr>
								<tr>
									<th scope="row">
										<b>배송메모</b>
									</th>
									<td>{{ '문옆 소화전이요' }}</td>
								</tr>
								<tr>
									<th scope="row">
										<b>개인통관 고유번호</b>
									</th>
									<td>{{ 'P1234567890' }}</td>
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
								v-for="item in presentItems"
								:key="item.id"
								:class="{ 'T=item-giftcard': item.isGifticon || item.isVoucher }"
							>
								<div class="mm_product-item">
									<a>
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													:src="item.thumbnail_url"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_brand">{{ item.brand_name }}</p>
												<p class="text_product">{{ item.name }}</p>
												<p class="text_option">{{ item.option.name }} / {{ item.ea }}개</p>
											</figcaption>
										</figure>
									</a>
								</div>
								<div
									v-if="item.isGifticon || item.isVoucher"
									class="mm_product-unit"
								>
									<div class="mm_btn_box">
										<mm-link
											v-if="item.isGifticon"
											class="mm_btn T=xs T=primary"
											:to="{ name: '' }"
										>
											<b>기프티콘 다운받기</b>
											<i class="ico_coupon-download"></i>
										</mm-link>
										<button
											v-if="item.isVoucher"
											type="button"
											class="mm_btn T=xs T=primary"
											@click.prevent="modalVoucherCode"
										>
											<b>상품 이용권 확인하기</b>
										</button>
									</div>
									<p class="text_cancel">
										취소 가능 기간: {{ '2023.00.00' }}
									</p>
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
	import { ref, defineAsyncComponent } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';


	type PresentItem = {
		id: number;
		isGifticon: boolean;
		isVoucher: boolean;
		thumbnail_url: string;
		brand_name: string;
		name: string;
		option: {
			name: string;
		};
		ea: number;
	};

	const presentItems = ref<PresentItem[]>([
		{
			id: 1,
			isGifticon: false,
			isVoucher: false,
			thumbnail_url: '/image/_sample/prod_x1_1.png',
			brand_name: 'M.Mon 엠몬스타',
			name: '시스루스타이라프셔츠',
			option: {
				name: '네이비',
			},
			ea: 2,
		},
		{
			id: 2,
			isGifticon: true,
			isVoucher: false,
			thumbnail_url: '/image/_sample/prod_x1_2.png',
			brand_name: 'M.Mon 엠몬스타',
			name: '매긴나잇브릿지플리츠 디테일 드레스_MJM1OP3140',
			option: {
				name: '베이지',
			},
			ea: 1,
		},
		{
			id: 3,
			isGifticon: false,
			isVoucher: true,
			thumbnail_url: '/image/_sample/prod_x1_3.png',
			brand_name: 'M.Mon 엠몬스타',
			name: '시스루스타이라프셔츠',
			option: {
				name: '네이비',
			},
			ea: 1,
		},
	]);

	const { openModal } = useGlobalPageContext();

	function modalVoucherCode() {
		const component = defineAsyncComponent(() => import('@/page/mypage/order/voucher/code/VoucherCode.vue'));

		return openModal(component);
	}
</script>