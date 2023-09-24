export class Zoom {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	translatePos: { x: number; y: number }

	scale = 1.0
	scaleMultiplier = 0.8
	startDragOffset: { x: number; y: number }
	mouseDown = false

	drawHandle: (scale: number, translatePos: { x: number; y: number }) => void

	constructor(
		canvas: HTMLCanvasElement,
		drawHandle: (scale: number, translatePos: { x: number; y: number }) => void,
	) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')!
		this.translatePos = { x: canvas.width / 2, y: canvas.height / 2 }
		this.startDragOffset = { x: 0, y: 0 }
		this.listen()
		this.drawHandle = drawHandle
	}

	incrementScale() {
		this.scale /= this.scaleMultiplier
		this.drawHandle(this.scale, this.translatePos)
	}

	decrementScale() {
		this.scale *= this.scaleMultiplier
		this.drawHandle(this.scale, this.translatePos)
	}

	listen() {
		this.canvas.onmousedown = null
		this.canvas.onmouseup = null
		this.canvas.onmousemove = null
		this.canvas.onmouseover = null
		this.canvas.onmouseout = null
	}

	onMouseDown(evt: MouseEvent) {
		this.mouseDown = true
		this.startDragOffset.x = evt.clientX - this.translatePos.x
		this.startDragOffset.y = evt.clientY - this.translatePos.y
	}

	onMouseUp() {
		this.mouseDown = false
	}

	onMouseMove(evt: MouseEvent) {
		if (this.mouseDown) {
			this.translatePos.x = evt.clientX - this.startDragOffset.x
			this.translatePos.y = evt.clientY - this.startDragOffset.y
			this.drawHandle(this.scale, this.translatePos)
		}
	}

	onMouseOver() {
		this.mouseDown = false
	}

	onMouseOut() {
		this.mouseDown = false
	}
}
