<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import * as XLSX from 'xlsx'
import { t } from '../../../assets/languages'
import {
  cancelSettlement,
  confirmSettlement,
  createSettlement,
  createSettlementsBatch,
  getParticipants,
  getSettlements
} from '../../../modules/backend/api'
import { createSettlementFormModel } from '../../../models/portal/formModels'
import PageState from '../../../shared/ui/PageState.vue'

const loading = ref(true)
const submitting = ref(false)
const registryLoading = ref(false)
const error = ref('')
const registryError = ref('')
const registrySuccess = ref('')
const settlements = ref([])
const participants = ref([])
const registryRows = ref([])
const copy = t('settlements')

const form = reactive(createSettlementFormModel())

const participantOptions = computed(() => participants.value.map((item) => ({
  code: item.code,
  name: item.name,
  clearingAccount: item.clearingAccount
})))

const selectedParticipant = computed(() => {
  return participantOptions.value.find((item) => item.code === form.participantCode) ?? null
})

const isNetClearing = computed(() => form.clearingMethod === 'net')
const isBatchProcessing = computed(() => form.processingMode === 'batch')

watch(selectedParticipant, (participant) => {
  form.clearingAccount = participant?.clearingAccount || ''
})

watch(() => form.clearingMethod, (value) => {
  if (value === 'gross') {
    form.nettingPosition = 'individual'
  } else if (form.nettingPosition === 'individual') {
    form.nettingPosition = 'flat'
  }
})

watch(() => form.processingMode, (value) => {
  if (value === 'batch') {
    if (!form.batchWindow) {
      form.batchWindow = 'EOD'
    }
    if (!form.batchOperationCount || Number(form.batchOperationCount) < 2) {
      form.batchOperationCount = 10
    }
    return
  }

  form.batchWindow = ''
  form.batchOperationCount = 1
})

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    const [settlementResponse, participantResponse] = await Promise.all([
      getSettlements(),
      getParticipants()
    ])
    settlements.value = settlementResponse.items ?? []
    participants.value = participantResponse.items ?? []

    if (!form.participantCode && participants.value.length > 0) {
      form.participantCode = participants.value[0].code
      form.clearingAccount = participants.value[0].clearingAccount
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('common.unexpectedError')
  } finally {
    loading.value = false
  }
}

async function submitForm() {
  error.value = ''
  submitting.value = true

  try {
    await createSettlement({
      participantCode: form.participantCode,
      clearingMethod: form.clearingMethod,
      processingMode: form.processingMode,
      applicationArea: form.applicationArea,
      automationLevel: form.automationLevel,
      instrument: form.instrument,
      amount: Number(form.amount),
      currency: form.currency,
      settlementDate: form.settlementDate,
      nettingPosition: form.nettingPosition,
      priority: form.priority,
      batchWindow: form.batchWindow,
      batchOperationCount: Number(form.batchOperationCount)
    })

    const nextParticipantCode = form.participantCode
    Object.assign(form, createSettlementFormModel())
    form.participantCode = nextParticipantCode
    form.clearingAccount = selectedParticipant.value?.clearingAccount || ''
    await loadData()
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('common.unexpectedError')
  } finally {
    submitting.value = false
  }
}

function normalizeInstrument(value) {
  const normalized = String(value || '').trim().toLowerCase()
  if (['пополнить', 'top_up', 'topup', 'deposit'].includes(normalized)) {
    return 'top_up'
  }
  if (['перевести', 'transfer', 'payment'].includes(normalized)) {
    return 'transfer'
  }
  if (['списать', 'debit', 'write_off', 'withdraw'].includes(normalized)) {
    return 'debit'
  }
  return ''
}

