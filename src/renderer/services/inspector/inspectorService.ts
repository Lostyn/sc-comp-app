import { createDecorator } from '../../../commun/services/decorators';
import { registerSingleton } from '../../../commun/services/registry';
import { IService } from '../../../commun/services/services';
import Source from '../../internal/source';

export interface IInspectorView {
	refresh(items: Source[]);
}

export const IInspectorService = createDecorator<IInspectorService>('inspectorService');
export interface IInspectorService extends IService {
	addSource(source: Source): void;
	registerView(view: IInspectorView): void;
}

export default class InspectorService implements IInspectorService {
	_servicebrand: undefined;

	private _views: IInspectorView[];
	private _sources: Source[];

	constructor() {
		this._views = [];
		this._sources = [];
	}

	registerView(view: IInspectorView): void {
		this._views.push(view);
	}

	addSource(source: Source): void {
		this._sources.push(source);
		this._views.forEach(view => {
			view.refresh(this._sources);
		})
	}
}

registerSingleton(IInspectorService, InspectorService);