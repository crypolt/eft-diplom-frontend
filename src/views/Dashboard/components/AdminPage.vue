<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { t } from '../../../assets/languages'
import Modal from '../../../components/Common/basic/modal.vue'
import { useAdminSection } from '../../../features/admin/model/adminSection'
import { createCompanyFormModel } from '../../../models/portal/formModels'
import {
  approveRequest,
  createAdminCompany,
  createAdminUser,
  createPermission,
  createRole,
  createSupportTicket,
  deleteAdminUser,
  deleteCompany,
  deletePermission,
  deleteRole,
  getAdminAuthHistory,
  getAdminConfig,
  getAdminUsers,
  getApprovalRequests,
  getCompanies,
  getCompanyAccesses,
  getPermissions,
  getRoles,
  grantCompanyAccess,
  rejectRequest,
  updateAdminConfig,
  updateAdminUser,
  updatePermission,
  updateRole
} from '../../../services/api'
import PageState from '../../../shared/ui/PageState.vue'

const loading = ref(true)
const actionLoading = ref(false)
const error = ref('')
const successMessage = ref('')
const reportLoading = ref(false)
const reportSuccessMessage = ref('')
const configs = ref([])
const approvals = ref([])
const users = ref([])
const roles = ref([])
const permissions = ref([])
const companies = ref([])
const companyAccesses = ref([])
const authHistory = ref([])
const selectedRolesByUser = reactive({})
const selectedPermissionsByRole = reactive({})
const companyForm = reactive(createCompanyFormModel())
const newUserForm = reactive({
  username: '',
  email: '',
  password: '',
  fullName: '',
  phone: '',
  status: 'active',
  kycLevel: 'minimal',
  identificationStatus: 'unidentified',
  roleCodes: []
})
const newRoleForm = reactive({
  code: '',
  name: '',
  permissionCodes: []
})
const newPermissionForm = reactive({
  code: '',
  name: '',
  section: ''
})
const accessForm = reactive({
  userId: '',
  companyId: '',
  accessRole: 'operator'
})
const errorDialog = reactive({
  open: false,
  title: '',
  message: '',
  context: '',
  occurredAt: '',
  reported: false,
  reportError: ''
})
const rejectDialog = reactive({
  open: false,
  approvalId: '',
  paymentNumber: '',
  reason: ''
})
const copy = t('dashboard.admin')
const { currentAdminSection, setAdminSection } = useAdminSection()

const currentSection = computed(() => currentAdminSection.value || 'overview')
const sectionTitle = computed(() => {
  if (currentSection.value === 'approvals') return copy.adminLinks.approvals
  if (currentSection.value === 'config') return copy.adminLinks.config
  if (currentSection.value === 'companies') return copy.adminLinks.companies
  if (currentSection.value === 'users') return copy.adminLinks.users
  if (currentSection.value === 'security') return copy.adminLinks.security
  if (currentSection.value === 'authHistory') return copy.adminLinks.authHistory
  return copy.overviewTitle
})
const sectionDescription = computed(() => {
  if (currentSection.value === 'approvals') return copy.overviewDescriptions.approvals
  if (currentSection.value === 'config') return copy.overviewDescriptions.config
  if (currentSection.value === 'companies') return copy.overviewDescriptions.companies
  if (currentSection.value === 'users') return copy.overviewDescriptions.users
  if (currentSection.value === 'security') return copy.overviewDescriptions.security
  if (currentSection.value === 'authHistory') return copy.overviewDescriptions.authHistory
  return copy.overviewDescriptions.overview
})
const stats = computed(() => ({
  users: users.value.length,
  companies: companies.value.length,
  approvals: approvals.value.filter((item) => item.status === 'pending').length,
  assignments: companyAccesses.value.filter((item) => item.status === 'active').length
}))
const permissionGroups = computed(() => {
  const groups = {}

  for (const permission of permissions.value) {
    const key = permission.section || copy.permissionsDefaultGroup
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(permission)
  }

  return Object.entries(groups).sort(([left], [right]) => left.localeCompare(right, 'ru'))
})

function syncRoleState() {
  for (const user of users.value) {
    selectedRolesByUser[user.id] = [...(user.roles ?? [])]
  }
}

function syncRolePermissionState() {
  for (const role of roles.value) {
    selectedPermissionsByRole[role.id] = [...(role.permissionCodes ?? [])]
  }
}

function resetErrorDialog() {
  errorDialog.open = false
  errorDialog.title = ''
  errorDialog.message = ''
  errorDialog.context = ''
  errorDialog.occurredAt = ''
  errorDialog.reported = false
  errorDialog.reportError = ''
}

function openBackendErrorDialog(err, fallbackMessage, context, showPageState = false) {
  const message = err instanceof Error ? err.message : fallbackMessage
  const occurredAt = new Date().toISOString()

  if (showPageState) {
    error.value = message
  }

  reportSuccessMessage.value = ''
  errorDialog.open = true
  errorDialog.title = copy.errorDialog.title
  errorDialog.message = message
  errorDialog.context = context
  errorDialog.occurredAt = occurredAt
  errorDialog.reported = false
  errorDialog.reportError = ''
}

