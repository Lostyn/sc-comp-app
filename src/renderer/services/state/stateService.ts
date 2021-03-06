import { createDecorator } from '../../../commun/services/decorators';
import { registerSingleton } from '../../../commun/services/registry';
import { IService } from '../../../commun/services/services';
import { _reduce } from './createReducer';

export const IStateService = createDecorator<IStateService<any>>('stateService');
export interface IStateService<T> extends IService {
	readonly state: T;

	dispatch(action: any);
	connect(callback: (state: T) => void): void;
}

export class AppStateService<T> implements IStateService<T> {

	state: T;

	_servicebrand: undefined;
	_event: { (state: T): void }[] = [];

	constructor() {
		this.state = _reduce.state as T;
	}

	dispatch(action: any) {
		this._event.forEach(
			event => event(this.state)
		);
	}

	connect = (callback: (state: T) => void): () => void => {
		this._event.push(callback);

		return () => {
			this._event = this._event.filter(o => o != callback);
		};
	}
}

registerSingleton(IStateService, AppStateService);
