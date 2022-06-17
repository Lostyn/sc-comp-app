import { SourceRect } from '../../renderer/internal/source';

export default class Vector2 {

	constructor(
		public x: number,
		public y: number
	) { }

	isInside(rect: SourceRect) {
		return this.x >= rect.x && this.x <= rect.x + rect.width &&
			this.y >= rect.y && this.y <= rect.y + rect.height;
	}

	static Distance(v1: Vector2, v2: Vector2): number {
		return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
	}

	static Add(v1: Vector2, v2: Vector2): Vector2 {
		return new Vector2(v1.x + v2.x, v1.y + v2.y);
	}
}