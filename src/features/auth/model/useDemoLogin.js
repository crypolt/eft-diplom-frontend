import { ref } from 'vue'
import { getOAuthHealth } from '../../../modules/backend/api'

export function useDemoLogin() {
  const apiStatus = ref('checking')
  const loginState = ref('')

  async function checkApi() {
    try {
      await getOAuthHealth()
      apiStatus.value = 'online'
    } catch {
      apiStatus.value = 'offline'
    }
  }

  async function demoLogin() {
    loginState.value = 'open local login form'
    window.location.href = '/login'
  }

  return {
    apiStatus,
    loginState,
    checkApi,
    demoLogin
  }
}
