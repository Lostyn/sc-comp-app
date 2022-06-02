import { $ } from '../base/core/dom';

export default class Processor {

	private _canvas: HTMLCanvasElement;
	get canvas() { return this._canvas };

	private _ctx: CanvasRenderingContext2D;
	get stream() { return this._canvas.captureStream(30) }

	constructor() {
		this._canvas = $('canvas') as HTMLCanvasElement;
		this._ctx = this._canvas.getContext('2d');
	}

	public process(video: HTMLVideoElement) {
		this._canvas.width = this._canvas.clientWidth;
		this._canvas.height = this._canvas.clientHeight;

		const ratio = this._canvas.width / video.videoWidth;
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this._ctx.drawImage(video, 0, 0, video.videoWidth * ratio, video.videoHeight * ratio);
	}
}