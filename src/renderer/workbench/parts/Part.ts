import { ILayoutService } from '../../services/layout/layout';

export interface ContentAreaPartOption {
	context?: HTMLElement
}

export abstract class Part {

	private parent: HTMLElement | undefined;
	private contentArea: HTMLElement | undefined;

	element!: HTMLElement;

	constructor(
		private readonly id: string
	) {
	}

	getId(): string { return this.id; }

	/**
	 * Note: Clients should not call this method, the workbench calls this
	 * method.
	 *
	 * Called to create title and content area of the part.
	 */
	create(parent: HTMLElement, options?: ContentAreaPartOption): void {
		this.parent = parent;
		this.contentArea = this.createContentArea(parent, options);
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