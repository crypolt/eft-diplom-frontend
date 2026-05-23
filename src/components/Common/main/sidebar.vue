<template>
  <aside class="sidebar">
    <div class="sidebar-panel">
      <p class="sidebar-label">{{ copy.navigation }}</p>
      <RouterLink v-if="canSeeDashboard" to="/dashboard">{{ copy.overview }}</RouterLink>
      <RouterLink v-if="canSeePayments" to="/dashboard/payments">{{ copy.payments }}</RouterLink>
      <RouterLink v-if="canSeeSupport" to="/dashboard/support">{{ copy.support }}</RouterLink>
      <RouterLink v-if="canSeeSettlements" to="/dashboard/settlements">{{ copy.settlements }}</RouterLink>
      <RouterLink v-if="canSeeParticipants" to="/dashboard/participants">{{ copy.participants }}</RouterLink>
      <RouterLink v-if="canSeeTransactions" to="/dashboard/transactions">{{ copy.transactions }}</RouterLink>

      <div v-if="canSeeAdmin" class="sidebar-admin-group">
        <p class="sidebar-group-title">{{ copy.adminGroup }}</p>
        <button
          type="button"
          class="sidebar-link-button"
          :class="{ active: isAdminRoute && currentAdminSection === 'overview' }"
          @click="openAdminOverview"
        >
          {{ copy.admin }}
        </button>
        <div class="sidebar-subnav">
          <button type="button" class="sidebar-link-button sidebar-subnav-button" :class="{ active: isAdminSectionActive('approvals') }" @click="openAdminSection('approvals')">{{ copy.adminLinks.approvals }}</button>
          <button type="button" class="sidebar-link-button sidebar-subnav-button" :class="{ active: isAdminSectionActive('config') }" @click="openAdminSection('config')">{{ copy.adminLinks.config }}</button>
          <button type="button" class="sidebar-link-button sidebar-subnav-button" :class="{ active: isAdminSectionActive('companies') }" @click="openAdminSection('companies')">{{ copy.adminLinks.companies }}</button>
          <button type="button" class="sidebar-link-button sidebar-subnav-button" :class="{ active: isAdminSectionActive('users') }" @click="openAdminSection('users')">{{ copy.adminLinks.users }}</button>
          <button type="button" class="sidebar-link-button sidebar-subnav-button" :class="{ active: isAdminSectionActive('security') }" @click="openAdminSection('security')">{{ copy.adminLinks.security }}</button>
          <button type="button" class="sidebar-link-button sidebar-subnav-button" :class="{ active: isAdminSectionActive('authHistory') }" @click="openAdminSection('authHistory')">{{ copy.adminLinks.authHistory }}</button>
        </div>
      </div>
    </div>

    <div class="sidebar-card">
      <p class="sidebar-label">{{ copy.access }}</p>
      <strong>{{ displayName }}</strong>
      <span>{{ subtitle }}</span>
      <span class="status-line">{{ t('sidebar.kycLine', { kyc: kycLevel, status: identificationStatus }) }}</span>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { t } from '../../../assets/languages'
import { useAdminSection } from '../../../features/admin/model/adminSection'
import store from '../../../store'

const copy = t('sidebar')
const route = useRoute()
const router = useRouter()
const { currentAdminSection, setAdminSection } = useAdminSection()

const displayName = computed(() => {
  const user = store.user.value
  return user?.fullName || user?.username || copy.fallbackName
})

const subtitle = computed(() => {
  const user = store.user.value
  return user?.email || copy.fallbackSubtitle
})

const kycLevel = computed(() => store.user.value?.kycLevel || 'minimal')
const identificationStatus = computed(() => store.user.value?.identificationStatus || 'unidentified')
const isIdentified = computed(() => identificationStatus.value === 'identified')
const accessSet = computed(() => new Set(store.user.value?.accesses ?? []))
const permissionSet = computed(() => new Set((store.user.value?.permissions ?? []).map((item) => item.code)))

function hasAccess(...codes) {
  return codes.some((code) => accessSet.value.has(code) || permissionSet.value.has(code))
}

const canSeeDashboard = computed(() => hasAccess('portal.dashboard', 'portal.dashboard.view'))
const canSeePayments = computed(() => hasAccess('payments.view', 'payments.create'))
const canSeeSupport = computed(() => hasAccess('tickets.view', 'tickets.create'))
const canSeeSettlements = computed(() => isIdentified.value && hasAccess('portal.settlements'))
const canSeeParticipants = computed(() => isIdentified.value && hasAccess('portal.participants'))
const canSeeTransactions = computed(() => isIdentified.value && hasAccess('portal.transactions'))
const canSeeAdmin = computed(() => {
  return hasAccess('admin.panel.view', 'admin.users.manage', 'admin.config.manage', 'admin.approvals.manage')
})

const isAdminRoute = computed(() => route.path === '/dashboard/admin')

function openAdminOverview() {
  setAdminSection('overview')
  if (!isAdminRoute.value) {
    router.push('/dashboard/admin')
  }
}

function openAdminSection(section) {
  setAdminSection(section)
  if (!isAdminRoute.value) {
    router.push('/dashboard/admin')
  }
}

function isAdminSectionActive(section) {
  return isAdminRoute.value && currentAdminSection.value === section
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-self: stretch;
  min-height: 100%;
  padding: 32px 20px;
  background:
    linear-gradient(180deg, rgba(236, 241, 250, 0.96), rgba(245, 248, 253, 0.98));
  border-right: 1px solid rgba(67, 88, 125, 0.1);
}

.sidebar-panel,
.sidebar-card {
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.sidebar-panel {
  display: grid;
  gap: 4px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(67, 88, 125, 0.08);
  border-radius: 18px;
}

.sidebar-card {
  padding-top: 20px;
  border-top: 1px solid rgba(67, 88, 125, 0.12);
}

.sidebar-group-title {
  margin: 14px 0 8px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #51627e;
}

.sidebar-admin-group {
  display: grid;
  gap: 4px;
  margin-top: 10px;
}

.sidebar-panel a {
  display: block;
  padding: 12px 14px;
  border-radius: 14px;
  text-decoration: none;
  color: #32435f;
  font-weight: 600;
}

.sidebar-link-button {
  display: block;
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 14px;
  background: transparent;
  text-align: left;
  color: #32435f;
  font-weight: 600;
}

.sidebar-panel a:hover,
.sidebar-panel a.router-link-active,
.sidebar-link-button:hover,
.sidebar-link-button.active {
  background: #eef1fb;
  color: #3f51b5;
}

.sidebar-subnav {
  display: grid;
  gap: 4px;
  padding-left: 12px;
}

.sidebar-subnav a {
  padding: 9px 12px;
  font-size: 0.92rem;
  font-weight: 600;
  color: #5a6b86;
}

.sidebar-subnav-button {
  padding: 9px 12px;
  font-size: 0.92rem;
  color: #5a6b86;
}

.sidebar-label {
  margin: 0 0 12px;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #7f8ea6;
}

.sidebar-card strong {
  display: block;
  color: #26344f;
  margin-bottom: 6px;
}

.sidebar-card span {
  color: #5b6b84;
  line-height: 1.5;
}

.status-line {
  display: block;
  margin-top: 10px;
  font-weight: 600;
  color: #3f51b5;
}

@media (max-width: 980px) {
  .sidebar {
    min-height: auto;
    padding: 20px 16px 0;
    background: transparent;
    border-right: none;
  }

  .sidebar-card {
    padding-top: 16px;
  }
}
</style>
