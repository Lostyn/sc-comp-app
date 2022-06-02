export class SyncDescriptor<T> {
	readonly ctor: any;
	readonly staticArguments: any[];

	constructor(ctor: new (...args: any[]) => T, staticArguments: any[] = []) {
		this.ctor = ctor;
		this.staticArguments = staticArguments;
	}
}