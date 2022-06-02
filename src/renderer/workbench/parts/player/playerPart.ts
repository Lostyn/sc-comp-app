import { ILayoutService } from '../../../interfaces/services/layout';
import { Parts } from '../../layout';
import { Part } from '../Part';
import { $, append } from '../../../base/core/dom';
import { IShortcutService } from '../../../services/shortcut/shortcutService';
import { IInstantiationService } from '../../../interfaces/services/instantiation';
import { Button } from '../../../base/ui/button/button';
import { IMainCaptureService } from '../../../../main/services/mainCaptureService';
import SourcePreview from '../../components/sourcePreview/sourcePreview';
import SourceSelector from '../../components/sourceSelector/sourceSelector';
import { IDialogService } from '../../../../main/services/dialogService';
import Processor from '../../../internal/processor';

export default class PlayerPart extends Part {
	sourceSelector: SourceSelector;

	video: HTMLVideoElement;
	video2: HTMLVideoElement;
	processor: Processor;

	constructor(
		@ILayoutService layoutService: ILayoutService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IDialogService private readonly dialogService: IDialogService,
		@IShortcutService private readonly shortcutService: IShortcutService,
		@IMainCaptureService private readonly captureService: IMainCaptureService
	) {
		super(Parts.PLAYER_PART, layoutService);
	}

	override createContentArea(parent: HTMLElement, options?: object): HTMLElement {
		this.element = parent;
		this.processor = new Processor();

		this.createContent();
		window.requestAnimationFrame(this.process);
		return this.element;
	}

	private createContent() {
		const btn = new Button(this.element);
		btn.label = "open";
		btn.onDidClick = this.onDidClick;

		this.sourceSelector = new SourceSelector(this.element);
		this.sourceSelector.onDidSelect(this.onDidSelectPreview);

		const owner = append(this.element, $('div.viewport'));
		this.video = $('video.video') as HTMLVideoElement;
		append(owner, this.processor.canvas);
		this.video2 = append(owner, $('video.video2')) as HTMLVideoElement;
		this.video2.srcObject = this.processor.stream;
		this.video2.onloadedmetadata = (e) => {
			this.video2.play()
		};
	}

	private onDidClick = async () => {
		var sources = await this.captureService.getSource();
		this.sourceSelector.display(sources);
	}

	private onDidSelectPreview = async (preview: SourcePreview) => {
		try {
			const constraints = {
				audio: false,
				video: {
					cursor: 'always',
					mandatory: {
						chromeMediaSource: 'desktop',
						chromeMediaSourceId: preview.source.id
					}
				}
			};

			const stream = await navigator.mediaDevices
				.getUserMedia(constraints as any);

			this.video.srcObject = stream;
			this.video.onloadedmetadata = (e) => {
				this.video.play()
			};
		} catch (err) {
			console.error(err);
		}
	}

	private process = () => {
		window.requestAnimationFrame(this.process);

		if (this.video.srcObject != null) {
			this.processor.process(this.video);
		}
	}
}