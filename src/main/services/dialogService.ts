import { dialog, ipcMain, OpenDialogSyncOptions, SaveDialogOptions } from 'electron';
import { ProxyService } from '../../commun/ipc/proxy';
import { createDecorator } from '../../commun/decorators';
import { OpenDialogOptions } from '../../types/services/dialog';

export interface IDialogService {
	showOpenDialog(options: OpenDialogOptions): Promise<string | string[]>;
	showSaveDialog(options: Electron.SaveDialogOptions): Promise<string>;
}


export const IDialogService = createDecorator<IDialogService>('mainDialogService');
class DialogService implements IDialogService {
	static get channel(): string { return "mainDialog"; }

	constructor() {
		ProxyService.asMainService(this, DialogService.channel);
	}

	showOpenDialog = async (options: OpenDialogOptions) => {
		const electronOptions: OpenDialogSyncOptions = {
			title: options.title,
			buttonLabel: options.openLabel,
			filters: options.filters,
			properties: []
		}

		electronOptions.properties.push('createDirectory');
		if (options.canSelectFiles) electronOptions.properties.push('openFile');
		if (options.canSelectFolder) electronOptions.properties.push('openDirectory');
		if (options.canSelectMany) electronOptions.properties.push('multiSelections');

		var result = await dialog.showOpenDialog(void 0, options)
		if (!result.canceled) {
			if (result.filePaths.length > 0 && options.canSelectMany) {
				return result.filePaths;
			}

			return result.filePaths[0];
		}

		return Promise.reject('No file(s) selected');
	}

	showSaveDialog = async (options: Electron.SaveDialogOptions) => {
		var result = await dialog.showSaveDialog(void 0, options);
		if (!result.canceled)
			return result.filePath;

		return void 0;
	}
}

export default DialogService;