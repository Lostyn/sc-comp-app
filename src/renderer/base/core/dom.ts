/**
 * Wait for ddom content to be loaeded
 */
export function domContentLoaded(): Promise<unknown> {
	return new Promise<unknown>(resolve => {
		const readyState = document.readyState;
		if (readyState === 'complete' || (document && document.body !== null)) {
			resolve(undefined);
		} else {
			window.addEventListener('DOMContentLoaded', resolve, false);
		}
	});
}

export function append<T extends Node>(parent: HTMLElement, child: T): T;
export function append<T extends Node>(parent: HTMLElement, ...children: (T | string)[]): void;
export function append<T extends Node>(parent: HTMLElement, ...children: (T | string)[]): T | void {
	parent.append(...children);
	if (children.length === 1 && typeof children[0] !== 'string') {
		return <T>children[0];
	}
}


export function prepend<T extends Node>(parent: HTMLElement, child: T): T {
	parent.insertBefore(child, parent.firstChild);
	return child;
}

const SELECTOR_REGEX = /([\w\-]+)?(#([\w\-]+))?((.([\w\-]+))*)/;
export function $(description: string) {
	let match = SELECTOR_REGEX.exec(description);

	let result = document.createElement(match[1] || 'div');

	if (match[3])
		result.id = match[3]
	if (match[4])
		result.className = match[4].replace(/\./g, ' ').trim();

	return result;
}

export function activeClass(element: HTMLElement, className: string, isActive: boolean) {
	if (isActive && !element.classList.contains(className))
		element.classList.add(className);
	else if (!isActive && element.classList.contains(className))
		element.classList.remove(className);
}