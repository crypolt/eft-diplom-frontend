<script setup>
import { t } from '../../assets/languages'

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const copy = t('state')
</script>

<template>
  <div v-if="loading || error" class="state-panel">
    <p v-if="loading">{{ copy.loading }}</p>
    <p v-else class="state-error">{{ error }}</p>
  </div>
</template>
