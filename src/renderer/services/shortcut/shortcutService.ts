import { ipcRenderer } from 'electron';
import { Callback } from '../../base/core/event';
import { IService } from '../../interfaces/services/services';
import { createDecorator } from '../../../commun/decorators';
import * as IPC from '../../../main/contansts/ipc';
import { registerSingleton } from '../registry';
import { Map } from '../../../types/type';

export const IShortcutService = createDecorator<IShortcutService>('shortcutService');
export interface IShortcutService extends IService {
	register(key: string, callback: Callback<void>): Function;
}

export class ShortcutService implements IShortcutService {
	_servicebrand: undefined;

	_entries: Map<Callback<void>>;

	constructor() {
		this._entries = {};
		ipcRenderer.on(IPC.SHORTCUT, this.onShurtcutIPC);
	}

	register(key: string, callback: Callback<void>): Function {
		if (this._entries[key] != undefined) return null;

		this._entries[key] = callback;
		return () => { delete (this._entries[key]) }
	}

	onShurtcutIPC = (event: any, ...args: any[]) => {
		const code = args[0];
		if (this._entries[code] != undefined) {
			this._entries[code]();
		}
	}
}

registerSingleton(IShortcutService, ShortcutService);