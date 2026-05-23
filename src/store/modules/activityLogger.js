import { reactive, readonly } from 'vue'

const state = reactive({
  entries: []
})

export function logAction(description) {
  state.entries.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    description,
    timestamp: new Date().toISOString()
  })
}

export function useActivityLogger() {
  return readonly(state)
}
