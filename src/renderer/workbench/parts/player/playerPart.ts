import { Part } from '../Part';
import { $, append } from '../../../base/core/dom';
import { IShortcutService } from '../../../services/shortcut/shortcutService';
import { Button } from '../../../base/ui/button/button';
import { IMainCaptureService } from '../../../../main/services/mainCaptureService';
import SourcePreview from '../../components/sourcePreview/sourcePreview';
import SourceSelector from '../../components/sourceSelector/sourceSelector';
import { IDialogService } from '../../../../main/services/dialogService';
import Processor from '../../../internal/processor';
import { ILayoutService, Parts } from '../../../services/layout/layout';
import { IInstantiationService } from '../../../services/instantiation/instantiationService';

export default class PlayerPart extends Part {
	video: HTMLVideoElement;
	processor: Processor;

	constructor(
		@ILayoutService layoutService: ILayoutService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IDialogService private readonly dialogService: IDialogService,
		@IShortcutService private readonly shortcutService: IShortcutService,
		@IMainCaptureService private readonly captureService: IMainCaptureService
	) {
		super(Parts.PLAYER_PART);
	}

	override createContentArea(parent: HTMLElement, options?: object): HTMLElement {
		this.element = parent;
		this.processor = this.instantiationService.createInstance(Processor);

		this.createContent();
		window.requestAnimationFrame(this.process);
		return this.element;
	}

	private createContent() {
		const owner = append(this.element, $('div.viewport'));
		append(owner, this.processor.canvas);

		this.video = append(owner, $('video.video2')) as HTMLVideoElement;
		this.video.srcObject = this.processor.stream;
		this.video.onloadedmetadata = (e) => {
			this.video.play()
		};
	}

	private process = () => {
		window.requestAnimationFrame(this.process);

		this.processor.process();
	}
}