<template>
	<div id="mm_view">
		<h1><b>KBHC MOBILE</b></h1>

		<!--
			인덱스
			(D) 태그 상태에 따라 text_tag에 상태 클래스를 추가하고(미작업 제외), 링크가 없는 li의 경우 .text_name을 제외한 나머지 div 요소를 삭제합니다.
		-->
		<div
			class="mm_tab"
			data-tab
		>
			<nav class="mm_tab-menu">
				<ul>
					<li
						v-for="(menu, _i) in tabMenu"
						:key="_i"
					>
						<a
							class="btn_tab"
							:class="{ 'S=tab-on': tabIndex === _i }"
							@click.prevent="tabIndex = _i"
						>
							{{ menu.name }}
						</a>
					</li>
				</ul>
			</nav>

			<!-- 에러/오버레이 -->
			<div class="mm_tab-item">
				<!-- 에러 -->
				<section>
					<h2><b>에러</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">403</div>
								<div class="text_link">Error403</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">404</div>
								<div class="text_link">Error404</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">500</div>
								<div class="text_link">Error500</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">서비스점검</div>
								<div class="text_link">ErrorMaintenance</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">트래픽</div>
								<div class="text_link">ErrorTraffic</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">리뉴얼</div>
								<div class="text_link">ErrorRenewal</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">그 외</div>
								<div class="text_link">Error</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
					</ul>
				</section>

				<!-- 오버레이 -->
				<section>
					<h2><b>오버레이</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">(오버레이) 최근 본 상품</div>
								<div class="text_link">--ProductRecently</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(오버레이) 본인인증 SNS</div>
								<div class="text_link">--AuthMobile</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(오버레이) 우편번호찾기</div>
								<div class="text_link">--AddressPostcode</div>
								<div><span class="text_tag T=working"></span></div>
								<div>(포함) 검색결과, 내용없음</div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(오버레이) 배송지 관리</div>
								<div class="text_link">--Address</div>
								<div><span class="text_tag T=working"></span></div>
								<div>(포함) 내용없음</div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(오버레이) 신규 배송지 등록</div>
								<div class="text_link">--AddressCreate</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(오버레이) 카드사별혜택</div>
								<div class="text_link">--CardBenefit</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(오버레이) 찜폴더 선택</div>
								<div class="text_link">--MyWishlistProductFolder</div>
								<div><span class="text_tag T=working"></span></div>
								<div>(BOM) 새 폴더 추가하기</div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(오버레이) 포토리뷰(이미지 보기)</div>
								<div class="text_link">--ProductReviewPhoto</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
					</ul>
				</section>
			</div>

			<!-- 메인/검색 -->
			<div class="mm_tab-item">
				<!-- 메인 -->
				<section>
					<h2><b>메인</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">메인</div>
								<div class="text_link">Main</div>
								<div><span class="text_tag T=working"></span></div>
								<div>블록으로 구성</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">메인 캐러셀(스와이프)</div>
										<div class="text_link">-</div>
										<div><span class="text_tag"></span></div>
										<div>ts 사용으로 로컬 dev로 확인 가능</div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">팝업</div>
									</a>
									<ul>
										<li>
											<a class="mm_flex">
												<div class="text_name">기본형</div>
											</a>
											<ul>
												<li>
													<a class="mm_flex">
														<div class="text_name">A타입</div>
														<div class="text_link">-</div>
														<div><span class="text_tag"></span></div>
														<div></div>
													</a>
												</li>
												<li>
													<a class="mm_flex">
														<div class="text_name">B타입</div>
														<div class="text_link">-</div>
														<div><span class="text_tag"></span></div>
														<div></div>
													</a>
												</li>
											</ul>
										</li>
										<li>
											<a class="mm_flex">
												<div class="text_name">토스트형</div>
											</a>
											<ul>
												<li>
													<a class="mm_flex">
														<div class="text_name">A타입</div>
														<div class="text_link">-</div>
														<div><span class="text_tag"></span></div>
														<div><p class="text_color2">이미지 높이 448px</p></div>
													</a>
												</li>
												<li>
													<a class="mm_flex">
														<div class="text_name">B타입</div>
														<div class="text_link">-</div>
														<div><span class="text_tag"></span></div>
														<div><p class="text_color2">이미지 높이 520px</p></div>
													</a>
												</li>
												<li>
													<a class="mm_flex">
														<div class="text_name">C타입</div>
														<div class="text_link">-</div>
														<div><span class="text_tag"></span></div>
														<div><p class="text_color2">이미지 높이 700px</p></div>
													</a>
												</li>
											</ul>
										</li>
									</ul>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">타임딜</div>
									</a>
									<ul>
										<li>
											<a class="mm_flex">
												<div class="text_name">A타입</div>
												<div class="text_link">-</div>
												<div><span class="text_tag"></span></div>
												<div></div>
											</a>
										</li>
									</ul>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">배너</div>
									</a>
									<ul>
										<li>
											<a class="mm_flex">
												<div class="text_name">탑배너</div>
											</a>
											<ul>
												<li>
													<a class="mm_flex">
														<div class="text_name">A타입</div>
														<div class="text_link">-</div>
														<div><span class="text_tag"></span></div>
														<div></div>
													</a>
												</li>
												<li>
													<a class="mm_flex">
														<div class="text_name">B타입</div>
														<div class="text_link">-</div>
														<div><span class="text_tag"></span></div>
														<div></div>
													</a>
												</li>
											</ul>
										</li>
									</ul>
								</li>
							</ul>
						</li>
					</ul>
				</section>

				<!-- GNB 메뉴 -->
				<section>
					<h2><b>GNB 메뉴</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">기획전 상세</div>
								<div class="text_link">PromotionDetail</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p class="text_color2">(상태) 로그인</p>
									<p>(포함) 댓글 내용없음, 비로그인</p>
									<p class="text_color1">기획전 리스트 페이지 없음</p>
								</div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(유료) 랭킹</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">B타입</div>
									</a>
									<ul>
										<li>
											<a class="mm_flex">
												<div class="text_name">메인</div>
												<div class="text_link">Ranking</div>
												<div><span class="text_tag T=working"></span></div>
												<div><p>(포함) 내용없음</p></div>
											</a>
											<ul>
												<li>
													<a class="mm_flex">
														<div class="text_name">아이템 랭킹</div>
														<div class="text_link">RankingProduct</div>
														<div><span class="text_tag T=working"></span></div>
														<div><p>(포함) 내용없음</p></div>
													</a>
												</li>
												<li>
													<a class="mm_flex">
														<div class="text_name">브랜드 랭킹</div>
														<div class="text_link">RankingBrand</div>
														<div><span class="text_tag T=working"></span></div>
														<div><p>(포함) 내용없음</p></div>
													</a>
												</li>
												<li>
													<a class="mm_flex">
														<div class="text_name">View 랭킹</div>
														<div class="text_link">RankingView</div>
														<div><span class="text_tag T=working"></span></div>
														<div><p>(포함) 내용없음</p></div>
													</a>
												</li>
												<li>
													<a class="mm_flex">
														<div class="text_name">찜 랭킹</div>
														<div class="text_link">RankingWishlist</div>
														<div><span class="text_tag T=working"></span></div>
														<div><p>(포함) 내용없음</p></div>
													</a>
												</li>
											</ul>
										</li>
									</ul>
								</li>
							</ul>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(유료) 이벤트</div>
								<div class="text_link">Event</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(포함) 내용없음</p>
									<p class="text_color2">(유료기능) 갤러리형 게시판</p>
								</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">이벤트 상세</div>
										<div class="text_link">EventDetail</div>
										<div><span class="text_tag T=working"></span></div>
										<div>
											<p class="text_color2">(상태) 로그인</p>
											<div><p>(포함) 댓글 내용없음, 비로그인</p></div>
										</div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(유료) 체험단</div>
										<div class="text_link">Experience</div>
										<div><span class="text_tag T=working"></span></div>
										<div>
											<p>(포함) 내용없음</p>
											<p class="text_color2">(유료기능) 체험단 게시판</p>
										</div>
									</a>
									<ul>
										<li>
											<a class="mm_flex">
												<div class="text_name">(팝업) 체험단 후기 상세</div>
												<div class="text_link">ExperienceDetail</div>
												<div><span class="text_tag T=working"></span></div>
												<div></div>
											</a>
										</li>
										<li>
											<a class="mm_flex">
												<div class="text_name">(오버레이) 체험단 후기 작성</div>
												<div class="text_link">--ExperienceCreate</div>
												<div><span class="text_tag T=working"></span></div>
												<div></div>
											</a>
										</li>
									</ul>
								</li>
							</ul>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(유료) 코디샷</div>
								<div class="text_link">Codyshot</div>
								<div><span class="text_tag T=unused"></span></div>
								<div>
									<p>(포함) 내용없음</p>
									<p class="text_color2">(유료기능) 코디샷</p>
								</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">코디샷 상세</div>
										<div class="text_link">CodyshotDetail</div>
										<div><span class="text_tag T=unused"></span></div>
										<div></div>
									</a>
								</li>
							</ul>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(유료) 공동구매</div>
								<div class="text_link">Coop</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(포함) 내용없음</p>
									<p class="text_color2">(유료기능) 공동구매</p>
								</div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(유료) 래플</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이) 래플 안내</div>
										<div class="text_link">--RaffleGuide</div>
										<div><span class="text_tag T=working"></span></div>
										<div></div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이) 래플 응모하기</div>
										<div class="text_link">--RaffleEntry</div>
										<div><span class="text_tag T=working"></span></div>
										<div><p class="text_color2">(페이지) 상품상세(래플)에서 공통 사용</p></div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이) 당첨자 보기</div>
										<div class="text_link">--raffleWinner</div>
										<div><span class="text_tag T=working"></span></div>
										<div></div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">B타입</div>
									</a>
									<ul>
										<li>
											<a class="mm_flex">
												<div class="text_name">메인</div>
												<div class="text_link">Raffle</div>
												<div><span class="text_tag T=working"></span></div>
												<div>
													<p class="text_color2">(상태) 래플 진행중/종료</p>
													<p>(팝업) 래플 응모 동의, 래플 안내, 응모 내역 없음, 추첨중, 당첨자 보기, 래플 당첨, 래플 낙첨</p>
													<p class="text_color3">(유료기능) 래플</p>
												</div>
											</a>
											<ul>
												<li>
													<a class="mm_flex">
														<div class="text_name">(모달) 당첨 결과 확인</div>
														<div class="text_link">--raffleResult</div>
														<div><span class="text_tag T=working"></span></div>
														<div>
															<p class="text_color2">(상태) 래플 당첨</p>
															<p>(포함) 내용없음, 낙첨/추첨중/미응모</p>
														</div>
													</a>
												</li>
											</ul>
										</li>
									</ul>
								</li>
							</ul>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(유료) 쇼케이스</div>
								<div class="text_link">Showcase</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(포함) 내용없음</p>
									<p class="text_color2">(유료기능) 웹진</p>
								</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">(유료) 쇼케이스 상세</div>
										<div class="text_link">ShowcaseDetail</div>
										<div><span class="text_tag T=working"></span></div>
										<div><p class="text_color3">(유료기능) 웹진</p></div>
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</section>

				<!-- 검색 -->
				<section>
					<h2><b>검색</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">(팝업) 검색</div>
								<div class="text_link">Search</div>
								<div><span class="text_tag T=working"></span></div>
								<div><p>(포함) 내용없음</p></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(팝업) 검색결과</div>
								<div class="text_link">SearchResult</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(포함) 결과없음, 상품없음(필터 재검색 시 노출)</p>
									<p class="text_color3">
										(유료기능) 상품 아이콘<br>
										(유료기능) 재입고 예정 아이콘<br>
										(유료기능) 말머리
									</p>
								</div>
							</a>
						</li>
					</ul>
				</section>

				<!-- 선물받기 -->
				<section>
					<h2><b>선물받기</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">선물받기</div>
								<div class="text_link">Present</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">선물 받기완료</div>
								<div class="text_link">PresentSuccess</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
					</ul>
				</section>
			</div>

			<!-- 카테고리/상품상세 -->
			<div class="mm_tab-item">
				<!-- 카테고리 -->
				<section>
					<h2><b>카테고리</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">상품 카테고리</div>
								<div class="text_link">Category</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(포함) 내용없음</p>
									<p class="text_color3">
										(유료기능) 상품 아이콘<br>
										(유료기능) 재입고 예정 아이콘<br>
										(유료기능) 말머리
									</p>
								</div>
							</a>
						</li>
					</ul>
				</section>

				<!-- 필터검색 -->
				<section>
					<h2><b>필터검색</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">(오버레이) 필터 및 정렬</div>
								<div class="text_link">--CategoryFilter</div>
								<div><span class="text_tag T=working"></span></div>
								<div><p class="text_color3">(유료기능) 사이즈 필터(슈즈)</p></div>
							</a>
						</li>
					</ul>
				</section>

				<!-- 상품상세 -->
				<section>
					<h2><b>상품상세</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">상품상세</div>
								<div class="text_link">ProductDetail</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(포함) 정보, 리뷰, Q&A, 판매자정보</p>
									<p class="text_color3">
										(유료기능) 배송확률 - 일반 상품 상세에만 적용<br>
										(유료기능) 재입고 알림<br>
										(유료기능) 타임딜<br>
										(유료기능) 체험단 게시판<br>
										(유료기능) 구매 리뷰 템플릿<br>
									</p>
								</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">상품상세 - 상품정보</div>
										<div></div>
										<div></div>
										<div>
											<p class="text_color2">(상태) 회원/비회원, 버튼형 옵션</p>
											<p>(오버레이) 쿠폰 다운로드, 카드사별 혜택, 좋아요 폴더 담기, 재입고 알림 신청, 사은품 정보</p>
											<p>(팝업) sns회원본인인증</p>
											<p>(모달) PCS쿠폰</p>
										</div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">상품상세 - 리뷰</div>
										<div></div>
										<div></div>
										<div>
											<p>(오버레이) 포토리뷰 이미지 전체리스트, 포토리뷰 상세, 이미지 보기</p>
											<p>(포함) 내용없음, 포토리뷰없음</p>
										</div>
									</a>
									<ul>
										<li>
											<a class="mm_flex">
												<div class="text_name">(오버레이) 포토리뷰 이미지 전체리스트</div>
												<div class="text_link">--ProductReviewAllPhoto</div>
												<div><span class="text_tag T=working"></span></div>
												<div></div>
											</a>
										</li>
										<li>
											<a class="mm_flex">
												<div class="text_name">(오버레이) 포토리뷰 이미지보기</div>
												<div class="text_link">--ProductReviewPhoto</div>
												<div><span class="text_tag T=working"></span></div>
												<div></div>
											</a>
										</li>
										<li>
											<a class="mm_flex">
												<div class="text_name">(오버레이) 포토리뷰 상세</div>
												<div class="text_link">--ProductReviewDetail</div>
												<div><span class="text_tag T=working"></span></div>
												<div>
													<p class="text_color3">
														(유료기능) 체험단 게시판<br>
														(유료기능) 구매 리뷰 템플릿
													</p>
												</div>
											</a>
										</li>
										<li>
											<a class="mm_flex">
												<div class="text_name">(오버레이) 베스트 리뷰 상세</div>
												<div class="text_link">--ProductReviewBest</div>
												<div><span class="text_tag T=working"></span></div>
												<div>
													<p class="text_color3">
														(유료기능) 체험단 게시판<br>
														(유료기능) 구매 리뷰 템플릿
													</p>
												</div>
											</a>
										</li>
									</ul>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">상품상세 - Q&A</div>
										<div></div>
										<div></div>
										<div>
											<p>(오버레이) 상품 문의하기</p>
											<p>(포함) 내용없음</p>
										</div>
									</a>
									<ul>
										<li>
											<a class="mm_flex">
												<div class="text_name">(오버레이) 상품 문의하기</div>
												<div class="text_link">--MyInquiryProductCreate</div>
												<div><span class="text_tag T=working"></span></div>
												<div></div>
											</a>
										</li>
									</ul>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">상품상세 - 판매자정보</div>
										<div></div>
										<div></div>
										<div></div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이) 쿠폰 다운로드</div>
										<div class="text_link">--ProductDetailCoupon</div>
										<div><span class="text_tag T=working"></span></div>
										<div></div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(모달) PCS쿠폰</div>
										<div class="text_link">--ProductDetailPcs</div>
										<div><span class="text_tag T=working"></span></div>
										<div><p>(상태) 네이버</p></div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이)(유료) 재입고 알림 신청</div>
										<div class="text_link">--RestockApply</div>
										<div><span class="text_tag T=working"></span></div>
										<div><p class="text_color2">(유료기능) 재입고 알림</p></div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(유료) 상품상세_360도 뷰</div>
										<div class="text_link">-</div>
										<div><span class="text_tag"></span></div>
										<div><p class="text_color2">(유료기능) 360도 뷰</p></div>
									</a>
									<ul>
										<li>
											<a class="mm_flex">
												<div class="text_name">(유료)(팝업) 306도 보기</div>
												<div class="text_link">-</div>
												<div><span class="text_tag"></span></div>
												<div><p class="text_color2">(유료기능) 360도 뷰</p></div>
											</a>
										</li>
									</ul>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(유료) 상품상세_선물하기</div>
										<div class="text_link">-</div>
										<div><span class="text_tag"></span></div>
										<div><p class="text_color3">(유료기능) 선물하기</p></div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(유료) 상품상세_래플</div>
										<div class="text_link">-</div>
										<div><span class="text_tag"></span></div>
										<div>
											<p>(모달) 래플 낙첨, 래플 당첨</p>
											<p>(팝업) 래플 응모 동의</p>
											<p class="text_color3">(유료기능) 래플</p>
										</div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(유료) 상품상세_공동구매</div>
										<div class="text_link">-</div>
										<div><span class="text_tag"></span></div>
										<div>
											<p class="text_color2">(상태) 진행중인 공동구매/종료된 공동구매</p>
											<p class="text_color3">(유료기능) 공동구매</p>
										</div>
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</section>

				<!-- 판매자샵 -->
				<section>
					<h2><b>판매자샵</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">판매자샵</div>
								<div class="text_link">SellerShop</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(포함) 내용없음</p>
									<p class="text_color3">
										(유료기능) 상품 아이콘<br>
										(유료기능) 재입고 예정 아이콘<br>
										(유료기능) 말머리
									</p>
								</div>
							</a>
						</li>
					</ul>
				</section>
			</div>

			<!-- 브랜드 -->
			<div class="mm_tab-item">
				<section>
					<h2><b>브랜드</b></h2>
					<ul>
						<!-- 브랜드샵 -->
						<li>
							<a class="mm_flex">
								<div class="text_name">브랜드샵</div>
								<div class="text_link">BrandShop</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(포함) 내용없음</p>
									<p class="text_color3">
										(유료기능) 웹진_쇼케이스 배너
										(유료기능) 상품 아이콘<br>
										(유료기능) 재입고 예정 아이콘<br>
										(유료기능) 말머리
									</p>
								</div>
							</a>
						</li>
					</ul>
				</section>
			</div>

			<!-- 장바구니/주문결제 -->
			<div class="mm_tab-item">
				<!-- 장바구니 -->
				<section>
					<h2><b>장바구니</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">장바구니</div>
								<div class="text_link">Cart</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(레이어) 옵션/수량 변경</p>
									<p>(포함) 내용없음</p>
								</div>
							</a>
						</li>
					</ul>
				</section>

				<!-- 주문결제 -->
				<section>
					<h2><b>(팝업)주문결제</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">주문결제</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">회원</div>
										<div class="text_link">Order</div>
										<div><span class="text_tag T=working"></span></div>
										<div>
											<P>(팝업) 배송지 관리, 카드사 혜택</P>
											<p>(오버레이) 쿠폰적용, 개인통관고유부호 수집 및 제공</p>
											<p class="text_color3">(유료기능) 간편결제</p>
										</div>
									</a>
									<ul>
										<li>
											<a class="mm_flex">
												<div class="text_name">(오버레이) 쿠폰적용</div>
												<div class="text_link">--OrderCoupon</div>
												<div><span class="text_tag T=working"></span></div>
												<div></div>
											</a>
										</li>
									</ul>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이) 개인통관고유부호 수집 및 제공</div>
										<div class="text_link">--OrderUnipass</div>
										<div><span class="text_tag T=working"></span></div>
										<div></div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(유료)(오버레이) 사은품 지급 대상_상품</div>
										<div class="text_link">--GiftOrderTarget</div>
										<div><span class="text_tag T=working"></span></div>
										<div><p class="text_color3">(유료기능) 사은품</p></div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(유료) 주문결제_래플</div>
										<div class="text_link">-</div>
										<div><span class="text_tag"></span></div>
										<div><p class="text_color3">(유료기능) 래플</p></div>
									</a>
								</li>
							</ul>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">주문결과</div>
								<div class="text_link">OrderResult</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(포함) 주문완료/주문실패</p>
									<p class="text_color3">(유료기능) 사은품</p>
								</div>
							</a>
						</li>
					</ul>
				</section>
			</div>

			<!-- 마이페이지(회원) -->
			<div class="mm_tab-item">
				<!-- 메인 -->
				<section>
					<h2><b>메인</b></h2>
					<ul>
						<li>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이) MY사이즈</div>
										<div class="text_link">--SizeFilterMySize, --RecommendMySize, --ReviewTemplateMySize</div>
										<div><span class="text_tag T=working"></span></div>
										<div>
											<p class="text_color3">
												(유료기능) 구매 리뷰 템플릿<br>
												(유료기능) 개인화 상품 추천<br>
												(유료기능) 사이즈 필터
											</p>
										</div>
									</a>
								</li>
							</ul>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(유료) 메인_래플</div>
								<div class="text_link">-</div>
								<div><span class="text_tag"></span></div>
								<div><p class="text_color3">(유료기능) 래플</p></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(유료) 메인_자체페이</div>
								<div class="text_link">-</div>
								<div><span class="text_tag"></span></div>
								<div><p class="text_color3">(유료기능) 자체페이</p></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(팝업) 등급혜택안내</div>
								<div class="text_link">MyLevel</div>
								<div><span class="text_tag T=working"></span></div>
								<div><p>(포함) 등급</p></div>
							</a>
						</li>
					</ul>
				</section>

				<!-- 주문 관리 -->
				<section>
					<h2><b>주문 관리</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">주문 관리</div>
								<div class="text_link">MyOrder</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(오버레이) 구매 확정, 판매자 문의하기, 리뷰쓰기</p>
									<p>(포함) 내용없음, 비회원</p>
								</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이) 구매 확정</div>
										<div class="text_link">--MyOrderConfirm</div>
										<div><span class="text_tag T=working"></span></div>
										<div></div>
									</a>
								</li>
							</ul>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">취소관리</div>
								<div class="text_link">MyOrderCancel</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(오버레이) 판매자 문의하기</p>
									<p>(포함) 내용없음, 비회원</p>
								</div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">반품관리</div>
								<div class="text_link">MyOrderReturn</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(오버레이) 판매자 문의하기</p>
									<p>(포함) 내용없음, 비회원</p>
								</div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">교환관리</div>
								<div class="text_link">MyOrderExchange</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(팝업) 반품전환 신청</p>
									<p>(오버레이) 판매자 문의하기</p>
									<p>(포함) 내용없음, 비회원</p>
								</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">(팝업) 반품전환 신청</div>
										<div class="text_link">MyOrderToReturnCreate</div>
										<div><span class="text_tag T=working"></span></div>
										<div>
											<p class="text_color2">(페이지) 비회원 공동사용</p>
											<p>(포함) 상품선택, 정보입력</p>
										</div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(팝업) 반품전환 완료</div>
										<div class="text_link">MyOrderToReturnSuccess</div>
										<div><span class="text_tag T=working"></span></div>
										<div><p class="text_color2">(페이지) 비회원 공동사용</p></div>
									</a>
								</li>
							</ul>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(오버레이) 판매자 문의하기</div>
								<div class="text_link">--MyInquirySellerCreate</div>
								<div><span class="text_tag T=working"></span></div>
								<div><span class="text_color2">(기능) 상품선택</span></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">주문상세내역</div>
								<div class="text_link">MyOrderDetail</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(오버레이) 판매자 문의하기, 배송지 관리, 리뷰쓰기, 영수증보기</p>
									<p class="text_color3">(유료기능) 사은품</p>
								</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이) 영수증보기</div>
										<div class="text_link">--MyOrderDetailReceipt</div>
										<div><span class="text_tag T=working"></span></div>
										<div>
											<p>(포함) 신용카드, 가상계좌</p>
											<p>(BOM) 영수증이메일로발송, 송장번호입력</p>
										</div>
									</a>
								</li>
							</ul>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(오버레이) 부분선택</div>
								<div class="text_link">--MyOrderPick</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(팝업) 주문취소</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">주문취소</div>
										<div class="text_link">MyOrderCancelCreate</div>
										<div><span class="text_tag T=working"></span></div>
										<div><p>(오버레이) 부분선택</p></div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">취소완료</div>
										<div class="text_link">MyOrderCancelSuccess</div>
										<div><span class="text_tag T=working"></span></div>
										<div><p class="text_color2">(페이지) 비회원 공동사용</p></div>
									</a>
								</li>
							</ul>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(팝업) 주문 반품</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">반품 신청</div>
										<div class="text_link">MyOrderReturnCreate</div>
										<div><span class="text_tag T=working"></span></div>
										<div>
											<p>(오버레이) 부분선택</p>
											<p>(포함) 상품선택, 정보입력</p>
										</div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">반품신청완료</div>
										<div class="text_link">MyOrderReturnSuccess</div>
										<div><span class="text_tag T=working"></span></div>
										<div><p class="text_color2">(페이지) 비회원 공동사용</p></div>
									</a>
								</li>
							</ul>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">(팝업) 주문 교환</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">교환 신청</div>
										<div class="text_link">MyOrderExchangeCreate</div>
										<div><span class="text_tag T=working"></span></div>
										<div>
											<p>(오버레이) 옵션 변경</p>
											<p>(포함) 상품선택, 정보입력</p>
										</div>
									</a>
									<ul>
										<li>
											<a class="mm_flex">
												<div class="text_name">(오버레이) 옵션 변경</div>
												<div class="text_link">--MyOrderExchangeCreateOption</div>
												<div><span class="text_tag T=working"></span></div>
												<div></div>
											</a>
										</li>
									</ul>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">교환 신청 완료</div>
										<div class="text_link">MyOrderExchangeSuccess</div>
										<div><span class="text_tag T=working"></span></div>
										<div><p class="text_color2">(페이지) 비회원 공동사용</p></div>
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</section>

				<!-- 혜택 관리 -->
				<section>
					<h2><b>혜택 관리</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">쿠폰</div>
								<div class="text_link">MyBenefit</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(오버레이) 사용조건_모든상품, 상품, 브랜드</p>
									<p>(BOM) 쿠폰 등록</p>
									<p>(포함) 내용없음</p>
								</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">(bom) 쿠폰 등록</div>
										<div class="text_link">-</div>
										<div><span class="text_tag"></span></div>
										<div></div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이) 사용조건</div>
										<div class="text_link">--MyBenefitCouponGuideline</div>
										<div><span class="text_tag T=working"></span></div>
										<div><p>(포함) 모든상품, 상품, 브랜드</p></div>
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</section>

				<!-- MY찜 -->
				<section>
					<h2><b>MY찜</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">찜한 아이템</div>
								<div class="text_link">MyWishlistProduct</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(팝업) 찜폴더 선택</p>
									<p>(BOM) 찜폴더 추가, 찜폴더 수정</p>
								</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">상세보기</div>
										<div class="text_link">MyWishlistProductDetail</div>
										<div><span class="text_tag T=working"></span></div>
										<div><p>(포함) 내용없음</p></div>
									</a>
								</li>
							</ul>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">찜한 브랜드</div>
								<div class="text_link">MyWishlistBrand</div>
								<div><span class="text_tag T=working"></span></div>
								<div><p>(포함) 내용없음</p></div>
							</a>
						</li>
					</ul>
				</section>

				<!-- 리뷰 관리 -->
				<section>
					<h2><b>리뷰 관리</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">작성 가능한 리뷰</div>
								<div class="text_link">MyReviewPending</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(오버레이) 리뷰작성</p>
									<p>(포함) 내용없음</p>
								</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이) 리뷰작성</div>
										<div class="text_link">--MyReviewCreate</div>
										<div><span class="text_tag T=working"></span></div>
										<div><p class="text_color3">(유료기능) 구매 리뷰 템플릿</p></div>
									</a>
								</li>
							</ul>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">작성한 리뷰</div>
								<div class="text_link">MyReviewCompleted</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(오버레이) 리뷰수정</p>
									<p>(포함) 내용없음</p>
									<p class="text_color3">(유료기능) 구매 리뷰 템플릿</p>
								</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이) 리뷰수정</div>
										<div class="text_link">--MyReviewUpdate</div>
										<div><span class="text_tag T=working"></span></div>
										<div><p class="text_color3">(유료기능) 구매 리뷰 템플릿</p></div>
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</section>

				<!-- 문의관리 -->
				<section>
					<h2><b>문의관리</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">1:1문의</div>
								<div class="text_link">MyInquirySingle</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(팝업) 1:1 고객상담</p>
									<p>(오버레이) 1:1문의 수정</p>
									<p>(포함) 내용없음</p>
								</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">(팝업) 1:1 고객상담</div>
										<div class="text_link">MyInquirySingleCreate</div>
										<div><span class="text_tag T=working"></span></div>
										<div></div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이) 1:1문의 수정</div>
										<div class="text_link">--MyInquirySingleUpdate</div>
										<div><span class="text_tag T=working"></span></div>
										<div></div>
									</a>
								</li>
							</ul>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">판매자 문의</div>
								<div class="text_link">MyInquirySeller</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(오버레이) 판매자 문의 수정, 상품 문의 수정</p>
									<p>(포함) 내용없음</p>
								</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이) 판매자 문의 수정</div>
										<div class="text_link">--MyInquirySellerUpdate</div>
										<div><span class="text_tag T=working"></span></div>
										<div></div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이) 상품 문의 수정</div>
										<div class="text_link">--MyInquiryProductUpdate</div>
										<div><span class="text_tag T=working"></span></div>
										<div></div>
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</section>

				<!-- 배송지연신고 -->
				<section>
					<h2><b>배송지연신고</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">배송지연신고</div>
								<div class="text_link">MyDelayedPending</div>
								<div><span class="text_tag T=working"></span></div>
								<div><p>(포함) 내용없음</p></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">배송지연 처리결과</div>
								<div class="text_link">MyDelayedCompleted</div>
								<div><span class="text_tag T=working"></span></div>
								<div><p>(포함) 내용없음</p></div>
							</a>
						</li>
					</ul>
				</section>

				<!-- 품절취소신고 -->
				<section>
					<h2><b>품절취소신고</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">품절취소 신고</div>
								<div class="text_link">MySoldoutPending</div>
								<div><span class="text_tag T=working"></span></div>
								<div><p>(포함) 내용없음</p></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">품절취소 처리결과</div>
								<div class="text_link">MySoldoutCompleted</div>
								<div><span class="text_tag T=working"></span></div>
								<div><p>(포함) 내용없음</p></div>
							</a>
						</li>
					</ul>
				</section>

				<!-- 최근본쇼핑정보 -->
				<section>
					<h2><b>최근본쇼핑정보</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">최근본상품</div>
								<div class="text_link">MyRecentlyProduct</div>
								<div><span class="text_tag T=working"></span></div>
								<div><p>(포함) 내용없음</p></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">최근본기획전</div>
								<div class="text_link">MyRecentlyPromotion</div>
								<div><span class="text_tag T=working"></span></div>
								<div><p>(포함) 내용없음</p></div>
							</a>
						</li>
					</ul>
				</section>

				<!-- 환불 계좌 관리 -->
				<section>
					<h2><b>환불 계좌 관리</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">환불 계좌 관리</div>
								<div class="text_link">MyRefund</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(오버레이) 환불 계좌 등록, 환불 계좌 변경</p>
									<p>(포함) 내용없음</p>
								</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이) 환불 계좌 등록</div>
										<div class="text_link">--MyRefundCreate</div>
										<div><span class="text_tag T=working"></span></div>
										<div></div>
									</a>
								</li>
								<li>
									<a class="mm_flex">
										<div class="text_name">(오버레이) 환불 계좌 변경</div>
										<div class="text_link">--MyRefundUpdate</div>
										<div><span class="text_tag T=working"></span></div>
										<div></div>
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</section>

				<!-- 회원정보관리 -->
				<section>
					<h2><b>회원정보관리</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">(팝업) 회원정보 수정</div>
								<div class="text_link">MyInfoUpdate</div>
								<div><span class="text_tag T=working"></span></div>
								<div>
									<p>(팝업) 비밀번호 변경, 회원탈퇴</p>
									<p>(포함) 비밀번호 재입력 / sns 비밀번호 재입력</p>
								</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">(팝업) 회원탈퇴</div>
										<div class="text_link">MyWithdraw</div>
										<div><span class="text_tag T=working"></span></div>
										<div></div>
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</section>

				<!-- 설정 -->
				<section>
					<h2><b>설정</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">(팝업) 설정</div>
								<div class="text_link">MySetting</div>
								<div><span class="text_tag T=working"></span></div>
								<div><p>(포함) 비회원</p></div>
							</a>
						</li>
					</ul>
				</section>

				<!-- 간편결제 비밀번호 관리 -->
				<section>
					<h2><b>(유료) 간편결제 비밀번호 관리</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">(유료) 간편결제 비밀번호 관리</div>
							</a>
							<ul>
								<li>
									<a class="mm_flex">
										<div class="text_name">(팝업) SNS 비밀번호 재입력</div>
										<div class="text_link">-</div>
										<div><span class="text_tag"></span></div>
										<div><p class="text_color2">(유료기능) 자체페이</p></div>
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</section>

				<!-- 래플 응모 내역 -->
				<section>
					<h2><b>(유료) 래플 응모 내역</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">래플 응모 내역</div>
								<div class="text_link">RaffleMy</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
					</ul>
				</section>

				<!-- 선물함 -->
				<section>
					<h2><b>(유료) 선물함</b></h2>
					<ul>
						<li>
							<a class="mm_flex">
								<div class="text_name">받은 선물함</div>
								<div class="text_link">PresentMyReceive</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">보낸 선물함</div>
								<div class="text_link">PresentMySent</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
						<li>
							<a class="mm_flex">
								<div class="text_name">선물 주문 상세</div>
								<div class="text_link">PresentDetail</div>
								<div><span class="text_tag T=working"></span></div>
								<div></div>
							</a>
						</li>
					</ul>
				</section>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, watch, onMounted } from 'vue';
	import { useRouter } from 'vue-router';

	const tabIndex = ref(0);
	const tabMenu = [
		{ name: '에러/오버레이' },
		{ name: '메인/검색' },
		{ name: '카테고리/상품상세' },
		{ name: '브랜드' },
		{ name: '장바구니/주문결제' },
		{ name: '마이페이지(회원)' },
	];
	const $router = useRouter();

	const changeTab = () => {

		const tabClass = 'S=tab-on';
		const $items = Object.values(document.getElementsByClassName('mm_tab-item'));
		for (const [_i, $item] of $items.entries()) $item.classList[(_i === tabIndex.value) ? 'add' : 'remove'](tabClass);

	};

	onMounted(() => {
		const $tag = document.getElementsByClassName('text_tag');
		const stateMap = {
			complete: { count: 0, label: '완료' },
			develop: { count: 0, label: '개발가능' },
			working: { count: 0, label: '작업중' },
			checking: { count: 0, label: '검수중' },
			recheck: { count: 0, label: '재검수' },
			ready: { count: 0, label: '미작업' },
			remove: { count: 0, label: '삭제' },
			unused: { count: 0, label: '미사용' },
		};

		for (const $el of Object.values($tag)) {
			const key = Object.values($el.classList).find(_class => _class.startsWith('T='))?.replace('T=', '') ?? 'ready';
			const state = stateMap[key as keyof typeof stateMap];
			if (state == null) continue;

			$el.textContent = state.label;
			state.count++;

			const $a = $el.closest('a')!;
			// 삭제
			if ([stateMap.remove.label, stateMap.unused.label].includes(state.label)) {
				for (const $el of Object.values($a.children)) $el.innerHTML = `<del>${$el.innerHTML}</del>`;
			}

			// 링크
			if (![stateMap.ready.label, stateMap.unused.label].includes(state.label)) {
				const name = $a.querySelector('.text_link')!.textContent;
				const link = $router.getRoutes().find(_record => _record.name === name)?.path.replace('', '.').replace(':id(\\d+)?', '001000000').replace(':id(\\d+)', '123');
				if (link != null) {
					$a.setAttribute('href', link);
					$a.setAttribute('target', '_blank');
				}
			}
		}

		changeTab();

		console.log(`
			총 페이지 수: ${$tag.length}\n
			완료: ${stateMap.complete.count}\n
			개발가능: ${stateMap.develop.count}\n
			삭제: ${stateMap.remove.count}\n
			검수중: ${stateMap.checking.count}\n
			재검수: ${stateMap.recheck.count}\n
			작업중: ${stateMap.working.count}\n
			미작업: ${stateMap.ready.count}\n
		`);
	});

	watch(tabIndex, () => changeTab(),
		{
			immediate: true,
		}
	);
