import { readonly, ref } from 'vue'

const currentSection = ref('overview')

export function useAdminSection() {
  function setAdminSection(section) {
    currentSection.value = section || 'overview'
  }

  return {
    currentAdminSection: readonly(currentSection),
    setAdminSection
  }
}
