export const EventType = {
	CLICK: 'click',
	DOWN: 'mousedown',
	UP: 'mouseup',
	MOVE: 'mousemove',
	RESIZE: 'resize',

	LOADED_DATA: 'loadeddata',
	TIME_UPDATE: 'timeupdate',

	DOM_INSERT: 'DOMNodeInserted'
}


export interface Callback<T> {
	(value: T): void
}

export interface Event<T> {
	(listener: (e: T) => any, thisArgs?: any): void;
}

export interface EventLike {
	preventDefault(): void;
	stopPropagation(): void;
}

export const EventHelper = {
	stop: (e: EventLike, cancelBubble?: boolean) => {
		e.preventDefault();

		if (cancelBubble) {
			e.stopPropagation();
		}
	}
}

export class Emitter<T> {
	private _event?: Event<T>;
	protected _listeners?: Callback<T>[];

	constructor() { }

	/**
	 * For the public to allow to subscribe
	 * to event form this Emitter
	 * myevent.event(listener);
	 */
	get event(): Event<T> {
		if (!this._event) {
			this._event = (listener: Callback<T>) => {
				if (!this._listeners) {
					this._listeners = [];
				}

				const index = this._listeners.length;
				this._listeners.push(listener);
				return () => {
					this._listeners.splice(index, 1);
				}
			}
		}

		return this._event;
	}

	/**
	 * to be kept private to fire an event to
	 * subscribers
	 */
	fire(event: T): void {
		if (this._listeners) {
			for (let listener of this._listeners) {
				listener(event);
			}
		}
	}

	dispose() {
		this._listeners = [];
	}
}