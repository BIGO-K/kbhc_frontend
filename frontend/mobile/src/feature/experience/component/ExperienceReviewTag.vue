<template>
	<b class="mm_tag"><i class="ico_experience"></i>체험단</b>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
	@use '../../../asset/scss/helper/mixin';

	/** 상품상세 리뷰, 리뷰 상세 공통 */
	.mm_review-head {
		.text_user {
			.mm_tag {
				margin: -1px 7px 1px 0;
				padding: 0 4px;
				height: 22px;
				border-radius: 3px;
				@include mixin.font('1.2rem/2rem');

				.ico_experience {
					margin: 2px 2px 0 0;

					&::before {
						width: 16px;
						height: 16px;
						@include mixin.svg(var(--color_sub) url('/image/common/ico_smile.svg'));
					}
				}
			}
		}
	}


	// *---------- 오버레이 ----------*

	/** 리뷰 상세(포토 리뷰, 베스트 리뷰) */
	.m_review-detail {
		.mm_review-head {
			.text_user {
				.mm_tag {
					margin-top: -1px;
					height: 22px;
					line-height: 2rem;
				}
			}
		}
	}
</style>