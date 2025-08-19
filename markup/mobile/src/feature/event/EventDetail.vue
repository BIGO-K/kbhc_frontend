<template>
	<layout title="이벤트">
		<div class="mm_event">
			<!-- 관련정보 -->
			<div class="mm_event-head">
				<h2><b>EXOPLORE OCEANIA EXOPLORE OCEANIA</b></h2>
				<!-- SNS 공유 -->
				<button
					type="button"
					class="btn_sns-share"
					@click="shareStore.open"
				>
					<i class="ico_share"></i><b class="mm_ir-blind">공유하기</b>
				</button>
			</div>

			<!-- 이벤트 상세 이미지 -->
			<div class="m_event-hero">
				<!-- 이미지 등록 -->
				<i class="image_banner">
					<lazyload
						tag="img"
						src="/image/_sample/promo_detail_1.png"
					></lazyload>
				</i>

				<!-- 에디터 등록 -->
				<div class="mm_editor">
					<div class="section1 w750">
						<img
							src="/image/_sample/promo_detail_2.png"
							alt=""
						>
					</div>
					<!--
						<style>
						.mm_editor .w750 {max-width: 750px;}
						.mm_editor .section1 {text-align:center;}
						.mm_event .mm_editor .item {padding: 30px 0;}
						</style>
					-->
				</div>
			</div>

			<!-- (D) 이벤트 등록시 상품 그룹을 등록한 경우에만 '상품 그룹 앵커(mm_event-anchor)' 및 '상품 그룹 목록(mm_event-list)'을 노출합니다. -->
			<!-- 상품 그룹 앵커 -->
			<div
				v-anchor-sticky
				class="mm_event-anchor"
				:class="classSticky"
			>
				<dropdown v-model:is-active="isDropdown">
					<template #button>
						<b>{{ selectedGroupTitle || groupItems[0].title }}</b>
					</template>
					<template #content>
						<ul>
							<li
								v-for="group in groupItems"
								:key="group.title"
								@click.prevent="moveAnchor(group)"
							>
								<a :href="`#event_prod_section${group.id}`"><b>{{ group.title }}</b></a>
							</li>
						</ul>
					</template>
				</dropdown>
			</div>

			<!-- 상품 그룹 목록 -->
			<!-- (D) 앵커 이동을 위해 id 값을 순서대로 넣어주세요. -->
			<div
				v-for="group in groupItems"
				:id="`event_prod_section${group.id}`"
				:key="group.id"
				v-product-section="{ setOnGroupTitle: (title: string) => { selectedGroupTitle = title }}"
				class="mm_event-list"
			>
				<h3><b>{{ group.title }}</b></h3>
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

			<!-- 이벤트 댓글 -->
			<div class="mm_event-reply">
				<!-- 댓글 작성 -->
				<!-- (D) 작성자가 로그인 상태일 경우 -->
				<div class="mm_event-reply-write">
					<div class="mm_inner">
						<h6>댓글<small>{{ commentItems.length }}개</small></h6>
						<template v-if="!isLogin">
							<p class="text_login">
								로그인을 하셔야<br>댓글을 등록하실 수 있습니다
							</p>
							<div class="mm_btn_box">
								<div class="mm_inline">
									<mm-link
										class="mm_btn T=primary"
										:to="{ name: '' }"
									>
										<b>로그인 하기</b>
									</mm-link>
								</div>
							</div>
						</template>
						<template v-else>
							<form-check
								v-model="privateReplyCreate"
								label="비공개"
								icon-class="T=sm"
							></form-check>
							<div class="mm_event-reply-title">
							</div>
							<form-textarea
								maxlength="5000"
								:resize="{ 'min': 5, 'max': 9 }"
								:byte="5000"
								placeholder="댓글을 작성하세요"
							></form-textarea>
							<div class="mm_btn_box">
								<button
									type="button"
									class="mm_btn T=primary"
								>
									<b>작성완료</b>
								</button>
							</div>
						</template>
					</div>
				</div>

				<!-- 댓글 목록 -->
				<div class="mm_event-reply-list">
					<template v-if="commentItems.length < 1">
						<p class="mm_text-none T=sm">
							<i class="ico_text-none"></i>등록된 댓글이 없습니다
						</p>
					</template>
					<template v-else>
						<ul>
							<li class="mm_event-reply-item">
								<p class="text_user">
									<lazyload
										class="mm_bg-contain image_grade"
										src="/image/common/level5.png"
									></lazyload>a****
								</p>
								<p class="text_reply">
									제가 옷을 진짜 좋아하는데 이제 고등학교에 올라와서 편한 옷이 필요하겠더라고요! 찾아보던 도중에 트레이닝 세트 체험단을 모집하길래 참여하게 되었습니당
								</p>
								<p class="text_date">
									2020.05.26 11:12:00
								</p>
							</li>
							<!-- (D) 댓글 내용이 2줄 미만인 경우 아래와 같이 노출합니다. -->
							<li class="mm_event-reply-item">
								<p class="text_user">
									<lazyload
										class="mm_bg-contain image_grade"
										src="/image/common/level2.png"
									></lazyload>i******
								</p>
								<p class="text_reply">
									만족합니다
								</p>
								<p class="text_date">
									2020.05.26 11:12:00
								</p>
							</li>
							<!--
								(D) 내가 쓴 댓글일 경우 mm_event-reply-item 요소에 T=item-my 클래스와 회원 등급에 맞는 'T=등급' 클래스를 추가합니다.
								등급: level1 ~ level5
							-->
							<!-- 내가 쓴 댓글 수정 -->
							<li class="mm_event-reply-item T=item-my">
								<p class="text_user">
									<lazyload
										class="mm_bg-contain image_grade"
										src="/image/common/level4.png"
									></lazyload>a****
								</p>
								<form-textarea
									model-value="2번이요!! 다이어트 성공하면 입을라구 슬립드레스 샀는데 한번도 입은적이 없답니다"
									maxlength="200"
									:resize="{ 'min': 4, 'max': 6 }"
									placeholder="댓글을 작성하세요"
								></form-textarea>
								<form-check
									v-model="privateReplyModify"
									label="비공개"
									icon-class="T=sm"
								></form-check>
								<div class="mm_btn_box">
									<button
										type="button"
										class="btn_modify"
									>
										<i class="ico_modify"></i>
										<b>수정</b>
									</button>
								</div>
							</li>

							<!-- 내가 쓴 댓글 -->
							<li class="mm_event-reply-item T=item-my">
								<p class="text_user">
									<lazyload
										class="mm_bg-contain image_grade"
										src="/image/common/level4.png"
									></lazyload>a****<b class="text_tag">내 댓글</b>
								</p>
								<p class="text_reply">
									제가 옷을 진짜 좋아하는데 이제 고등학교에 올라와서 편한 옷이 필요하겠더라고요! 찾아보던 도중에 트레이닝 세트 체험단을 모집하길래 참여하게 되었습니당 제가 요즘 체력을 늘리려고 운동도 꾸준히 하고 있는데 운동 할 때 옷이 넘 편해서 이것도 꼭 입어보고 싶어용
								</p>
								<p class="text_date">
									2020.05.26 11:12:00
								</p>
								<div class="mm_btn_box">
									<button
										type="button"
										class="btn_remove"
									>
										<i class="ico_delete"></i>
										<b>삭제</b>
									</button>
									<button
										type="button"
										class="btn_modify"
									>
										<i class="ico_modify"></i>
										<b>수정</b>
									</button>
								</div>
							</li>
							<li class="mm_event-reply-item T=item-my">
								<p class="text_user">
									<lazyload
										class="mm_bg-contain image_grade"
										src="/image/common/level4.png"
									></lazyload>A*******<b class="text_tag">내 댓글</b><i class="ico_secret"></i>
								</p>
								<p class="text_reply">
									제가 옷을 진짜 좋아하는데 이제 고등학교에 올라와서 편한 옷이 필요하겠더라고요! 찾아보던 도중에 트레이닝 세트 체험단을 모집하길래 참여하게 되었습니당 제가 요즘 체력을 늘리려고 운동도 꾸준히 하고 있는데 운동 할 때 옷이 넘 편해서 이것도 꼭 입어보고 싶어용
								</p>
								<p class="text_date">
									2020.05.26 11:12:00
								</p>
								<div class="mm_btn_box">
									<button
										type="button"
										class="btn_remove"
									>
										<i class="ico_delete"></i>
										<b>삭제</b>
									</button>
									<button
										type="button"
										class="btn_modify"
									>
										<i class="ico_modify"></i>
										<b>수정</b>
									</button>
								</div>
							</li>

							<!-- 내가 쓴 비공개 댓글 -->
							<li class="mm_event-reply-item">
								<p class="text_user">
									<lazyload
										class="mm_bg-contain image_grade"
										src="/image/common/level1.png"
									></lazyload>k****
								</p>
								<p class="text_reply">
									1번! 거금주고 스타일바꿔보려고 산옷<br>왜때문에 편한항상 입던스타일에만 손이가고..<br>비싸다고 처분도 못하고 자리만 차지하고ㅠ 언젠가 입을날이 올것같고 안입던스타일이라 매칭할 아이템도 부족해서 더 손안가고.ㅠㅠ 새로운스타일 도전은 저렴이로 해야한다는 교훈을 얻었지만;;새로운 도전은 계속되어야겠죠잉?ㅋㅋㅋ
								</p>
								<p class="text_date">
									2020.05.26 11:12:00
								</p>
							</li>
							<!-- 비공개 댓글 -->
							<li class="mm_event-reply-item">
								<p class="text_user">
									<lazyload
										class="mm_bg-contain image_grade"
										src="/image/common/level2.png"
									></lazyload>h********
								</p>
								<p class="text_reply">
									비공개 댓글입니다<i class="ico_secret"></i>
								</p>
								<p class="text_date">
									2020.05.26 11:12:00
								</p>
							</li>
						</ul>
					</template>
				</div>

				<div
					v-if="commentItems.length > 5"
					class="mm_foot"
				>
					<div class="mm_btn_box">
						<button
							type="button"
							class="mm_btn T=line"
						>
							<b>더보기</b><i class="ico_more"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, computed, watch, DirectiveBinding } from 'vue';
	import { useScroll, useIntersectionObserver } from '@vueuse/core';
	import { useShareStore } from '$/stores/useShareStore';
	import { useFakeCreator } from '$/composables/useFakeCreator';
	import Layout from '@/component/layout/Layout.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormTextarea from '@/component/form/FormTextarea.vue';

	const shareStore = useShareStore();

	// XXX 임시 생성
	const groupItems: SpecialEventDetail['goods_groups'] = [
		{
			id: 1,
			title: '롱 패딩',
			goods_list: useFakeCreator().goods(6),
		},
		{
			id: 2,
			title: '숏 패딩',
			goods_list: useFakeCreator().goods(11),
		},
		{
			id: 3,
			title: '우라누스',
			goods_list: useFakeCreator().goods(3),
		},
		{
			id: 4,
			title: '23FW 헤비아우터',
			goods_list: useFakeCreator().goods(8),
		},
	];
	const selectedGroupTitle = ref<string>('');

	const isLogin = true;// XXX 로그인 임시 변수
	const commentItems = ref(['']);
	const privateReplyCreate = ref(false);
	const privateReplyModify = ref(false);


	const $scroller = ref<HTMLElement | null>(null);
	const $anchor = ref<HTMLElement | null>(null);
	let $productSections: Element[] = [];
	const isDropdown = ref<boolean>(true);
	const classSticky = ref('');


	// 상품 그룹 앵커 sticky
	const vAnchorSticky = {
		mounted(_$element: HTMLElement) {

			$anchor.value = _$element;
			$scroller.value = document.querySelector('.mm_page > .mm_scroller') as HTMLElement;

			const smooth = ref(false);
			const behavior = computed(() => smooth.value ? 'smooth' : 'auto');
			const { y } = useScroll($scroller, { behavior });

			watch(y, () => {

				const offsetTop = _$element.getBoundingClientRect().top;
				const $lastAnchorSection = $productSections[$productSections.length - 1] as HTMLElement;

				if (offsetTop + _$element.offsetHeight <= 0 && $lastAnchorSection.offsetHeight + $lastAnchorSection.getBoundingClientRect().top > _$element.offsetHeight) {
					_$element.style.height = getComputedStyle(_$element)['height'];
					classSticky.value = 'S=anchor-sticky';
					isDropdown.value = false;
				}
				else {
					_$element.style.height = '';
					classSticky.value = '';
					isDropdown.value = true;
				}

			});
		},
	};

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

	function moveAnchor(group: SpecialEventDetail['goods_groups'][number]) {
		selectedGroupTitle.value = group.title;
		const target = document.querySelector<HTMLElement>(`#event_prod_section${group.id}`);
		if (!target) return;
		(target as HTMLElement).scrollIntoView({
			block: 'start',
		});

		if ($scroller.value) {
			// .mm_event-list의 Padding Top 만큼
			$scroller.value.scrollTop = $scroller.value.scrollTop - 48;
		}
		isDropdown.value = false;
	}
</script>

<style src="./_event.scss" lang="scss"></style>