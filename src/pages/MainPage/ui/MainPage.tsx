import { cn } from '@/shared/lib/classNames'
import { FC } from 'react'
import classes from './MainPage.module.scss'

interface Props {
	className?: string
}

const MainPage: FC<Props> = ({ className }) => {
	return <div className={cn(classes.MainPage, {}, [className])}>MainPage</div>
}

export default MainPage
