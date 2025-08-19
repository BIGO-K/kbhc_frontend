<template>
	<div :class="`${prefix}_product-item`">
		<mm-link :to="link">
			<figure>
				<div :class="`${prefix}_product-item-image`">
					<lazyload
						:class="`${prefix}_bg-cover image_product`"
						:src="isAdult ? null : goods.thumbnail_url"
					></lazyload>

					<template v-if="isAdult">
						<p class="text_adult">
							<b :class="`${prefix}_ir-blind`">미성년자 구매불가</b>
							<i :class="`${iconPrefix}_adult`"></i>
						</p>
					</template>

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
					<template v-if="goods.brand_name">
						<p class="text_brand">
							{{ goods.brand_name }}
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
							<strong>{{ number(displayPrice) }}</strong><del v-if="goods.price != null"><span>{{ number(goods.price) }}</span></del>
						</p>
					</template>

					<template v-if="useReact">
						<div :class="`${prefix}_product-item-react`">
							<p class="text_star">
								<i :class="`${iconPrefix}_star`"></i><span>{{ goods.review_score_average }}</span>
							</p>
							<p class="text_review">
								<i :class="`${iconPrefix}_review`"></i><span>{{ goods.review_count > 999 ? '999+' : goods.review_count }}</span>
							</p>
							<p class="text_like">
								<i :class="`${iconPrefix}_like`"></i><span>{{ goods.wish_count > 999 ? '999+' : goods.wish_count }}</span>
							</p>
						</div>
					</template>

					<template v-if="badges.length > 0">
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
			class="btn_like"
			@toggle="toggleGoodsWish"
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

	type GoodsRequiredKey = Extract<keyof Goods, 'id' | 'name' | 'thumbnail_url' | 'headline'>;
	type GoodsUsableKey = Exclude<keyof Goods, GoodsRequiredKey>;

	const prop = withDefaults(defineProps<{
		/** @prop { Goods } @requires - 상품정보 */
		goods: Goods;
		/** @prop { GoodsUsableKey[] } - 사용하는 goods 속성 설정, 값이 없으면 전체 사용, id | name | thumnail_url 은 필수로 제외 */
		usable?: {
			/** @prop { GoodsUsableKey[] } - 사용하는 Goods 타입 키 */
			keys: GoodsUsableKey[];
			/** @prop { true } - 적용한 키를 사용 안함으로 적용 */
			isReverse?: true;
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
	const { openOverlay } = useGlobalPageContext();

	const prefix = computed(() => prop.isBlockContent ? 'mui' : 'mm');
	const iconPrefix = computed(() => prop.isBlockContent ? 'uico' : 'ico');

	// 사용하는 속성 재할당
	const usableKeys = computed(() => Object.keys(prop.goods).filter(_key => {
		if (prop.usable == null) return true;
		else return prop.usable.keys.includes(_key as GoodsUsableKey) === prop.usable.isReverse ? false : true;
	}) as GoodsUsableKey[]);
	const goods = computed(() => prop.usable == null ? prop.goods : ({
		id: prop.goods.id,
		name: prop.goods.name,
		thumbnail_url: prop.goods.thumbnail_url,
		headline: prop.goods.headline,
		...usableKeys.value.reduce((_result: Record<string, unknown>, _key) => {
			_result[_key] = prop.goods[_key];

			return _result;
		}, {}),
	} as Partial<Goods> & Pick<Goods, GoodsRequiredKey>));
	const badgeClassMap: Record<string, string | undefined> = {
		무료배송: 'T=ship',
		쿠폰: 'T=coupon',
		즉시할인: 'T=discount',
		최근배송지: 'T=gray',
	};

	// 타입가드
	const displayPrice = computed(() => prop.displayPrice ?? goods.value.base_discounted_price);
	const badges = computed(() => goods.value.badges?.map(_badge => ({
		name: _badge,
		class: badgeClassMap[_badge] ?? '',
	})) ?? []);
	const isAdult = false;// computed(() => goods.value.is_only_adult && !me?.is_verify_age);// 사용안함
	const isLowStock = computed(() => (goods.value.stock ?? 999) < 6);
	// 셋 중 하나만 null이면 사용 안함
	const useReact = computed(() => goods.value.review_count != null && goods.value.review_score_average != null && goods.value.wish_count != null);
	const link = computed(() => prop.link ?? {
		name: 'ProductDetail',
		params: {
			id: goods.value.id,
		},
	});

	// 찜한 아이템
	const wishComponent = defineAsyncComponent(() => import('@/page/mypage/wishlist/product/folder/MyWishlistProductFolder.vue'));
	const isWished = computed(() => isWishedGoods(goods.value.id));
	const toggleGoodsWish = async () => {
		// if (!isMember.value) {
		// 	bom.confirm('로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까?', (_flag) => {
		// 		if (_flag) {
		// 			router.push({
		// 				name: 'Login',
		// 				query: {
		// 					redirect_to_after: router.currentRoute.value.fullPath,
		// 				},
		// 			});
		// 		}
		// 	});

		// 	return;
		// }

		if (isWished.value) removeWish([goods.value.id]);
		else {
			openOverlay(wishComponent, {
				props: {
					goodsId: goods.value.id,
				},
				onClose: async () => {
					await addWish(goods.value.id);
				},
			});
		}
	};
</script>