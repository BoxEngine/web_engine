import { cn } from '@/shared/lib/classNames'
import { FC } from 'react'
import classes from './PageError.module.scss'
import { useTranslation } from 'react-i18next';

interface Props {
    className?: string
}

export const PageError: FC<Props> = ({ className }) => {
    const {t} = useTranslation()

    const reloadPage = () => {
        location.reload()
    }

    return (
        <div
            className={cn(classes.PageError, {}, [
                className,
            ])}
        >
            {t('Произошла непредвиденная ошибка')}
            <button onClick={reloadPage}>{t('Обновить страницу')}</button>
        </div>
    )
}