import { Suspense, useEffect } from 'react'
import { cn } from '../shared/lib/classNames/classNames'
import { AppRouter } from './providers/router'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@/shared/lib/hooks/useTheme/useTheme'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'

const App = () => {
	const { theme } = useTheme()
	const dispatch = useAppDispatch()
	// const _inited = useSelector(getUserInited);

	useEffect(() => {
		// dispatch(initAuthData());
	}, [dispatch])

	return (
		<div className={cn('app', {}, [theme])}>
			<Suspense /* fallback={ <PageLoader />} */>
				{/* <Navbar /> */}
				<div className="content-page">
					{/* <Sidebar /> */}
					{/* {_inited && <AppRouter />} */}
					<AppRouter />
				</div>
			</Suspense>
		</div>
	)
}

export default App
