<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useSession } from '../features/auth/model/session'

const route = useRoute()
const isPortal = computed(() => route.meta.layout === 'portal')
const { currentUser, logoutUser } = useSession()

async function handleLogout() {
  await logoutUser()
  window.location.href = '/'
}
</script>

<template>
  <div v-if="isPortal" class="portal-shell">
    <aside class="portal-sidebar">
      <RouterLink to="/" class="brand-mark">Clearing ePortal</RouterLink>

      <nav class="portal-nav">
        <RouterLink to="/portal" class="portal-link">Обзор</RouterLink>
        <RouterLink to="/portal/settlements" class="portal-link">Расчеты</RouterLink>
        <RouterLink to="/portal/participants" class="portal-link">Участники</RouterLink>
        <RouterLink to="/portal/transactions" class="portal-link">Транзакции</RouterLink>
        <RouterLink to="/portal/risk" class="portal-link">Риск</RouterLink>
        <RouterLink to="/developers" class="portal-link">API Docs</RouterLink>
      </nav>

      <div class="portal-status-card">
        <span class="micro-label">Architecture</span>
        <strong>{{ currentUser?.fullName || 'Local OAuth session' }}</strong>
        <p>{{ currentUser?.email || 'Sign in with local account to access portal routes.' }}</p>
        <button class="ghost-button portal-logout" @click="handleLogout">Выйти</button>
      </div>
    </aside>

    <main class="portal-content">
      <RouterView />
    </main>
  </div>

  <RouterView v-else />
</template>
