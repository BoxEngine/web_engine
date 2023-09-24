import { ImageNode } from '../Nodes/ImageNode'
import { Cloud } from './Cloud'

export class Figure {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')!
		this.destroyEv()
	}

	set fillColor(color: string) {
		this.ctx!.fillStyle = color
	}

	set strokeColor(color: string) {
		this.ctx!.strokeStyle = color
	}

	set lineWidth(width: number) {
		this.ctx!.lineWidth = width
	}

	destroyEv() {
		this.canvas.onmousedown = null
		this.canvas.onmouseup = null
		this.canvas.onmousemove = null
	}
}

export abstract class AFigure {
	abstract listen(): void
	abstract mouseUpHandler(): void
	abstract mouseDownHandler(e: MouseEvent): void
	abstract mouseMoveHandler(e: MouseEvent): void
	abstract moveTo(x: number, y: number): void
	abstract delete(): void
}
