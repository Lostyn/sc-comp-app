import { DesktopCapturerSource } from 'electron';
import { $ } from '../base/core/dom';

export interface SourceRect {
	x: number;
	y: number;
	width?: number;
	height?: number;
}

export default class Source {
	private _source: DesktopCapturerSource;
	private _video: HTMLVideoElement;
	private _rect: SourceRect;

	get graphics() { return this._video; }
	get sourceId() { return this._source.id; }
	get name() { return this._source.name; }
	get rect() { return this._rect }

	constructor(source: DesktopCapturerSource) {
		this._source = source;
		this._rect = { x: 0, y: 0 };

		this._video = $('video.video') as HTMLVideoElement;
		this.initializeStream();
	}

	initWidth(width: number) {
		this._rect.width = width;
	}

	async initializeStream() {
		try {
			const constraints = {
				audio: false,
				video: {
					cursor: 'always',
					mandatory: {
						chromeMediaSource: 'desktop',
						chromeMediaSourceId: this.sourceId
					}
				}
			};

			const stream = await navigator.mediaDevices
				.getUserMedia(constraints as any);

			this._video.srcObject = stream;
			this._video.onloadedmetadata = (e) => {
				if (this._rect.height === undefined) {
					this._rect.height = this._rect.width * (this._video.videoHeight / this._video.videoWidth);
				}
				this._video.play()
			};
		} catch (err) {
			console.log(`Enable to initialize source ${this.name}`)
			console.error(err);
		}
	}

	drawIn(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		if (this._rect.height) {
			context.drawImage(this.graphics, this._rect.x, this._rect.y, this._rect.width, this._rect.height);
		}
	}
}