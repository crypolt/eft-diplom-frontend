<script setup>
import { computed, onMounted, ref } from 'vue'
import { t } from '../../assets/languages'
import { getDashboardSummary, getMyAuthHistory } from '../../services/api'
import PageState from '../../shared/ui/PageState.vue'
import store from '../../store'

const summary = ref(null)
const authHistory = ref([])
const loading = ref(true)
const error = ref('')
const copy = t('dashboard.main')

const userName = computed(() => store.user.value?.fullName || store.user.value?.username || copy.fallbackUser)
const isIdentified = computed(() => store.user.value?.identificationStatus === 'identified')

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    summary.value = await getDashboardSummary()
    authHistory.value = []
    try {
      const authHistoryData = await getMyAuthHistory()
      authHistory.value = authHistoryData.items ?? []
    } catch {
      authHistory.value = []
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('common.unexpectedError')
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <div class="dashboard-stack">
    <header class="dashboard-hero-card">
      <div class="dashboard-hero-main">
        <div>
          <p class="micro-label">{{ copy.title }}</p>
          <h1>{{ copy.title }}</h1>
        </div>
        <div class="user-greeting">
          {{ t('dashboard.main.welcome', { name: userName }) }}
        </div>
      </div>
      <div class="dashboard-hero-actions">
        <button class="btn secondary" @click="loadData">{{ t('common.refresh') }}</button>
      </div>
    </header>

    <PageState :loading="loading" :error="error" />

    <section v-if="!isIdentified" class="dashboard-note-card">
      <h3>{{ copy.unidentifiedTitle }}</h3>
      <p>{{ copy.unidentifiedDesc }}</p>
      <RouterLink to="/onboarding/identity" class="route-link">{{ copy.passBiometry }}</RouterLink>
    </section>

    <template v-if="!loading && !error && summary">
      <section class="dashboard-section-grid three-columns">
        <article class="dashboard-stat-card">
          <h3>{{ copy.operatingDay }}</h3>
          <p class="dashboard-stat-value">{{ summary.operatingDay }}</p>
          <p>{{ t('dashboard.main.processedDeals', { value: summary.processedDeals }) }}</p>
        </article>
        <article class="dashboard-stat-card">
          <h3>{{ copy.volume }}</h3>
          <p class="dashboard-stat-value">{{ summary.totalVolume.toLocaleString() }}</p>
          <p>{{ t('dashboard.main.openSettlements', { value: summary.openSettlements }) }}</p>
        </article>
        <article class="dashboard-stat-card">
          <h3>{{ copy.approvalQueue }}</h3>
          <p class="dashboard-stat-value">{{ summary.pendingApprovals }}</p>
          <p>{{ t('dashboard.main.openTickets', { value: summary.openTickets }) }}</p>
        </article>
      </section>

      <section class="dashboard-panel-card">
        <div class="dashboard-history-head">
          <div>
            <p class="micro-label">{{ copy.authHistoryKicker }}</p>
            <h3>{{ copy.authHistoryTitle }}</h3>
          </div>
          <span class="dashboard-history-caption">{{ copy.authHistoryCaption }}</span>
        </div>
        <div class="history-table-wrap">
          <table class="history-table">
            <colgroup>
              <col class="col-time" />
              <col class="col-event" />
              <col class="col-status" />
              <col class="col-client" />
              <col class="col-ip" />
              <col class="col-details" />
            </colgroup>
            <thead>
              <tr>
                <th>{{ copy.authHistoryColumns.time }}</th>
                <th>{{ copy.authHistoryColumns.event }}</th>
                <th>{{ copy.authHistoryColumns.status }}</th>
                <th>{{ copy.authHistoryColumns.client }}</th>
                <th>{{ copy.authHistoryColumns.ip }}</th>
                <th>{{ copy.authHistoryColumns.details }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in authHistory" :key="item.id">
                <td class="wrap-cell">{{ item.createdAt }}</td>
                <td class="wrap-cell">{{ item.eventType }}</td>
                <td>
                  <span class="history-status" :class="{ danger: !item.success }">
                    {{ item.success ? copy.authHistorySuccess : copy.authHistoryFailed }}
                  </span>
                </td>
                <td class="wrap-cell">{{ item.clientId }}</td>
                <td class="wrap-cell">{{ item.ipAddress || copy.authHistoryUnknown }}</td>
                <td class="wrap-cell">{{ item.errorMessage || item.userAgent || copy.authHistoryEmpty }}</td>
              </tr>
              <tr v-if="authHistory.length === 0">
                <td colspan="6" class="empty-note">{{ copy.authHistoryEmptyState }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.user-greeting {
  color: #7a8aa5;
}

.dashboard-stat-card h3,
.dashboard-note-card h3 {
  margin: 0 0 12px;
  color: #2d3c58;
}

.route-link {
  display: block;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f4f6fb;
  text-decoration: none;
  color: #334662;
  font-weight: 600;
}

.dashboard-history-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.dashboard-history-caption {
  color: #7a8aa5;
  font-size: 0.92rem;
}
m
.history-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.history-table {
  width: 100%;
  min-width: 1080px;
  border-collapse: collapse;
  table-layout: fixed;
}

.history-table .col-time {
  width: 16%;
}

.history-table .col-event {
  width: 11%;
}

.history-table .col-status {
  width: 10%;
}

.history-table .col-client {
  width: 16%;
}

.history-table .col-ip {
  width: 13%;
}

.history-table .col-details {
  width: 34%;
}

.history-table th,
.history-table td {
  padding: 14px 10px;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid rgba(67, 88, 125, 0.1);
  color: #42546f;
}

.history-table th {
  white-space: normal;
  word-break: normal;
  overflow-wrap: break-word;
}

.history-status {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: #e6f4ea;
  color: #1d6b3d;
  font-weight: 700;
  font-size: 0.84rem;
}

.history-status.danger {
  background: #fdecec;
  color: #b42318;
}

.wrap-cell {
  white-space: normal;
  word-break: normal;
  overflow-wrap: break-word;
  line-height: 1.45;
}

@media (max-width: 720px) {
  .dashboard-history-head {
    flex-direction: column;
  }
}
</style>
