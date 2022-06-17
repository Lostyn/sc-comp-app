import { createDecorator } from '../../../commun/services/decorators';
import { registerSingleton } from '../../../commun/services/registry';
import { IService } from '../../../commun/services/services';
import Source from '../../internal/source';

export interface IProcessingView {
	refresh(items: Source[]);
	sizeDidChange(size: { width: number, height: number });
	onDidSelect(selected: Source);
}

export const IProcessingService = createDecorator<IProcessingService>('inspectorService');
export interface IProcessingService extends IService {
	addSource(source: Source): void;
	registerView(view: IProcessingView): void;
	setSize(width: number, height: number): void;
	setSelection(selected: Source): void;
	get size();
	get selected(): Source;
}

export default class ProcessingService implements IProcessingService {
	_servicebrand: undefined;

	private _views: IProcessingView[];
	private _sources: Source[];
	private _selectedSource: Source;
	public get selected(): Source { return this._selectedSource; }
	private _size: { width: number, height: number }
	public get size() { return this._size; }

	constructor() {
		this._views = [];
		this._sources = [];
		this._size = { width: 720, height: 480 };
	}



	registerView(view: IProcessingView): void {
		this._views.push(view);
	}

	setSize(width: number, height: number) {
		this._size = { width, height };
		this._views.forEach(view => view.sizeDidChange(this._size));
	}

	setSelection(selected: Source) {
		if (this._selectedSource != null) {
			this._selectedSource.selected = false;
		}
		if (selected != null)
			selected.selected = true;

		this._selectedSource = selected;
		this._views.forEach(view => view.onDidSelect(this._selectedSource));
	}

	addSource(source: Source): void {
		source.initWidth(this._size.width);
		this._sources.push(source);
		this._views.forEach(view => view.refresh(this._sources));
	}
}

registerSingleton(IProcessingService, ProcessingService);