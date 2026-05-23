<template>
  <div class="auth-container">
    <Loading :visible="loading" />

    <div class="auth-card">
      <button v-if="showClose" class="close-icon" @click="$emit('close')">✕</button>

      <div class="auth-tabs">
        <button :class="{ active: mode === 'login' }" @click="mode = 'login'">{{ copy.tabs.login }}</button>
        <button :class="{ active: mode === 'register' }" @click="mode = 'register'">{{ copy.tabs.register }}</button>
      </div>

      <h2>{{ mode === 'login' ? copy.login.heading : copy.register.heading }}</h2>

      <form v-if="mode === 'login'" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">{{ copy.login.username }}</label>
          <input id="username" v-model="loginForm.username" type="text" required />
        </div>

        <div class="form-group">
          <label for="password">{{ copy.login.password }}</label>
          <input id="password" v-model="loginForm.password" type="password" required />
        </div>

        <button type="submit" class="btn primary">
          {{ loading ? copy.login.submitLoading : copy.login.submit }}
        </button>
      </form>

      <form v-else @submit.prevent="handleRegister">
        <div class="form-grid">
          <div class="form-group">
            <label for="register-username">{{ copy.register.username }}</label>
            <input id="register-username" v-model="registerForm.username" type="text" required />
          </div>

          <div class="form-group">
            <label for="register-email">{{ copy.register.email }}</label>
            <input id="register-email" v-model="registerForm.email" type="email" required />
          </div>

          <div class="form-group">
            <label for="register-full-name">{{ copy.register.fullName }}</label>
            <input id="register-full-name" v-model="registerForm.fullName" type="text" required />
          </div>

          <div class="form-group">
            <label for="register-phone">{{ copy.register.phone }}</label>
            <input id="register-phone" v-model="registerForm.phone" type="text" required />
          </div>

          <div class="form-group form-group-wide">
            <label for="register-company-name">{{ copy.register.companyName }}</label>
            <input id="register-company-name" v-model="registerForm.companyName" type="text" required />
            <small class="field-help">{{ copy.register.helper }}</small>
          </div>

          <div class="form-group form-group-wide">
            <label for="register-password">{{ copy.register.password }}</label>
            <input id="register-password" v-model="registerForm.password" type="password" required />
          </div>
        </div>

        <button type="submit" class="btn primary">
          {{ loading ? copy.register.submitLoading : copy.register.submit }}
        </button>
      </form>

      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { t } from '../../assets/languages'
import Loading from '../../components/Common/basic/loading.vue'
import store from '../../store'
import { useSession } from '../../features/auth/model/session'

defineProps({
  showClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])
const router = useRouter()
const route = useRoute()
const { registerWithPassword } = useSession()
const copy = t('auth')

const mode = ref('login')
const loading = ref(false)
const error = ref('')
const successMessage = ref('')

const loginForm = reactive({
  username: 'administrator',
  password: 'password'
})

const registerForm = reactive({
  username: '',
  email: '',
  fullName: '',
  phone: '+77',
  companyName: '',
  password: ''
})

async function handleLogin() {
  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    await store.login({
      username: loginForm.username,
      password: loginForm.password
    })

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    emit('close')
    await router.push(redirect)
  } catch (err) {
    error.value = err instanceof Error ? err.message : copy.login.error
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const response = await registerWithPassword({
      username: registerForm.username,
      email: registerForm.email,
      fullName: registerForm.fullName,
      phone: registerForm.phone,
      companyName: registerForm.companyName,
      password: registerForm.password
    })

    successMessage.value = t('auth.register.success', {
      username: response.user.username,
      companyName: registerForm.companyName
    })
    mode.value = 'login'
    loginForm.username = registerForm.username
    loginForm.password = registerForm.password
  } catch (err) {
    error.value = err instanceof Error ? err.message : copy.register.error
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
}

.auth-card {
  position: relative;
  width: 100%;
  max-width: 720px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
  padding: 28px;
  box-shadow: 0 26px 60px rgba(35, 53, 92, 0.2);
}

.auth-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.auth-tabs button {
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  background: #eef1fb;
  color: #3a4d69;
  font-weight: 700;
}

.auth-tabs button.active {
  background: #3f51b5;
  color: #fff;
}

.close-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  border: none;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
}

.auth-card h2 {
  margin: 0 0 18px;
  color: #2d3c58;
}

.form-group {
  margin-bottom: 16px;
}

.form-group-wide {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #5b6b84;
  font-weight: 600;
}

.field-help {
  display: block;
  margin-top: 6px;
  color: #7a8aa5;
}

.btn.primary {
  width: 100%;
  margin-top: 8px;
}

.demo-copy,
.success {
  margin: 16px 0 0;
  color: #63748f;
}

.success {
  color: #2e7d32;
}

.error {
  margin-top: 12px;
  color: #c62828;
}
</style>
