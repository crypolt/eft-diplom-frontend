<template>
  <nav class="navbar">
    <Loading :visible="logoutLoading" />

    <div v-if="notification" class="notification">
      {{ notification }}
    </div>

    <div class="nav-left">
      <RouterLink to="/">{{ copy.home }}</RouterLink>
      <RouterLink to="/about">{{ copy.about }}</RouterLink>
      <RouterLink to="/developers">{{ copy.api }}</RouterLink>
    </div>

    <div class="nav-right">
      <template v-if="isAuthenticated">
        <div class="user-menu">
          <button @click="toggleDropdown">
            {{ displayName }}
          </button>
          <div v-if="showDropdown" class="dropdown">
            <RouterLink to="/dashboard" @click="closeDropdown">
              {{ copy.dashboard }}
            </RouterLink>
            <RouterLink to="/dashboard/settlements" @click="closeDropdown">
              {{ copy.settlements }}
            </RouterLink>
            <a href="#" @click.prevent="handleLogout">{{ copy.logout }}</a>
          </div>
        </div>
      </template>

      <template v-else>
        <button class="nav-action" @click="$emit('open-login')">{{ copy.login }}</button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { t } from '../../../assets/languages'
import Loading from '../basic/loading.vue'
import store from '../../../store'

const emit = defineEmits(['open-login'])
const router = useRouter()

const showDropdown = ref(false)
const logoutLoading = ref(false)
const notification = ref('')
const copy = t('navbar')

const isAuthenticated = computed(() => store.isAuthenticated.value)
const displayName = computed(() => {
  const user = store.user.value
  return user?.fullName || user?.username || copy.fallbackUser
})

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function closeDropdown() {
  showDropdown.value = false
}

async function handleLogout() {
  logoutLoading.value = true

  try {
    await store.logout()
    notification.value = copy.sessionEnded
    closeDropdown()
    await router.push('/')
    window.setTimeout(() => {
      notification.value = ''
    }, 2500)
  } finally {
    logoutLoading.value = false
  }
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 900;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  box-shadow: 0 8px 24px rgba(36, 54, 86, 0.08);
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-left a,
.user-menu button,
.dropdown a,
.nav-action {
  color: #2d3c58;
  text-decoration: none;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.98rem;
}

.nav-left a.router-link-active {
  color: #3f51b5;
}

.nav-action {
  padding: 10px 18px;
  border-radius: 999px;
  background: #3f51b5;
  color: #fff;
}

.user-menu {
  position: relative;
}

.user-menu button {
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.84);
}

.dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 220px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(67, 88, 125, 0.12);
  box-shadow: 0 24px 50px rgba(28, 43, 78, 0.18);
  overflow: hidden;
}

.dropdown a {
  display: block;
  padding: 14px 16px;
}

.dropdown a:hover {
  background: #f4f6fb;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #3f51b5;
  color: #fff;
  padding: 12px 18px;
  border-radius: 12px;
  box-shadow: 0 18px 35px rgba(63, 81, 181, 0.28);
}

@media (max-width: 720px) {
  .navbar {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .nav-left,
  .nav-right {
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style>
