export const COOP_DEAL_STATUSES: { [key in CoopDealStatus]: key } = {
	upcoming: 'upcoming',
	ongoing: 'ongoing',
	end: 'end',
} as const;