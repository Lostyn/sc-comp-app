import { createDecorator } from '../../../commun/decorators';
import { Parts } from '../../workbench/layout';
import { Part } from '../../workbench/parts/Part';
import { IService } from './services';

export const ILayoutService = createDecorator<ILayoutService>('layoutService');
export interface ILayoutService extends IService {

	registerPart(part: Part): void;
	getPart(key: Parts): Part;
}
