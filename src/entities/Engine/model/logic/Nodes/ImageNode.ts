import { Rect } from '../Geometry/Rect'

export class ImageNode extends Rect {
	id: string

	constructor(canvas: HTMLCanvasElement, id: string) {
		super(canvas)
		this.id = id
	}
}
