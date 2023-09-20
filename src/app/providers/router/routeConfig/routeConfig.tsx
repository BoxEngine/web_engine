import { AppRoutes } from '@/shared/consts/router'
import { AppRouteProps } from '@/shared/types/router'

export const routeConfig: Record<AppRoutes, AppRouteProps> = {
	// like this
	// [AppRoutes.PROFILE]: {
	// 	path: getRouteProfile(':id'),
	// 	element: <LazyProfilePage />,
	// 	authOnly: true,
	// },
}