function normalizeRegistryRows(rows) {
  const output = []

  for (const row of rows) {
    const participantCode = String(row.participantCode ?? row.participant_code ?? row['Код участника'] ?? '').trim()
    const amount = Number(row.amount ?? row['Сумма'] ?? 0)
    const instrument = normalizeInstrument(row.instrument ?? row['Инструмент'])
    const clearingMethod = String(row.clearingMethod ?? row.clearing_method ?? row['Тип клиринга'] ?? 'gross').trim().toLowerCase() || 'gross'
    const processingMode = String(row.processingMode ?? row.processing_mode ?? row['Режим обработки'] ?? 'realtime').trim().toLowerCase() || 'realtime'
    const applicationArea = String(row.applicationArea ?? row.application_area ?? row['Область применения'] ?? 'payment').trim().toLowerCase() || 'payment'
    const automationLevel = String(row.automationLevel ?? row.automation_level ?? row['Автоматизация'] ?? 'automated').trim().toLowerCase() || 'automated'
    const settlementDate = String(row.settlementDate ?? row.settlement_date ?? row['Дата расчета'] ?? '').trim()
    const currency = String(row.currency ?? row['Валюта'] ?? 'KZT').trim() || 'KZT'
    const nettingPosition = String(row.nettingPosition ?? row.netting_position ?? row['Неттинг'] ?? 'flat').trim() || 'flat'
    const priority = String(row.priority ?? row['Приоритет'] ?? 'medium').trim() || 'medium'
    const batchWindow = String(row.batchWindow ?? row.batch_window ?? row['Пакетное окно'] ?? '').trim()
    const batchOperationCount = Number(row.batchOperationCount ?? row.batch_operation_count ?? row['Количество операций'] ?? 1)

    if (!participantCode || !instrument || !amount || !settlementDate) {
      continue
    }

    output.push({
      participantCode,
      clearingMethod,
      processingMode,
      applicationArea,
      automationLevel,
      amount,
      instrument,
      settlementDate,
      currency,
      nettingPosition,
      priority,
      batchWindow,
      batchOperationCount
    })
  }

  return output
}

async function handleRegistryUpload(event) {
  registryError.value = ''
  registrySuccess.value = ''
  const [file] = event.target.files ?? []
  if (!file) {
    return
  }

  registryLoading.value = true

  try {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const firstSheetName = workbook.SheetNames[0]
    const firstSheet = workbook.Sheets[firstSheetName]
    const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' })
    registryRows.value = normalizeRegistryRows(rows)

    if (registryRows.value.length === 0) {
      throw new Error(copy.registryUploadError)
    }

    await createSettlementsBatch(registryRows.value)
    registrySuccess.value = t('settlements.registryUploadSuccess', { count: registryRows.value.length })
    await loadData()
  } catch (err) {
    registryError.value = err instanceof Error ? err.message : t('common.unexpectedError')
  } finally {
    registryLoading.value = false
    event.target.value = ''
  }
}

async function confirmItem(id) {
  await confirmSettlement(id)
  await loadData()
}

async function cancelItem(id) {
  await cancelSettlement(id)
  await loadData()
}

function instrumentLabel(value) {
  if (value === 'top_up') return copy.instruments.topUp
  if (value === 'transfer') return copy.instruments.transfer
  if (value === 'debit') return copy.instruments.debit
  return value
}

function clearingMethodLabel(value) {
  if (value === 'gross') return copy.gross
  if (value === 'net') return copy.net
  return value
}

function processingModeLabel(value) {
  if (value === 'realtime') return copy.realtime
  if (value === 'batch') return copy.batch
  return value
}

onMounted(loadData)
</script>

