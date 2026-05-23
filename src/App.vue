<template>
  <div id="app">
    <HeaderComponent />
    <NavbarComponent @open-login="openLoginModal" />

    <div class="layout" :class="{ 'layout-dashboard': isDashboard }">
      <SidebarComponent v-if="isDashboard" />
      <main class="content">
        <RouterView />
      </main>
    </div>

    <FooterComponent />

    <ModalComponent v-if="isLoginModalOpen" @close="closeLoginModal">
      <LoginPage :show-close="true" @close="closeLoginModal" />
    </ModalComponent>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import ModalComponent from './components/Common/basic/modal.vue'
import FooterComponent from './components/Common/main/footer.vue'
import HeaderComponent from './components/Common/main/header.vue'
import NavbarComponent from './components/Common/main/navbar.vue'
import SidebarComponent from './components/Common/main/sidebar.vue'
import LoginPage from './views/Auth/LoginPage.vue'
import { useLoginModal } from './features/auth/model/loginModal'

const route = useRoute()
const isDashboard = computed(() => Boolean(route.meta.requiresAuth))
const { isLoginModalOpen, openLoginModal, closeLoginModal } = useLoginModal()
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout {
  width: min(1280px, calc(100% - 32px));
  margin: 24px auto 32px;
}

.layout-dashboard {
  display: grid;
  width: 100%;
  max-width: none;
  margin: 0 0 32px;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 0;
  align-items: stretch;
  min-height: calc(100vh - 140px);
}

.content {
  min-width: 0;
}

.layout-dashboard .content {
  padding: 24px 24px 0;
}

@media (max-width: 980px) {
  .layout-dashboard {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .layout-dashboard .content {
    padding: 24px 16px 0;
  }
}
</style>
