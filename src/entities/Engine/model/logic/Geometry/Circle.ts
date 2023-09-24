import { AFigure, Figure } from './Figure'

export class Circle extends Figure implements AFigure {
	mouseDown: boolean = false
	startX: number = 0
	startY: number = 0
	saved: string = ''
	radius: number = 0

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
		this.ctx.beginPath()
		this.ctx.arc(this.startX, this.startY, this.radius, 0, 2 * Math.PI)
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
		this.saved = this.canvas.toDataURL()
	}

	mouseMoveHandler(e: MouseEvent) {
		if (this.mouseDown) {
			// @ts-ignore
			let currentX = e.pageX - e.target.offsetLeft
			// @ts-ignore
			let currentY = e.pageY - e.target.offsetTop
			this.radius = Math.sqrt(Math.abs((this.startX - currentX) ** 2 + (this.startY - currentY) ** 2))
			this.draw(this.startX, this.startY)
		}
	}

	draw(x: number, y: number) {
		const img = new Image()
		img.src = this.saved
		img.onload = () => {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
			this.ctx.beginPath()
			this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI, false)
			this.ctx.fill()
			this.ctx.stroke()
		}
	}

	moveTo(x: number, y: number) {}

	delete() {}
}
