import { createDecorator } from '../../../commun/decorators';
import { IService } from './services';

export interface ServiceIdentifier<T> {
	(...args: any[]): void;
	type: T;
}

export interface ServicesAccessor {
	get<T>(id: ServiceIdentifier<T>): T;
}

export const IInstantiationService = createDecorator<IInstantiationService>('instantiationService');
export interface IInstantiationService extends IService {
	invokeFunction<R, TS extends any[] = []>(fn: (accessor: ServicesAccessor, ...args: TS) => R, ...args: TS): R;

	createInstance<Ctor extends new (...args: any[]) => any>(t: Ctor, ...args: any[]): any;
}