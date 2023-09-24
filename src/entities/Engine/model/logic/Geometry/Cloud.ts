import { AFigure, Figure } from './Figure'

export class Cloud extends Figure implements AFigure {
	mouseDown: boolean = false
	startX: number = 0
	startY: number = 0
	saved: string = ''
	width: number = 0
	height: number = 0
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
		this.drawCloud(this.startX, this.startY, this.radius)
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

	draw(x: number, y: number, width: number) {
		const img = new Image()
		img.src = this.saved
		img.onload = () => {
			this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height)
			this.ctx.drawImage(img, 0, 0, this.canvas?.width, this.canvas?.height)
			this.ctx.beginPath()
			this.drawCloud(x, y, width)
			this.ctx.fill()
			this.ctx.stroke()
		}
	}

	drawCloud(x: number, y: number, width: number) {
		const coef = width / 200

		this.ctx.beginPath()
		this.ctx.arc(x, y, 60 * coef, Math.PI * 0.5, Math.PI * 1.5)
		this.ctx.arc(x + 70 * coef, y - 60 * coef, 70 * coef, Math.PI * 1, Math.PI * 1.85)
		this.ctx.arc(x + 152 * coef, y - 45 * coef, 50 * coef, Math.PI * 1.37, Math.PI * 1.91)
		this.ctx.arc(x + 200 * coef, y, 60 * coef, Math.PI * 1.5, Math.PI * 0.5)
		this.ctx.moveTo(x + 200 * coef, y + 60 * coef)
		this.ctx.lineTo(x, y + 60 * coef)
		this.ctx.strokeStyle = '#797874'
		this.ctx.stroke()
		this.ctx.fillStyle = '#8ED6FF'
		this.ctx.fill()
	}

	moveTo(x: number, y: number) {}

	delete() {}
}
