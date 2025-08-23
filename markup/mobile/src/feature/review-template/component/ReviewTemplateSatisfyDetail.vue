<template>
	<!-- 개인화 상품 평가 -->
	<div class="m...review-satisfy">
		<section>
			<h6><b>사이즈</b><strong>정사이즈예요</strong><span>75%<small>(113명)</small></span></h6>
			<ul>
				<li>
					<span class="text_label">작아요</span>
					<b class="m...review-satisfy-progress">
						<i
							style="width:10%"
							title="10%"
						></i>
					</b>
					<span>19명</span>
				</li>
				<li class="S=value-high">
					<span class="text_label">정사이즈예요</span>
					<b class="m...review-satisfy-progress">
						<i
							style="width:82%"
							title="82%"
						></i>
					</b>
					<span>119명</span>
				</li>
				<li>
					<span class="text_label">생각보다 커요</span>
					<b class="m...review-satisfy-progress">
						<i
							style="width:23%"
							title="23%"
						></i>
					</b>
					<span>80명</span>
				</li>
			</ul>
		</section>
		<section>
			<h6><b>색상</b><strong>화면과 같아요</strong><span>91%<small>(113명)</small></span></h6>
			<ul>
				<li>
					<span class="text_label">화면보다 밝아요</span>
					<b class="m...review-satisfy-progress">
						<i
							style="width:10%"
							title="10%"
						></i>
					</b>
					<span>19명</span>
				</li>
				<li class="S=value-high">
					<span class="text_label">화면과 같아요</span>
					<b class="m...review-satisfy-progress">
						<i
							style="width:82%"
							title="82%"
						></i>
					</b>
					<span>74명</span>
				</li>
				<li>
					<span class="text_label">화면보다 어두워요</span>
					<b class="m...review-satisfy-progress">
						<i
							style="width:23%"
							title="23%"
						></i>
					</b>
					<span>20명</span>
				</li>
			</ul>
		</section>
		<section>
			<h6><b>핏</b><strong>적당해요</strong><span>57%<small>(113명)</small></span></h6>
			<ul>
				<li>
					<span class="text_label">슬림해요</span>
					<b class="m...review-satisfy-progress">
						<i
							style="width:10%"
							title="10%"
						></i>
					</b>
					<span>19명</span>
				</li>
				<li class="S=value-high">
					<span class="text_label">적당해요</span>
					<b class="m...review-satisfy-progress">
						<i
							style="width:82%"
							title="82%"
						></i>
					</b>
					<span>119명</span>
				</li>
				<li>
					<span class="text_label">오버핏이에요</span>
					<b class="m...review-satisfy-progress">
						<i
							style="width:23%"
							title="23%"
						></i>
					</b>
					<span>80명</span>
				</li>
			</ul>
		</section>
		<toggle
			class="btn_detail"
			parent-selector=".m...review-satisfy"
		>
			<b>자세히 보기</b><i class="ico_more"></i>
		</toggle>
	</div>
</template>

<script setup lang="ts">
	import Toggle from '@/component/Toggle.vue';
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/mixin';
	@use '../../../asset/scss/helper/function';

	/** 상품상세 */
	.m_prodetail-tab-review {
		#{function.escape('.m...review-satisfy')} {
			position: relative;
			margin: 0 24px;
			padding: 24px 0 41px;
			border-bottom: 1px solid #ccc;

			&#{function.escape('.S=toggle-on')} {
				section {
					h6 {
						&::before,
						span {
							display: block;
						}
					}

					> ul {
						display: block;
					}

					+ section {
						margin-top: 11px;
					}
				}

				.btn_detail {
					.ico_more::before {
						transform: rotate(180deg);
					}
				}
			}

			section {
				h6 {
					position: relative;
					z-index: 0;
					@include mixin.font(#222 '1.5rem/2.4rem');

					&::before {
						display: none;
						position: absolute;
						z-index: -1;
						top: 10px;
						right: 0;
						left: 0;
						height: 1px;
						@include mixin.background('/6px 1px' repeat-x);
						background-image: linear-gradient(90deg, #ccc 5px, #fff 2px);
						content: '';
					}

					b {
						width: 72px;
						height: 24px;
						border-radius: 4px;
						background-color: #f8f8f8;
						@include mixin.font(#666 '1.4rem/2.4rem' center);
					}

					strong {
						padding: 0 14px 0 12px;
						background-color: #fff;
					}

					span {
						display: none;
						position: absolute;
						top: 0;
						right: 0;
						padding-left: 10px;
						background-color: #fff;

						small {
							margin-left: 4px;
						}
					}
				}

				ul {
					display: none;
					padding: 16px 0 20px;

					li {
						position: relative;
						padding-left: 109px;
						@include mixin.font(#888 '1.3rem/2rem');

						&#{function.escape('.S=value-high')} {
							color: #444;

							b > i {
								background-color: var(--color_sub);
							}

							span:not(.text_label) {
								color: var(--color_sub);
							}
						}

						> span {
							position: absolute;
							top: 0;
							right: 0;

							&.text_label {
								right: auto;
								left: 5px;
							}
						}

						> b {
							display: block;
							position: relative;
							margin-right: 58px;
							height: 20px;

							&::before,
							i {
								position: absolute;
								top: 50%;
								left: 0;
								height: 6px;
								border-radius: 6px;
								background-color: #ccc;
								transform: translateY(-50%);
							}

							&::before {
								right: 0;
								background-color: #eee;
								content: '';
							}
						}
					}
				}

				+ section {
					margin-top: 8px;
				}
			}

			.btn_detail {
				position: absolute;
				right: 0;
				bottom: -1px;
				padding: 0 14px;
				width: auto;
				height: 42px;
				border: 1px solid #ccc;
				border-radius: 12px 12px 0 0;
				@include mixin.font(#222 '1.5rem/4rem');

				.ico_more {
					margin: 12px 0 0 7px;

					&::before {
						width: 16px;
						height: 16px;
					}
				}
			}
		}
	}
</style>