</script>

<style lang="scss">
	#mm_view {
		overflow-y: scroll;
		padding-bottom: 50px;
		height: 100%;
	}

	h1 {
		margin-bottom: 30px;
		padding: 25px 0;
		background: #00989c;
		color: #fff;
		font-size: 40px;
		text-align: center;
	}

	.mm_tab-menu {
		border: 0;

		ul:not(.mm_flex) {
			display: flex;
			height: auto;
			border-right: 1px solid #bcbcbc;

			> li {
				flex: auto;
				border: 1px solid #bcbcbc;
				border-right: 0;
				background: #fafafa;
				color: #bcbcbc;
				font-size: 14px;

				> .btn_tab {
					padding: 15px;
					width: 100%;
					height: auto;
					font-size: 14px;
					line-height: 1;
					text-align: center;
					cursor: pointer;

					&.S\=tab-on {
						background: #fff;
						color: #202020;
						font-weight: 700;
					}
				}
			}
		}
	}

	.mm_tab-item {
		margin-top: -1px;
		border: 1px solid #bcbcbc;

		section {
			border-bottom: 1px solid #ddd;

			> ul > li:nth-child(even) {
				background: #fafafa;
			}
		}

		h2 {
			padding: 12px 10px;
			font-size: 15px;
		}

		li {
			position: relative;
			padding-left: 30px;

			> ul .mm_flex {
				border-top: 1px solid #f4f4f4;
			}

			ul::before {
				position: absolute;
				top: 35px;
				bottom: 10px;
				left: 48px;
				border-left: 1px solid #ddd;
				content: '';
			}
		}

		.mm_flex {
			align-items: center;
			padding: 8px 0;
			line-height: 18px;

			&:hover {
				background: #dfdfdf;
			}

			div {
				padding: 0 10px;
				font-size: 13px;
				text-align: center;

				&.text_name {
					flex: 1;
					text-align: left;
				}

				&.text_link {
					width: 350px;
					text-align: left;
				}

				&:nth-child(3) {
					width: 100px;
				}

				&:nth-child(4) {
					width: 450px;
					text-align: left;
				}
			}

			del {
				color: #aaa;
			}
		}

		.text_tag {
			display: inline-block;
			padding: 1px 5px;
			border: 1px solid #e11;
			border-radius: 3px;
			background: #fff;
			color: #e11;
			font-size: 12px;

			&.T\=develop,
			&.T\=complete {
				border-color: #04aa37;
				color: #04aa37;
			}

			&.T\=working {
				border-color: #558eda;
				color: #558eda;
			}

			&.T\=checking {
				border-color: #973af3;
				color: #973af3;
			}

			&.T\=recheck {
				border-color: #e83af3;
				color: #e83af3;
			}

			&.T\=remove,
			&.T\=unused {
				border-color: #aaa;
				color: #aaa;
			}
		}

		// 진행 중
		.text_color1 {
			color: #558eda;
		}

		// 개발전달
		.text_color2 {
			color: #973af3;
		}

		// 긴급, 변경사항
		.text_color3 {
			color: #e11;
		}
	}
</style>
