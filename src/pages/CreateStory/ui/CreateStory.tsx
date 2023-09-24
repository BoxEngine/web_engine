import { cn } from '@/shared/lib/classNames'
import { FC, useRef } from 'react';
import classes from './CreateStory.module.scss'
import { Canvas, RenderCallbackProps } from '@/shared/ui/Canvas'
import { Cloud } from '@/entities/Engine/model/logic/Geometry/Cloud'
import { EngineCanvas } from '@/entities/Engine/ui/EngineCanvas';

interface Props {
	className?: string
}

const CreateStory: FC<Props> = ({ className }) => {

	

	return (
		<div className={cn(classes.CreateStory, {}, [className])}>
			<EngineCanvas/>
		</div>
	)
}

export default CreateStory
