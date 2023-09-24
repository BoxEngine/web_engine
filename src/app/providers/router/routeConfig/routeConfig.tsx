import { CreateStory } from '@/pages/CreateStory'
import { ForbiddenPage } from '@/pages/ForbiddenPage'
import { MainPage } from '@/pages/MainPage'
import { AppRoutes, getRouteCreateStory, getRouteForbidden, getRouteMain } from '@/shared/consts/router'
import { AppRouteProps } from '@/shared/types/router'

export const routeConfig: Record<AppRoutes, AppRouteProps> = {
	[AppRoutes.MAIN]: {
		element: <MainPage/>,
		path: getRouteMain()
	},
	[AppRoutes.FORBIDDEN]: {
		element: <ForbiddenPage/>,
		path: getRouteForbidden()
	},
	[AppRoutes.CREATE_STORY]: {
		element: <CreateStory/>,
		path: getRouteCreateStory(),
		// authOnly: true
	}
}
