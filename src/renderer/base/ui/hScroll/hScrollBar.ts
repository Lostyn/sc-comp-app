import { $, append } from '../../core/dom';
import { Callback, EventType } from '../../core/event';
import { HScrollView } from './hScrollview';

export class HScrollBar {
	onDidChange: Callback<number>;
	_element: HTMLElement;
	_thumb: HTMLElement;

	_parent: HScrollView;

	_startPos: number;
	_startLeft: number;

	_left: number;

	constructor(parent: HScrollView, classname: string) {
		this._parent = parent;

		this._element = append(parent.element, $(`div.${classname}-bar`));
		this._thumb = append(this._element, $(`div.${classname}-thumb`));

		this._thumb.addEventListener(EventType.DOWN, this.onThumbDown);
		this._left = 0;
	}

	setActive(active: boolean) {
		this._element.style.display = active ? 'block' : 'none';
	}

	onThumbDown = (e) => {
		const r = this._element.getBoundingClientRect();
		this._startPos = ((e.clientX - r.x) / r.width) * 100;
		this._startLeft = this._left;

		window.addEventListener(EventType.MOVE, this.onThumbMove);
		window.addEventListener(EventType.UP, this.onThumbUp);
	}

	onThumbMove = (e) => {
		const r = this._element.getBoundingClientRect();
		const pos = ((e.clientX - r.x) / r.width) * 100;
		const delta = this._startPos - pos;

		this.left = this._startLeft - delta;
		if (this.onDidChange != null)
			this.onDidChange(this._left);
	}

	onThumbUp = (e) => {
		window.removeEventListener(EventType.MOVE, this.onThumbMove);
		window.removeEventListener(EventType.UP, this.onThumbUp);
	}

	get prctWidth() {
		const pW = this._parent.element.getBoundingClientRect().width;
		const cW = this._parent.element.firstElementChild.getBoundingClientRect().width;

		if (pW * cW === 0) {
			return 100;
		}

		return pW / cW * 100;
	}

	set left(value: number) {
		this._left = Math.min(Math.max(value, 0), (100 - this.prctWidth));
		this.layout();
	}

	layout = () => {
		const pW = this._parent.element.getBoundingClientRect().width;
		const cW = this._parent.element.firstElementChild.getBoundingClientRect().width;

		if (pW * cW > 0) {
			const prct = pW / cW * 100;
			this._thumb.style.width = `${prct}%`
		}

		const prevLeft = this._left;
		this._left = Math.min(Math.max(this._left, 0), (100 - this.prctWidth));
		this._thumb.style.marginLeft = `${this._left}%`;

		if (prevLeft != this._left) {
			console.log('changed');
			this.onDidChange(this._left);
		}
	}
}