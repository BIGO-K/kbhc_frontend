<template>
	<div :class="`${prefix}_product-item`">
		<mm-link
			:to="link"
			:open-webview="isBlockContent && !needGradeAccessAlert"
			@click="gradeAccessAlert"
		>
			<figure>
				<div :class="`${prefix}_product-item-image`">
					<lazyload
						:class="`${prefix}_bg-cover image_product`"
						:src="goods.thumbnail_url"
					></lazyload>
					<template v-if="goods.is_soldout">
						<p class="text_soldout">
							<b>품절</b>
						</p>
					</template>
					<template v-else-if="isLowStock">
						<p class="text_product-status">
							품절임박
						</p>
					</template>

					<product-icon
						v-if="!goods.is_soldout && goods.icon"
						:icon="goods.icon"
					></product-icon>

					<restock-icon v-if="goods.is_use_stock_notify"></restock-icon>
				</div>
				<figcaption>
					<template v-if="showBrandName">
						<p class="text_brand">
							{{ goods.brand_name ?? '' }}
						</p>
					</template>
					<p class="text_product">
						<headline
							v-if="goods.headline"
							:headline="goods.headline"
						></headline>
						{{ goods.name }}
					</p>
					<template v-if="goods.sale_rate != null && goods.sale_rate > 0">
						<p class="text_sale">
							{{ goods.sale_rate }}%
						</p>
					</template>

					<template v-if="displayPrice">
						<p class="text_price">
							<strong>{{ number(displayPrice) }}</strong>
							<del v-if="goods.price != null && displayPrice !== goods.price">
								<span>{{ number(goods.price) }}</span>
							</del>
						</p>
					</template>

					<template v-if="useReact">
						<div :class="`${prefix}_product-item-react`">
							<p class="text_star">
								<i :class="`${iconPrefix}_star`"></i><span>{{ goods.review_score_average }}</span>
							</p>
							<p class="text_review">
								<i :class="`${iconPrefix}_review`"></i><span>{{ goods.review_count && goods.review_count > 999 ? '999+' : goods.review_count }}</span>
							</p>
							<p class="text_like">
								<i :class="`${iconPrefix}_like`"></i><span>{{ goods.wish_count && goods.wish_count > 999 ? '999+' : goods.wish_count }}</span>
							</p>
						</div>
					</template>

					<template v-if="badges != null">
						<div :class="`${prefix}_tag-list`">
							<b
								v-for="badge in badges"
								:key="badge.name"
								:class="[`${prefix}_tag`, 'T=square', badge.class]"
							>
								{{ badge.name }}
							</b>
						</div>
					</template>
				</figcaption>
			</figure>
		</mm-link>

		<toggle
			v-if="prop.useWish"
			:is-active="isWished"
			is-lazy
			class="btn_like"
			@click="_$ui => toggleGoodsWish(_$ui)"
		>
			<i :class="`${iconPrefix}_like`"></i><b :class="`${prefix}_ir-blind`">찜한 아이템에 추가하기</b>
		</toggle>
	</div>
</template>

