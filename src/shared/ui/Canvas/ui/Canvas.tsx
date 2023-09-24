import { cn } from '@/shared/lib/classNames'
import { CSSProperties, FC, useRef, useEffect } from 'react';

export type RenderCallbackProps = {
	canvasHTML: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
}

export type CanvasRenderType = (props: RenderCallbackProps) => void

interface Props {
	className?: string
	width?: number
	height?: number
	style?: CSSProperties
	renderCallback: CanvasRenderType
}

export const Canvas: FC<Props> = (props) => {
	const { style, height, renderCallback, width, className } = props
	const canvasRef = useRef<HTMLCanvasElement | null>(null)

	useEffect(() => {
		const canvasHTML = canvasRef.current
		const ctx = canvasHTML?.getContext('2d')
		ctx!.imageSmoothingEnabled = true

		if (canvasHTML && ctx) {
			renderCallback({ canvasHTML, ctx })
		}
	}, [])

	return <canvas ref={canvasRef} className={cn('', {}, [className])} width={width} height={height} style={style} />
}
