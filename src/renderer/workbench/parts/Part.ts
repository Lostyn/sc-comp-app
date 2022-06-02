import { ILayoutService } from '../../interfaces/services/layout';

export abstract class Part {

	private parent: HTMLElement | undefined;
	private titleArea: HTMLElement | undefined;
	private contentArea: HTMLElement | undefined;

	element!: HTMLElement;

	constructor(
		private readonly id: string,
		layoutService: ILayoutService
	) {
		layoutService.registerPart(this);
	}

	getId(): string { return this.id; }

	/**
	 * Note: Clients should not call this method, the workbench calls this
	 * method.
	 *
	 * Called to create title and content area of the part.
	 */
	create(parent: HTMLElement): void {
		this.parent = parent;
		this.titleArea = this.createTitleArea(parent);
		this.contentArea = this.createContentArea(parent);
	}

	/**
	 * Returns the overall part container.
	 */
	getContainer(): HTMLElement | undefined {
		return this.parent;
	}

	/**
	 * Subclasses override to provide a title area implementation.
	 */
	protected createTitleArea(parent: HTMLElement): HTMLElement | undefined {
		return undefined;
	}

	/**
	 * Returns the title area container.
	 */
	protected getTitleArea(): HTMLElement | undefined {
		return this.titleArea;
	}

	/**
	 * Subclasses override to provide a content area implementation.
	 */
	protected createContentArea(parent: HTMLElement, options?: object): HTMLElement | undefined {
		return undefined;
	}

	/**
	 * Returns the content area container.
	 */
	protected getContentArea(): HTMLElement | undefined {
		return this.contentArea;
	}
}