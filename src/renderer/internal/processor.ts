import Vector2 from '../../commun/math/Vector2';
import { $ } from '../base/core/dom';
import { EventHelper, EventType } from '../base/core/event';
import { IProcessingService, IProcessingView } from '../services/processor/processorService';
import Source from './source';
import source from './source';

export default class Processor implements IProcessingView {
	private _canvas: HTMLCanvasElement;
	get canvas() { return this._canvas };
	private _overlayCanvas: HTMLCanvasElement;
	get overlay() { return this._overlayCanvas };

	private _ctx: CanvasRenderingContext2D;
	get stream() { return this._canvas.captureStream(30) }
	private _overlayCtx: CanvasRenderingContext2D;

	private _sources: Source[];
	_size: { width: number, height: number };

	_downTime: number;
	_downGizmo: boolean;
	_startPos: Vector2;

	constructor(
		@IProcessingService private readonly processorService: IProcessingService
	) {
		this._canvas = $('canvas.renderer') as HTMLCanvasElement;
		this._ctx = this._canvas.getContext('2d');
		this._overlayCanvas = $('canvas.overlay') as HTMLCanvasElement;
		this._overlayCtx = this._overlayCanvas.getContext('2d');

		this._sources = [];
		this._size = processorService.size;

		processorService.registerView(this);
		this._canvas.addEventListener(EventType.DOWN, this.onDidCanvasDown);
		this._canvas.addEventListener(EventType.UP, this.onDidCanvasUp);
	}

	public setSize(width: number, height: number) {
		this._size = { width, height }
	}

	getCanvasMousePos(e): Vector2 {
		const canvasRect = this._canvas.getBoundingClientRect();
		return new Vector2(
			(e.clientX - canvasRect.x) / canvasRect.width * this._canvas.width,
			(e.clientY - canvasRect.y) / canvasRect.height * this._canvas.height
		);
	}

	onDidCanvasDown = (e) => {
		EventHelper.stop(e);
		this._downTime = Date.now();

		this._startPos = this.getCanvasMousePos(e);
		const selected = this.processorService.selected
		this._downGizmo = selected && selected.overHGizmo(this._startPos);

		if (selected) {
			this._canvas.addEventListener(EventType.MOVE, this.onDidCanvasMove);
		}
	}

	onDidCanvasMove = (e) => {
		const nPos = this.getCanvasMousePos(e);
		const d = new Vector2(nPos.x - this._startPos.x, nPos.y - this._startPos.y);

		const { selected } = this.processorService;
		if (this._downGizmo) {
			selected.setDimension(selected.rect.width + d.x, selected.rect.height + d.y);
		} else if (selected) {
			selected.setPosition(selected.rect.x + d.x, selected.rect.y + d.y);
		}
		this._startPos = nPos;
	}

	onDidCanvasUp = (e) => {
		EventHelper.stop(e);
		this._canvas.removeEventListener(EventType.MOVE, this.onDidCanvasMove);

		if (Date.now() - this._downTime <= 325) {
			this.checkSelect(e);
		} else {
			this._downGizmo = false;
		}
	}

	checkSelect = (e) => {
		var pos = this.getCanvasMousePos(e);
		let matchSource: Source = null;
		for (let i = 0; i < this._sources.length; i++) {
			if (pos.isInside(this._sources[i].rect)) {
				matchSource = this._sources[i];
				break;
			}
		}

		this.processorService.setSelection(matchSource);
	}

	refresh(items: source[]) {
		this._sources = items;
	}

	sizeDidChange(size) {
		this._size = size;
	}

	onDidSelect(selected: Source) { }

	public process() {
		this.ensureSize();


		this._ctx.clearRect(0, 0, this._size.width, this._size.height);
		for (let i = 0; i < this._sources.length; i++) {
			this._sources[i].drawIn(this._ctx, this._overlayCtx);
		}
	}

	ensureSize() {
		this._canvas.width = this._overlayCanvas.width = this._size.width;
		this._canvas.height = this._overlayCanvas.height = this._size.height;
		this._canvas.style.height = this._overlayCanvas.style.height = `${this._size.height / this._size.width * this.canvas.clientWidth}px`;
	}
}