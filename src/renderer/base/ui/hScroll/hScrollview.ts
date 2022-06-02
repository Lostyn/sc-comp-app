import { Component } from '../../Component';
import { $, append } from '../../core/dom';
import { Callback } from '../../core/event';
import { HScrollBar } from './hScrollBar';

export class HScrollView extends Component {
	onDidZoom: Callback<number>;

	_content: HTMLElement;
	_zoom: number;

	public get zoom() { return this._zoom; }
	public get content() { return this._content; }

	_bar: HScrollBar;

	createElement(parent: HTMLElement): HTMLElement {
		const className = 'hscrollview';
		this._element = append(parent, $(`div.${className}`));

		this._zoom = 100;
		this._content = append(this._element, $(`div.${className}-content`));
		this._content.addEventListener('wheel', (e) => this.onDidWheel(e));

		this._bar = new HScrollBar(this, className);
		this._bar.onDidChange = (v) => this.onBarChanged(v);
		setTimeout(() => this.layout(), 1);
		return this._element;
	}

	private onDidWheel = (e) => {
		const inc = e.ctrlKey ? e.deltaY : e.deltaY / 10;
		this.setZoom(this._zoom - inc);
	}

	onBarChanged = (left: number) => {
		const r = this._content.getBoundingClientRect().width;
		this._content.style.marginLeft = `${-r * left / 100}px`;
		this.layout();
	}

	public setZoom(value: number) {
		this._zoom = Math.max(100, value);
		this.layout();

		if (this.onDidZoom) this.onDidZoom(this._zoom);
	}

	public layout = () => {
		this._content.style.width = `${this._zoom}%`;

		this._bar.setActive(this._zoom > 100);
		this._bar.layout();
	}
}