async function reportBackendError() {
  reportLoading.value = true
  errorDialog.reportError = ''
  try {
    await createSupportTicket({
      subject: t('dashboard.admin.errorDialog.ticketSubject', { context: errorDialog.context }),
      category: 'system',
      priority: 'high',
      description: [
        copy.errorDialog.ticketSummary,
        `${copy.errorDialog.contextLabel}: ${errorDialog.context}`,
        `${copy.errorDialog.timeLabel}: ${errorDialog.occurredAt}`,
        `${copy.errorDialog.messageLabel}: ${errorDialog.message}`
      ].join('\n')
    })
    errorDialog.reported = true
    reportSuccessMessage.value = copy.errorDialog.ticketCreated
  } catch (err) {
    errorDialog.reportError = err instanceof Error ? err.message : copy.errorDialog.reportFailed
  } finally {
    reportLoading.value = false
  }
}

async function runAdminAction(action, options = {}) {
  const {
    context,
    success,
    fallbackError = t('common.unexpectedError'),
    reload = true
  } = options

  actionLoading.value = true
  reportSuccessMessage.value = ''
  try {
    await action()
    if (success) {
      successMessage.value = success
    }
    if (reload) {
      await loadData(false)
    }
  } catch (err) {
    openBackendErrorDialog(err, fallbackError, context)
  } finally {
    actionLoading.value = false
  }
}

async function loadData(showPageError = true) {
  loading.value = true
  error.value = ''
  try {
    const [configData, approvalData, userData, roleData, permissionData, companyData, accessData] = await Promise.all([
      getAdminConfig(),
      getApprovalRequests(),
      getAdminUsers(),
      getRoles(),
      getPermissions(),
      getCompanies(),
      getCompanyAccesses()
    ])
    configs.value = configData.items ?? []
    approvals.value = approvalData.items ?? []
    users.value = userData.items ?? []
    roles.value = roleData.items ?? []
    permissions.value = permissionData.items ?? []
    companies.value = companyData.items ?? []
    companyAccesses.value = accessData.items ?? []
    authHistory.value = []
    syncRoleState()
    syncRolePermissionState()

    if (!accessForm.userId && users.value.length > 0) {
      accessForm.userId = users.value[0].id
    }
    if (!accessForm.companyId && companies.value.length > 0) {
      accessForm.companyId = companies.value[0].id
    }

    try {
      const authHistoryData = await getAdminAuthHistory()
      authHistory.value = authHistoryData.items ?? []
    } catch {
      authHistory.value = []
    }
  } catch (err) {
    openBackendErrorDialog(err, t('common.unexpectedError'), copy.errorContexts.loadData, showPageError)
  } finally {
    loading.value = false
  }
}

function toggleRole(userId, roleCode, checked) {
  const current = new Set(selectedRolesByUser[userId] ?? [])
  if (checked) {
    current.add(roleCode)
  } else {
    current.delete(roleCode)
  }
  selectedRolesByUser[userId] = Array.from(current)
}

function togglePermission(roleId, permissionCode, checked) {
  const current = new Set(selectedPermissionsByRole[roleId] ?? [])
  if (checked) {
    current.add(permissionCode)
  } else {
    current.delete(permissionCode)
  }
  selectedPermissionsByRole[roleId] = Array.from(current)
}

function toggleNewUserRole(roleCode, checked) {
  const current = new Set(newUserForm.roleCodes)
  if (checked) {
    current.add(roleCode)
  } else {
    current.delete(roleCode)
  }
  newUserForm.roleCodes = Array.from(current)
}

function toggleNewRolePermission(permissionCode, checked) {
  const current = new Set(newRoleForm.permissionCodes)
  if (checked) {
    current.add(permissionCode)
  } else {
    current.delete(permissionCode)
  }
  newRoleForm.permissionCodes = Array.from(current)
}

async function saveConfig(item) {
  await runAdminAction(
    () => updateAdminConfig(item.key, { value: item.value }),
    {
      context: t('dashboard.admin.errorContexts.configSave', { key: item.key }),
      success: t('dashboard.admin.configSaved', { key: item.key })
    }
  )
}

async function approve(item) {
  await runAdminAction(
    () => approveRequest(item.id, { comment: 'Approved by administrator from admin panel' }),
    {
      context: t('dashboard.admin.errorContexts.approve', { paymentNumber: item.paymentNumber }),
      success: t('dashboard.admin.approvalAccepted', { paymentNumber: item.paymentNumber })
    }
  )
}

async function reject(item) {
  rejectDialog.open = true
  rejectDialog.approvalId = item.id
  rejectDialog.paymentNumber = item.paymentNumber
  rejectDialog.reason = ''
}

function closeRejectDialog() {
  rejectDialog.open = false
  rejectDialog.approvalId = ''
  rejectDialog.paymentNumber = ''
  rejectDialog.reason = ''
}

async function submitRejectReason() {
  const reason = rejectDialog.reason.trim()
  if (!reason) {
    openBackendErrorDialog(new Error(copy.rejectCommentRequired), copy.rejectCommentRequired, copy.errorContexts.reject)
    return
  }

  await runAdminAction(
    () => rejectRequest(rejectDialog.approvalId, { comment: reason }),
    {
      context: t('dashboard.admin.errorContexts.reject', { paymentNumber: rejectDialog.paymentNumber }),
      success: t('dashboard.admin.approvalRejected', { paymentNumber: rejectDialog.paymentNumber })
    }
  )

  if (!errorDialog.open) {
    closeRejectDialog()
  }
}

