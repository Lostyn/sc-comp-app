export interface IService {
	readonly _servicebrand: undefined;
}

export interface ServiceIdentifier<T> {
	(...args: any[]): void;
	type: T;
}

export interface ServicesAccessor {
	get<T>(id: ServiceIdentifier<T>): T;
}