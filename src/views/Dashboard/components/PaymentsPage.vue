<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import Modal from '../../../components/Common/basic/modal.vue'
import { t } from '../../../assets/languages'
import { useSession } from '../../../features/auth/model/session'
import { createCompanyFormModel, createEDSPurchaseFormModel } from '../../../models/portal/formModels'
import {
  acceptAssignedPayment,
  createCompany,
  getAssignedPayments,
  getCompanies,
  getMerchantAccounts,
  getPaymentSteps,
  getPayments,
  getSentPayments,
  purchaseEDS,
  rejectAssignedPaymentAction
} from '../../../services/api'
import PageState from '../../../shared/ui/PageState.vue'

const { currentUser } = useSession()
const loading = ref(true)
const submitting = ref(false)
const creatingCompany = ref(false)
const resolvingAssigned = ref(false)
const error = ref('')
const successMessage = ref('')
const payments = ref([])
const sentPayments = ref([])
const assignedPayments = ref([])
const companies = ref([])
const merchantAccounts = ref([])
const selectedPayment = ref(null)
const selectedSteps = ref([])
const companyForm = reactive(createCompanyFormModel())
const purchaseForm = reactive(createEDSPurchaseFormModel())
const rejectDialog = reactive({
  open: false,
  paymentId: '',
  paymentNumber: '',
  reason: ''
})
const copy = t('dashboard.payments')

const isIdentified = computed(() => currentUser.value?.identificationStatus === 'identified')
const filteredMerchantAccounts = computed(() =>
  merchantAccounts.value.filter((item) => item.companyCode === purchaseForm.companyCode)
)
const recipientCompanies = computed(() =>
  companies.value.filter((item) => item.code !== purchaseForm.companyCode)
)
const allKnownPayments = computed(() => {
  const merged = [...payments.value, ...sentPayments.value, ...assignedPayments.value]
  const byId = new Map()
  for (const item of merged) {
    byId.set(item.id, item)
  }
  return Array.from(byId.values())
})

watch(
  () => purchaseForm.companyCode,
  (value) => {
    const firstMerchant = filteredMerchantAccounts.value[0]
    if (!value) {
      purchaseForm.merchantCode = ''
      return
    }
    if (!filteredMerchantAccounts.value.some((item) => item.merchantCode === purchaseForm.merchantCode)) {
      purchaseForm.merchantCode = firstMerchant?.merchantCode || ''
    }
    if (purchaseForm.recipientCompanyCode === value) {
      purchaseForm.recipientCompanyCode = ''
    }
  }
)

function closeRejectDialog() {
  rejectDialog.open = false
  rejectDialog.paymentId = ''
  rejectDialog.paymentNumber = ''
  rejectDialog.reason = ''
}

function selectPaymentById(id) {
  selectedPayment.value = allKnownPayments.value.find((item) => item.id === id || item.paymentNumber === id) || null
}

function paymentDirectionLabel(item) {
  if (item.recipientCompanyCode) {
    return `${item.companyCode} → ${item.recipientCompanyCode}`
  }
  return item.companyCode
}

function paymentCounterpartyLabel(item) {
  if (item.recipientCompanyName) {
    return `${copy.recipient} ${item.recipientCompanyName}`
  }
  return copy.noRecipient
}

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const [paymentData, sentData, assignedData, companyData, merchantData] = await Promise.all([
      getPayments(),
      getSentPayments(),
      getAssignedPayments(),
      getCompanies(),
      getMerchantAccounts()
    ])
    payments.value = paymentData.items ?? []
    sentPayments.value = sentData.items ?? []
    assignedPayments.value = assignedData.items ?? []
    companies.value = companyData.items ?? []
    merchantAccounts.value = merchantData.items ?? []

    if (!purchaseForm.companyCode && companies.value.length > 0) {
      purchaseForm.companyCode = companies.value[0].code
    }

    if (selectedPayment.value?.id) {
      selectPaymentById(selectedPayment.value.id)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('common.unexpectedError')
  } finally {
    loading.value = false
  }
}

async function submitCompany() {
  creatingCompany.value = true
  error.value = ''
  successMessage.value = ''
  try {
    const company = await createCompany({
      code: companyForm.code,
      name: companyForm.name,
      merchantCode: companyForm.merchantCode
    })
    successMessage.value = t('dashboard.payments.createCompanySuccess', { companyName: company.name })
    Object.assign(companyForm, createCompanyFormModel())
    await loadData()
    purchaseForm.companyCode = company.code
  } catch (err) {
    error.value = err instanceof Error ? err.message : copy.createCompanyError
  } finally {
    creatingCompany.value = false
  }
}

