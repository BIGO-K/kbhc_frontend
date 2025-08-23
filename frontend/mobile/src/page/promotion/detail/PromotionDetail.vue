<template>
	<layout title="기획전">
		<div
			v-if="planningEvent"
			class="mm_event"
		>
			<!-- 관련정보 -->
			<div class="mm_event-head">
				<h2><b>{{ planningEvent.title }}</b></h2>
				<!-- SNS 공유 -->
				<promotion-share
					:title="planningEvent.title"
					:description="`#기획전#${planningEvent.title}`"
					:first-goods-image="planningEvent.groups[0]?.goods_list[0]?.thumbnail_url"
				></promotion-share>
			</div>

			<!-- 상세 컨텐츠 -->
			<div
				v-for="section in planningEvent.sections"
				:key="section.id"
				class="mm_event-content"
			>
				<!-- 에디터 등록 -->
				<div
					class="mm_editor"
					v-html="section.mobile_html"
				></div>

				<!-- 상품리스트 -->
				<div
					v-if="section.goods_list.length > 0"
					class="mm_scroller T=x"
				>
					<div class="mm_product-list T=card">
						<ul>
							<li
								v-for="item in section.goods_list"
								:key="item.id"
							>
								<product-item
									class="T=pa"
									:goods="item"
									:usable="{
										keys: ['review_count', 'price'],
										isReverse: true,
									}"
								></product-item>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- (D) 기획전 등록시 상품 그룹을 등록한 경우에만 '상품 그룹 앵커(mm_event-anchor)' 및 '상품 그룹 목록(mm_event-list)'을 노출합니다. -->
			<!-- 상품 그룹 앵커 -->

			<promotion-goods-groups
				v-if="planningEvent.groups.length"
				:goods-groups="planningEvent.groups"
			></promotion-goods-groups>
			<!-- 이벤트 댓글 -->
			<promotion-comments
				v-if="planningEvent.is_use_comment && commentPaginator"
				v-bind="{
					paginator: commentPaginator,
					loadedComments,
				}"
				@fetch-more="fetchMoreComment"
				@add="createComment"
				@update="editComment"
				@destroy="destroyComment"
			></promotion-comments>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { usePlanningEvent } from '$/composables/usePlanningEvent';
	import Layout from '@/component/layout/Layout.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import PromotionComments from '@/page/promotion/component/PromotionComments.vue';
	import PromotionGoodsGroups from '@/page/promotion/component/PromotionGoodsGroups.vue';
	import PromotionShare from '@/page/promotion/component/PromotionShare.vue';
	import router from '@/router';

	const props = defineProps<{
		promotionId: number;
	}>();

	const { bom, loading } = useGlobalPageContext();
	const {
		getDetail,
		getGoodsGroup,
		getCommentPaginator,
		addComment,
		updateComment,
		removeComment,
		addRecentView,
	} = usePlanningEvent();


	const planningEvent = ref<PlanningEvent>();
	const commentPaginator = ref<Paginator<PlanningComment>>();
	const loadedComments = ref<PlanningComment[]>([]);

	try {
		planningEvent.value = await getDetail(props.promotionId);
		if (!planningEvent.value) {
			throw new Error('존재하지 않는 기획전입니다.');
		}

		Promise.all([
			planningEvent.value.groups.forEach(group =>
				getGoodsGroup(props.promotionId, group.id)
					.then((groupGoods) => {
						group.goods_list = groupGoods;
					})
			),
			addRecentView(props.promotionId),
		]);

		if (planningEvent.value.is_use_comment) {
			commentPaginator.value = await getCommentPaginator(props.promotionId);
			loadedComments.value = commentPaginator.value.data;
		}
	}
	catch (e) {
		useErrorAlert(e, {
			httpCatcher: {
				404: '존재하지 않는 기획전입니다.',
			},
			alertCallback: () => {
				router.go(-1);
			},
		});
	}

	async function fetchMoreComment(refresh: boolean = false) {
		if (!planningEvent.value?.is_use_comment || !commentPaginator.value) {
			return;
		}

		loading.show();
		try {
			if (refresh) {
				commentPaginator.value.current_page = 0;
				loadedComments.value = [];
			}
			commentPaginator.value = await getCommentPaginator(props.promotionId, ++commentPaginator.value.current_page);
			loadedComments.value = loadedComments.value.concat(commentPaginator.value.data);
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}

	async function createComment(form: PlanningCommentForm, callback?: () => void) {
		try {
			await addComment(props.promotionId, form);
			fetchMoreComment(true);
			bom.alert('댓글이 작성되었습니다.');
			if (typeof callback == 'function') {
				callback();
			}
		}
		catch (e) {
			useErrorAlert(e);
		}
	}

	async function editComment(commentId: number, form: PlanningCommentForm, callback?: () => void) {
		try {
			await updateComment(props.promotionId, commentId, form);
			bom.alert('댓글이 수정되었습니다.');
			if (typeof callback == 'function') {
				callback();
			}
		}
		catch (e) {
			useErrorAlert(e);
		}
	}

	async function destroyComment(commentId: number, callback?: () => void) {
		try {
			await removeComment(props.promotionId, commentId);
			bom.alert('댓글이 삭제되었습니다.');
			fetchMoreComment(true);
			if (typeof callback == 'function') {
				callback();
			}
		}
		catch (e) {
			useErrorAlert(e);
		}
	}
</script>