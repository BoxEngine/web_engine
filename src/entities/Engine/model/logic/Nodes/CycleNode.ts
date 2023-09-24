import { Circle } from '../Geometry/Circle'

export class CycleNode extends Circle {
	id: string

	constructor(canvas: HTMLCanvasElement, id: string) {
		super(canvas)
		this.id = id
	}
}
