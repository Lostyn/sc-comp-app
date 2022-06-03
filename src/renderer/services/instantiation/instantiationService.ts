import { createDecorator } from '../../../commun/services/decorators';
import { SyncDescriptor } from '../../../commun/services/descriptors';
import { Graph } from '../../../commun/services/graph';
import { _util } from '../../../commun/services/instantiation';
import { ServiceCollection } from '../../../commun/services/serviceCollection';
import { IService, ServiceIdentifier, ServicesAccessor } from '../../../commun/services/services';


class CyclicDependencyError extends Error {
	constructor(graph: Graph<any>) {
		super('cyclic dependency between services');
		this.message = graph.findCycleSlow() ?? `UNABLE to detect cycle, dumping graph: \n${graph.toString()}`;
	}
}

export const IInstantiationService = createDecorator<IInstantiationService>('instantiationService');
export interface IInstantiationService extends IService {
	invokeFunction<R, TS extends any[] = []>(fn: (accessor: ServicesAccessor, ...args: TS) => R, ...args: TS): R;

	createInstance<Ctor extends new (...args: any[]) => any>(t: Ctor, ...args: any[]): any;
}

export class InstantiationService implements IInstantiationService {
	_servicebrand: undefined;

	private readonly _services: ServiceCollection;

	constructor(services: ServiceCollection = new ServiceCollection()) {
		this._services = services;
		this._services.set(IInstantiationService, this);
	}

	invokeFunction<R, TS extends any[] = []>(fn: (accessor: ServicesAccessor, ...args: TS) => R, ...args: TS): R {
		const accessor: ServicesAccessor = {
			get: <T>(id: ServiceIdentifier<T>) => {
				const result = this._getOrCreateServiceInstance(id);

				if (!result) {
					throw new Error(`[invokeFunction] unknown service '${id}'`);
				}
				return result;
			}
		};
		return fn(accessor, ...args);
	}

	createInstance(ctor: any, ...rest: any[]): any {
		let result: any = this._createInstance(ctor, rest);
		return result;
	}

	private _createInstance<T>(ctor: any, args: any[] = []): T {
		// arguments defined by service decorators
		let serviceDependencies = _util.getServiceDependencies(ctor).sort((a, b) => a.index - b.index);
		let serviceArgs: any[] = [];
		for (const dependency of serviceDependencies) {
			let service = this._getOrCreateServiceInstance(dependency.id);
			if (!service && !dependency.optional) {
				throw new Error(`[createInstance] ${ctor.name} depends on UNKNOWN service ${dependency.id}.`);
			}
			serviceArgs.push(service);
		}

		let firstServiceArgPos = serviceDependencies.length > 0 ? serviceDependencies[0].index : args.length;

		// check for argument mismatches, adjjust static args if needed
		if (args.length !== firstServiceArgPos) {
			console.warn(`[createInstance] First service dependency of ${ctor.name} at position ${firstServiceArgPos + 1} conflicts with ${args.length} static arguments`);

			let delta = firstServiceArgPos - args.length;
			if (delta > 0) {
				args = args.concat(new Array(delta));
			} else {
				args = args.slice(0, firstServiceArgPos);
			}
		}

		// now create the instance
		return <T>new ctor(...[...args, ...serviceArgs]);
	}

	private _setServiceInstance<T>(id: ServiceIdentifier<T>, instance: T): void {
		if (this._services.get(id) instanceof SyncDescriptor) {
			this._services.set(id, instance);
		} else {
			throw new Error('illegalState - setting UNKNOWN service instance');
		}
	}

	private _getServiceInstanceOrDescriptor<T>(id: ServiceIdentifier<T>): T | SyncDescriptor<T> {
		let instanceOrDesc = this._services.get<T>(id);
		return instanceOrDesc;
	}

	private _getOrCreateServiceInstance<T>(id: ServiceIdentifier<T>): T {
		let thing = this._getServiceInstanceOrDescriptor(id);
		if (thing instanceof SyncDescriptor) {
			return this._createAndCacheServiceInstance(id, thing);
		}

		return thing;
	}

	private _createAndCacheServiceInstance<T>(id: ServiceIdentifier<T>, desc: SyncDescriptor<T>): T {
		type Double = { id: ServiceIdentifier<any>, desc: SyncDescriptor<any> };
		const graph = new Graph<Double>(data => data.id.toString());

		let cycleCount = 0;
		const stack = [{ id, desc }];
		while (stack.length) {
			const item = stack.pop();
			graph.lookupOrInsertNode(item);

			// a weak but working heuristic for cycle checks
			if (cycleCount++ > 1000) {
				throw new CyclicDependencyError(graph);
			}

			// check all dependencies for existence and if they need to be created first
			for (let dependency of _util.getServiceDependencies(item.desc.ctor)) {
				let instanceOrDesc = this._getServiceInstanceOrDescriptor(dependency.id);
				if (!instanceOrDesc && !dependency.optional) {
					console.warn(`[createInstance] ${id} depends on ${dependency.id} which is NOT registered.`);
				}

				if (instanceOrDesc instanceof SyncDescriptor) {
					const d = { id: dependency.id, desc: instanceOrDesc };
					graph.insertEdge(item, d);
					stack.push(d);
				}
			}
		}

		while (true) {
			const roots = graph.roots();

			// if there is no more roots but still
			// nodes in the graph we have a cycle
			if (roots.length === 0) {
				if (!graph.isEmpty()) {
					throw new CyclicDependencyError(graph);
				}
				break;
			}

			for (const { data } of roots) {
				// Repeat the check for this still being a service sync descriptor. That's because
				// instantiating a dependency might have side-effect and recursively trigger instantiation
				// so that some dependencies are now fullfilled already.
				const instanceOrDesc = this._getServiceInstanceOrDescriptor(data.id);
				if (instanceOrDesc instanceof SyncDescriptor) {
					// create instance and overwrite the service collections
					const instance = this._createServiceInstance(data.desc.ctor, data.desc.staticArguments);
					this._setServiceInstance(data.id, instance);
				}
				graph.removeNode(data);
			}
		}
		return <T>this._getServiceInstanceOrDescriptor(id);
	}

	private _createServiceInstance<T>(ctor: any, args: any[] = []): T {
		return this._createInstance(ctor, args);
	}
}