<template>
	<!-- (D) 이벤트 등록시 상품 그룹을 등록한 경우에만 '상품 그룹 앵커(mm_event-anchor)' 및 '상품 그룹 목록(mm_event-list)'을 노출합니다. -->
	<!-- 상품 그룹 앵커 -->
	<div
		v-if="goodsGroups.length > 0"
		ref="$anchorElement"
		v-anchor-sticky
		class="mm_event-anchor"
		:class="classSticky"
	>
		<dropdown v-model:is-active="isDropdown">
			<template #button>
				<b>{{ selectedGroupTitle || goodsGroups[0].title }}</b>
			</template>
			<template #content>
				<ul>
					<li
						v-for="group, index in goodsGroups"
						:key="group.id"
					>
						<a
							:href="`#event_prod_section_${group.id}`"
							@click.prevent="moveAnchor(group, index)"
						><b>{{ group.title }}</b></a>
					</li>
				</ul>
			</template>
		</dropdown>
	</div>

	<!-- 상품 그룹 목록 -->
	<!-- (D) 앵커 이동을 위해 id 값을 순서대로 넣어주세요. -->
	<div
		v-for="group in goodsGroups"
		:id="`event_prod_section_${group.id}`"
		:key="`p_${group.id}`"
		v-product-section="{ setOnGroupTitle: (title: string) => { selectedGroupTitle = title }}"
		class="mm_event-list"
	>
		<h3>
			<i v-if="group.has_mobile_image">
				<lazyload
					tag="img"
					:src="group.mobile_image_url"
					:alt="group.mobile_alt"
				></lazyload>
			</i>
			<b v-else>{{ group.title }}</b>
		</h3>
		<div class="mm_product-list T=card">
			<ul>
				<li
					v-for="item in group.goods_list"
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
</template>
<script setup lang="ts">
	import { ref, computed, watch, DirectiveBinding } from 'vue';
	import { useScroll, useIntersectionObserver } from '@vueuse/core';
	import { usePageContextStore } from '$/stores/usePageContextStore';
	import { useAnimation } from '$/composables/useAnimation';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import ProductItem from '@/component/ProductItem.vue';

	type RequiredKey = Extract<keyof PlanningEventGroup, 'id' | 'title' | 'goods_list'>;
	type GoodsGroup = Partial<PlanningEventGroup> & Pick<PlanningEventGroup, RequiredKey>;

	const prop = withDefaults(defineProps<{
		goodsGroups: GoodsGroup[];
	}>(), {
		goodsGroups: () => [],
	});
	const pageContextStore = usePageContextStore();
	const goodsGroups = computed(() => prop.goodsGroups as GoodsGroup[]);
	const selectedGroupTitle = ref<string>('');
	const $scroller = ref<HTMLElement | null>(null);
	const $anchor = ref<HTMLElement | null>(null);
	const $anchorElement = ref<HTMLElement | null>(null);
	let $productSections: Element[] = [];
	const isDropdown = ref<boolean>(true);
	const classSticky = ref('');
	const smooth = ref(false);
	const behavior = computed(() => smooth.value ? 'smooth' : 'auto');
	// 상품 그룹 앵커 sticky
	const vAnchorSticky = {
		mounted(_$element: HTMLElement) {
			$anchor.value = _$element;
			$scroller.value = document.querySelector('.mm_page > .mm_scroller') as HTMLElement;
		},
	};

	const { y } = useScroll($scroller, { behavior });

	watch(y, () => {
		if (!$anchor.value) return;
		const offsetTop = $anchor.value.getBoundingClientRect().top;
		const $lastAnchorSection = $productSections[$productSections.length - 1] as HTMLElement;

		if (offsetTop + $anchor.value.offsetHeight <= 0 && $lastAnchorSection.offsetHeight + $lastAnchorSection.getBoundingClientRect().top > $anchor.value.offsetHeight) {
			classSticky.value = 'S=anchor-sticky';
			isDropdown.value = false;
		}
		else {
			classSticky.value = '';
			isDropdown.value = true;
		}
	});

	// 상품 그룹 감지
	const vProductSection = {
		mounted(_$element: HTMLElement, binding: DirectiveBinding<{ setOnGroupTitle: (title: string) => void }>) {
			$productSections.push(_$element);
			const $anchorBtns = $anchor.value?.querySelectorAll('a');
			const classAnchorOn = 'S=anchor-on';

			useIntersectionObserver(_$element, _entries => {
					for (const entry of _entries) {
						if (entry.isIntersecting) {
							if (!$anchorBtns) return;

							$anchorBtns.forEach((_$btn) => {

								_$btn.classList.remove(classAnchorOn);
								_$btn.setAttribute('title', '');

								if (_$btn === $anchorBtns[$productSections.indexOf(entry.target)]) {
									_$btn.classList.add(classAnchorOn);
									_$btn.setAttribute('title', '선택됨');
									binding.value.setOnGroupTitle(_$btn.textContent || '');
								}

							});
						}
					}
				},
				{
					rootMargin: '-35% 0px -60% 0px', // 요소의 상단이 스크롤 높이의 35%
					threshold: [0, 1], // 요소의 시작과 끝 모두 감지
				}
			);
		},
	};

	const { to } = useAnimation();
	const beforeIndex = ref<number>(0);

	function moveAnchor(group: GoodsGroup, index: number) {
		selectedGroupTitle.value = group.title;
		const target = document.querySelector<HTMLElement>(`#event_prod_section_${group.id}`);
		if (!target) return;

		if ($scroller.value) {
			to($scroller.value, {
				scrollTo: {
					y: target,
					offsetY: 48,
				},
				duration: 0.4,
				onStart: () => {
					pageContextStore.setHeaderSticky(true);
					isDropdown.value = false;
				},
				onComplete: () => {
					beforeIndex.value = index;
					setTimeout(() => {
						pageContextStore.setHeaderSticky(false);
					}, 100);

				},
			});
		}
	}

	watch($anchorElement, (to) => {
		if (to) {
			to.style.height = `${to.offsetHeight}px`;
		}
	}, {
		flush: 'post',
		immediate: true,
	});
</script>