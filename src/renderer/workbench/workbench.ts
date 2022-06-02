import { IMainWindowService } from '../../main/services/windowService';
import { IInstantiationService, ServicesAccessor } from '../interfaces/services/instantiation';
import { ILayoutService } from '../interfaces/services/layout';
import { IService } from '../interfaces/services/services';
import { InstantiationService } from '../services/instantiation/instantiationService';
import { getSingletinServiceDescriptors, registerSingleton } from '../services/registry';
import { ServiceCollection } from '../services/serviceCollection';
import { Layout, Parts } from './layout';
import PlayerPart from './parts/player/playerPart';
import TitlebarPart from './parts/titlebar/titlebarPart';

// registerSingleton(ITitleService, TitlebarPart);

export default class Workbench extends Layout {

	readonly container = document.createElement('div');

	private playerPart!: PlayerPart;

	constructor(
		parent: HTMLElement,
		private readonly serviceCollection: ServiceCollection
	) {
		super(parent);
	}

	startup(): IInstantiationService {
		const instiatiationService = this.initServices(this.serviceCollection);

		console.log('startup');

		// Create parts
		this.playerPart = instiatiationService.createInstance(PlayerPart);

		instiatiationService.invokeFunction(accessor => {


		});

		this.initLayout(instiatiationService);
		this.renderWorkbench();

		return instiatiationService;
	}

	private initServices(serviceCollection: ServiceCollection): IInstantiationService {
		serviceCollection.set(ILayoutService, this);

		const registeredServices = getSingletinServiceDescriptors();
		for (let [id, descriptor] of registeredServices) {
			serviceCollection.set(id, descriptor);
		}

		const instantiationService = new InstantiationService(serviceCollection);
		return instantiationService;
	}

	private initLayout(instiatiationService: IInstantiationService) {

		this.registerPart(instiatiationService.createInstance(TitlebarPart))

	}

	private renderWorkbench() {
		[
			{ id: Parts.TITLEBAR_PART, classes: ['titlebar'] },
			{ id: Parts.PLAYER_PART, classes: ['player'] }
		].forEach(({ id, classes }) => {
			const partContainer = this.createPart(id, classes);
			this.getPart(id).create(partContainer);
			this.container.append(this.getPart(id).element);
		});

		this.container.id = 'workbench';

		// Add Workbench to DOM
		this.parent.appendChild(this.container);
	}

	private createPart(id: string, classes: string[]): HTMLElement {
		const part = document.createElement('div');
		part.classList.add('part', ...classes);
		part.id = id;
		return part;
	}
}