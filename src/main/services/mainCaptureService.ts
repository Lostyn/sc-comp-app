import { desktopCapturer, DesktopCapturerSource } from 'electron';
import { ProxyService } from '../../commun/ipc/proxy';
import { createDecorator } from '../../commun/decorators';

export interface IMainCaptureService {
	getSource(): Promise<DesktopCapturerSource[]>;
}

export const IMainCaptureService = createDecorator<IMainCaptureService>('mainCaptureService');
class MainCaptureService implements IMainCaptureService {
	static get channel(): string { return "capture"; }

	constructor() {
		ProxyService.asMainService(this, MainCaptureService.channel);
	}

	async getSource() {
		return await desktopCapturer.getSources({ types: ['window', 'screen'] });
	}
}

export default MainCaptureService;