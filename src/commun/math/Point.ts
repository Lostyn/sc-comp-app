import { SourceRect } from '../../renderer/internal/source';

export default class Point {

	constructor(
		public x: number,
		public y: number
	) { }

	isInside(rect: SourceRect) {
		return this.x >= rect.x && this.x <= rect.x + rect.width &&
			this.y >= rect.y && this.y <= rect.y + rect.width;
	}
}