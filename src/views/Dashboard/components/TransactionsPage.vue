<script setup>
import { onMounted, ref } from 'vue'
import { t } from '../../../assets/languages'
import { getTransactions, getWebhooks, sendWebhookTest } from '../../../modules/backend/api'
import PageState from '../../../shared/ui/PageState.vue'

const loading = ref(true)
const error = ref('')
const transactions = ref([])
const webhooks = ref([])
const webhookResult = ref('')
const copy = t('transactions')

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    const [transactionsData, webhookData] = await Promise.all([
      getTransactions(),
      getWebhooks()
    ])
    transactions.value = transactionsData.items ?? []
    webhooks.value = webhookData.items ?? []
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('common.unexpectedError')
  } finally {
    loading.value = false
  }
}

async function triggerTest() {
  try {
    const response = await sendWebhookTest()
    webhookResult.value = `${response.deliveryRef} at ${response.deliveredAt}`
  } catch (err) {
    webhookResult.value = err instanceof Error ? err.message : copy.webhookError
  }
}

onMounted(loadData)
</script>

<template>
  <div class="dashboard-stack">
    <section class="dashboard-hero-card">
      <div class="dashboard-hero-main">
        <p class="micro-label">{{ copy.kicker }}</p>
        <h1>{{ copy.title }}</h1>
      </div>
      <div class="dashboard-hero-actions">
        <button class="primary-button" @click="loadData">{{ t('common.refresh') }}</button>
      </div>
    </section>

    <PageState :loading="loading" :error="error" />

    <template v-if="!loading && !error">
      <section class="dashboard-section-grid two-columns">
        <article class="dashboard-panel-card">
          <div class="section-head">
            <div>
              <p class="micro-label">{{ copy.transactionsKicker }}</p>
              <h2>{{ copy.transactionsTitle }}</h2>
            </div>
          </div>

          <ul class="compact-list">
            <li v-for="item in transactions" :key="item.id">
              {{ item.id }} / {{ item.type }} / {{ item.status }} / {{ item.callbackStatus }}
            </li>
          </ul>
        </article>

        <article class="dashboard-panel-card">
          <div class="section-head">
            <div>
              <p class="micro-label">{{ copy.webhooksKicker }}</p>
              <h2>{{ copy.webhooksTitle }}</h2>
            </div>
            <button class="primary-button" @click="triggerTest">{{ copy.sendTest }}</button>
          </div>

          <ul class="compact-list">
            <li v-for="item in webhooks" :key="item.id">
              {{ item.name }} / {{ item.event }} / {{ item.status }}
            </li>
          </ul>

          <p v-if="webhookResult" class="hint-text">{{ webhookResult }}</p>
        </article>
      </section>
    </template>
  </div>
</template>
