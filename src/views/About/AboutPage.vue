<template>
  <div class="about-page">
    <div class="content">
      <header class="about-header">
        <h1>{{ copy.title }}</h1>
        <p class="tagline">
          {{ copy.tagline }}
        </p>
      </header>

      <section class="about-section mission-block">
        <h2>{{ copy.missionTitle }}</h2>
        <div class="mission-content">
          <div class="mission-text">
            <p>{{ copy.missionLead }}</p>
            <ul class="mission-list">
              <li v-for="item in copy.missionPoints" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div class="mission-text">
            <p>{{ copy.quickLinks }}</p>
            <ul class="mission-list">
              <li v-for="item in linksToRender" :key="item.title">
                <a :href="item.href" target="_blank" rel="noreferrer">{{ item.title }}</a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="about-section features">
        <h2>{{ copy.featureTitle }}</h2>
        <div class="features-grid">
          <article class="feature-card">
            <h3>{{ copy.monitorTitle }}</h3>
            <p>{{ copy.monitorDesc }}</p>
          </article>
          <article class="feature-card">
            <h3>{{ copy.adminTitle }}</h3>
            <p>{{ copy.adminDesc }}</p>
          </article>
          <article class="feature-card">
            <h3>{{ copy.developersTitle }}</h3>
            <p>{{ copy.developersDesc }}</p>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { t } from '../../assets/languages'
import { usePublicContent } from '../../features/public/model/usePublicContent'

const { quickLinks } = usePublicContent()
const copy = t('about')
const linksToRender = computed(() => (quickLinks.value?.length ? quickLinks.value : copy.quickLinksFallback))
</script>

<style scoped>
.about-page {
  min-height: 100%;
  background: linear-gradient(150deg, #f8f9ff 0%, #e6f0ff 100%);
  border-radius: 24px;
  padding: 24px;
}

.content {
  max-width: 1180px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 22px;
  box-shadow: 0 20px 48px rgba(29, 46, 81, 0.1);
  padding: 32px;
}

.about-header {
  text-align: center;
  margin-bottom: 32px;
}

.about-header h1 {
  margin: 0 0 12px;
  color: #2d3c58;
  font-size: 2.5rem;
}

.tagline {
  margin: 0 auto;
  max-width: 760px;
  color: #5a6c87;
  line-height: 1.8;
}

.about-section {
  margin-top: 28px;
}

.mission-block {
  background: #f9faff;
  border-radius: 18px;
  padding: 24px;
}

.mission-content,
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.mission-list {
  padding-left: 18px;
  color: #5a6c87;
}

.mission-list li,
.mission-text p,
.feature-card p {
  line-height: 1.7;
}

.feature-card {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(67, 88, 125, 0.1);
  padding: 22px;
}

.feature-card h3,
.mission-text a,
.about-section h2 {
  color: #2d3c58;
}

.mission-text a {
  text-decoration: none;
}
</style>
