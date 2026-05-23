import { ref } from 'vue'

const isLoginModalOpen = ref(false)

export function useLoginModal() {
  function openLoginModal() {
    isLoginModalOpen.value = true
  }

  function closeLoginModal() {
    isLoginModalOpen.value = false
  }

  return {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal
  }
}
