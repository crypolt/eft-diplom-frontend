<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section">
        <h3>{{ copy.contactsTitle }}</h3>
        <p v-for="item in copy.contacts" :key="item">{{ item }}</p>
      </div>

      <div class="footer-section">
        <h3>{{ copy.linksTitle }}</h3>
        <RouterLink to="/about">{{ copy.about }}</RouterLink>
        <RouterLink to="/developers">{{ copy.docs }}</RouterLink>
        <RouterLink to="/dashboard">{{ copy.dashboard }}</RouterLink>
      </div>

      <div class="footer-section">
        <h3>{{ copy.newsletterTitle }}</h3>
        <div class="newsletter">
          <input v-model="email" type="email" :placeholder="copy.emailPlaceholder" />
          <button @click="subscribe">{{ copy.subscribe }}</button>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>{{ copy.rights }}</p>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { t } from '../../../assets/languages'

const email = ref('')
const copy = t('footer')

function subscribe() {
  email.value = ''
}
</script>

<style scoped>
.footer {
  margin-top: auto;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  border-top: 1px solid rgba(67, 88, 125, 0.14);
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 28px 24px 18px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.footer-section {
  background: rgba(255, 255, 255, 0.82);
  border-radius: 16px;
  padding: 18px;
}

.footer-section h3 {
  margin: 0 0 12px;
  color: #2d3c58;
}

.footer-section p,
.footer-section a {
  display: block;
  color: #566983;
  margin: 7px 0;
  text-decoration: none;
}

.newsletter {
  display: flex;
  gap: 10px;
}

.newsletter input {
  flex: 1;
  min-width: 0;
}

.newsletter button {
  border: none;
  border-radius: 10px;
  padding: 0 16px;
  background: #3f51b5;
  color: #fff;
  font-weight: 600;
}

.footer-bottom {
  text-align: center;
  color: #64758f;
  padding: 0 24px 18px;
}
</style>
