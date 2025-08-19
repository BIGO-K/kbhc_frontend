<template>
	<layout title="코디샷">
		<div class="mm_inner m_codyshot-detail">
			<figure>
				<div class="m_codyshot-detail-banner">
					<lazyload
						class="mm_bg-cover image_banner"
						src="/image/_sample/prod_x3_4.png"
					></lazyload>
					<button
						type="button"
						class="btn_product-pointer"
						style="top:45%;left:20%;"
					>
						<b class="mm_ir-blind">남녀공용 블랙 숏 라이너 리버시블 점퍼 블랙 숏 라이너 리버시블 점퍼</b>
					</button>
					<button
						type="button"
						class="btn_product-pointer"
						style="top:50%;left:32%;"
					>
						<b class="mm_ir-blind">프로텍팅 네츄럴 사인 톤업 선쿠션 SET</b>
					</button>
					<button
						type="button"
						class="btn_product-pointer"
						style="top:45%;left:77%;"
					>
						<b class="mm_ir-blind">찰리브라운 폭신폭신 슬리퍼 blue</b>
					</button>
					<button
						type="button"
						class="btn_product-pointer"
						style="top:20%;left:52%;"
					>
						<b class="mm_ir-blind">JE Asymmetry Wrap Skirt_GR</b>
					</button>
					<button
						type="button"
						class="btn_product-pointer"
						style="top:64%;left:61%;"
					>
						<b class="mm_ir-blind">프로텍팅 네츄럴 사인 톤업 선쿠션 SET</b>
					</button>
				</div>
				<figcaption>
					<p class="text_brand">
						{{ 'M.MONSTAR' }}
					</p>
					<p class="text_main">
						{{ 'SS블루종 발매기념! 머리부터 발끝까지' }}
					</p>
					<p class="text_sub">
						{{ '당신을 위한 맞춤 패셔너블 레시피' }}
					</p>
					<p class="text_date">
						{{ '2022-00-00' }}
					</p>
					<button
						type="button"
						class="btn_sns-share"
						@click="shareStore.open"
					>
						<i class="ico_share"></i><b class="mm_ir-blind">공유하기</b>
					</button>
				</figcaption>
			</figure>
			<div class="mm_product-list T=card">
				<ul>
					<li
						v-for="item in productItems"
						:key="item.id"
					>
						<product-item
							class="T=pa"
							:goods="item"
						></product-item>
					</li>
				</ul>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { useShareStore } from '$/stores/useShareStore';
	import { useFakeCreator } from '$/composables/useFakeCreator';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import ProductItem from '@/component/ProductItem.vue';

	const shareStore = useShareStore();

	const productItems = useFakeCreator().goods(6);// XXX 상품 임시 생성
</script>

<style src="./_codyshot.scss" lang="scss"></style>