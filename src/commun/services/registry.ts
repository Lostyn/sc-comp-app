
import { SyncDescriptor } from './descriptors';
import { IService, ServiceIdentifier } from './services';

const _registry: [ServiceIdentifier<any>, SyncDescriptor<any>][] = [];

export function registerSingleton<T, Services extends IService[]>(id: ServiceIdentifier<T>, ctor: new (...services: Services) => T): void;
export function registerSingleton<T, Services extends IService[]>(id: ServiceIdentifier<T>, ctorOrDescriptor: { new(...services: Services): T } | SyncDescriptor<any>): void {
	if (!(ctorOrDescriptor instanceof SyncDescriptor)) {
		ctorOrDescriptor = new SyncDescriptor<T>(ctorOrDescriptor as new (...args: any[]) => T, []);
	}

	_registry.push([id, ctorOrDescriptor]);
}

export function getSingletinServiceDescriptors() {
	return _registry;
}