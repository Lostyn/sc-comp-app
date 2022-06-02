import { ipcMain, ipcRenderer } from 'electron';

/**
 * This methods are used to define MainService which are design to be called
 * from the render process.
 * Magic use Proxy to expose ipc call as native classe function
 */
export namespace ProxyService {

	/**
	 * Call from the renderer process to isntantiate a proxy expose as service class
	 * ex: const serviceInRenderer = serviceProxy<IMainCaptureService>(MainCaptureService.channel);
	 * 		IMainCaptureService is a service intantiate in the main process
	 * next you can call in the renderer process
	 * 		await serviceInRenderer.foo();
	 *
	 * @param channel ipc channel to use
	 * @returns a proxy as T
	 */
	export function fromMainService<T>(channel: string): T {
		return new Proxy({}, {
			get(_target: T, propKey: PropertyKey) {
				return async function (...args: any[]) {
					const result = await ipcRenderer.invoke(channel, [propKey, ...args]);
					if (result != undefined)
						return result;
					return void 0;
				};
			}
		}) as T;
	}

	/**
	 * Call from the contructor of a main process service to connect to the ipc channel
	 * function of the service will be call from the renderer process
	 * Used to be call in the contructor function
	 * 	connectProxy(this, "fooChannel");
	 * @param service instance of the service
	 * @param channel ipc channel to use
	 */
	export function asMainService(service: any, channel: string) {

		const call = async (e, args) => {
			const fn = args.splice(0, 1)[0];
			if (service[fn] != null) {
				if (typeof service[fn] === 'function') {
					return service[fn](...args);
				}
				return service[fn];
			}
		};

		ipcMain.handle(channel, call);
	}
}