import { Part } from '../Part';
import { $, append } from '../../../base/core/dom';
import Processor from '../../../internal/processor';
import { ILayoutService, Parts } from '../../../services/layout/layout';
import { IInstantiationService } from '../../../services/instantiation/instantiationService';
import { Dropdown, IDropdownChoice } from '../../../base/ui/dropdown/dropdown';
import { IProcessingService, IProcessingView } from '../../../services/processor/processorService';
import source from '../../../internal/source';

export default class PlayerPart extends Part implements IProcessingView {
	video: HTMLVideoElement;
	processor: Processor;

	constructor(
		@ILayoutService layoutService: ILayoutService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IProcessingService private readonly processorService: IProcessingService
	) {
		super(Parts.PLAYER_PART);
		processorService.registerView(this);
	}

	refresh(items: source[]) { }
	onDidSelect(selected: source) { }
	sizeDidChange(size: { width: number; height: number; }) {
		this.video.style.height = `${size.height / size.width * this.video.clientWidth}px`;
	}

	override createContentArea(parent: HTMLElement, options?: object): HTMLElement {
		this.element = parent;
		this.processor = this.instantiationService.createInstance(Processor);

		this.createContent();

		window.requestAnimationFrame(this.process);
		return this.element;
	}

	private createContent() {
		const choices = [
			['480p', 720, 480],
			['720p', 1080, 720],
			['1080p', 1920, 1080],
			['4K', 3840, 2160]
		].map(o => ({ label: o[0], action: () => this.processorService.setSize(o[1] as number, o[2] as number) }))
		const sizeChoice = new Dropdown(this.element, { choices: choices as IDropdownChoice[] });

		const owner = append(this.element, $('div.viewport'));
		append(owner, this.processor.canvas);
		append(owner, this.processor.overlay);

		this.video = append(owner, $('video.video2')) as HTMLVideoElement;
		this.video.srcObject = this.processor.stream;
		this.video.onloadedmetadata = (e) => {
			this.sizeDidChange(this.processorService.size);
			this.video.play()
		};
	}

	private process = () => {
		window.requestAnimationFrame(this.process);
		this.processor.process();
	}
}