import Point from '../../commun/math/Point';
import { $ } from '../base/core/dom';
import { EventHelper, EventType } from '../base/core/event';
import { IProcessingService, IProcessingView } from '../services/processor/processorService';
import Source from './source';
import source from './source';

export default class Processor implements IProcessingView {
	private _canvas: HTMLCanvasElement;
	get canvas() { return this._canvas };

	private _ctx: CanvasRenderingContext2D;
	get stream() { return this._canvas.captureStream(30) }

	private _sources: Source[];
	_size: { width: number, height: number };

	constructor(
		@IProcessingService private readonly processorService: IProcessingService
	) {
		this._canvas = $('canvas') as HTMLCanvasElement;
		this._ctx = this._canvas.getContext('2d');
		this._sources = [];
		this._size = processorService.size;

		processorService.registerView(this);
		this._canvas.addEventListener(EventType.CLICK, this.onDidSelect);
	}

	public setSize(width: number, height: number) {
		this._size = { width, height }
	}

	onDidSelect = (e) => {
		EventHelper.stop(e);
		const canvasRect = this._canvas.getBoundingClientRect();
		const pos = new Point((e.clientX - canvasRect.x) / canvasRect.width, (e.clientY - canvasRect.y) / canvasRect.height);
		let source: Source = null;
		for (let i = 0; i < this._sources.length; i++) {
			source = this._sources[i];
			if (pos.isInside(source.rect))
				break;
		}
	}

	refresh(items: source[]) {
		this._sources = items;
	}

	sizeDidChange(size) {
		this._size = size;
	}

	public process() {
		this._canvas.width = this._size.width;
		this._canvas.height = this._size.height;
		this.canvas.style.height = `${this._size.height / this._size.width * this.canvas.clientWidth}px`;

		this._ctx.clearRect(0, 0, this._size.width, this._size.height);
		for (let i = 0; i < this._sources.length; i++) {
			this._sources[i].drawIn(this._canvas, this._ctx);
		}
	}
}