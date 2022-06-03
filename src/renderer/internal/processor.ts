import { $ } from '../base/core/dom';
import { IInspectorService, IInspectorView } from '../services/inspector/inspectorService';
import Source from './source';
import source from './source';

export default class Processor implements IInspectorView {
	private _canvas: HTMLCanvasElement;
	get canvas() { return this._canvas };

	private _ctx: CanvasRenderingContext2D;
	get stream() { return this._canvas.captureStream(30) }

	private _sources: Source[];

	constructor(
		@IInspectorService private readonly inspectorService: IInspectorService
	) {
		this._canvas = $('canvas') as HTMLCanvasElement;
		this._ctx = this._canvas.getContext('2d');

		inspectorService.registerView(this);
	}

	refresh(items: source[]) {
		this._sources = items;
	}

	public process() {
		this._canvas.width = this._canvas.clientWidth;
		this._canvas.height = this._canvas.clientHeight;

		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		let i = 0;
		if (this._sources) {
			this._sources.forEach(source => {
				const ratio = (this._canvas.width * 0.5) / source.width;
				this._ctx.drawImage(
					source.graphics,
					i * (this._canvas.width * 0.5),
					0,
					source.width * ratio,
					source.height * ratio
				);
				i++;
			})
		}
	}
}