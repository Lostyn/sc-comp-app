import { ProxyService } from '../commun/services/proxy';
import { ServiceCollection } from '../commun/services/serviceCollection';
import DialogService, { IDialogService } from '../main/services/dialogService';
import MainCaptureService, { IMainCaptureService } from '../main/services/mainCaptureService';
import MainWindowService, { IMainWindowService } from '../main/services/windowService';
import { domContentLoaded } from './base/core/dom';
import Workbench from './workbench/workbench';

class DesktopMain {
	async open() {
		const [services] = await Promise.all([this.initServices(), domContentLoaded()]);

		const workbench = new Workbench(document.body, services.serviceCollection);

		const instantiationService = workbench.startup();

		// instantiationService.invokeFunction(accessor => {
		// 	const stateService = accessor.get(IStateService);
		// 	stateService.dispatch(increment(2));
		// })
	}

	private async initServices(): Promise<{ serviceCollection: ServiceCollection }> {
		const serviceCollection = new ServiceCollection();

		// Service from main process
		const mainWindowService = ProxyService.fromMainService<IMainWindowService>(MainWindowService.channel);
		serviceCollection.set(IMainWindowService, mainWindowService);

		const mainCaptureService = ProxyService.fromMainService<IMainCaptureService>(MainCaptureService.channel);
		serviceCollection.set(IMainCaptureService, mainCaptureService);

		const mainDialogService = ProxyService.fromMainService<IDialogService>(DialogService.channel);
		serviceCollection.set(IDialogService, mainDialogService);

		return { serviceCollection };
	}
}

new DesktopMain().open();