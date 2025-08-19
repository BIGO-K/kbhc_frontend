<template>
	<div class="mm_view L=main">
		<div
			id="mm_body"
			class="mm_page"
			:data-path="$route.path"
		>
			<div class="mm_scroller">
				<div class="mm_page-inner">
					<div class="mm_page-content">
						<div class="m_main">
							<div
								v-for="container in containers"
								:key="container.id"
								class="mm_mui T=full"
							>
								<template
									v-for="block in container.blocks"
									:key="block.id"
								>
									<component
										:is="blockComponents[block.mui_code]"
										:block="block"
									></component>
								</template>
							</div>

							<!-- 테스트 후 제거 예정 -->
							<div class="mm_inner">
								<h4 class="mm_strapline T=sm">
									<b>햄버거 메뉴에 추가될 커머스 메뉴</b>
								</h4>
								<div class="mm_btn-box">
									<div class="mm_inline">
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'RankingMain'}"
										>
											<b>랭킹</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'Raffle'}"
										>
											<b>래플</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'Coop'}"
										>
											<b>공동구매</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'Showcase'}"
										>
											<b>쇼케이스</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'Event'}"
										>
											<b>이벤트</b>
										</mm-link>
									</div>
								</div>
								<h4 class="mm_strapline T=sm">
									<b>마이페이지 메뉴에 추가될 커머스 메뉴</b>
								</h4>
								<div class="mm_btn-box">
									<div class="mm_inline">
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'MyWishlistProduct'}"
										>
											<b>찜한 상품</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'Cart'}"
										>
											<b>장바구니</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'MyOrder'}"
										>
											<b>주문관리</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'MyReview'}"
										>
											<b>리뷰관리</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'MyRaffle'}"
										>
											<b>래플응모내역</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'MyAddress'}"
										>
											<b>배송지 관리</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'MyRefund'}"
										>
											<b>환불계좌 관리</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'MyDelayed'}"
										>
											<b>배송지연 신고</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'MySoldoutPending'}"
										>
											<b>품절취소 신고</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'PresentMy'}"
										>
											<b>선물함</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'MyInquirySingleCreate'}"
										>
											<b>1:1 문의하기</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'MyInquiry'}"
										>
											<b>문의 관리</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'MyLevel'}"
										>
											<b>등급 혜택</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'MyBenefit'}"
										>
											<b>쿠폰함</b>
										</mm-link>
										<mm-link
											open-webview
											class="mm_btn T=light"
											:to="{name: 'MyRecentlyProduct'}"
										>
											<b>최근 본 상품</b>
										</mm-link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<timedeal-toast-popup></timedeal-toast-popup>

			<main-popup></main-popup>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, defineAsyncComponent } from 'vue';
	import { useAppBridge } from '$/composables/useAppBridge';
	import { useBlock } from '$/composables/useBlock';
	import { useUserAgent } from '$/composables/useUserAgent';
	import TimedealToastPopup from '@/feature/timedeal/component/TimedealToastPopup.vue';
	import MainPopup from '@/page/main/component/MainPopup.vue';

	defineOptions({
		inheritAttrs: false,
	});

	const { execute } = useAppBridge();
	const { isAppUser } = useUserAgent();
	if (isAppUser) {
		try {
			execute('getLoginInfo', {
				callback: 'loginCallback',
			});
		}
		catch (e) {
			// console.log(e);
		}

	}
	const { getPage, getComponentGetter, checkLikedGoods } = useBlock();

	const containers = ref<Container[]>([]);

	try {
		containers.value = await getPage();
		checkLikedGoods(containers.value);
	}
	catch (e) {
		//
	}

	/** 블록 컴포넌트 리스트 */
	const blockComponents = computed(() => {
		return containers.value
			.map(container => container.blocks)
			.flat()
			.reduce<Record<string, ReturnType<typeof defineAsyncComponent> | null>>((accumulation, block) => {
				accumulation[block.mui_code] = getBlockComponents(block.mui_code);

				return accumulation;
			}, {});
	});

	/**
	 * 블록 컴포넌트 GETTER
	 * @param name
	 */
	function getBlockComponents(name: string) {
		try {
			const component = defineAsyncComponent(getComponentGetter(name));

			return component;
		}
		catch (e) {
			return null;
		}
	}
</script>

<style src="./_option.scss" lang="scss"></style>
<style src="./_product.scss" lang="scss"></style>

<!-- 테스트 후 제거 예정 -->
<style lang="scss">
	@use '../../asset/scss/helper/mixin';

	.m_main {
		> .mm_inner {
			margin-top: 50px;

			.mm_btn-box {
				padding: 10px 0 20px;

				.mm_btn {
					margin: 2px;
					width: calc(33.33333% - 4px);
					@include mixin.font(500 '1.4rem');
				}
			}
		}
	}
</style>