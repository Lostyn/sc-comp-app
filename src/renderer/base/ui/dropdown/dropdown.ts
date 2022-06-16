import { $, activeClass, append } from '../../core/dom';
import { EventHelper, EventType } from '../../core/event';

export interface IDropdownChoice {
	label: string;
	action: () => void;
}

export interface IDropdownOptions {
	choices: IDropdownChoice[];
	current?: number;
}

export class Dropdown {
	private _element: HTMLElement;
	private _options: HTMLElement;
	private _title: HTMLElement;
	private _icon: HTMLElement;

	private _visible: boolean;

	set Visible(visible: boolean) {
		this._visible = visible;
		activeClass(this._element, 'open', visible);
	}

	setChoice = (choice: IDropdownChoice) => {
		this.setLabel(choice.label);
		choice.action();
		this.Visible = false;
	}

	setLabel(label: string) {
		this._title.innerHTML = label;
	}

	toggleVisible = (e) => {
		if (e.target != this._options && !this._options.contains(e.target)) {
			this.Visible = !this._visible;
		}
	}

	constructor(parent: HTMLElement, options: IDropdownOptions) {
		this._element = append(parent, $('div.dropdown'));
		this._element.addEventListener(EventType.CLICK, this.toggleVisible);

		this._title = append(this._element, $('span'));
		this._icon = append(this._element, $('span.icon-arrow-down'));

		this._options = append(this._element, $('div.options'));

		for (const choice of options.choices) {
			const c = append(this._options, $('.choice'));
			c.innerHTML = choice.label;
			c.addEventListener(EventType.CLICK, (e) => {
				this.setChoice(choice)
			});
		}

		if (options.current != undefined) {
			this.setLabel(options.choices[options.current].label);
		} else {
			this.setLabel(options.choices[0].label);
		}


	}
}