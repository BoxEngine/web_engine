export { initAuthData } from './model/services/initAuthData'
export { saveJsonSettings } from './model/services/saveJsonSettings'
export { UserActions, UserReducer } from './model/slice/userSlice'
export type { User, UserSchema } from './model/types/User'
export { UserRoles } from './model/consts/UserRoles'
export {
	getJsonSettings,
	getJsonSettingsByKey,
	getUserAuthData,
	getUserInited,
	getUserRoles,
	isUserAdmin,
	isUserManager,
	useJsonSettings,
	useJsonSettingsByKey,
} from './model/selectors/getUser'
