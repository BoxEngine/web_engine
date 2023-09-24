import { StateSchema } from '@/app/providers/StoreProvider'
import { buildSelector } from '@/shared/lib/store/buildSelector'
import { jsonSettings } from '../types/jsonSettings'
import { createSelector } from '@reduxjs/toolkit'
import { UserRoles } from '../consts/UserRoles'

export const getUserAuthData = (state: StateSchema) => state.user.authData

export const getUserInited = (state: StateSchema) => state.user._inited

export const [useJsonSettings, getJsonSettings] = buildSelector((state) => state.user.authData?.jsonSettings)

export const [useJsonSettingsByKey, getJsonSettingsByKey] = buildSelector(
	(state, key: keyof jsonSettings) => state.user.authData?.jsonSettings?.[key],
)

export const getUserRoles = (state: StateSchema) => state.user.authData?.roles

export const isUserAdmin = createSelector(getUserRoles, (roles) => Boolean(roles?.includes(UserRoles.ADMIN)))

export const isUserManager = createSelector(getUserRoles, (roles) =>
	Boolean(roles?.includes(UserRoles.MANAGER)),
)
