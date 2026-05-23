<template>
  <header class="main-header">
    <div class="header-container">
      <div class="brand-badge">TR</div>
      <div class="brand-copy">
        <h1>{{ copy.title }}</h1>
        <p>{{ copy.subtitle }}</p>
      </div>
    </div>
  </header>
</template>

<script setup>
import { t } from '../../../assets/languages'

const copy = t('header')
</script>

<style scoped>
.main-header {
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  border-bottom: 1px solid rgba(67, 88, 125, 0.16);
  box-shadow: 0 8px 20px rgba(36, 54, 86, 0.08);
}

.header-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.brand-badge {
  width: 62px;
  height: 62px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 1.35rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3f51b5, #5c6bc0);
  box-shadow: 0 10px 22px rgba(63, 81, 181, 0.25);
}

.brand-copy h1 {
  margin: 0;
  font-size: 1.75rem;
  color: #26344f;
}

.brand-copy p {
  margin: 4px 0 0;
  color: #54657f;
  font-size: 0.98rem;
}

@media (max-width: 720px) {
  .header-container {
    justify-content: flex-start;
  }

  .brand-copy h1 {
    font-size: 1.35rem;
  }

  .brand-copy p {
    font-size: 0.9rem;
  }
}
</style>
