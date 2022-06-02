import { DesktopCapturerSource } from 'electron';
import { Component } from '../../../base/Component';
import { $, append } from '../../../base/core/dom';
import { Emitter, EventType } from '../../../base/core/event';

class SourcePreview extends Component {

	private _source: DesktopCapturerSource;

	private _onDidSelect = new Emitter<SourcePreview>();
	readonly onDidSelect = this._onDidSelect.event;

	public get source() {
		return this._source;
	}

	createElement(parent: HTMLElement): HTMLElement {
		return append(parent, $('div.preview'));
	}

	override dispose() {
		super.dispose();

		this._onDidSelect.dispose();
		this._element.removeEventListener(EventType.CLICK, this.onDidClick);

	}

	onDidClick = () => {
		this._onDidSelect.fire(this);
	}

	setContent(source: DesktopCapturerSource) {
		this._source = source;

		const name = append(this.element, $('div.name'));
		name.innerHTML = source.name;

		const img = append(this.element, $('img')) as HTMLImageElement;
		img.src = source.thumbnail.toDataURL();


		this._element.addEventListener(EventType.CLICK, this.onDidClick);
	}

}

export default SourcePreview;