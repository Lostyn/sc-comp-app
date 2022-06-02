import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { ProxyService } from '../../commun/ipc/proxy';
import { createDecorator } from '../../commun/decorators';
import createWindow from '../windows';

export interface IMainWindowService {
	createWindow(options: BrowserWindowConstructorOptions): BrowserWindow;
	minimize();
	maximize();
	unmaximize();
	close();
	isMaximized(): Promise<boolean>;
}

export const IMainWindowService = createDecorator<IMainWindowService>('mainWindowService');
class MainWindowService implements IMainWindowService {
	static get channel(): string { return "mainWindow"; }

	private window: BrowserWindow;

	constructor() {
		ProxyService.asMainService(this, MainWindowService.channel);
	}

	createWindow(options: BrowserWindowConstructorOptions = {}) {
		this.window = createWindow('mainWindow', options);
		return this.window;
	}

	minimize = () => {
		this.window?.minimize();
	}

	maximize = () => {
		this.window?.maximize();
	}

	unmaximize = () => {
		this.window?.unmaximize();
	}

	close = () => {
		this.window?.close();
	}

	isMaximized = async (): Promise<boolean> => {
		return this.window?.isMaximized()
	}
}

export default MainWindowService;