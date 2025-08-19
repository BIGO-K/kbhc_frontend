<template>
	<div class="mm_event-reply">
		<!-- 댓글 작성 -->
		<div class="mm_event-reply-write">
			<div class="mm_inner">
				<h6>댓글<small>{{ paginator.total }}개</small></h6>
				<form-check
					v-model="createForm.is_private"
					label="비공개"
					icon-class="T=sm"
				></form-check>
				<div class="mm_event-reply-title">
				</div>
				<form-textarea
					v-model="createForm.contents"
					maxlength="200"
					:resize="{ 'min': 5, 'max': 9 }"
					:byte="200"
					placeholder="댓글을 작성하세요"
				></form-textarea>
				<div class="mm_btn_box">
					<button
						type="button"
						class="mm_btn T=primary"
						@click="addComment"
					>
						<b>작성완료</b>
					</button>
				</div>
			</div>
		</div>

		<!-- 댓글 목록 -->
		<div class="mm_event-reply-list">
			<template v-if="paginator.total < 1">
				<p class="mm_text-none T=sm">
					<i class="ico_text-none"></i>등록된 댓글이 없습니다
				</p>
			</template>
			<template v-else>
				<ul>
					<li
						v-for="comment in loadedComments"
						:key="comment.id"
						:class="['mm_event-reply-item', {'T=item-my': comment.is_editable}]"
					>
						<p class="text_user">
							<lazyload
								class="mm_bg-contain image_grade"
								:src="comment.writer_grade_image_url"
								:is-error-image="false"
							></lazyload>
							{{ comment.writer_masking_login_id }}
							<b
								v-if="comment.is_editable"
								class="text_tag"
							>내 댓글</b>
							<i
								v-if="comment.is_private"
								class="ico_secret"
							></i>
						</p>
						<p
							v-if="comment.is_private && !comment.is_editable"
							class="text_reply"
						>
							비공개 댓글입니다
						</p>
						<template v-else-if="editingComment?.id == comment.id">
							<form-textarea
								v-model="updateForm.contents"
								maxlength="200"
								:resize="{ 'min': 4, 'max': 6 }"
								placeholder="댓글을 작성하세요"
								:byte="200"
							></form-textarea>
							<form-check
								v-model="updateForm.is_private"
								label="비공개"
								icon-class="T=sm"
							></form-check>
							<div class="mm_btn_box">
								<button
									type="button"
									class="btn_modify"
									@click="updateComment"
								>
									<i class="ico_modify"></i>
									<b>수정</b>
								</button>
							</div>
						</template>
						<template v-else>
							<p
								class="text_reply"
								v-html="newLineToBr(comment.contents)"
							></p>
							<p class="text_date">
								{{ date(comment.created_at, 'YYYY.MM.DD HH:mm:ss') }}
							</p>
							<div
								v-if="comment.is_editable"
								class="mm_btn_box"
							>
								<button
									type="button"
									class="btn_remove"
									@click="destroyComment(comment.id)"
								>
									<i class="ico_delete"></i>
									<b>삭제</b>
								</button>
								<button
									type="button"
									class="btn_modify"
									@click="editingComment = comment"
								>
									<i class="ico_modify"></i>
									<b>수정</b>
								</button>
							</div>
						</template>
					</li>
				</ul>
			</template>
		</div>

		<div
			v-if="paginator.total > paginator.per_page"
			class="mm_foot"
		>
			<div class="mm_btn_box">
				<button
					v-if="loadedComments.length < paginator.total"
					type="button"
					class="mm_btn T=line"
					@click="emit('fetchMore')"
				>
					<b>더보기</b><i class="ico_more"></i>
				</button>
				<p
					v-else
					class="mm_btn T=sm T=line"
				>
					마지막 댓글입니다
				</p>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
	import { ref, computed, watch } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useForm } from '$/composables/useForm';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Lazyload from '@/component/Lazyload.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormTextarea from '@/component/form/FormTextarea.vue';

	const props = defineProps<{
		paginator: Paginator<PlanningComment>;
		loadedComments: PlanningComment[];
	}>();

	const emit = defineEmits<{
		(e: 'fetchMore'): Promise<void>;
		(e: 'add', newComment: PlanningCommentForm, callback?: () => void): Promise<void>;
		(e: 'update', id: number, newComment: PlanningCommentForm, callback?: () => void): Promise<void>;
		(e: 'destroy', id: number, callback?: () => void): Promise<void>;
	}>();

	const { newLineToBr, date } = useFormatter();
	const { loading, bom } = useGlobalPageContext();

	const loadedComments = computed(() => props.loadedComments);
	const editingComment = ref<PlanningComment | null>();

	const { form: createForm, validate: validateCreateForm } = useForm<PlanningCommentForm>(
		{
			contents: '',
			is_private: false,
		},
		{
			rule: {
				'contents(내용)': ['required', 'blank'],
			},
		}
	);

	const { form: updateForm, validate: validateUpdateForm } = useForm<PlanningCommentForm>(
		{
			contents: '',
			is_private: false,
		},
		{
			rule: {
				'contents(내용)': ['required', 'blank'],
			},
		}
	);

	async function addComment() {
		bom.confirm('댓글을 작성하시겠습니까?', async (flag) => {
			if (!flag) {
				return;
			}

			loading.show();
			try {
				await validateCreateForm();
				await emit('add', { ...createForm.value }, () => {
					createForm.value.contents = '';
					createForm.value.is_private = false;
				});
			}
			catch (e) {
				useErrorAlert(e);
			}
			finally {
				loading.hide();
			}
		});
	}

	async function updateComment() {
		bom.confirm('댓글을 수정하시겠습니까?', async (flag) => {

			if (!editingComment.value || !flag) {
				return;
			}

			loading.show();
			try {
				await validateUpdateForm();
				await emit('update', editingComment.value.id, { ...updateForm.value }, () => {
					loadedComments.value.map(comment => {
						if (comment.id == editingComment.value?.id) {
							comment.contents = updateForm.value.contents;
							comment.is_private = updateForm.value.is_private;
						}

						return comment;
					});
					editingComment.value = null;
				});

			}
			catch (e) {
				useErrorAlert(e);
			}
			finally {
				loading.hide();
			}
		});
	}

	async function destroyComment(id: number) {
		bom.confirm('댓글을 삭제하시겠습니까?', async (flag) => {
			if (!flag) {
				return;
			}

			loading.show();
			try {
				await emit('destroy', id);
			}
			catch (e) {
				useErrorAlert(e);
			}
			finally {
				loading.hide();
			}
		});
	}

	watch(editingComment, (to) => {
		updateForm.value.contents = to?.contents || '';
		updateForm.value.is_private = to?.is_private || false;
	});
</script>