import { AFigure, Figure } from './Figure'

export class Polygon extends Figure implements AFigure {
	mouseDown: boolean = false
	startX: number = 0
	startY: number = 0
	saved: string = ''
	width: number = 0
	height: number = 0
	sides: number = 5
	radius: number = 0

	constructor(canvas: HTMLCanvasElement, sides: number) {
		super(canvas)
		this.sides = sides
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
		this.drawPolygon(this.startX, this.startY, this.radius)
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
			this.drawPolygon(x, y, radius)
			this.ctx.fill()
			this.ctx.stroke()
		}
	}

	drawPolygon(Xcenter: number, Ycenter: number, radius: number) {
		const numberOfSides = this.sides,
			size = radius,
			step = (2 * Math.PI) / numberOfSides, //Precalculate step value
			shift = (Math.PI / 180.0) * -(90 - 360 / numberOfSides) //Quick fix ;)

		this.ctx.beginPath()

		for (let i = 0; i <= numberOfSides; i++) {
			const curStep = i * step + shift
			this.ctx.lineTo(Xcenter + size * Math.cos(curStep), Ycenter + size * Math.sin(curStep))
		}

		this.ctx.strokeStyle = '#000000'
		this.ctx.lineWidth = 1
		this.ctx.stroke()
		this.ctx.closePath()
	}

	moveTo(x: number, y: number) {}

	delete() {}
}
