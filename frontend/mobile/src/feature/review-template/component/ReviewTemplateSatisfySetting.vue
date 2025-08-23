<template>
	<!-- 사이즈 -->
	<section
		v-for="reviewTemplate in reviewTemplates"
		:key="reviewTemplate.id"
	>
		<h6><b>{{ korean(`${reviewTemplate.title}(은/는)`) }} 어떤가요?</b></h6>
		<div class="mm_radio-list">
			<ul class="mm_flex T=equal">
				<li
					v-for="(detail, _i) in reviewTemplate.details"
					:key="detail.id"
				>
					<form-radio
						v-model="selected[reviewTemplate.id]"
						:name="`template_${reviewTemplate.id}`"
						:value="detail.id"
						:checked="!selected[reviewTemplate.id] ? _i == 1: selected[reviewTemplate.id] == detail.id"
					>
						<b class="mm_block">
							<i class="ico_form-radio"></i>
							<span class="text_label">{{ detail.label }}</span>
						</b>
					</form-radio>
				</li>
			</ul>
		</div>
	</section>
</template>

<script setup lang="ts">
	import { ref, watch } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import FormRadio from '@/component/form/FormRadio.vue';

	const props = withDefaults(defineProps<{
		selectedReviewTemplates: MyReviewDetail['selected_templates'];
		reviewTemplates: ReviewTemplate[];
	}>(), {
		selectedReviewTemplates: () => [],
		reviewTemplates: () => [],
	});

	const emit = defineEmits<(e: 'update:selectedReviewTemplates', value: MyReviewDetail['selected_templates']) => void>();

	const { korean } = useFormatter();

	const selected = ref(Object.fromEntries(
		props.selectedReviewTemplates
			.map(selected => [selected.template_id, selected.detail_id])
	));

	watch(selected, (newSelected) => {
		const templates = Object.entries(newSelected).map(selected => {
			return {
				template_id: Number(selected[0]),
				detail_id: selected[1],
			};
		});
		emit('update:selectedReviewTemplates', templates);
	}, {
		deep: true,
	});
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/mixin';

	/** 리뷰 관리/체험단 */
	// 리뷰 쓰기
	.m_review-write {
		> section {
			.mm_radio-list {
				padding: 0 24px;

				ul {
					position: relative;
					text-align: center;

					&::before {
						position: absolute;
						top: 20px;
						left: 20%;
						width: 60%;
						border-top: 1px solid #eee;
						content: '';
					}
				}

				li {
					&:nth-child(n+2) {
						margin-top: 0;
					}
				}

				.mm_form-radio {
					padding: 49px 0 0;
					min-width: 60px;

					.ico_form-radio {
						left: 50%;
						width: 40px;
						height: 40px;
						border-color: #ccc;
						background-color: #ccc;
						transform: translateX(-50%);

						&::before {
							top: 50%;
							left: 50%;
							width: 30px;
							height: 30px;
							background-color: #fff;
							transform: translate(-50%, -50%);
						}
					}

					.text_label {
						margin: 0;
						@include mixin.font(#444 '1.3rem/2rem');
					}

					input:checked {
						+ .mm_block {
							.ico_form-radio {
								border-color: var(--color_main);
								background-color: var(--color_main);

								&::before {
									top: 50%;
									left: 50%;
									width: 20px;
									height: 20px;
									background-color: #444;
								}
							}
						}
					}
				}
			}
		}
	}
</style>