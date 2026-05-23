import { computed, reactive, readonly } from 'vue'
import { t } from '../assets/languages'
import { useSession } from '../features/auth/model/session'
import { logAction } from './modules/activityLogger'

const { currentUser, loadSession, loginWithPassword, logoutUser } = useSession()

const state = reactive({
  initialized: false
})

async function initializeSession(force = false) {
  const user = await loadSession(force)
  state.initialized = true
  return user
}

async function login(payload) {
  const user = await loginWithPassword(payload.username, payload.password)
  logAction(t('logs.login', { username: payload.username }))
  return user
}

async function logout() {
  const username = currentUser.value?.username || currentUser.value?.fullName || t('logs.fallbackUser')
  await logoutUser()
  logAction(t('logs.logout', { username }))
}

const store = {
  state: readonly(state),
  user: currentUser,
  isAuthenticated: computed(() => Boolean(currentUser.value)),
  initializeSession,
  login,
  logout,
  logAction
}

export default store
