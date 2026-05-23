<template>
  <section class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <div class="hero-actions">
        <RouterLink to="/dashboard" class="cta-button">{{ copy.openDashboard }}</RouterLink>
        <RouterLink to="/developers" class="cta-button secondary">{{ copy.docs }}</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { t } from '../../../assets/languages'
import { usePublicContent } from '../../../features/public/model/usePublicContent'

const { profile } = usePublicContent()
const copy = t('hero')

const title = computed(() => profile.value?.title || copy.fallbackTitle)
const description = computed(() => profile.value?.description || copy.fallbackDescription)
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 72vh;
  border-radius: 24px;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.22), transparent 28%),
    linear-gradient(120deg, rgba(32, 52, 97, 0.82), rgba(63, 81, 181, 0.78)),
    linear-gradient(135deg, #c3cfe2, #f5f7fa);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: 0.4;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 860px;
  text-align: center;
  padding: 48px 32px;
  color: #fff;
}

.eyebrow {
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.78);
}

.hero-content h1 {
  margin: 0 0 18px;
  font-size: clamp(2.5rem, 4vw, 4rem);
  line-height: 1.05;
}

.hero-content p {
  margin: 0 auto;
  font-size: 1.15rem;
  line-height: 1.8;
  max-width: 680px;
}

.hero-actions {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

.cta-button {
  padding: 14px 24px;
  border-radius: 999px;
  background: #fff;
  color: #2d3c58;
  text-decoration: none;
  font-weight: 700;
}

.cta-button.secondary {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.22);
}
</style>
