import { IMainCaptureService } from '../../../../main/services/mainCaptureService';
import { $, append } from '../../../base/core/dom';
import { Button } from '../../../base/ui/button/button';
import Source from '../../../internal/source';
import { IInspectorService, IInspectorView } from '../../../services/inspector/inspectorService';
import { Parts } from '../../../services/layout/layout';
import SourcePreview from '../../components/sourcePreview/sourcePreview';
import SourceSelector from '../../components/sourceSelector/sourceSelector';
import { ContentAreaPartOption, Part } from '../Part';
import SourceView from '../../components/sourceView/sourceView';

export default class InspectorPart extends Part implements IInspectorView {
	private _sourceSelector: SourceSelector;
	private _sources: SourceView[];

	constructor(
		@IInspectorService private readonly inspectorService: IInspectorService,
		@IMainCaptureService private readonly captureService: IMainCaptureService
	) {
		super(Parts.INSPECTOR_PART);

		this.inspectorService.registerView(this);
		this._sources = [];
	}

	override createContentArea(parent: HTMLElement, options: ContentAreaPartOption): HTMLElement {
		this.element = parent;

		this._sourceSelector = new SourceSelector(options.context);
		this._sourceSelector.onDidSelect(this.onDidSelectPreview);

		this.renderTitle(parent, 'Inspector');
		return this.element;
	}

	renderTitle(container: HTMLElement, title: string) {
		const titleContainer = append(container, $('.title-label'));
		const titleLabel = append(titleContainer, $('h2'));
		titleLabel.innerHTML = title;

		const options = append(titleContainer, $('.options'));
		const addButton = new Button(options);
		addButton.label = "Add source";
		addButton.onDidClick = this.onDidAdd;
	}

	onDidAdd = async () => {
		var sources = await this.captureService.getSource();
		this._sourceSelector.display(sources);
	}

	private onDidSelectPreview = async (preview: SourcePreview) => {
		this.inspectorService.addSource(new Source(preview.source));
	}

	refresh(items: Source[]) {
		this._sources.forEach(source => {
			source.dispose();
		});
		this._sources = [];


		items.forEach(item => {
			this._sources.push(new SourceView(this.element, item));
		})
	}
}