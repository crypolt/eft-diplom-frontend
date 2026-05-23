<template>
  <div v-if="visible" class="loading-overlay">
    <div class="spinner"></div>
  </div>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(245, 247, 250, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  backdrop-filter: blur(4px);
}

.spinner {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 6px solid rgba(63, 81, 181, 0.18);
  border-top-color: #3f51b5;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
