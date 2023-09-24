import { Triangle } from '../Geometry/Triangle'

export class IfElseNode extends Triangle {
	id: string

	constructor(canvas: HTMLCanvasElement, id: string) {
		super(canvas, 'up')
		this.id = id
	}
}
