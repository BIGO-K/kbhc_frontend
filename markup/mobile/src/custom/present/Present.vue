<template>
	<layout
		title="선물받기"
		layout="popup"
		class="L=present"
	>
		<div class="m_present">
			<div class="m_present-head">
				<div class="mm_inner">
					<h2 class="mm_title">
						<b>홍길동님에게 보내신<br> 소중한 선물이 도착했어요!</b>
					</h2>
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
			</div>

			<!-- 선물 정보 -->
			<section>
				<div class="mm_inner">
					<h4><b>선물 정보</b></h4>
					<div class="mm_product-list T=sm">
						<ul>
							<li
								v-for="item in presentItems"
								:key="item.id"
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
								<div class="mm_product-unit">
									<div class="mm_product-unit-indent">
										<toggle
											class="mm_btn T=xs T=line btn_option-change"
											parent-selector=".mm_product-unit"
										>
											<b>옵션 변경</b><i class="ico_toggle"></i>
										</toggle>
									</div>
									<div class="m_present-option">
										<div class="m_product-option-select">
											<template v-if="item.is_package">
												<section>
													<h6><b>상품 A</b></h6>
													<dl>
														<dt>옵션1</dt>
														<dd>
															<form-select v-model="sortOption1">
																<option>옵션명1</option>
															</form-select>
														</dd>
													</dl>
													<dl>
														<dt>옵션2</dt>
														<dd>
															<form-select v-model="sortOption2">
																<option>옵션명2</option>
															</form-select>
														</dd>
													</dl>
												</section>
												<section>
													<h6><b>상품 B</b></h6>
													<dl>
														<dt>옵션1</dt>
														<dd>
															<form-select v-model="sortOption1">
																<option>옵션명1</option>
															</form-select>
														</dd>
													</dl>
													<dl>
														<dt>옵션2</dt>
														<dd>
															<form-select v-model="sortOption2">
																<option>옵션명2</option>
															</form-select>
														</dd>
													</dl>
												</section>
											</template>
											<template v-else>
												<dl>
													<dt>옵션1</dt>
													<dd>
														<form-select v-model="sortOption1">
															<option>옵션명1</option>
														</form-select>
													</dd>
												</dl>
												<dl>
													<dt>옵션2</dt>
													<dd>
														<form-select v-model="sortOption2">
															<option>옵션명2</option>
														</form-select>
													</dd>
												</dl>
											</template>
										</div>
										<div class="mm_btn_box">
											<div class="mm_flex T=equal">
												<button
													type="button"
													class="mm_btn T=xs T=light"
												>
													<b>취소</b>
												</button>
												<button
													type="button"
													class="mm_btn T=xs T=support"
												>
													<b>변경</b>
												</button>
											</div>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</section>

			<!-- 배송지 정보 -->
			<section>
				<div class="mm_inner">
					<h4><b>배송지 정보</b></h4>
					<div class="mm_form_mix-address">
						<h6><b>주소</b></h6>
						<div class="mm_form_mix-linked">
							<form-text
								v-model="form.zip_code"
								readonly
								placeholder="우편번호"
								label-on-blind
							></form-text>
							<button
								type="button"
								class="mm_btn T=lg T=support"
								@click="overlayAddressPostcode"
							>
								<b>우편번호 찾기</b>
							</button>
						</div>
						<form-text
							v-model="form.jibun_address"
							readonly
							label-on-blind
							placeholder="검색주소"
						></form-text>
						<form-text
							v-model="form.road_address"
							placeholder="상세 주소를 입력하세요(필수입력)"
						></form-text>
					</div>
					<h6><b>배송메모</b></h6>
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
					<template v-if="isUnipass">
						<h6><b>해외배송 개인통관고유부호</b></h6>
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
			</section>
			<div class="mm_inner">
				<div class="mm_btn_box">
					<button
						type="button"
						class="mm_btn T=primary"
					>
						<b>선물받기</b>
					</button>
				</div>
				<div class="mm_note T=bg">
					<ul>
						<li>주소를 입력하지 않고 선물받은 다음날부터 7일이 소요되면 주문은 자동으로 취소됩니다. (취소 시, 구매자분에게 환불됩니다.)</li>
						<li>배송지 주소는 필수 입력 사항입니다.</li>
						<li>주소 입력 이후 변경이 필요하시면 고객센터에 문의해주세요. (고객센터: 1234-5678, 운영시간: 월~금 09시~18시, 점심시간: 12시~13시)</li>
					</ul>
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
	import Toggle from '@/component/Toggle.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import FormText from '@/component/form/FormText.vue';

	type PresentItem = {
		id: number;
		is_package: boolean;
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
			is_package: false,
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
			is_package: false,
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
			is_package: true,
			thumbnail_url: '/image/_sample/prod_x1_3.png',
			brand_name: 'M.Mon 엠몬스타',
			name: '시스루스타이라프셔츠',
			option: {
				name: '네이비',
			},
			ea: 1,
		},
	]);

	const sortOption1 = ref('');
	const sortOption2 = ref('');

	const form = ref<SearchAddress>({
		zip_code: '',
		jibun_address: '',
		road_address: '',
	});

	const { openOverlay } = useGlobalPageContext();

	function overlayAddressPostcode() {
		const component = defineAsyncComponent(() => import('@/page/address/postcode/AddressPostcode.vue'));

		return openOverlay(component);
	}

	function overlayOrderUnipass() {
		const component = defineAsyncComponent(() => import('@/page/order/unipass/OrderUnipass.vue'));

		return openOverlay(component);
	}

	const sortDeliveryNote = ref('');
	const orderDeliveryNote = ref('');

	const isUnipass = ref(Math.floor(Math.random() * 2) == 0 ? true : false);

	const orderUnipass = ref('');
	const unipassCollectAgree = ref(false);
	const unipassSellerAgree = ref(false);
</script>