<script setup lang="ts">
	import { computed, defineAsyncComponent } from 'vue';
	// import { useAuthStore } from '$/stores/useAuthStore';
	import { useWishedStore } from '$/stores/useWishedStore';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Lazyload from '@/component/Lazyload.vue';
	import Toggle from '@/component/Toggle.vue';
	import Headline from '@/feature/headline/Headline.vue';
	import ProductIcon from '@/feature/product-icon/component/ProductIcon.vue';
	import RestockIcon from '@/feature/restock/component/RestockIcon.vue';

	const prop = withDefaults(defineProps<{
		/** @prop { OptianalGoods } @requires - 상품정보 */
		goods: OptianalGoods;
		/** @prop { GoodsUsableKey[] } - 사용하는 goods 속성 설정, 값이 없으면 전체 사용, id | name | thumnail_url 은 필수로 제외 */
		usable?: {
			/** @prop { GoodsUsableKey[] } - 사용하는 Goods 타입 키 */
			keys: GoodsUsableKey[];
			/** @prop { boolean } - 적용한 키를 사용 안함으로 적용 */
			isReverse?: boolean;
		};
		/** @prop { number } `default: undefined` - 판매가 */
		displayPrice?: number;
		/** @prop { boolean } `default: true` - 찜 사용 */
		useWish?: boolean;
		/** @prop { string } `default: undefined` - 링크 */
		link?: string;
		/** @prop { boolean } `default: false` - 블록 구조 */
		isBlockContent?: boolean;
	}>(), {
		// goods 필수
		usable: undefined,
		displayPrice: undefined,
		useWish: true,
		link: undefined,
		isBlockContent: false,
	});

	// const me = useAuthStore().member;
	const { isWishedGoods, add: addWish, remove: removeWish } = useWishedStore();

	const { number } = useFormatter();
	// const { isMember, bom, openOverlay, router } = useGlobalPageContext();
	const { openOverlay, member, bom } = useGlobalPageContext();

	const prefix = prop.isBlockContent ? 'mui' : 'mm';
	const iconPrefix = prop.isBlockContent ? 'uico' : 'ico';

	// 사용하는 속성 재할당
	const usableKeys = Object.keys(prop.goods).filter(_key => {
		if (prop.usable == null) return true;
		else return prop.usable.keys.includes(_key as GoodsUsableKey) === (prop.usable.isReverse ? false : true);
	}) as GoodsUsableKey[];
	const goods = computed(() => prop.usable == null ? prop.goods : ({
		id: prop.goods.id,
		name: prop.goods.name,
		thumbnail_url: prop.goods.thumbnail_url,
		headline: prop.goods.headline,
		...usableKeys.reduce((_result: Record<string, unknown>, _key) => {
			// console.log(usableKeys);
			_result[_key] = prop.goods[_key];

			return _result;
		}, {}),
	} as Partial<Goods> & Pick<Goods, GoodsRequiredKey>));
	const badgeClassMap: Record<string, string | undefined> = {
		무료배송: 'T=ship',
		쿠폰: 'T=coupon',
		즉시할인: 'T=discount',
	};

	// 타입가드
	const displayPrice = computed(() => prop.displayPrice ?? goods.value.base_discounted_price);
	const badges = computed(() => goods.value.badges == null ? null : goods.value.badges.map(_badge => ({
		name: _badge,
		class: badgeClassMap[_badge] ?? '',
	})));// usable이 아니면 영역을 삭제하기 위해 null 적용
	const isLowStock = computed(() => (goods.value.stock ?? 999) < 6);
	// 셋 중 하나만 null이면 사용 안함
	const useReact = computed(() => goods.value.review_count != null && goods.value.review_score_average != null && goods.value.wish_count != null);
	const link = computed(() => {
		if (prop.link) {
			return prop.link;
		}

		if (needGradeAccessAlert.value) {
			return '';
		}

		return {
			name: 'ProductDetail',
			params: {
				id: goods.value.id,
			},
		};
	});

	/**
	 * 브랜드 태그 미노출되는 경우와, 태그 유지되어야하는 경우 분기처리
	 * @example 상품무한스크롤 : 브랜드 이름 없을경우 영역 노출
	 * @example 검색 > 최근본상품: 영역 자체 미노출
	 */
	const showBrandName = computed(() => goods.value.brand_name !== undefined);

	const accessableGrade = computed(() => (prop.goods.basic_category?.accessable_grades || []).map(grade => grade.name));
	const needGradeAccessAlert = computed(() => {
		if (accessableGrade.value.length < 1) {
			return false;
		}

		return !accessableGrade.value.includes((member.value?.grade.name || ''));
	});

	const gradeAccessAlert = () => {
		if (needGradeAccessAlert.value) {
			return bom.alert(`[${accessableGrade.value.join(',')}] 등급만 접속 가능합니다.`);
		}
	};

	// 찜한 아이템
	const isWished = computed(() => isWishedGoods(goods.value.id));
	const toggleGoodsWish = async (_$ui: HTMLElement) => {
		if (needGradeAccessAlert.value) {
			return bom.alert(`[${accessableGrade.value.join(',')}] 등급만 사용 가능합니다.`);
		}

		if (isWished.value) {
			return removeWish([goods.value.id]);
		}

		openOverlay(defineAsyncComponent(() => import('@/page/mypage/wishlist/product/folder/MyWishlistProductFolder.vue')), {
			props: {
				type: 'add',
				goodsId: goods.value.id,
			},
			clickElement: _$ui,
			onClose: async () => {
				await addWish(goods.value.id);
			},
		});
	};
</script>