import { desktopCapturer, DesktopCapturerSource } from 'electron';
import { createDecorator } from '../../commun/services/decorators';
import { ProxyService } from '../../commun/services/proxy';

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