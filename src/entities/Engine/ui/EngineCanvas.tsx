import { cn } from '@/shared/lib/classNames'
import { FC } from 'react'
import classes from './EngineCanvas.module.scss'
import { Canvas, RenderCallbackProps } from '@/shared/ui/Canvas'
import { Zoom } from '../model/logic/Canvas/Zoom'

interface Props {
	className?: string
}

export const EngineCanvas: FC<Props> = ({ className }) => {
	const renderCanvas = ({ canvasHTML, ctx }: RenderCallbackProps) => {
        const zoom = new Zoom(canvasHTML, (scale, {x, y}) => {
            
        })

		const animate = () => {
			const timer = requestAnimationFrame(animate)

			return () => {
				cancelAnimationFrame(timer)
			}
		}

		requestAnimationFrame(animate)
	}

	return (
		<div className={cn(classes.EngineCanvas, {}, [className])}>

			<Canvas
				className={classes.canvas}
				renderCallback={renderCanvas}
				height={window.innerHeight}
				width={window.innerWidth}
			/>
		</div>
	)
}
