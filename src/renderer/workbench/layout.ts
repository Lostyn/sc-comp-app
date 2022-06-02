import { ILayoutService } from '../interfaces/services/layout';
import { Part } from './parts/Part';

export enum Parts {
	TITLEBAR_PART = 'workbench.parts.titlebar',
	PLAYER_PART = 'workbench.parts.player'
}

export abstract class Layout implements ILayoutService {
	_servicebrand: undefined;

	protected readonly parts = new Map<string, Part>();

	constructor(
		protected readonly parent: HTMLElement
	) {

	}

	registerPart(part: Part): void {
		this.parts.set(part.getId(), part);
	}

	getPart(key: Parts): Part {
		const part = this.parts.get(key);
		if (!part) {
			throw new Error(`Unknow part ${key}`);
		}

		return part;
	}
}