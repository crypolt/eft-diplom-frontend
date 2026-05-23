<script setup>
import { onMounted, reactive, ref } from 'vue'
import { t } from '../../../assets/languages'
import { createParticipant, getParticipants } from '../../../modules/backend/api'
import { createParticipantFormModel } from '../../../models/portal/formModels'
import PageState from '../../../shared/ui/PageState.vue'

const loading = ref(true)
const error = ref('')
const participants = ref([])
const form = reactive(createParticipantFormModel())
const copy = t('participants')

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    const response = await getParticipants()
    participants.value = response.items ?? []
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('common.unexpectedError')
  } finally {
    loading.value = false
  }
}

async function submitForm() {
  error.value = ''

  try {
    await createParticipant({
      ...form,
      guaranteeFund: Number(form.guaranteeFund)
    })

    Object.assign(form, createParticipantFormModel())
    await loadData()
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('common.unexpectedError')
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

    <section class="form-card">
      <div class="section-head">
        <div>
          <p class="micro-label">{{ copy.addKicker }}</p>
          <h2>{{ copy.addTitle }}</h2>
        </div>
        <button class="primary-button" @click="submitForm">{{ copy.addButton }}</button>
      </div>

      <div class="form-grid">
        <input v-model="form.code" :placeholder="copy.placeholders.code" />
        <input v-model="form.name" :placeholder="copy.placeholders.name" />
        <input v-model="form.category" :placeholder="copy.placeholders.category" />
        <input v-model="form.riskLevel" :placeholder="copy.placeholders.risk" />
        <input v-model="form.guaranteeFund" type="number" min="0" :placeholder="copy.placeholders.fund" />
        <input v-model="form.operationalState" :placeholder="copy.placeholders.status" />
        <input v-model="form.country" :placeholder="copy.placeholders.country" />
      </div>
    </section>

    <PageState :loading="loading" :error="error" />

    <section v-if="!loading && !error" class="table-card">
      <div class="section-head">
        <div>
          <p class="micro-label">{{ copy.registryKicker }}</p>
          <h2>{{ copy.registryTitle }}</h2>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>{{ copy.columns.code }}</th>
            <th>{{ copy.columns.name }}</th>
            <th>{{ copy.columns.category }}</th>
            <th>{{ copy.columns.risk }}</th>
            <th>{{ copy.columns.fund }}</th>
            <th>{{ copy.columns.status }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in participants" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.riskLevel }}</td>
            <td>{{ item.guaranteeFund.toLocaleString() }}</td>
            <td><span class="status-chip">{{ item.operationalState }}</span></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>