async function createUserFromAdmin() {
  await runAdminAction(
    () =>
      createAdminUser({
        ...newUserForm,
        roleCodes: [...newUserForm.roleCodes]
      }),
    {
      context: t('dashboard.admin.errorContexts.userCreate', { username: newUserForm.username || copy.fallbackNewUser }),
      success: t('dashboard.admin.userCreated', { username: newUserForm.username }),
      fallbackError: copy.userCreateError
    }
  )

  if (!errorDialog.open) {
    Object.assign(newUserForm, {
      username: '',
      email: '',
      password: '',
      fullName: '',
      phone: '',
      status: 'active',
      kycLevel: 'minimal',
      identificationStatus: 'unidentified',
      roleCodes: []
    })
  }
}

async function updateUserRecord(user) {
  await runAdminAction(
    () =>
      updateAdminUser(user.id, {
        email: user.email,
        password: user.newPassword || '',
        fullName: user.fullName,
        phone: user.phone,
        status: user.status,
        kycLevel: user.kycLevel,
        identificationStatus: user.identificationStatus,
        roleCodes: selectedRolesByUser[user.id] ?? []
      }),
    {
      context: t('dashboard.admin.errorContexts.userUpdate', { username: user.username }),
      success: t('dashboard.admin.userUpdated', { username: user.username }),
      fallbackError: copy.userUpdateError
    }
  )
  user.newPassword = ''
}

async function removeUser(user) {
  await runAdminAction(
    () => deleteAdminUser(user.id),
    {
      context: t('dashboard.admin.errorContexts.userDelete', { username: user.username }),
      success: t('dashboard.admin.userDeleted', { username: user.username }),
      fallbackError: copy.userDeleteError
    }
  )
}

async function createRoleFromAdmin() {
  await runAdminAction(
    () =>
      createRole({
        code: newRoleForm.code,
        name: newRoleForm.name,
        permissionCodes: [...newRoleForm.permissionCodes]
      }),
    {
      context: t('dashboard.admin.errorContexts.roleCreate', { code: newRoleForm.code || copy.fallbackNewRole }),
      success: t('dashboard.admin.roleCreated', { code: newRoleForm.code }),
      fallbackError: copy.roleCreateError
    }
  )

  if (!errorDialog.open) {
    Object.assign(newRoleForm, {
      code: '',
      name: '',
      permissionCodes: []
    })
  }
}

async function updateRoleRecord(role) {
  await runAdminAction(
    () =>
      updateRole(role.id, {
        name: role.name,
        permissionCodes: selectedPermissionsByRole[role.id] ?? []
      }),
    {
      context: t('dashboard.admin.errorContexts.roleUpdate', { code: role.code }),
      success: t('dashboard.admin.roleUpdated', { code: role.code }),
      fallbackError: copy.roleUpdateError
    }
  )
}

async function removeRole(role) {
  await runAdminAction(
    () => deleteRole(role.id),
    {
      context: t('dashboard.admin.errorContexts.roleDelete', { code: role.code }),
      success: t('dashboard.admin.roleDeleted', { code: role.code }),
      fallbackError: copy.roleDeleteError
    }
  )
}

async function createPermissionFromAdmin() {
  await runAdminAction(
    () =>
      createPermission({
        code: newPermissionForm.code,
        name: newPermissionForm.name,
        section: newPermissionForm.section
      }),
    {
      context: t('dashboard.admin.errorContexts.permissionCreate', { code: newPermissionForm.code || copy.fallbackNewPermission }),
      success: t('dashboard.admin.permissionCreated', { code: newPermissionForm.code }),
      fallbackError: copy.permissionCreateError
    }
  )

  if (!errorDialog.open) {
    Object.assign(newPermissionForm, {
      code: '',
      name: '',
      section: ''
    })
  }
}

async function updatePermissionRecord(permission) {
  await runAdminAction(
    () =>
      updatePermission(permission.id, {
        name: permission.name,
        section: permission.section
      }),
    {
      context: t('dashboard.admin.errorContexts.permissionUpdate', { code: permission.code }),
      success: t('dashboard.admin.permissionUpdated', { code: permission.code }),
      fallbackError: copy.permissionUpdateError
    }
  )
}

async function removePermission(permission) {
  await runAdminAction(
    () => deletePermission(permission.id),
    {
      context: t('dashboard.admin.errorContexts.permissionDelete', { code: permission.code }),
      success: t('dashboard.admin.permissionDeleted', { code: permission.code }),
      fallbackError: copy.permissionDeleteError
    }
  )
}

async function saveCompanyAccess() {
  await runAdminAction(
    () =>
      grantCompanyAccess({
        userId: accessForm.userId,
        companyId: accessForm.companyId,
        accessRole: accessForm.accessRole
      }),
    {
      context: t('dashboard.admin.errorContexts.companyAccessSave', {
        userId: accessForm.userId || copy.fallbackNewUser,
        companyId: accessForm.companyId || copy.fallbackNewCompany
      }),
      success: copy.companyAccessSaved
    }
  )
}

async function createCompanyFromAdmin() {
  await runAdminAction(
    async () => {
      const company = await createAdminCompany({
        code: companyForm.code,
        name: companyForm.name,
        merchantCode: companyForm.merchantCode
      })
      successMessage.value = t('dashboard.admin.companyCreated', { companyName: company.name })
    },
    {
      context: t('dashboard.admin.errorContexts.companyCreate', { companyName: companyForm.name || copy.fallbackNewCompany }),
      fallbackError: copy.companyCreateError
    }
  )

  if (!errorDialog.open) {
    Object.assign(companyForm, createCompanyFormModel())
  }
}