async function submitPurchase() {
  submitting.value = true
  error.value = ''
  successMessage.value = ''
  try {
    const payment = await purchaseEDS({
      companyCode: purchaseForm.companyCode,
      recipientCompanyCode: purchaseForm.recipientCompanyCode || '',
      merchantCode: purchaseForm.merchantCode,
      amount: Number(purchaseForm.amount),
      currency: purchaseForm.currency,
      description: purchaseForm.description
    })
    successMessage.value = purchaseForm.recipientCompanyCode ? copy.transferSuccess : copy.purchaseSuccess
    await loadData()
    await showDetails(payment.id || payment.paymentNumber)
  } catch (err) {
    error.value = err instanceof Error ? err.message : copy.purchaseError
  } finally {
    submitting.value = false
  }
}

async function showDetails(id) {
  selectPaymentById(id)
  const stepData = await getPaymentSteps(id)
  selectedSteps.value = stepData.items ?? []
}

async function acceptAssigned(item) {
  resolvingAssigned.value = true
  error.value = ''
  successMessage.value = ''
  try {
    await acceptAssignedPayment(item.id)
    successMessage.value = t('dashboard.payments.acceptAssignedSuccess', { paymentNumber: item.paymentNumber })
    await loadData()
    await showDetails(item.id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : copy.resolveAssignedError
  } finally {
    resolvingAssigned.value = false
  }
}

function openRejectDialog(item) {
  rejectDialog.open = true
  rejectDialog.paymentId = item.id
  rejectDialog.paymentNumber = item.paymentNumber
  rejectDialog.reason = ''
}

async function submitAssignedReject() {
  const reason = rejectDialog.reason.trim()
  if (!reason) {
    error.value = copy.rejectCommentRequired
    return
  }

  resolvingAssigned.value = true
  error.value = ''
  successMessage.value = ''
  try {
    await rejectAssignedPaymentAction(rejectDialog.paymentId, { comment: reason })
    successMessage.value = t('dashboard.payments.rejectAssignedSuccess', { paymentNumber: rejectDialog.paymentNumber })
    const paymentId = rejectDialog.paymentId
    closeRejectDialog()
    await loadData()
    await showDetails(paymentId)
  } catch (err) {
    error.value = err instanceof Error ? err.message : copy.resolveAssignedError
  } finally {
    resolvingAssigned.value = false
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
        <p class="lead-copy compact">{{ copy.lead }}</p>
      </div>
      <div class="dashboard-hero-actions">
        <button class="primary-button" @click="loadData">{{ t('common.refresh') }}</button>
      </div>
    </section>

    <PageState :loading="loading" :error="error" />

    <template v-if="!loading && !error">
      <section v-if="!isIdentified" class="dashboard-note-card blocked-card">
        <p class="micro-label">{{ copy.blockedKicker }}</p>
        <h2>{{ copy.blockedTitle }}</h2>
        <p>{{ copy.blockedDesc }}</p>
      </section>

      <template v-else>
        <section class="dashboard-section-grid two-columns">
          <article class="dashboard-panel-card">
            <div class="section-head">
              <div>
                <p class="micro-label">{{ copy.myCompanies }}</p>
                <h2>{{ copy.addCompany }}</h2>
              </div>
              <button class="primary-button" :disabled="creatingCompany" @click="submitCompany">
                {{ creatingCompany ? copy.createCompanyLoading : copy.createCompany }}
              </button>
            </div>

            <div class="form-grid">
              <input v-model="companyForm.code" :placeholder="copy.companyCode" />
              <input v-model="companyForm.name" :placeholder="copy.companyName" />
              <input v-model="companyForm.merchantCode" :placeholder="copy.merchantCode" />
            </div>
          </article>

          <article class="dashboard-panel-card">
            <p class="micro-label">{{ copy.userCompanies }}</p>
            <h2>{{ copy.accountsAndBalances }}</h2>
            <ul class="payment-list">
              <li v-for="item in companies" :key="item.id" class="payment-item">
                <strong>{{ item.code }} - {{ item.name }}</strong>
                <span>{{ t('dashboard.payments.balance', { value: item.walletBalance.toLocaleString() }) }}</span>
                <span>{{ t('dashboard.payments.clearing', { value: item.clearingStatus }) }}</span>
                <span>{{ t('dashboard.payments.settlementAccount', { value: item.settlementAccount }) }}</span>
              </li>
            </ul>
            <p v-if="companies.length === 0" class="empty-note">
              {{ copy.companiesEmpty }}
            </p>
          </article>
        </section>

        <section class="form-card">
          <div class="section-head">
            <div>
              <p class="micro-label">{{ copy.newOperation }}</p>
              <h2>{{ copy.edsPurchase }}</h2>
            </div>
            <button class="primary-button" :disabled="submitting || companies.length === 0" @click="submitPurchase">
              {{ submitting ? copy.submitRequestLoading : copy.submitRequest }}
            </button>
          </div>

          <div class="form-grid">
            <select v-model="purchaseForm.companyCode">
              <option value="" disabled>{{ copy.selectCompany }}</option>
              <option v-for="item in companies" :key="item.code" :value="item.code">
                {{ item.code }} - {{ item.name }}
              </option>
            </select>
            <select v-model="purchaseForm.merchantCode">
              <option value="" disabled>{{ copy.selectMerchant }}</option>
              <option v-for="item in filteredMerchantAccounts" :key="item.merchantCode" :value="item.merchantCode">
                {{ item.merchantCode }} / {{ item.displayName || item.companyCode }}
              </option>
            </select>
            <select v-model="purchaseForm.recipientCompanyCode">
              <option value="">{{ copy.noRecipient }}</option>
              <option v-for="item in recipientCompanies" :key="item.code" :value="item.code">
                {{ item.code }} - {{ item.name }}
              </option>
            </select>
            <input v-model="purchaseForm.amount" type="number" min="1" :placeholder="copy.amount" />
            <input v-model="purchaseForm.currency" :placeholder="copy.currency" />
            <input v-model="purchaseForm.description" class="form-span" :placeholder="copy.description" />
          </div>

          <p class="empty-note operation-note">
            {{ copy.transferLead }}
          </p>
        </section>
      </template>

      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <section class="dashboard-section-grid two-columns">
        <article class="dashboard-panel-card">
          <div class="section-head">
            <div>
              <p class="micro-label">{{ copy.sentRegistry }}</p>
              <h2>{{ copy.sentTitle }}</h2>
            </div>
          </div>

          <ul class="payment-list">
            <li
              v-for="item in sentPayments"
              :key="item.id"
              class="payment-item clickable"
              @click="showDetails(item.id)"
            >
              <strong>{{ item.paymentNumber }}</strong>
              <span>{{ item.orderType }} / {{ item.status }}</span>
              <span>{{ item.amount.toLocaleString() }} {{ item.currency }}</span>
              <span>{{ paymentDirectionLabel(item) }}</span>
              <span>{{ paymentCounterpartyLabel(item) }}</span>
            </li>
          </ul>
          <p v-if="sentPayments.length === 0" class="empty-note">{{ copy.sentEmpty }}</p>
        </article>

        <article class="dashboard-panel-card">
          <div class="section-head">
            <div>
              <p class="micro-label">{{ copy.assignedRegistry }}</p>
              <h2>{{ copy.assignedTitle }}</h2>
            </div>
          </div>

          <ul class="payment-list">
            <li
              v-for="item in assignedPayments"
              :key="item.id"
              class="payment-item clickable"
              @click="showDetails(item.id)"
            >
              <strong>{{ item.paymentNumber }}</strong>
              <span>{{ item.orderType }} / {{ item.status }}</span>
              <span>{{ item.amount.toLocaleString() }} {{ item.currency }}</span>
              <span>{{ copy.sender }} {{ item.companyName }}</span>
              <div v-if="item.status === 'assigned'" class="action-row">
                <button class="ghost-button" :disabled="resolvingAssigned" @click.stop="acceptAssigned(item)">
                  {{ t('common.confirm') }}
                </button>
                <button class="ghost-button danger" :disabled="resolvingAssigned" @click.stop="openRejectDialog(item)">
                  {{ t('common.reject') }}
                </button>
              </div>
            </li>
          </ul>
          <p v-if="assignedPayments.length === 0" class="empty-note">{{ copy.assignedEmpty }}</p>
        </article>
      </section>

      <section class="dashboard-section-grid two-columns">
        <article class="dashboard-panel-card">
          <div class="section-head">
            <div>
              <p class="micro-label">{{ copy.registry }}</p>
              <h2>{{ copy.paymentsAndSettlements }}</h2>
            </div>
          </div>

          <ul class="payment-list">
            <li v-for="item in payments" :key="item.id" @click="showDetails(item.id)" class="payment-item clickable">
              <strong>{{ item.paymentNumber }}</strong>
              <span>{{ item.orderType }} / {{ item.status }}</span>
              <span>{{ item.amount.toLocaleString() }} {{ item.currency }}</span>
              <span>{{ paymentDirectionLabel(item) }}</span>
            </li>
          </ul>
        </article>

        <article class="dashboard-panel-card">
          <div class="section-head">
            <div>
              <p class="micro-label">{{ copy.details }}</p>
              <h2>{{ selectedPayment?.paymentNumber || t('common.selectPayment') }}</h2>
            </div>
          </div>

          <template v-if="selectedPayment">
            <div class="details-grid">
              <p><strong>{{ copy.type }}</strong> {{ selectedPayment.orderType }}</p>
              <p><strong>{{ copy.status }}</strong> {{ selectedPayment.status }}</p>
              <p><strong>{{ copy.company }}</strong> {{ selectedPayment.companyName }}</p>
              <p><strong>{{ copy.recipient }}</strong> {{ selectedPayment.recipientCompanyName || copy.noRecipient }}</p>
              <p><strong>{{ copy.channel }}</strong> {{ selectedPayment.channel }}</p>
              <p><strong>{{ copy.initiator }}</strong> {{ selectedPayment.initiatorName || copy.initiatorUnknown }}</p>
              <p><strong>{{ copy.createdAt }}</strong> {{ selectedPayment.createdAt }}</p>
              <p><strong>{{ copy.direction }}</strong> {{ paymentDirectionLabel(selectedPayment) }}</p>
            </div>
            <p><strong>{{ copy.processingDescription }}</strong> {{ selectedPayment.description }}</p>

            <div v-if="selectedPayment.status === 'assigned'" class="action-row details-actions">
              <button class="ghost-button" :disabled="resolvingAssigned" @click="acceptAssigned(selectedPayment)">
                {{ t('common.confirm') }}
              </button>
              <button class="ghost-button danger" :disabled="resolvingAssigned" @click="openRejectDialog(selectedPayment)">
                {{ t('common.reject') }}
              </button>
            </div>

            <h3>{{ copy.steps }}</h3>
            <ul class="payment-list">
              <li v-for="step in selectedSteps" :key="step.id" class="step-item">
                <strong>{{ step.stepName }}</strong>
                <span>{{ step.stepStatus }}</span>
                <span>{{ step.actorType }} / {{ step.actorRef }}</span>
                <span>{{ step.details }}</span>
              </li>
            </ul>
          </template>
        </article>
      </section>
    </template>

    <Modal v-if="rejectDialog.open" @close="closeRejectDialog">
      <div class="decision-modal">
        <div class="decision-modal__head">
          <p class="micro-label">{{ copy.assignedRegistry }}</p>
          <h2>{{ copy.rejectReasonTitle }}</h2>
          <p>{{ t('dashboard.payments.rejectReasonLead', { paymentNumber: rejectDialog.paymentNumber }) }}</p>
        </div>
        <div class="decision-modal__body">
          <textarea
            v-model="rejectDialog.reason"
            class="decision-modal__textarea"
            :placeholder="copy.rejectReasonPlaceholder"
            rows="5"
          />
        </div>
        <div class="decision-modal__actions">
          <button class="ghost-button" :disabled="resolvingAssigned" @click="closeRejectDialog">{{ t('common.close') }}</button>
          <button class="ghost-button danger" :disabled="resolvingAssigned" @click="submitAssignedReject">
            {{ copy.submitRejectReason }}
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.payment-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.payment-item,
.step-item {
  display: grid;
  gap: 4px;
  padding: 14px;
  border-radius: 14px;
  background: #f7f8fd;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background: #eef1fb;
}

.form-span {
  grid-column: 1 / -1;
}

.blocked-card {
  border: 1px solid rgba(63, 81, 181, 0.16);
}

.success-message {
  margin: 0 0 20px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(230, 244, 234, 0.92);
  color: #1d6b3d;
  border: 1px solid rgba(29, 107, 61, 0.14);
  font-weight: 600;
}

.empty-note {
  margin: 14px 0 0;
  color: #66758f;
}

.operation-note {
  margin-top: 18px;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px 18px;
}

.details-grid p {
  margin: 0;
}

.details-actions {
  margin: 12px 0 6px;
}

.decision-modal {
  display: grid;
  gap: 18px;
  padding: 28px;
  background: linear-gradient(180deg, #ffffff, #f4f7ff);
}

.decision-modal__head {
  display: grid;
  gap: 8px;
}

.decision-modal__head h2,
.decision-modal__head p {
  margin: 0;
}

.decision-modal__body {
  display: grid;
  gap: 12px;
}

.decision-modal__textarea {
  width: 100%;
  min-height: 132px;
  resize: vertical;
}

.decision-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 980px) {
  .decision-modal__actions {
    flex-direction: column;
  }

  .decision-modal__actions .ghost-button {
    width: 100%;
  }
}
</style>
