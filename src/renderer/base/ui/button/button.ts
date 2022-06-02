import { EventHelper, EventType } from '../../core/event';

export interface IButton {
	readonly element: HTMLElement;
	onDidClick: (e) => void;
	label: string;
	icon: string;
}

export class Button implements IButton {

	protected _element: HTMLElement;

	private _onDidClick: (e) => void;
	set onDidClick(value: (e) => void) { this._onDidClick = value; }

	get element(): HTMLElement {
		return this._element;
	}

	set label(value: string) {
		this._element.classList.add('text-button');
		this._element.textContent = value;
	}

	set icon(icon: string) {
		this._element.classList.add('icon-button');
		this._element.classList.add(`icon-${icon}`);
	}

	constructor(container: HTMLElement) {

		this._element = document.createElement('a');
		this._element.classList.add('button');

		container.appendChild(this._element);
		this._element.addEventListener(EventType.CLICK, e => {
			EventHelper.stop(e);

			if (this._onDidClick)
				this._onDidClick(e);
		})
	}

}