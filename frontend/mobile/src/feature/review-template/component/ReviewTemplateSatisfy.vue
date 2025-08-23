<template>
	<div class="mm_satisfy">
		<dl
			v-for="template in templates"
			:key="template.id"
		>
			<dt>{{ template.title }}</dt><dd>{{ template.selected_label }}</dd>
		</dl>
	</div>
</template>

<script setup lang="ts">
	withDefaults(defineProps<{
		templates: SelectedReviewTemplate[];
	}>(), {
		templates: () => [],
	});
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/mixin';

	/** 공통 */
	// 리뷰 만족도
	.mm_satisfy {
		dl {
			position: relative;
			padding-left: 72px;

			dt {
				position: absolute;
				top: 0;
				left: 0;
				width: 72px;
				height: 24px;
				border-radius: 4px;
				background-color: #f8f8f8;
				@include mixin.font(#666 '1.4rem/2.4rem' center);
			}

			+ dl {
				margin-top: 8px;
			}

			dd {
				margin-left: 12px;
				@include mixin.font(#444 '1.5rem/2.4rem');
			}
		}
	}

	/** 상품상세 */
	.m_prodetail-tab-review {
		.mm_review {
			.mm_satisfy {
				margin-top: 15px;

				@include mixin.context-before('button.text_review +') {
					margin-top: 24px;
				}

				+ .mm_review-image {
					margin-top: 24px;
				}
			}
		}
	}

	/** 마이페이지 - 리뷰 관리 - 작성한 리뷰 */
	.m_myreview-written {
		.mm_review {
			.mm_satisfy {
				margin-top: -1px;
				padding: 1px 0 23px;
				border-bottom: 1px solid #eee;
				background-color: #fff;
			}

			.text_review[tabindex] {
				+ .text_date {
					+ .mm_satisfy {
						margin-top: -11px;
					}
				}
			}
		}
	}


	// *---------- 오버레이 ----------*

	/** 리뷰 상세(포토 리뷰, 베스트 리뷰) */
	.m_review-detail {
		.mm_satisfy {
			margin-top: 23px;
		}
	}
</style>