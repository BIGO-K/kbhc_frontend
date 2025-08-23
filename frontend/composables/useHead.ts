const titleElement = document.querySelector<HTMLTitleElement>('title');

export const useHead = (
	options?: {
		title?: string;
	}
) => {
	const baseTitle = options?.title ? `KB 오케어 X	- ${options.title}` : 'KB 오케어 X';
	if (titleElement) titleElement.innerText = baseTitle;
};