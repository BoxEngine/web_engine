import { AFigure, Figure } from './Figure'

export class Rect extends Figure implements AFigure {
	mouseDown: boolean = false
	startX: number = 0
	startY: number = 0
	saved: string = ''
	width: number = 0
	height: number = 0

	constructor(canvas: HTMLCanvasElement) {
		super(canvas)
		this.listen()
	}

	listen() {
		this.canvas.onmousedown = this.mouseDownHandler.bind(this)
		this.canvas.onmouseup = this.mouseUpHandler.bind(this)
		this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
	}

	mouseUpHandler() {
		this.mouseDown = false
		// this.ctx.fillStyle = this.ctx.fillStyle
		// this.ctx.strokeStyle = this.ctx.strokeStyle
		// this.ctx.lineWidth = this.ctx.lineWidth
		this.ctx.beginPath()
		this.ctx.rect(this.startX, this.startY, this.width, this.height)
		this.ctx.fill()
		this.ctx.stroke()
	}

	mouseDownHandler(e: MouseEvent) {
		this.mouseDown = true
		this.ctx.beginPath()
		// @ts-ignore
		this.startX = e.pageX - e.target.offsetLeft
		// @ts-ignore
		this.startY = e.pageY - e.target.offsetTop
		// @ts-ignore
		this.saved = this.canvas?.toDataURL()
	}

	mouseMoveHandler(e: MouseEvent) {
		if (this.mouseDown) {
			// @ts-ignore
			let currentX = e.pageX - e.target.offsetLeft
			// @ts-ignore
			let currentY = e.pageY - e.target.offsetTop
			this.width = currentX - this.startX
			this.height = currentY - this.startY
			this.draw(this.startX, this.startY, this.width, this.height)
		}
	}

	draw(x: number, y: number, w: number, h: number) {
		const img = new Image()
		img.src = this.saved
		img.onload = () => {
			this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height)
			this.ctx.drawImage(img, 0, 0, this.canvas?.width, this.canvas?.height)
			this.ctx.beginPath()
			this.ctx.rect(x, y, w, h)
			this.ctx.fill()
			this.ctx.stroke()
		}
	}

	moveTo(x: number, y: number) {}

	delete() {}
}
