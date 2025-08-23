declare interface ImportMeta {
	readonly env: ImportMetaEnv
}

declare interface ImportMetaEnv {
	readonly MM_BACKEND_BASE_URL: string;
	readonly MM_CLAIM_OFFER_URL: string;
	readonly MM_KAKAO_SHARE_KEY: string;
	readonly MM_SHARE_BASE_URL: string;
	readonly MM_BASE_PATH?: string;
	readonly MM_OUT_DIR?: string;
}