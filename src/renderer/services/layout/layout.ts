import { createDecorator } from '../../../commun/services/decorators';
import { IService } from '../../../commun/services/services';
import { Part } from '../../workbench/parts/Part';

export const ILayoutService = createDecorator<ILayoutService>('layoutService');
export interface ILayoutService extends IService {

	registerPart(part: Part): void;
	getPart(key: Parts): Part;
}

export enum Parts {
	TITLEBAR_PART = 'workbench.parts.titlebar',
	PLAYER_PART = 'workbench.parts.player',
	INSPECTOR_PART = 'workbench.parts.inspector'
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