<template>
  <div class="dashboard-stack">
    <section class="dashboard-hero-card">
      <div class="dashboard-hero-main">
        <p class="micro-label">{{ copy.headerKicker }}</p>
        <h1>{{ copy.title }}</h1>
      </div>
      <div class="dashboard-hero-actions">
        <button class="primary-button" @click="loadData">{{ t('common.refresh') }}</button>
      </div>
    </section>

    <section class="form-card">
      <div class="section-head">
        <div>
          <p class="micro-label">{{ copy.manualKicker }}</p>
          <h2>{{ copy.manualTitle }}</h2>
        </div>
        <button class="primary-button" :disabled="submitting" @click="submitForm">
          {{ submitting ? copy.creating : copy.create }}
        </button>
      </div>

      <div class="form-grid">
      <label class="field">
        <span>{{ copy.participant }}</span>
        <select v-model="form.participantCode">
          <option disabled value="">{{ copy.selectParticipant }}</option>
          <option v-for="item in participantOptions" :key="item.code" :value="item.code">
            {{ item.name }} ({{ item.code }})
          </option>
        </select>
      </label>

      <label class="field">
        <span>{{ copy.clearingMethod }}</span>
        <select v-model="form.clearingMethod">
          <option value="gross">{{ copy.gross }}</option>
          <option value="net">{{ copy.net }}</option>
        </select>
      </label>

      <label class="field">
        <span>{{ copy.processingMode }}</span>
        <select v-model="form.processingMode">
          <option value="realtime">{{ copy.realtime }}</option>
          <option value="batch">{{ copy.batch }}</option>
        </select>
      </label>

      <label class="field">
        <span>{{ copy.applicationArea }}</span>
        <select v-model="form.applicationArea">
          <option value="banking">{{ copy.areas.banking }}</option>
          <option value="payment">{{ copy.areas.payment }}</option>
          <option value="corporate">{{ copy.areas.corporate }}</option>
          <option value="exchange">{{ copy.areas.exchange }}</option>
        </select>
      </label>

      <label class="field">
        <span>{{ copy.automationLevel }}</span>
        <select v-model="form.automationLevel">
          <option value="manual">{{ copy.automation.manual }}</option>
          <option value="automated">{{ copy.automation.automated }}</option>
        </select>
      </label>

      <label class="field">
        <span>{{ copy.instrument }}</span>
        <select v-model="form.instrument">
          <option value="top_up">{{ copy.instruments.topUp }}</option>
          <option value="transfer">{{ copy.instruments.transfer }}</option>
          <option value="debit">{{ copy.instruments.debit }}</option>
        </select>
      </label>

      <label class="field">
        <span>{{ copy.amount }}</span>
        <input v-model="form.amount" type="number" min="0" :placeholder="copy.amount" />
      </label>

      <label class="field">
        <span>{{ copy.currency }}</span>
        <input v-model="form.currency" :placeholder="copy.currency" />
      </label>

      <label class="field">
        <span>{{ copy.settlementDate }}</span>
        <input v-model="form.settlementDate" type="date" />
      </label>

      <label v-if="isNetClearing" class="field">
        <span>{{ copy.netting }}</span>
        <select v-model="form.nettingPosition">
          <option value="flat">Flat</option>
          <option value="short">Short</option>
          <option value="long">Long</option>
        </select>
      </label>

      <label v-if="isBatchProcessing" class="field">
        <span>{{ copy.batchWindow }}</span>
        <select v-model="form.batchWindow">
          <option value="15M">15 минут</option>
          <option value="1H">1 час</option>
          <option value="EOD">Конец дня</option>
        </select>
      </label>

      <label v-if="isBatchProcessing" class="field">
        <span>{{ copy.batchCount }}</span>
        <input v-model="form.batchOperationCount" type="number" min="2" />
      </label>

      <label class="field">
        <span>{{ copy.priority }}</span>
        <input v-model="form.priority" :placeholder="copy.priority" />
      </label>

      <label class="field">
        <span>{{ copy.clearingAccount }}</span>
        <input :value="form.clearingAccount" disabled />
      </label>
      </div>

    </section>

    <section class="form-card">
      <div class="section-head">
        <div>
          <p class="micro-label">{{ copy.uploadKicker }}</p>
          <h2>{{ copy.uploadTitle }}</h2>
        </div>
      </div>

      <p class="registry-hint">{{ copy.registryHint }}</p>
      <p class="registry-hint">{{ copy.registryHintRu }}</p>
      <p class="registry-hint">{{ copy.registryHintRules }}</p>

      <label class="upload-box">
        <span>{{ registryLoading ? copy.uploadLoading : copy.uploadAction }}</span>
        <input type="file" accept=".xlsx,.xls,.csv" :disabled="registryLoading" @change="handleRegistryUpload" />
      </label>

      <p v-if="registrySuccess" class="success-line">{{ registrySuccess }}</p>
      <p v-if="registryError" class="error-line">{{ registryError }}</p>

      <div v-if="registryRows.length" class="registry-preview">
        <div class="section-head compact">
          <div>
            <p class="micro-label">{{ copy.previewKicker }}</p>
            <h3>{{ copy.previewTitle }}</h3>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>{{ copy.columns.participant }}</th>
              <th>{{ copy.columns.clearing }}</th>
              <th>{{ copy.columns.mode }}</th>
              <th>{{ copy.columns.instrument }}</th>
              <th>{{ copy.columns.amount }}</th>
              <th>{{ copy.columns.date }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in registryRows.slice(0, 6)" :key="`${row.participantCode}-${index}`">
              <td>{{ row.participantCode }}</td>
              <td>{{ clearingMethodLabel(row.clearingMethod) }}</td>
              <td>{{ processingModeLabel(row.processingMode) }}</td>
              <td>{{ instrumentLabel(row.instrument) }}</td>
              <td>{{ Number(row.amount).toLocaleString() }} {{ row.currency }}</td>
              <td>{{ row.settlementDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <PageState :loading="loading" :error="error" />

    <section v-if="!loading && !error" class="table-card">
      <div class="section-head">
        <div>
          <p class="micro-label">{{ copy.bookKicker }}</p>
          <h2>{{ copy.bookTitle }}</h2>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>{{ copy.columns.id }}</th>
            <th>{{ copy.columns.participant }}</th>
            <th>{{ copy.columns.clearing }}</th>
            <th>{{ copy.columns.mode }}</th>
            <th>{{ copy.columns.instrument }}</th>
            <th>{{ copy.columns.account }}</th>
            <th>{{ copy.columns.amount }}</th>
            <th>{{ copy.columns.status }}</th>
            <th>{{ copy.columns.date }}</th>
            <th>{{ copy.columns.actions }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in settlements" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.participant }}</td>
            <td>{{ clearingMethodLabel(item.clearingMethod) }}</td>
            <td>{{ processingModeLabel(item.processingMode) }}</td>
            <td>{{ instrumentLabel(item.instrument) }}</td>
            <td>{{ item.clearingAccount }}</td>
            <td>{{ item.amount.toLocaleString() }} {{ item.currency }}</td>
            <td><span class="status-chip">{{ item.status }}</span></td>
            <td>{{ item.settlementDate }}</td>
            <td class="actions-cell">
              <button class="ghost-button" @click="confirmItem(item.id)">{{ copy.confirm }}</button>
              <button class="ghost-button danger" @click="cancelItem(item.id)">{{ copy.cancel }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field span {
  font-size: 0.9rem;
  font-weight: 600;
  color: #334662;
}

.field input,
.field select {
  width: 100%;
}

.registry-hint {
  margin: 0 0 12px;
  color: #52637c;
  line-height: 1.6;
}

.upload-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  border: 1px dashed rgba(63, 81, 181, 0.35);
  border-radius: 16px;
  background: #f7f9fc;
  color: #31415e;
  font-weight: 600;
}

.upload-box input {
  border: none;
  background: transparent;
  padding: 0;
}

.registry-preview {
  margin-top: 18px;
}

.compact {
  margin-bottom: 12px;
}

.success-line {
  margin: 12px 0 0;
  color: #1e7a46;
  font-weight: 600;
}

.error-line {
  margin: 12px 0 0;
  color: #b42318;
  font-weight: 600;
}
</style>
