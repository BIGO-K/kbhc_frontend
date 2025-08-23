import { useBackend } from '$/composables/useBackend';

export const usePolicy = () => {
	return {
		/**
		 * 현재 노출중인 약관 및 이전약관 조회
		 * @param type 약관 타입
		 */
		getNowAndPrev: async (type: PolicyType) => {
			return await useBackend().command<{
				prev_policies: PrevPolicy[];
				now_policy: Policy;
			}>(`v1/policies/${type}`);
		},
		/**
		 * 약관 상세 내용 조회
		 * @param type 약관 타입
		 * @param id 약관 ID
		 */
		getContents: async (type: PolicyType, id: number): Promise<string> => {
			const { contents } = await useBackend().command<{
				contents: string;
			}>(`v1/policies/${type}/${id}`);

			return contents;
		},
		/** 협력업체 조회 */
		getCompanies: async () => {
			const { middle_users } = await useBackend().command<{
				middle_users: PolicyCompany[];
			}>('v1/middle-users');

			return middle_users;
		},
		/** 가입시 필요약관 조회 */
		getRegistPolicies: async () => {
			const { policies } = await useBackend().command<{
				policies: Policy[];
			}>('v1/members/policies');

			return policies;
		},
	};
};