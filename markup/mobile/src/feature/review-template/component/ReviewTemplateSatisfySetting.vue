<template>
	<!-- 사이즈 -->
	<section>
		<h6><b>사이즈는 어떤가요?</b></h6>
		<div class="mm_radio-list">
			<ul class="mm_flex T=equal">
				<li>
					<form-radio name="dev_radio-size">
						<b class="mm_block">
							<i class="ico_form-radio"></i>
							<span class="text_label">작아요</span>
						</b>
					</form-radio>
				</li>
				<li>
					<form-radio name="dev_radio-size">
						<b class="mm_block">
							<i class="ico_form-radio"></i>
							<span class="text_label">정사이즈예요</span>
						</b>
					</form-radio>
				</li>
				<li>
					<form-radio name="dev_radio-size">
						<b class="mm_block">
							<i class="ico_form-radio"></i>
							<span class="text_label">생각보다 커요</span>
						</b>
					</form-radio>
				</li>
			</ul>
		</div>
	</section>

	<!-- 색상 -->
	<section>
		<h6><b>색상은 어떤가요?</b></h6>
		<div class="mm_radio-list">
			<ul class="mm_flex T=equal">
				<li>
					<form-radio name="dev_radio-color">
						<b class="mm_block">
							<i class="ico_form-radio"></i>
							<span class="text_label">화면보다 밝아요</span>
						</b>
					</form-radio>
				</li>
				<li>
					<form-radio name="dev_radio-color">
						<b class="mm_block">
							<i class="ico_form-radio"></i>
							<span class="text_label">화면과 같아요</span>
						</b>
					</form-radio>
				</li>
				<li>
					<form-radio name="dev_radio-color">
						<b class="mm_block">
							<i class="ico_form-radio"></i>
							<span class="text_label">화면보다 어두워요</span>
						</b>
					</form-radio>
				</li>
			</ul>
		</div>
	</section>

	<!-- 핏 -->
	<section>
		<h6><b>핏은 어떤가요?</b></h6>
		<div class="mm_radio-list">
			<ul class="mm_flex T=equal">
				<li>
					<form-radio name="dev_radio-fit">
						<b class="mm_block">
							<i class="ico_form-radio"></i>
							<span class="text_label">슬림해요</span>
						</b>
					</form-radio>
				</li>
				<li>
					<form-radio name="dev_radio-fit">
						<b class="mm_block">
							<i class="ico_form-radio"></i>
							<span class="text_label">적당해요</span>
						</b>
					</form-radio>
				</li>
				<li>
					<form-radio name="dev_radio-fit">
						<b class="mm_block">
							<i class="ico_form-radio"></i>
							<span class="text_label">오버핏이에요</span>
						</b>
					</form-radio>
				</li>
			</ul>
		</div>
	</section>
</template>

<script setup lang="ts">
	import FormRadio from '@/component/form/FormRadio.vue';
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