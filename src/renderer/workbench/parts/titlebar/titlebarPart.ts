import { IMainWindowService } from '../../../../main/services/windowService';
import { $, prepend, append, activeClass } from '../../../base/core/dom';
import { EventType } from '../../../base/core/event';
import { ILayoutService } from '../../../interfaces/services/layout';
import { IStateService } from '../../../services/state/stateService';
import { Parts } from '../../layout';
import { Part } from '../Part';

export default class TitlebarPart extends Part {

	protected title!: HTMLElement;
	protected appIcon: HTMLElement | undefined;
	protected windowControls: HTMLElement | undefined;

	protected minMaxBtn!: HTMLElement;

	constructor(
		@ILayoutService layoutService: ILayoutService,
		@IMainWindowService private readonly mainWindowService: IMainWindowService
	) {
		super(Parts.TITLEBAR_PART, layoutService);
	}

	override createContentArea(parent: HTMLElement, options?: object): HTMLElement {
		this.element = parent;

		// App Icon (Native Windows)
		this.appIcon = prepend(this.element, $('a.window-appicon'));

		// Title
		this.title = append(this.element, $('div.window-title'));

		this.windowControls = append(this.element, $('div.window-controls-container'));

		this.createWindowsControl();

		return this.element;
	}

	private createWindowsControl() {
		// Draggable region that we can manipulate for #52522
		prepend(this.element, $('div.titlebar-drag-region'));

		// Minimize
		const minimizeIcon = append(this.windowControls, $('div.window-icon.window-minimize'));
		minimizeIcon.addEventListener(EventType.CLICK, e => {
			this.mainWindowService.minimize();
		});

		// Restore
		this.minMaxBtn = append(this.windowControls, $('div.window-icon.window-max-restore'));
		this.minMaxBtn.addEventListener(EventType.CLICK, async e => {
			const maximized = await this.mainWindowService.isMaximized();
			this.updateMinMaxClass(maximized);
			if (maximized)
				return this.mainWindowService.unmaximize();

			return this.mainWindowService.maximize();
		});

		// Close
		const closeIcon = append(this.windowControls, $('div.window-icon.window-close'));
		closeIcon.addEventListener(EventType.CLICK, e => {
			this.mainWindowService.close();
		})


		window.addEventListener(EventType.RESIZE, () => this.updateMinMaxClass());
		this.updateMinMaxClass();
	}

	private async updateMinMaxClass(isMaximized?: boolean) {
		if (this.minMaxBtn) {
			const maximized = isMaximized ?? await this.mainWindowService.isMaximized();
			activeClass(this.minMaxBtn, "window-max-restore", maximized);
			activeClass(this.minMaxBtn, "window-maximize", !maximized);
		}
	}
}