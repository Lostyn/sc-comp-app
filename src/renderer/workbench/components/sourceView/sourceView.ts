import { Component } from '../../../base/Component'
import { $, append } from '../../../base/core/dom'
import Source from '../../../internal/source';

export default class SourceView extends Component {

	constructor(
		parent: HTMLElement,
		private readonly source: Source
	) {
		super(parent);

		this.render();
	}

	createElement(parent: HTMLElement): HTMLElement {
		return append(parent, $('.source-view'));
	}

	render() {
		const title = append(this.element, $('span'));
		title.innerHTML = this.source.name;
	}

	override dispose(): void {
		this._parent.removeChild(this.element);
	}

}