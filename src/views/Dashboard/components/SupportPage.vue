<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { t } from '../../../assets/languages'
import { createSupportReplyFormModel, createSupportTicketFormModel } from '../../../models/portal/formModels'
import { createSupportMessage, createSupportTicket, getSupportMessages, getSupportTickets } from '../../../services/api'
import PageState from '../../../shared/ui/PageState.vue'

const loading = ref(true)
const actionLoading = ref(false)
const error = ref('')
const tickets = ref([])
const messages = ref([])
const selectedTicket = ref(null)
const form = reactive(createSupportTicketFormModel())
const replyForm = reactive(createSupportReplyFormModel())
const copy = t('dashboard.support')

const sortedTickets = computed(() => tickets.value)

async function loadData(selectTicketID = '') {
  loading.value = true
  error.value = ''
  try {
    const ticketData = await getSupportTickets()
    tickets.value = ticketData.items ?? []

    const nextTicket =
      tickets.value.find((item) => item.id === selectTicketID) ||
      tickets.value.find((item) => item.id === selectedTicket.value?.id) ||
      tickets.value[0] ||
      null

    if (nextTicket) {
      await openTicket(nextTicket)
    } else {
      selectedTicket.value = null
      messages.value = []
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('common.unexpectedError')
  } finally {
    loading.value = false
  }
}

async function submitTicket() {
  actionLoading.value = true
  error.value = ''
  try {
    await createSupportTicket({
      subject: form.subject,
      category: form.category,
      priority: form.priority,
      description: form.description
    })
    Object.assign(form, createSupportTicketFormModel())
    await loadData()
  } catch (err) {
    error.value = err instanceof Error ? err.message : copy.createError
  } finally {
    actionLoading.value = false
  }
}

async function openTicket(ticket) {
  selectedTicket.value = ticket
  try {
    const response = await getSupportMessages(ticket.id)
    messages.value = response.items ?? []
  } catch (err) {
    error.value = err instanceof Error ? err.message : copy.messagesError
  }
}

async function sendReply() {
  if (!selectedTicket.value) {
    return
  }

  actionLoading.value = true
  error.value = ''
  try {
    await createSupportMessage(selectedTicket.value.id, {
      message: replyForm.message
    })
    Object.assign(replyForm, createSupportReplyFormModel())
    await loadData(selectedTicket.value.id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : copy.replyError
  } finally {
    actionLoading.value = false
  }
}

function ticketStatusLabel(ticket) {
  return `${ticket.status} / ${ticket.priority}`
}

function messageAuthorLabel(message) {
  if (message.authorType === 'admin') {
    return copy.adminAuthor
  }
  return message.authorName || copy.userAuthor
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="dashboard-stack">
    <section class="dashboard-hero-card">
      <div class="dashboard-hero-main">
        <p class="micro-label">{{ copy.kicker }}</p>
        <h1>{{ copy.title }}</h1>
        <p class="lead-copy">{{ copy.lead }}</p>
      </div>
      <div class="dashboard-hero-actions">
        <button class="primary-button" @click="loadData()">{{ t('common.refresh') }}</button>
      </div>
    </section>

    <section class="dashboard-panel-card">
      <div class="section-head section-head-aligned">
        <div>
          <p class="micro-label">{{ copy.newTicket }}</p>
          <h2>{{ copy.createTicket }}</h2>
          <p class="support-section-copy">{{ copy.createLead }}</p>
        </div>
        <button class="primary-button" :disabled="actionLoading" @click="submitTicket">{{ t('common.send') }}</button>
      </div>

      <div class="support-form-shell">
        <div class="form-grid">
          <input v-model="form.subject" :placeholder="copy.subject" />
          <select v-model="form.category">
            <option value="payments">{{ copy.categories.payments }}</option>
            <option value="verification">{{ copy.categories.verification }}</option>
            <option value="wallet">{{ copy.categories.wallet }}</option>
            <option value="system">{{ copy.categories.system }}</option>
          </select>
          <select v-model="form.priority">
            <option value="low">{{ copy.priorities.low }}</option>
            <option value="medium">{{ copy.priorities.medium }}</option>
            <option value="high">{{ copy.priorities.high }}</option>
          </select>
        </div>
        <textarea v-model="form.description" rows="4" :placeholder="copy.description" />
      </div>
    </section>

    <PageState :loading="loading" :error="error" />

    <section v-if="!loading && !error" class="dashboard-grid two-columns support-layout">
      <article class="dashboard-panel-card support-list-card">
        <div class="section-head section-head-aligned compact-gap">
          <div>
            <p class="micro-label">{{ copy.myTickets }}</p>
            <h2>{{ copy.ticketList }}</h2>
          </div>
          <span class="support-counter">{{ sortedTickets.length }}</span>
        </div>

        <ul class="ticket-list">
          <li
            v-for="ticket in sortedTickets"
            :key="ticket.id"
            class="ticket-item"
            :class="{ active: selectedTicket?.id === ticket.id }"
            @click="openTicket(ticket)"
          >
            <div class="ticket-item__head">
              <strong>{{ ticket.ticketNumber }}</strong>
              <span class="ticket-status-chip">{{ ticketStatusLabel(ticket) }}</span>
            </div>
            <p class="ticket-item__subject">{{ ticket.subject }}</p>
            <p class="ticket-item__preview">{{ ticket.lastMessage || copy.emptyPreview }}</p>
            <div class="ticket-item__meta">
              <span>{{ ticket.createdAt }}</span>
              <span>{{ t('dashboard.support.messageCount', { value: ticket.messageCount || 0 }) }}</span>
            </div>
          </li>
          <li v-if="sortedTickets.length === 0" class="ticket-item empty">
            <p>{{ copy.emptyTickets }}</p>
          </li>
        </ul>
      </article>

      <article class="dashboard-panel-card support-thread-card">
        <div class="section-head section-head-aligned compact-gap">
          <div>
            <p class="micro-label">{{ copy.chat }}</p>
            <h2>{{ selectedTicket?.ticketNumber || copy.selectTicket }}</h2>
          </div>
          <span v-if="selectedTicket" class="ticket-status-chip">{{ ticketStatusLabel(selectedTicket) }}</span>
        </div>

        <div v-if="selectedTicket" class="thread-shell">
          <div class="thread-header">
            <strong>{{ selectedTicket.subject }}</strong>
            <span>{{ selectedTicket.category }}</span>
          </div>

          <div class="thread-messages">
            <article
              v-for="message in messages"
              :key="message.id"
              class="message-bubble"
              :class="message.authorType === 'admin' ? 'message-bubble--admin' : 'message-bubble--user'"
            >
              <div class="message-bubble__head">
                <strong>{{ messageAuthorLabel(message) }}</strong>
                <span>{{ message.createdAt }}</span>
              </div>
              <p>{{ message.message }}</p>
            </article>
            <div v-if="messages.length === 0" class="empty-thread">
              {{ copy.emptyMessages }}
            </div>
          </div>

          <div class="reply-shell">
            <textarea v-model="replyForm.message" rows="4" :placeholder="copy.replyPlaceholder" />
            <div class="reply-actions">
              <button class="primary-button" :disabled="actionLoading || !replyForm.message.trim()" @click="sendReply">
                {{ copy.sendReply }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-thread">
          {{ copy.selectTicket }}
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.support-section-copy {
  color: #5b6b84;
}

.support-form-shell {
  display: grid;
  gap: 16px;
  padding: 20px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(242, 245, 255, 0.9), rgba(255, 255, 255, 0.92));
  border: 1px solid rgba(63, 81, 181, 0.08);
}

.support-form-shell textarea,
.reply-shell textarea {
  resize: vertical;
  min-height: 110px;
}

.support-layout {
  align-items: start;
}

.support-list-card,
.support-thread-card {
  min-height: 620px;
}

.compact-gap {
  margin-bottom: 0;
}

.support-counter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  padding: 8px 12px;
  border-radius: 999px;
  background: #eef1fb;
  color: #3f51b5;
  font-weight: 700;
}

.ticket-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.ticket-item {
  display: grid;
  gap: 8px;
  padding: 16px;
  border-radius: 18px;
  background: #f7f8fd;
  border: 1px solid transparent;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.ticket-item:hover,
.ticket-item.active {
  border-color: rgba(63, 81, 181, 0.18);
  box-shadow: 0 10px 24px rgba(31, 48, 83, 0.08);
  transform: translateY(-1px);
}

.ticket-item.empty {
  cursor: default;
}

.ticket-item__head,
.ticket-item__meta,
.message-bubble__head,
.thread-header,
.reply-actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.ticket-item__subject,
.ticket-item__preview,
.message-bubble p {
  margin: 0;
}

.ticket-item__subject {
  color: #24344f;
  font-weight: 700;
}

.ticket-item__preview,
.ticket-item__meta,
.thread-header span,
.message-bubble__head span,
.empty-thread {
  color: #6d7c95;
}

.ticket-status-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: #eef1fb;
  color: #445779;
  font-size: 0.84rem;
  font-weight: 700;
}

.thread-shell {
  display: grid;
  gap: 18px;
  height: 100%;
}

.thread-header {
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(242, 245, 255, 0.9);
  border: 1px solid rgba(63, 81, 181, 0.08);
}

.thread-header strong {
  color: #24344f;
}

.thread-messages {
  display: grid;
  gap: 12px;
  align-content: start;
  min-height: 280px;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 4px;
}

.message-bubble {
  display: grid;
  gap: 10px;
  padding: 16px 18px;
  border-radius: 18px;
  max-width: 82%;
}

.message-bubble--user {
  justify-self: start;
  background: #f7f8fd;
}

.message-bubble--admin {
  justify-self: end;
  background: linear-gradient(180deg, rgba(63, 81, 181, 0.12), rgba(238, 241, 251, 0.95));
}

.message-bubble__head strong {
  color: #24344f;
}

.reply-shell {
  display: grid;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid rgba(67, 88, 125, 0.1);
}

.empty-thread {
  display: grid;
  place-items: center;
  min-height: 280px;
  padding: 24px;
  border-radius: 18px;
  background: #f7f8fd;
  text-align: center;
}

@media (max-width: 980px) {
  .support-list-card,
  .support-thread-card {
    min-height: auto;
  }

  .ticket-item__head,
  .ticket-item__meta,
  .message-bubble__head,
  .thread-header,
  .reply-actions {
    flex-direction: column;
  }

  .message-bubble {
    max-width: 100%;
  }
}
</style>
