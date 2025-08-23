<template>
	<layout title="이벤트">
		<div class="mm_event">
			<!-- 관련정보 -->
			<div class="mm_event-head">
				<h2><b>{{ specialEvent.title }}</b></h2>
				<!-- SNS 공유 -->
				<promotion-share
					:title="specialEvent.title"
					:description="`#이벤트#${specialEvent.title}`"
					:first-goods-image="specialEvent.goods_groups[0]?.goods_list[0]?.thumbnail_url"
				></promotion-share>
			</div>

			<!-- 이벤트 상세 이미지 -->
			<div class="m_event-hero">
				<!-- 이미지 등록 -->
				<i
					v-if="specialEvent.contents_type === 'image'"
					class="image_banner"
				>
					<lazyload
						tag="img"
						:src="specialEvent.contents_image_url"
						:alt="specialEvent.contents_image_alt"
					></lazyload>
				</i>

				<!-- 에디터 등록 -->
				<div
					v-else-if="specialEvent.contents_type === 'html'"
					class="mm_editor"
				>
					<div
						class="section1 w750"
						v-html="specialEvent.contents_html"
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

			<promotion-goods-groups
				v-if="specialEvent.goods_groups.length"
				:goods-groups="specialEvent.goods_groups"
			></promotion-goods-groups>

			<!-- 이벤트 댓글 -->
			<promotion-comments
				v-if="specialEvent.is_commentable && commentPaginator"
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
	import { useSpecialEvent } from '$/composables/useSpecialEvent';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import PromotionComments from '@/page/promotion/component/PromotionComments.vue';
	import PromotionGoodsGroups from '@/page/promotion/component/PromotionGoodsGroups.vue';
	import PromotionShare from '@/page/promotion/component/PromotionShare.vue';

	const props = defineProps<{
		eventId: number;
	}>();

	const { bom, loading } = useGlobalPageContext();

	const {
		getDetail,
		getGoodsGroup,
		getCommentPaginator,
		addComment,
		updateComment,
		removeComment,
	} = useSpecialEvent();
	const specialEvent = ref<SpecialEventDetail>(await getDetail(props.eventId));
	Promise.all([
		specialEvent.value.goods_groups.forEach(async (group) => {
			group.goods_list = await getGoodsGroup(props.eventId, group.id);
		}),
	]);

	const commentPaginator = ref<Paginator<SpecialEventComment>>();
	const loadedComments = ref<SpecialEventComment[]>([]);

	(async () => {
		if (!specialEvent.value.is_commentable) {
			return;
		}
		commentPaginator.value = await getCommentPaginator(props.eventId);
		loadedComments.value = commentPaginator.value.data;
	})();

	async function fetchMoreComment(refresh: boolean = false) {
		if (!specialEvent.value.is_commentable || !commentPaginator.value) {
			return;
		}

		loading.show();
		try {
			if (refresh) {
				commentPaginator.value.current_page = 0;
				loadedComments.value = [];
			}
			const newComments = (await getCommentPaginator(props.eventId, ++commentPaginator.value.current_page)).data;
			loadedComments.value = loadedComments.value.concat(newComments);
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
			await addComment(props.eventId, form);
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
			await updateComment(props.eventId, commentId, form);
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
			await removeComment(props.eventId, commentId);
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

<style src="./_event.scss" lang="scss"></style>