async function removeCompany(company) {
  await runAdminAction(
    () => deleteCompany(company.id),
    {
      context: t('dashboard.admin.errorContexts.companyDelete', { companyName: company.name }),
      success: t('dashboard.admin.companyDeleted', { companyName: company.name }),
      fallbackError: copy.companyDeleteError
    }
  )
}

onMounted(() => {
  if (!currentAdminSection.value) {
    setAdminSection('overview')
  }
  loadData()
})
</script>

<template>
  <div class="dashboard-stack">
    <section class="dashboard-hero-card">
      <div class="dashboard-hero-main">
        <p class="micro-label">{{ copy.kicker }}</p>
        <h1>{{ copy.title }}</h1>
        <p class="lead-copy">{{ sectionTitle }}. {{ sectionDescription }}</p>
      </div>
      <div class="dashboard-hero-actions">
        <button class="primary-button" @click="loadData(false)">{{ t('common.refresh') }}</button>
      </div>
    </section>

    <PageState :loading="loading" :error="error" />

    <template v-if="!loading && !error">
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="reportSuccessMessage" class="success-message">{{ reportSuccessMessage }}</p>

      <section v-if="currentSection === 'overview'" class="dashboard-section-grid four-columns">
        <article class="dashboard-stat-card stat-card">
          <p class="micro-label">{{ copy.usersKicker }}</p>
          <h2>{{ stats.users }}</h2>
          <span>{{ copy.usersStat }}</span>
        </article>
        <article class="dashboard-stat-card stat-card">
          <p class="micro-label">{{ copy.companiesKicker }}</p>
          <h2>{{ stats.companies }}</h2>
          <span>{{ copy.companiesStat }}</span>
        </article>
        <article class="dashboard-stat-card stat-card">
          <p class="micro-label">{{ copy.approvalsKicker }}</p>
          <h2>{{ stats.approvals }}</h2>
          <span>{{ copy.approvalsStat }}</span>
        </article>
        <article class="dashboard-stat-card stat-card">
          <p class="micro-label">{{ copy.assignmentsKicker }}</p>
          <h2>{{ stats.assignments }}</h2>
          <span>{{ copy.assignmentsStat }}</span>
        </article>
      </section>

      <section v-if="currentSection === 'approvals'" class="dashboard-stack admin-anchor">
        <article class="dashboard-panel-card">
          <p class="micro-label">{{ copy.approvalsKicker }}</p>
          <h2>{{ copy.approvalsTitle }}</h2>
          <div class="admin-table-wrap">
            <table class="settings-table admin-table">
              <thead>
                <tr>
                  <th>{{ copy.approvalColumns.payment }}</th>
                  <th>{{ copy.approvalColumns.type }}</th>
                  <th>{{ copy.approvalColumns.status }}</th>
                  <th>{{ copy.approvalColumns.role }}</th>
                  <th>{{ copy.approvalColumns.requester }}</th>
                  <th>{{ copy.approvalColumns.actions }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in approvals" :key="item.id">
                  <td class="wrap-cell"><strong>{{ item.paymentNumber }}</strong></td>
                  <td class="wrap-cell">{{ item.orderType }}</td>
                  <td class="wrap-cell">{{ item.status }}</td>
                  <td class="wrap-cell">{{ item.requestedRole }}</td>
                  <td class="wrap-cell">{{ item.requesterName }}</td>
                  <td>
                    <div class="action-row">
                      <button class="ghost-button" :disabled="actionLoading" @click="approve(item)">{{ copy.approve }}</button>
                      <button class="ghost-button danger" :disabled="actionLoading" @click="reject(item)">{{ copy.reject }}</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section v-if="currentSection === 'config'" class="dashboard-stack admin-anchor">
        <article class="dashboard-panel-card">
          <p class="micro-label">{{ copy.systemConfig }}</p>
          <h2>{{ copy.configTitle }}</h2>
          <div class="admin-table-wrap">
            <table class="settings-table admin-table">
              <thead>
                <tr>
                  <th>{{ copy.configColumns.key }}</th>
                  <th>{{ copy.configColumns.description }}</th>
                  <th>{{ copy.configColumns.value }}</th>
                  <th>{{ copy.configColumns.actions }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in configs" :key="item.key">
                  <td class="wrap-cell"><strong>{{ item.key }}</strong></td>
                  <td class="wrap-cell">{{ item.description }}</td>
                  <td><input v-model="item.value" /></td>
                  <td><button class="ghost-button" :disabled="actionLoading" @click="saveConfig(item)">{{ t('common.save') }}</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section v-if="currentSection === 'companies'" class="dashboard-stack admin-anchor">
        <article class="dashboard-panel-card">
          <div class="section-head section-head-aligned">
            <div>
              <p class="micro-label">{{ copy.companiesKicker }}</p>
              <h2>{{ copy.companyCreateTitle }}</h2>
              <p class="admin-section-copy">{{ copy.companyCreateLead }}</p>
            </div>
            <button class="primary-button" :disabled="actionLoading" @click="createCompanyFromAdmin">
              {{ copy.createCompany }}
            </button>
          </div>
          <div class="admin-form-shell">
            <div class="form-grid">
              <input v-model="companyForm.code" :placeholder="copy.companyCodePlaceholder" />
              <input v-model="companyForm.name" :placeholder="copy.companyNamePlaceholder" />
              <input v-model="companyForm.merchantCode" :placeholder="copy.companyMerchantPlaceholder" />
            </div>
          </div>
        </article>

        <article class="dashboard-panel-card">
          <div class="section-head section-head-aligned">
            <div>
              <p class="micro-label">{{ copy.companiesKicker }}</p>
              <h2>{{ copy.companiesTitle }}</h2>
              <p class="admin-section-copy">{{ copy.companiesLead }}</p>
            </div>
          </div>
          <div class="company-table-wrap">
            <table class="settings-table company-table">
              <thead>
                <tr>
                  <th>{{ copy.companyColumns.code }}</th>
                  <th>{{ copy.companyColumns.name }}</th>
                  <th>{{ copy.companyColumns.merchant }}</th>
                  <th>{{ copy.companyColumns.account }}</th>
                  <th>{{ copy.companyColumns.balance }}</th>
                  <th>{{ copy.companyColumns.status }}</th>
                  <th>{{ copy.companyColumns.actions }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="company in companies" :key="company.id">
                  <td class="wrap-cell"><strong>{{ company.code }}</strong></td>
                  <td class="wrap-cell">{{ company.name }}</td>
                  <td class="wrap-cell">{{ company.code }}-MAIN</td>
                  <td class="wrap-cell">{{ company.settlementAccount }}</td>
                  <td class="wrap-cell">{{ Number(company.walletBalance).toLocaleString() }} KZT</td>
                  <td class="wrap-cell">{{ company.status }} / {{ company.clearingStatus }}</td>
                  <td>
                    <div class="action-row">
                      <button class="ghost-button danger" :disabled="actionLoading" @click="removeCompany(company)">
                        {{ copy.deleteCompany }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section v-if="currentSection === 'users'" class="dashboard-stack admin-anchor">
        <article class="dashboard-panel-card">
          <div class="section-head section-head-aligned">
            <div>
              <p class="micro-label">{{ copy.usersKicker }}</p>
              <h2>{{ copy.userCreateTitle }}</h2>
              <p class="admin-section-copy">{{ copy.userCreateLead }}</p>
            </div>
            <button class="primary-button" :disabled="actionLoading" @click="createUserFromAdmin">
              {{ copy.createUser }}
            </button>
          </div>
          <div class="admin-form-shell">
            <div class="form-grid admin-form-grid-wide">
              <input v-model="newUserForm.username" :placeholder="copy.userCreatePlaceholders.username" />
              <input v-model="newUserForm.email" :placeholder="copy.userCreatePlaceholders.email" />
              <input v-model="newUserForm.password" type="password" :placeholder="copy.userCreatePlaceholders.password" />
              <input v-model="newUserForm.fullName" :placeholder="copy.userCreatePlaceholders.fullName" />
              <input v-model="newUserForm.phone" :placeholder="copy.userCreatePlaceholders.phone" />
              <select v-model="newUserForm.status">
                <option value="active">active</option>
                <option value="blocked">blocked</option>
              </select>
              <select v-model="newUserForm.kycLevel">
                <option value="minimal">minimal</option>
                <option value="standard">standard</option>
              </select>
              <select v-model="newUserForm.identificationStatus">
                <option value="unidentified">unidentified</option>
                <option value="pending_biometric">pending_biometric</option>
                <option value="identified">identified</option>
              </select>
            </div>
            <div class="selection-surface">
              <div class="selection-surface-head">
                <strong>{{ copy.rolesSelectionTitle }}</strong>
                <span>{{ copy.rolesSelectionLead }}</span>
              </div>
              <div class="token-grid">
                <label v-for="role in roles" :key="`new-user-${role.code}`" class="token-checkbox">
                  <input
                    type="checkbox"
                    :checked="newUserForm.roleCodes.includes(role.code)"
                    @change="toggleNewUserRole(role.code, $event.target.checked)"
                  />
                  <span>{{ role.code }}</span>
                </label>
              </div>
            </div>
          </div>
        </article>

        <article class="dashboard-panel-card">
          <p class="micro-label">{{ copy.usersKicker }}</p>
          <h2>{{ copy.rolesTitle }}</h2>
          <div class="admin-table-wrap">
            <table class="settings-table admin-table user-role-table">
              <thead>
                <tr>
                  <th>{{ copy.userColumns.user }}</th>
                  <th>{{ copy.userColumns.email }}</th>
                  <th>{{ copy.userColumns.profile }}</th>
                  <th>{{ copy.userColumns.kyc }}</th>
                  <th>{{ copy.userColumns.companies }}</th>
                  <th>{{ copy.userColumns.roles }}</th>
                  <th>{{ copy.userColumns.actions }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td class="wrap-cell"><strong>{{ user.username }}</strong></td>
                  <td><input v-model="user.email" /></td>
                  <td>
                    <div class="stacked-fields">
                      <input v-model="user.fullName" />
                      <input v-model="user.phone" />
                      <input v-model="user.newPassword" type="password" :placeholder="copy.userCreatePlaceholders.passwordOptional" />
                    </div>
                  </td>
                  <td>
                    <div class="stacked-fields">
                      <select v-model="user.status">
                        <option value="active">active</option>
                        <option value="blocked">blocked</option>
                      </select>
                      <select v-model="user.kycLevel">
                        <option value="minimal">minimal</option>
                        <option value="standard">standard</option>
                      </select>
                      <select v-model="user.identificationStatus">
                        <option value="unidentified">unidentified</option>
                        <option value="pending_biometric">pending_biometric</option>
                        <option value="identified">identified</option>
                      </select>
                    </div>
                  </td>
                  <td class="wrap-cell">{{ user.companyCodes?.join(', ') || copy.noCompanies }}</td>
                  <td>
                    <div class="token-grid token-grid-compact">
                      <label v-for="role in roles" :key="`${user.id}-${role.code}`" class="token-checkbox">
                        <input
                          type="checkbox"
                          :checked="(selectedRolesByUser[user.id] ?? []).includes(role.code)"
                          @change="toggleRole(user.id, role.code, $event.target.checked)"
                        />
                        <span>{{ role.code }}</span>
                      </label>
                    </div>
                  </td>
                  <td>
                    <div class="action-row action-row-vertical">
                      <button class="ghost-button" :disabled="actionLoading" @click="updateUserRecord(user)">{{ t('common.save') }}</button>
                      <button class="ghost-button danger" :disabled="actionLoading" @click="removeUser(user)">{{ copy.deleteUser }}</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article class="dashboard-panel-card">
          <div class="section-head section-head-aligned">
            <div>
              <p class="micro-label">{{ copy.companyAccessKicker }}</p>
              <h2>{{ copy.companyAccessTitle }}</h2>
              <p class="admin-section-copy">{{ copy.companyAccessLead }}</p>
            </div>
            <button class="primary-button" :disabled="actionLoading" @click="saveCompanyAccess">{{ copy.assignAccess }}</button>
          </div>

          <div class="admin-form-shell">
            <div class="form-grid">
              <select v-model="accessForm.userId">
                <option value="" disabled>{{ t('common.selectUser') }}</option>
                <option v-for="item in users" :key="item.id" :value="item.id">
                  {{ item.username }}
                </option>
              </select>
              <select v-model="accessForm.companyId">
                <option value="" disabled>{{ t('common.selectCompany') }}</option>
                <option v-for="item in companies" :key="item.id" :value="item.id">
                  {{ item.code }} - {{ item.name }}
                </option>
              </select>
              <select v-model="accessForm.accessRole">
                <option value="owner">{{ copy.accessRoles.owner }}</option>
                <option value="operator">{{ copy.accessRoles.operator }}</option>
                <option value="viewer">{{ copy.accessRoles.viewer }}</option>
              </select>
            </div>
          </div>

          <div class="admin-table-wrap">
            <table class="settings-table admin-table">
              <thead>
                <tr>
                  <th>{{ copy.accessColumns.user }}</th>
                  <th>{{ copy.accessColumns.company }}</th>
                  <th>{{ copy.accessColumns.role }}</th>
                  <th>{{ copy.accessColumns.status }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in companyAccesses" :key="item.id">
                  <td class="wrap-cell">{{ item.username }}</td>
                  <td class="wrap-cell">{{ item.companyCode }} - {{ item.companyName }}</td>
                  <td class="wrap-cell">{{ item.accessRole }}</td>
                  <td class="wrap-cell">{{ item.status }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section v-if="currentSection === 'security'" class="dashboard-stack admin-anchor">
        <article class="dashboard-panel-card">
          <div class="section-head section-head-aligned">
            <div>
              <p class="micro-label">{{ copy.securityModel }}</p>
              <h2>{{ copy.roleCreateTitle }}</h2>
              <p class="admin-section-copy">{{ copy.roleCreateLead }}</p>
            </div>
            <button class="primary-button" :disabled="actionLoading" @click="createRoleFromAdmin">
              {{ copy.createRole }}
            </button>
          </div>
          <div class="admin-form-shell">
            <div class="form-grid">
              <input v-model="newRoleForm.code" :placeholder="copy.rolePlaceholders.code" />
              <input v-model="newRoleForm.name" :placeholder="copy.rolePlaceholders.name" />
            </div>
            <div class="selection-surface">
              <div class="selection-surface-head">
                <strong>{{ copy.permissionsSelectionTitle }}</strong>
                <span>{{ copy.permissionsSelectionLead }}</span>
              </div>
              <div class="permission-group-stack">
                <section v-for="[sectionName, items] in permissionGroups" :key="`new-role-${sectionName}`" class="permission-group-card">
                  <div class="permission-group-head">
                    <strong>{{ sectionName }}</strong>
                    <span>{{ items.length }}</span>
                  </div>
                  <div class="token-grid">
                    <label v-for="permission in items" :key="`new-role-${permission.code}`" class="token-checkbox">
                      <input
                        type="checkbox"
                        :checked="newRoleForm.permissionCodes.includes(permission.code)"
                        @change="toggleNewRolePermission(permission.code, $event.target.checked)"
                      />
                      <span>{{ permission.code }}</span>
                    </label>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </article>

        <article class="dashboard-panel-card">
          <p class="micro-label">{{ copy.securityModel }}</p>
          <h2>{{ copy.roles }}</h2>
          <div class="role-card-grid">
            <article v-for="item in roles" :key="item.id" class="role-editor-card">
              <div class="role-editor-head">
                <div class="role-editor-title">
                  <strong>{{ item.code }}</strong>
                  <span>{{ copy.roleCodeLabel }}</span>
                </div>
                <div class="action-row">
                  <button class="ghost-button" :disabled="actionLoading" @click="updateRoleRecord(item)">{{ t('common.save') }}</button>
                  <button class="ghost-button danger" :disabled="actionLoading" @click="removeRole(item)">{{ copy.deleteRole }}</button>
                </div>
              </div>
              <div class="stacked-fields">
                <input v-model="item.name" :placeholder="copy.rolePlaceholders.name" />
              </div>
              <div class="permission-group-stack">
                <section v-for="[sectionName, items] in permissionGroups" :key="`${item.id}-${sectionName}`" class="permission-group-card">
                  <div class="permission-group-head">
                    <strong>{{ sectionName }}</strong>
                    <span>{{ items.length }}</span>
                  </div>
                  <div class="token-grid">
                    <label v-for="permission in items" :key="`${item.id}-${permission.code}`" class="token-checkbox">
                      <input
                        type="checkbox"
                        :checked="(selectedPermissionsByRole[item.id] ?? []).includes(permission.code)"
                        @change="togglePermission(item.id, permission.code, $event.target.checked)"
                      />
                      <span>{{ permission.code }}</span>
                    </label>
                  </div>
                </section>
              </div>
            </article>
          </div>
        </article>

        <article class="dashboard-panel-card">
          <div class="section-head section-head-aligned">
            <div>
              <p class="micro-label">{{ copy.permissionsKicker }}</p>
              <h2>{{ copy.permissionCreateTitle }}</h2>
              <p class="admin-section-copy">{{ copy.permissionCreateLead }}</p>
            </div>
            <button class="primary-button" :disabled="actionLoading" @click="createPermissionFromAdmin">
              {{ copy.createPermission }}
            </button>
          </div>
          <div class="admin-form-shell">
            <div class="form-grid">
              <input v-model="newPermissionForm.code" :placeholder="copy.permissionPlaceholders.code" />
              <input v-model="newPermissionForm.name" :placeholder="copy.permissionPlaceholders.name" />
              <input v-model="newPermissionForm.section" :placeholder="copy.permissionPlaceholders.section" />
            </div>
          </div>
        </article>

        <article class="dashboard-panel-card">
          <p class="micro-label">{{ copy.permissionsKicker }}</p>
          <h2>{{ copy.permissionsTitle }}</h2>
          <div class="admin-table-wrap">
            <table class="settings-table admin-table">
              <thead>
                <tr>
                  <th>{{ copy.securityColumns.code }}</th>
                  <th>{{ copy.securityColumns.name }}</th>
                  <th>{{ copy.securityColumns.section }}</th>
                  <th>{{ copy.securityColumns.actions }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in permissions" :key="item.id">
                  <td class="wrap-cell"><strong>{{ item.code }}</strong></td>
                  <td><input v-model="item.name" /></td>
                  <td><input v-model="item.section" /></td>
                  <td>
                    <div class="action-row">
                      <button class="ghost-button" :disabled="actionLoading" @click="updatePermissionRecord(item)">{{ t('common.save') }}</button>
                      <button class="ghost-button danger" :disabled="actionLoading" @click="removePermission(item)">{{ copy.deletePermission }}</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section v-if="currentSection === 'authHistory'" class="dashboard-stack admin-anchor">
        <article class="dashboard-panel-card">
          <div class="section-head section-head-aligned">
            <div>
              <p class="micro-label">{{ copy.authHistoryKicker }}</p>
              <h2>{{ copy.authHistoryTitle }}</h2>
              <p class="admin-section-copy">{{ copy.authHistoryLead }}</p>
            </div>
          </div>
          <div class="admin-table-wrap">
            <table class="settings-table admin-table">
              <thead>
                <tr>
                  <th>{{ copy.authHistoryColumns.time }}</th>
                  <th>{{ copy.authHistoryColumns.username }}</th>
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
                  <td class="wrap-cell">{{ item.username }}</td>
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
                  <td colspan="7" class="empty-note">{{ copy.authHistoryEmptyState }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </template>

    <Modal v-if="errorDialog.open" @close="resetErrorDialog">
      <div class="error-report-modal">
        <div class="error-report-modal__head">
          <p class="micro-label">{{ copy.errorDialog.kicker }}</p>
          <h2>{{ copy.errorDialog.title }}</h2>
        </div>
        <div class="error-report-modal__body">
          <div class="error-summary-card">
            <strong>{{ errorDialog.context }}</strong>
            <p>{{ errorDialog.message }}</p>
          </div>
          <div class="error-meta-grid">
            <div>
              <span>{{ copy.errorDialog.timeLabel }}</span>
              <strong>{{ errorDialog.occurredAt }}</strong>
            </div>
            <div>
              <span>{{ copy.errorDialog.messageLabel }}</span>
              <strong>{{ errorDialog.message }}</strong>
            </div>
          </div>
          <p v-if="errorDialog.reported" class="success-message modal-success">{{ copy.errorDialog.ticketCreated }}</p>
          <p v-if="errorDialog.reportError" class="form-error">{{ errorDialog.reportError }}</p>
        </div>
        <div class="error-report-modal__actions">
          <button class="ghost-button" :disabled="reportLoading" @click="resetErrorDialog">{{ t('common.close') }}</button>
          <button class="primary-button" :disabled="reportLoading || errorDialog.reported" @click="reportBackendError">
            {{ reportLoading ? copy.errorDialog.reporting : copy.errorDialog.reportAction }}
          </button>
        </div>
      </div>
    </Modal>

    <Modal v-if="rejectDialog.open" @close="closeRejectDialog">
      <div class="error-report-modal">
        <div class="error-report-modal__head">
          <p class="micro-label">{{ copy.approvalsKicker }}</p>
          <h2>{{ copy.rejectReasonTitle }}</h2>
          <p>{{ t('dashboard.admin.rejectReasonLead', { paymentNumber: rejectDialog.paymentNumber }) }}</p>
        </div>
        <div class="error-report-modal__body">
          <textarea
            v-model="rejectDialog.reason"
            class="decision-textarea"
            :placeholder="copy.rejectReasonPlaceholder"
            rows="5"
          />
        </div>
        <div class="error-report-modal__actions">
          <button class="ghost-button" :disabled="actionLoading" @click="closeRejectDialog">{{ t('common.close') }}</button>
          <button class="ghost-button danger" :disabled="actionLoading" @click="submitRejectReason">
            {{ copy.submitRejectReason }}
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.action-row-vertical {
  flex-direction: column;
  align-items: stretch;
}

.stacked-fields {
  display: grid;
  gap: 8px;
}

.stat-card h2 {
  margin: 0;
  font-size: 2rem;
  color: #3f51b5;
}

.stat-card span,
.admin-section-copy {
  color: #5b6b84;
}

.section-head-aligned {
  align-items: flex-start;
}

.admin-form-shell {
  display: grid;
  gap: 18px;
  padding: 20px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(242, 245, 255, 0.9), rgba(255, 255, 255, 0.92));
  border: 1px solid rgba(63, 81, 181, 0.08);
}

.admin-form-grid-wide {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.selection-surface {
  display: grid;
  gap: 14px;
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(67, 88, 125, 0.1);
}

.selection-surface-head {
  display: grid;
  gap: 4px;
  color: #62718a;
}

.selection-surface-head strong {
  color: #24344f;
}

.token-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.token-grid-compact {
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.token-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 10px 12px;
  border-radius: 14px;
  background: #eef1fb;
  border: 1px solid rgba(63, 81, 181, 0.08);
  color: #31435e;
}

.token-checkbox span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.token-checkbox input {
  width: auto;
  margin: 0;
}

.admin-table-wrap,
.company-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.admin-table,
.company-table {
  min-width: 100%;
}

.user-role-table {
  min-width: 1240px;
}

.admin-table th,
.admin-table td,
.company-table th,
.company-table td {
  vertical-align: top;
}

.admin-table td:last-child,
.company-table td:last-child {
  min-width: 160px;
}

.admin-table tbody tr:hover,
.company-table tbody tr:hover {
  background: rgba(238, 241, 251, 0.38);
}

.wrap-cell {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.role-card-grid {
  display: grid;
  gap: 18px;
}

.role-editor-card {
  display: grid;
  gap: 16px;
  padding: 20px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(247, 249, 255, 0.96), rgba(255, 255, 255, 0.96));
  border: 1px solid rgba(67, 88, 125, 0.1);
}

.role-editor-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.role-editor-title {
  display: grid;
  gap: 4px;
}

.role-editor-title strong {
  color: #24344f;
  font-size: 1.05rem;
}

.role-editor-title span {
  color: #7a8aa5;
  font-size: 0.88rem;
}

.permission-group-stack {
  display: grid;
  gap: 14px;
}

.permission-group-card {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(67, 88, 125, 0.1);
}

.permission-group-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.permission-group-head strong {
  color: #24344f;
}

.permission-group-head span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #eef1fb;
  color: #51627d;
  font-size: 0.82rem;
  font-weight: 700;
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

.error-report-modal {
  display: grid;
  gap: 18px;
  padding: 28px;
  background: linear-gradient(180deg, #ffffff, #f4f7ff);
}

.error-report-modal__head {
  display: grid;
  gap: 8px;
}

.error-report-modal__head h2 {
  margin: 0;
  color: #24344f;
}

.error-report-modal__body {
  display: grid;
  gap: 14px;
}

.error-summary-card {
  display: grid;
  gap: 8px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(253, 236, 236, 0.8);
  border: 1px solid rgba(180, 35, 24, 0.14);
}

.error-summary-card strong {
  color: #8c2a22;
}

.error-summary-card p {
  margin: 0;
  color: #5b2d29;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.error-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.error-meta-grid div {
  display: grid;
  gap: 4px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(238, 241, 251, 0.88);
}

.error-meta-grid span {
  color: #7a8aa5;
  font-size: 0.82rem;
}

.error-meta-grid strong {
  color: #24344f;
  overflow-wrap: anywhere;
}

.error-report-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-success {
  margin: 0;
}

.decision-textarea {
  width: 100%;
  min-height: 132px;
  resize: vertical;
}

.success-message {
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(230, 244, 234, 0.92);
  color: #1d6b3d;
  border: 1px solid rgba(29, 107, 61, 0.14);
}

.admin-anchor {
  scroll-margin-top: 96px;
}

@media (max-width: 980px) {
  .user-role-table {
    min-width: 980px;
  }

  .role-editor-head,
  .error-meta-grid,
  .error-report-modal__actions {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .error-report-modal__actions .ghost-button,
  .error-report-modal__actions .primary-button {
    width: 100%;
  }
}
</style>
