import { getSingletinServiceDescriptors } from '../../commun/services/registry';
import { ServiceCollection } from '../../commun/services/serviceCollection';
import { $, append } from '../base/core/dom';
import { IInstantiationService, InstantiationService } from '../services/instantiation/instantiationService';
import { ILayoutService, Layout } from '../services/layout/layout';
import InspectorPart from './parts/inspector/inspectorPart';
import { Part } from './parts/Part';
import PlayerPart from './parts/player/playerPart';
import TitlebarPart from './parts/titlebar/titlebarPart';


export default class Workbench extends Layout {

	private _container;

	constructor(
		parent: HTMLElement,
		private readonly serviceCollection: ServiceCollection
	) {
		super(parent);

		this._container = append(parent, $('div#workbench'));
	}

	startup(): IInstantiationService {
		console.log('startup');

		const instiatiationService = this.initServices(this.serviceCollection);

		this.initLayout(instiatiationService);

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
		[
			{ partClass: TitlebarPart, classes: ['titlebar'] },
			{ partClass: InspectorPart, classes: ['inspector'] },
			{ partClass: PlayerPart, classes: ['player'] }
		].forEach(({ partClass, classes }) => {
			const container = this.createPart(classes);
			const part = instiatiationService.createInstance(partClass) as Part;

			part.create(container, {
				context: this._container
			});
			this.registerPart(part);
			this._container.append(container)
		})
	}


	private createPart(classes: string[]): HTMLElement {
		const part = document.createElement('div');
		part.classList.add('part', ...classes);
		return part;
	}
}