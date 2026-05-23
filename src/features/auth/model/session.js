import { computed, ref } from 'vue'
import { getCurrentUser, issueOAuthToken, logout, refreshOAuthToken, registerUser, verifyBiometrics } from '../../../modules/backend/api'
import { clearAuthTokens, getRefreshToken, setAuthTokens } from './authStorage'

const currentUser = ref(null)
const sessionResolved = ref(false)
let pendingRequest = null

async function restoreSession(force = false) {
  if (pendingRequest && !force) {
    return pendingRequest
  }

  pendingRequest = (async () => {
    try {
      currentUser.value = await getCurrentUser()
    } catch {
      currentUser.value = null

      const refreshToken = getRefreshToken()
      if (refreshToken) {
        try {
          const tokenResponse = await refreshOAuthToken(refreshToken)
          setAuthTokens(tokenResponse.access_token, tokenResponse.refresh_token)
          currentUser.value = tokenResponse.user
        } catch {
          clearAuthTokens()
        }
      }
    } finally {
      sessionResolved.value = true
      pendingRequest = null
    }

    return currentUser.value
  })()

  return pendingRequest
}

export function useSession() {
  const isAuthenticated = computed(() => Boolean(currentUser.value))

  async function loginWithPassword(username, password) {
    const tokenResponse = await issueOAuthToken({
      grant_type: 'password',
      client_id: 'clearing-portal-web',
      username,
      password
    })

    setAuthTokens(tokenResponse.access_token, tokenResponse.refresh_token)
    currentUser.value = tokenResponse.user
    sessionResolved.value = true

    return tokenResponse.user
  }

  async function registerWithPassword(payload) {
    const response = await registerUser(payload)
    return response
  }

  async function submitBiometricVerification(payload) {
    const response = await verifyBiometrics(payload)
    currentUser.value = response.user
    sessionResolved.value = true
    return response
  }

  async function loadSession(force = false) {
    return restoreSession(force)
  }

  async function logoutUser() {
    try {
      await logout()
    } finally {
      clearAuthTokens()
      currentUser.value = null
      sessionResolved.value = true
    }
  }

  return {
    currentUser,
    isAuthenticated,
    sessionResolved,
    loadSession,
    loginWithPassword,
    registerWithPassword,
    submitBiometricVerification,
    logoutUser
  }
}
