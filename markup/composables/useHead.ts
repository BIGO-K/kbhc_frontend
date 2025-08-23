const titleElement = document.querySelector<HTMLTitleElement>('title');

export const useHead = (
	options?: {
		title?: string;
	}
) => {
	const baseTitle = options?.title ? `KBHC - ${options.title}` : 'KBHC';
	if (titleElement) titleElement.innerText = baseTitle;
};