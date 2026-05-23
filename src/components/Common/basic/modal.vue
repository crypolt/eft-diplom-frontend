<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(23, 31, 54, 0.62);
  padding: 24px;
  z-index: 1100;
}

.modal-content {
  width: min(100%, 520px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 70px rgba(19, 32, 68, 0.28);
}
</style>
