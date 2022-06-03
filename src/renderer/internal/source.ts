import { DesktopCapturerSource } from 'electron';
import { $ } from '../base/core/dom';

export default class Source {
	private _source: DesktopCapturerSource;
	private _video: HTMLVideoElement;

	get graphics() { return this._video; }
	get sourceId() { return this._source.id; }
	get name() { return this._source.name; }
	get width() { return this._video.videoWidth; }
	get height() { return this._video.videoHeight; }

	constructor(source: DesktopCapturerSource) {
		this._source = source;

		this._video = $('video.video') as HTMLVideoElement;
		this.initializeStream();
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
				this._video.play()
			};
		} catch (err) {
			console.log(`Enable to initialize source ${this.name}`)
			console.error(err);
		}
	}
}