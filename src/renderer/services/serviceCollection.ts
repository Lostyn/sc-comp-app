import { ServiceIdentifier } from '../interfaces/services/instantiation';
import { SyncDescriptor } from './descriptors';

export class ServiceCollection {
	private _entries = new Map<ServiceIdentifier<any>, any>();

	set<T>(id: ServiceIdentifier<T>, instanceOrDescriptor: T | SyncDescriptor<T>): T | SyncDescriptor<T> {
		const result = this._entries.get(id);
		this._entries.set(id, instanceOrDescriptor);
		return result;
	}

	has(id: ServiceIdentifier<any>): boolean {
		return this._entries.has(id);
	}

	get<T>(id: ServiceIdentifier<T>): T | SyncDescriptor<T> {
		return this._entries.get(id);
	}
}