<template>
  <section class="features">
    <div class="background-icons">
      <div
        v-for="icon in backgroundIcons"
        :key="icon.id"
        class="bg-icon"
        :style="{ top: `${icon.top}%`, left: `${icon.left}%` }"
      >
        {{ icon.symbol }}
      </div>
    </div>

    <h2>{{ copy.title }}</h2>

    <div class="features-grid">
      <article v-for="feature in features" :key="feature.title" class="feature-card">
        <div class="feature-icon">{{ feature.symbol }}</div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { t } from '../../../assets/languages'

const copy = t('features')
const features = copy.items

const backgroundIcons = Array.from({ length: 36 }, (_, index) => ({
  id: index,
  top: Math.round((index * 13) % 100),
  left: Math.round((index * 19) % 100),
  symbol: index % 2 === 0 ? 'TR' : 'DB'
}))
</script>

<style scoped>
.features {
  position: relative;
  padding: 56px 24px;
  border-radius: 24px;
  overflow: hidden;
  background: #f8f9fd;
}

.background-icons {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-icon {
  position: absolute;
  color: rgba(63, 81, 181, 0.12);
  font-size: 0.85rem;
  font-weight: 700;
  animation: float 6s ease-in-out infinite;
}

.features h2 {
  position: relative;
  margin: 0 0 28px;
  text-align: center;
  font-size: 2.2rem;
  color: #2d3c58;
}

.features-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 18px;
  padding: 24px;
  border: 1px solid rgba(67, 88, 125, 0.1);
  box-shadow: 0 14px 34px rgba(31, 48, 83, 0.08);
}

.feature-icon {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #3f51b5, #5c6bc0);
  color: #fff;
  font-weight: 700;
}

.feature-card h3 {
  margin: 0 0 10px;
  color: #2d3c58;
}

.feature-card p {
  margin: 0;
  line-height: 1.7;
  color: #5a6c87;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
