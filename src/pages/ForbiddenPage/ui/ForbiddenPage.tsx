import { cn } from '@/shared/lib/classNames';
import { FC } from 'react';
import classes from './ForbiddenPage.module.scss'

interface Props {
    className?: string
}

const ForbiddenPage: FC<Props> = ({className}) => {
    return (
        <div
            className={cn(classes.ForbiddenPage, {}, [className])}
        >
            ForbiddenPage
        </div>
    )
}


export default ForbiddenPage