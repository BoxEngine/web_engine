import { AFigure, Figure } from './Figure'

export class Triangle extends Figure implements AFigure {
	mouseDown: boolean = false
	startX: number = 0
	startY: number = 0
	saved: string = ''
	width: number = 0
	height: number = 0
	type: 'up' | 'down'
	radius: number = 0

	constructor(canvas: HTMLCanvasElement, type?: 'up' | 'down') {
		super(canvas)
		this.type = type || 'up'
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
		this.drawTriangle(this.startX, this.startY, this.radius)
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
			this.radius = Math.sqrt(Math.abs((this.startX - currentX) ** 2 + (this.startY - currentY) ** 2))
			this.draw(this.startX, this.startY, this.radius)
		}
	}

	draw(x: number, y: number, radius: number) {
		const img = new Image()
		img.src = this.saved
		img.onload = () => {
			this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height)
			this.ctx.drawImage(img, 0, 0, this.canvas?.width, this.canvas?.height)
			this.ctx.beginPath()
			this.drawTriangle(x, y, radius)
			this.ctx.fill()
			this.ctx.stroke()
		}
	}

	drawTriangle(x: number, y: number, radius: number) {
		const R = radius
		const coef = this.type === 'down' ? 1 : -1

		const triangle = {
			x2: x + R * Math.cos(Math.PI / 2 + (4 * Math.PI) / 3),
			y2: y + R * coef * Math.sin(Math.PI / 2 + (4 * Math.PI) / 3),
			x3: x + R * Math.cos(Math.PI / 2),
			y3: y + R * coef * Math.sin(Math.PI / 2),
			x1: x + R * Math.cos(Math.PI / 2 + (2 * Math.PI) / 3),
			y1: y + R * coef * Math.sin(Math.PI / 2 + (2 * Math.PI) / 3),
		}

		this.ctx.beginPath()
		this.ctx.moveTo(triangle.x1, triangle.y1)
		this.ctx.lineTo(triangle.x2, triangle.y2)
		this.ctx.lineTo(triangle.x3, triangle.y3)
		this.ctx.lineTo(triangle.x1, triangle.y1)
		this.ctx.closePath()
		this.ctx.stroke()
	}

	moveTo(x: number, y: number) {}

	delete() {}
}
