import { DesktopCapturerSource } from 'electron';
import { Component } from '../../../base/Component';
import { append, $, activeClass } from '../../../base/core/dom';
import { Emitter, EventType } from '../../../base/core/event';
import SourcePreview from '../sourcePreview/sourcePreview';

class SourceSelector extends Component {

	private _onDidSelect = new Emitter<SourcePreview>();
	onDidSelect = this._onDidSelect.event;

	private _previews: SourcePreview[];
	private _sources: DesktopCapturerSource[];

	private _tabScreen: HTMLElement;
	private _tabWindow: HTMLElement;
	private _content: HTMLElement;

	createElement(parent: HTMLElement): HTMLElement {
		const element = $('div.selector');

		const options = append(element, $('div.options'));
		this._tabScreen = append(options, $('div.tab'));
		this._tabScreen.innerHTML = 'Screen';
		this._tabScreen.addEventListener(EventType.CLICK, () => this._display('screen'));
		this._tabWindow = append(options, $('div.tab'));
		this._tabWindow.innerHTML = 'Window';
		this._tabWindow.addEventListener(EventType.CLICK, () => this._display('window'));

		this._content = append(element, $('div.content'));

		return element;
	}

	hide = () => {
		if (this._element.parentElement != null)
			this._parent.removeChild(this._element);
	}

	show() {
		if (this._element.parentElement == null)
			this._parent.appendChild(this._element);
	}

	display(sources: DesktopCapturerSource[]) {
		this._sources = sources;
		if (!this._previews) {
			this._previews = [];
		}

		this._display('screen');
	}

	private _display(type: 'screen' | 'window') {
		this.show();

		activeClass(this._tabScreen, 'active', type === 'screen');
		activeClass(this._tabWindow, 'active', type === 'window');

		this._previews.forEach(preview => { preview.dispose(); });
		this._previews = [];

		const sources = this._sources.filter(o => o.id.startsWith(type));
		for (let i = 0; i < sources.length; i++) {
			const preview = new SourcePreview(this._content);
			preview.setContent(sources[i]);
			preview.onDidSelect(this._onDidPreviewSelected);

			this._previews.push(preview);
		}
	}

	_onDidPreviewSelected = (preview: SourcePreview) => {
		this.hide();
		this._onDidSelect.fire(preview)
	}
}

export default SourceSelector;