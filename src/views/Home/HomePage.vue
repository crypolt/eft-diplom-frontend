<template>
  <div class="home-page">
    <div class="background-icons">
      <div
        v-for="icon in backgroundIcons"
        :key="icon.id"
        class="bg-icon"
        :style="{ left: `${icon.left}%`, top: `${icon.top}%` }"
      >
        {{ icon.symbol }}
      </div>
    </div>

    <HeroComponent />

    <section class="activity-section">
      <h2 class="section-title">{{ copy.activityTitle }}</h2>
      <p class="section-lead">{{ copy.activityLead }}</p>
      <div class="activity-content">
        <article class="activity-card">
          <p>{{ profile?.subtitle || heroCopy.fallbackTitle }}</p>
          <ul>
            <li v-for="item in profile?.highlights || []" :key="item">{{ item }}</li>
          </ul>
        </article>

        <article class="activity-card">
          <h3>{{ copy.participantCategories }}</h3>
          <p class="activity-card__lead">{{ copy.participantCategoriesLead }}</p>
          <p v-for="item in copy.clearingTypes" :key="item">
            {{ item }}
          </p>
        </article>

        <article class="activity-card">
          <h3>{{ copy.servicedMarkets }}</h3>
          <p class="activity-card__lead">{{ copy.servicedMarketsLead }}</p>
          <p v-for="item in copy.advantages" :key="item">
            {{ item }}
          </p>
        </article>
      </div>
    </section>

    <section class="faq-section">
      <h2 class="section-title">{{ copy.faqTitle }}</h2>
      <div class="faq-accordion">
        <article
          v-for="(faq, index) in faqs"
          :key="faq.question"
          class="faq-item"
          :class="{ active: activeFaq === index }"
          @click="toggleFaq(index)"
        >
          <div class="faq-question">
            <h3>{{ faq.question }}</h3>
            <span>{{ activeFaq === index ? '−' : '+' }}</span>
          </div>
          <p v-if="activeFaq === index" class="faq-answer">{{ faq.answer }}</p>
        </article>
      </div>
    </section>

    <FeaturesSection />

    <section class="news-preview">
      <h2 class="section-title">{{ copy.newsTitle }}</h2>
      <div class="news-grid">
        <article v-for="item in copy.fallbackNews" :key="item.title" class="news-card">
          <h3>{{ item.title }}</h3>
          <p>{{ item.summary }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../../assets/languages'
import HeroComponent from '../../components/Common/main/hero.vue'
import FeaturesSection from '../../components/Common/main/features.vue'
import { usePublicContent } from '../../features/public/model/usePublicContent'

const { profile } = usePublicContent()
const copy = t('home')
const heroCopy = t('hero')

const activeFaq = ref(null)
const faqs = copy.faqs

const backgroundIcons = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: Math.round((index * 17) % 100),
  top: Math.round((index * 11) % 100),
  symbol: index % 2 === 0 ? 'CL' : 'OA'
}))

function toggleFaq(index) {
  activeFaq.value = activeFaq.value === index ? null : index
}
</script>

<style scoped>
.home-page {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.background-icons {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-icon {
  position: absolute;
  color: rgba(63, 81, 181, 0.08);
  font-size: 0.9rem;
  font-weight: 700;
}

.section-title {
  margin: 0 0 22px;
  text-align: center;
  font-size: 2.2rem;
  color: #2d3c58;
}

.section-lead {
  max-width: 880px;
  margin: 0 auto 24px;
  text-align: center;
  color: #5a6c87;
  line-height: 1.8;
}

.activity-section,
.faq-section,
.news-preview {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.86);
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 0 18px 36px rgba(31, 48, 83, 0.08);
}

.activity-content,
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}

.activity-card,
.news-card,
.faq-item {
  background: #fff;
  border: 1px solid rgba(67, 88, 125, 0.1);
  border-radius: 18px;
  padding: 22px;
}

.activity-card p,
.news-card p,
.faq-answer {
  color: #5a6c87;
  line-height: 1.7;
}

.activity-card__lead {
  margin-bottom: 12px;
  font-size: 0.96rem;
}

.activity-card ul {
  margin: 12px 0 0;
  padding-left: 18px;
  color: #5a6c87;
}

.faq-accordion {
  display: grid;
  gap: 14px;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.faq-question h3,
.news-card h3,
.activity-card h3 {
  margin: 0;
  color: #2d3c58;
}
</style>
