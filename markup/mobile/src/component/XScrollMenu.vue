<template>
	<div
		ref="$scroller"
		class="mm_scroller T=x"
	>
		<ul
			ref="$list"
			:class="prop.listClass"
		>
			<li
				v-if="$slots.firstItem"
				@click="change(0)"
			>
				<slot name="firstItem"></slot>
			</li>
			<li
				v-for="(item, _i) in prop.items"
				:key="`${JSON.stringify(item)}_${_i}`"
				:class="prop.itemClass"
				@click="change(_i + ($slots.firstItem ? 1 : 0))"
			>
				<slot :item="item"></slot>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts" generic="T extends {}">
	import { ref, computed, watch } from 'vue';
	import { useAnimation } from '$/composables/useAnimation';

	const prop = withDefaults(defineProps<{
		/** @prop { T[] } @requires - 슬라이더 내용 slot scope을 위한 배열값 */
		items: T[];
		/** @prop { number } `default: 0` - 초기값 */
		activeIndex?: number;
		/** @prop { 'center' | 'left' | 'right' } `default: 'center'` - 요소의 스크롤 위치 */
		position?: 'center' | 'left' | 'right';
		/** @prop { number } `default: 0.2` - 모션 시간(초) */
		time?: number;
		/** @prop { 'ul' | 'ol' } `default: 'ul'` */
		listTag?: 'ul' | 'ol';
		/** @prop { string } `default: ''` - ul(ol)요소에 적용할 클래스 */
		listClass?: string;
		/** @prop { string } `default: ''` - li요소에 적용할 클래스 */
		itemClass?: string;
	}>(), {
		activeIndex: 0,
		position: 'center',
		time: 0.2,
		listTag: 'ul',
		listClass: '',
		itemClass: '',
	});

	const emit = defineEmits<{
		// 외부 제어가 필요할 경우 v-model:active-index, emit 사용
		'update:active-index': [index: number];
	}>();

	const animation = useAnimation();

	const $scroller = ref<HTMLElement>();
	const $list = ref<HTMLOListElement | HTMLUListElement>();

	const activeIndex = ref(prop.activeIndex);
	const $activeItem = computed(() => $list.value?.children[activeIndex.value]);

	const change = (_index: number) => {
		activeIndex.value = _index;
		emit('update:active-index', _index);// v-model로 연결되었을 때 반응형 값 없데이트
	};

	watch($activeItem, (_$item, _$oldItem) => {
		if (_$item == null || $scroller.value == null) return;

		const rect = _$item.getBoundingClientRect();
		const scrollRect = $scroller.value.getBoundingClientRect();
		const itemX = rect.left - scrollRect.left;
		const range = prop.position === 'center'
			? itemX - (scrollRect.width - rect.width) / 2
			: prop.position === 'left'
				? itemX - parseFloat(getComputedStyle($scroller.value).paddingLeft)
				: itemX + rect.width - scrollRect.width + parseFloat(getComputedStyle($scroller.value).paddingRight);

		animation.to($scroller.value, { scrollTo: { x: $scroller.value.scrollLeft + range }, duration: _$oldItem == null ? 0 : prop.time });// 최초 적용 시 모션 없이 이동
	}, {
		immediate: true,
	});

	watch(() => prop.activeIndex, () => {
		activeIndex.value = prop.activeIndex;
	});
</script>