export abstract class Component {
	protected _element: HTMLElement;
	protected _parent: HTMLElement;

	get element(): HTMLElement {
		return this._element;
	}

	constructor(parent: HTMLElement) {
		this._parent = parent;
		this._element = this.createElement(parent);
	}

	dispose() {
		this._element.parentElement.removeChild(this._element);
	}

	abstract createElement(parent: HTMLElement): HTMLElement;
}