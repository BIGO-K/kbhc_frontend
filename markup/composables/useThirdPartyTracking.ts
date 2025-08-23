import { onBeforeUnmount } from 'vue';
import { useUserAgent } from '$/composables/useUserAgent';
import { useGlobalPageContext } from './useGlobalPageContext';

declare global {
	interface Window {
		dataLayer: unknown[];
		criteo_q: unknown[];
		kakaoPixel?: (id: string) => ({
			pageView: (...args: unknown[]) => void;
			viewContent: (...args: unknown[]) => void;
			addToCart: (...args: unknown[]) => void;
			purchase: (...args: unknown[]) => void;
			search: (...args: unknown[]) => void;
			completeRegistration: () => void;
		});
		ENP_VAR: object;
		DOYOUAD_DATA: object;
		CallMtm: () => void;// FIXME 코드 window.CallMtm 선언부에 window.CallMtm.q ??
	}
}

export const useThirdPartyTracking = () => {
	const { router } = useGlobalPageContext();
	const { isMobileUser } = useUserAgent();

	const setting = {
		kakaoPixel: {
			id: '7505253707330309006',
		},
		gtm: {
			id: 'GTM-5PC79K89',
		},
		mobion: {
			id: 'kbhc',
		},
		ga: {
			id: 'G-CKE57LG7TM',
		},
	};

	const needMarketingScript = !(location.hostname.includes('dev') || location.hostname.includes('local') || location.protocol === 'http:');

	const pageView = () => {
		if (!needMarketingScript) return;

		// 카카오 픽셀
		if (window.kakaoPixel && setting.kakaoPixel.id) {
			window.kakaoPixel(`${setting.kakaoPixel.id}`).pageView();
		}
	};

	const doActive = {
		kakaoPixel: () => {
			const pixelScript = window.document.createElement('script');
			pixelScript.async = true;
			pixelScript.defer = true;
			pixelScript.src = '//t1.daumcdn.net/adfit/static/kp.js';
			insertElement(pixelScript, '카카오 픽셀');
		},
		mobion: () => {
			const mobionScript = window.document.createElement('script');
			mobionScript.async = true;
			mobionScript.defer = true;
			mobionScript.src = `//cdn.megadata.co.kr/dist/prod/v2/mtm.js?adverId=${setting.mobion.id}&device=${isMobileUser ? 'M' : 'W'}`;
			insertElement(mobionScript, '<!-- Enliple Tracker -->');
		},
		gtm: () => {
			window.dataLayer = window.dataLayer || [];
			window.dataLayer.push({
				'gtm.start': new Date().getTime(),
				event: 'gtm.js',
			});

			const gtmId = setting.gtm.id;
			const googleTagScript = window.document.createElement('script');
			googleTagScript.async = true;
			googleTagScript.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;

			const googleTagNoscript = window.document.createElement('noscript');
			googleTagNoscript.innerHTML = `
				<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
					height="0" width="0" style="display:none;visibility:hidden"></iframe>
			`;

			insertElement(googleTagScript, 'Google Tag Manager');
			insertElement(
				googleTagNoscript,
				'Google Tag Manager(noscript)',
				'bodystart'
			);
		},
		ga: () => {
			if (!window.dataLayer) window.dataLayer = window.dataLayer || [];

			const gaId = setting.ga.id;
			const googleTagScript = window.document.createElement('script');
			googleTagScript.async = true;
			googleTagScript.src = `https://www.googletagmanager.com/gtag.js?id=${gaId}`;

			insertElement(googleTagScript, 'Google Gtag');

			const gtag = (...args: unknown[]) => { window.dataLayer.push(args); };
			gtag('js', new Date());
			gtag('config', `${gaId}`);
		},
	};

	/** 헤더 내 엘리먼트 삽입처리 */
	function insertElement(
		element: HTMLElement | HTMLElement[],
		comment?: string,
		position: 'headend' | 'headstart' | 'bodyend' | 'bodystart' = 'headend'
	) {
		// (Array.isArray(element) ? element : [element]).forEach(el => args.push(el));// XXX 선언부가 없는데 사용? 그리고 forEach 없어도 될듯

		const args: (Comment | HTMLElement)[] = [window.document.createComment(`${comment}`)];
		args.push(window.document.createComment(`// ${comment}`));

		switch (position) {
			case 'headend':
			case 'bodyend':
				window.document[position === 'headend' ? 'head' : 'body'].append(...args);
				break;
			case 'headstart':
			case 'bodystart':
				const firstChild = window.document.head.children[0];
				for (const arg of args) {
					window.document[position === 'headstart' ? 'head' : 'body'].insertBefore(arg, firstChild);
				}
				break;
		}

		return args;
	}

	return {
		initialize: () => {
			if (!needMarketingScript) return;

			if (setting.kakaoPixel.id) doActive.kakaoPixel();
			if (setting.mobion.id) doActive.mobion();
			if (setting.gtm.id) doActive.gtm();
			if (setting.ga.id) doActive.ga();

			router.afterEach((to, from) => {
				if (to.path === from.path) return;

				// FIXME pageView에 파라미터 없음
				// pageView({
				// 	path: to.path,
				// 	uri: location.href,
				// 	title: document.querySelector('title')?.innerText || '',
				// });
				pageView();
			});
		},
		viewGoods: (resource: ViewGoodsActionResource) => {
			if (!needMarketingScript) return;

			const activateScripts: (Element | Element[])[] = [];
			const categoryLabel = (resource.categoryFullPath ?? '').split('>');

			// GTM 이벤트
			if (window.dataLayer) {
				window.dataLayer.push({
					event: 'view_goods',
					resource: {
						viewGoods: resource,
					},
				});
			}

			if (window.kakaoPixel && setting.kakaoPixel.id) {
				window.kakaoPixel(`${setting.kakaoPixel.id}`).viewContent({
					id: `${resource.goodsId}`,
				});
			}

			if (setting.mobion.id) {
				window.ENP_VAR = {};
				window.ENP_VAR = {
					collect: {
						productCode: `${resource.goodsId}`,
						productName: `${resource.goodsName}`,
						price: `${resource.listPrice}`,
						dcPrice: `${resource.discountedPrice}`,
						soldOut: `${resource.isSoldout ? 'Y' : 'N'}`,
						imageUrl: `${resource.imageUrls[0]}`,
						secondImageUrl: `${resource.imageUrls[1] || ''}`,
						topCategory: `${categoryLabel[0].trim() ?? ''}`,
						firstSubCategory: `${categoryLabel[0].trim() ?? ''}`,
						secondSubCategory: `${categoryLabel[1].trim() ?? ''}`,
						thirdSubCategory: `${categoryLabel[2].trim() ?? ''}`,
					},
				};
				window.CallMtm = window.CallMtm ?? ((...args: unknown[]) => { (window.CallMtm.q = window.CallMtm.q || []).push(args); });

				window.CallMtm();
			}

			onBeforeUnmount(() => {
				if (activateScripts.length > 0) {
					for (const el of activateScripts) {
						if (Array.isArray(el)) {
							for (const tag of el) tag.remove();
						}
						else el.remove();
					}
				}
			});
		},
		viewCart: (resource: ViewCartActionResource) => {
			if (!needMarketingScript) return;

			const activateScripts: (Element | Element[])[] = [];

			// GTM 이벤트
			if (setting.gtm.id && window.dataLayer) {
				window.dataLayer.push({
					event: 'add_to_cart',
					resource: {
						addToCart: resource,
					},
				});
			}

			// 카카오 픽셀
			if (setting.kakaoPixel.id && window.kakaoPixel) {
				for (const cartItem of resource.cartItems) {
					window.kakaoPixel(`${setting.kakaoPixel.id}`).addToCart({
						id: cartItem.goodsId,
					});
				}
			}

			if (setting.mobion.id) {
				window.ENP_VAR = {};
				window.ENP_VAR = {
					conversion: {
						product: resource.cartItems.map(cartItem => {
							return {
								productCode: `${cartItem.goodsId}`,
								productName: `${cartItem.goodsName}`,
								price: `${cartItem.price}`,
								dcPrice: `${cartItem.discountedPrice}`,
								qty: `${cartItem.quantity}`,
							};
						}),
						totalPrice: `${resource.cartItems.reduce((p, c) => p + (c.price * c.quantity), 0)}`, // 없는 경우 단일 상품의 정보를 이용해 계산
						totalQty: `${resource.cartItems.reduce((p, c) => p + c.quantity, 0)}`, // 없는 경우 단일 상품의 정보를 이용해 계산
					},
				};
				window.CallMtm = window.CallMtm ?? ((...args: unknown[]) => { (window.CallMtm.q = window.CallMtm.q || []).push(args); });

				window.CallMtm();
			}

			onBeforeUnmount(() => {
				if (activateScripts.length > 0) {
					for (const el of activateScripts) {
						if (Array.isArray(el)) {
							for (const tag of el) tag.remove();
						}
						else el.remove();
					}
				}
			});
		},
		orderReceipted: (resource: OrderReceiptedActionResource) => {
			if (!needMarketingScript) return;

			const activateScripts: (Element | Element[])[] = [];

			// 카카오 픽셀
			if (window.kakaoPixel && setting.kakaoPixel.id) {
				window.kakaoPixel(`${setting.kakaoPixel.id}`).purchase({
					total_quantity: resource.orderedItems.reduce((p, c) => p + c.quantity, 0),
					total_price: resource.paymentPrice,
					currency: 'KRW',
					products: resource.orderedItems.map(orderedItem => {
						return {
							id: orderedItem.goodsId,
							name: orderedItem.goodsName,
							price: orderedItem.price,
						};
					}),
				});
			}

			if (setting.mobion.id) {
				window.ENP_VAR = {};
				window.ENP_VAR = {
					conversion: {
						product: resource.orderedItems.map(orderedItem => {
							return {
								productCode: `${orderedItem.goodsId}`,
								productName: `${orderedItem.goodsName}`,
								price: `${orderedItem.price}`,
								dcPrice: `${orderedItem.paidPrice }`,
								qty: `${orderedItem.quantity}`,
							};
						}),
						ordCode: `${resource.orderId}`,
						totalPrice: resource.paymentPrice, // 없는 경우 단일 상품의 정보를 이용해 계산
						totalQty: `${resource.orderedItems.reduce((p, c) => p + c.quantity, 0)}`, // 없는 경우 단일 상품의 정보를 이용해 계산
					},
				};
				window.CallMtm = window.CallMtm ?? ((...args: unknown[]) => { (window.CallMtm.q = window.CallMtm.q || []).push(args); });

				window.CallMtm();
			}

			onBeforeUnmount(() => {
				if (activateScripts.length > 0) {
					for (const el of activateScripts) {
						if (Array.isArray(el)) {
							for (const tag of el) tag.remove();
						}
						else el.remove();
					}
				}
			});
		},
		joinComplete: () => {
			if (!needMarketingScript) return;

			const activateScripts: (Element | Element[])[] = [];

			// 카카오 픽셀
			if (window.kakaoPixel && setting.kakaoPixel.id) {
				window.kakaoPixel(`${setting.kakaoPixel.id}`).completeRegistration();
			}

			onBeforeUnmount(() => {
				if (activateScripts.length > 0) {
					for (const el of activateScripts) {
						if (Array.isArray(el)) {
							for (const tag of el) tag.remove();
						}
						else el.remove();
					}
				}
			});
		},
		searchKeyword: (keyword: string) => {
			if (!needMarketingScript || !keyword) return;

			// 카카오 픽셀(검색어 존재시만)
			if (window.kakaoPixel && setting.kakaoPixel.id) {
				window.kakaoPixel(`${setting.kakaoPixel.id}`).search({
					keyword: keyword,
				});
			}
		},
	};
};