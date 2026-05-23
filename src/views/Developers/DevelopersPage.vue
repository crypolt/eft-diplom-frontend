<script setup>
import { computed, onMounted, ref } from 'vue'
import { t } from '../../assets/languages'
import { backendConfig } from '../../modules/backend/config'
import { getIntegrationGuide, getOpenAPISpec } from '../../services/api'
import PageState from '../../shared/ui/PageState.vue'

const loading = ref(true)
const error = ref('')
const guide = ref('')
const spec = ref('')
const copy = t('developers')
const openApiOperations = computed(() => parseOpenApiOperations(spec.value))
const rawOpenApiUrl = `${backendConfig.platform}/api/developers/openapi.yaml`

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    const [guideData, specData] = await Promise.all([
      getIntegrationGuide(),
      getOpenAPISpec()
    ])
    guide.value = guideData
    spec.value = specData
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('common.unexpectedError')
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

function parseOpenApiOperations(source) {
  const lines = source.split('\n')
  const operations = []
  let currentPath = ''
  let currentOperation = null

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    const pathMatch = line.match(/^  (\/[^:]+):$/)
    if (pathMatch) {
      currentPath = pathMatch[1]
      continue
    }

    const methodMatch = line.match(/^    (get|post|put|patch|delete):$/i)
    if (methodMatch && currentPath) {
      currentOperation = {
        path: currentPath,
        method: methodMatch[1].toUpperCase(),
        summary: '',
        hasRequestBody: false
      }
      operations.push(currentOperation)
      continue
    }

    const summaryMatch = line.match(/^      summary: (.+)$/)
    if (summaryMatch && currentOperation) {
      currentOperation.summary = summaryMatch[1]
      continue
    }

    if (/^      requestBody:$/.test(line) && currentOperation) {
      currentOperation.hasRequestBody = true
    }
  }

  return operations
}
</script>

<template>
  <div class="developer-page">
    <section class="developer-hero">
      <div>
        <p class="developer-kicker">{{ copy.kicker }}</p>
        <h1>{{ copy.title }}</h1>
        <p>{{ copy.description }}</p>
      </div>
      <div class="developer-metrics">
        <div class="metric-ribbon">
          <span>{{ copy.formatsLabel }}</span>
          <strong>{{ copy.formatsValue }}</strong>
        </div>
        <div class="metric-ribbon">
          <span>{{ copy.callbacksLabel }}</span>
          <strong>{{ copy.callbacksValue }}</strong>
        </div>
        <div class="metric-ribbon">
          <span>{{ copy.authLabel }}</span>
          <strong>{{ copy.authValue }}</strong>
        </div>
      </div>
    </section>

    <PageState :loading="loading" :error="error" />

    <section v-if="!loading && !error" class="docs-grid">
      <article class="docs-card">
        <p class="developer-kicker">{{ copy.guideTitle }}</p>
        <div class="docs-viewer">
          <div class="docs-viewer__bar">
            <span class="docs-pill">GUIDE</span>
          </div>
          <pre class="docs-pre">{{ guide }}</pre>
        </div>
      </article>

      <article class="docs-card docs-wide">
        <p class="developer-kicker">{{ copy.openApiTitle }}</p>
        <div class="docs-viewer docs-viewer--openapi">
          <div class="docs-viewer__bar">
            <span class="docs-pill docs-pill--accent">OPENAPI</span>
          </div>
          <div class="openapi-visual">
            <div class="openapi-visual__head">
              <h3>API Operations</h3>
              <div class="openapi-visual__meta">
                <span>{{ openApiOperations.length }}</span>
                <a :href="rawOpenApiUrl" target="_blank" rel="noreferrer" class="openapi-raw-link">openapi.yaml</a>
              </div>
            </div>
            <div class="openapi-operation-grid">
              <article v-for="item in openApiOperations" :key="`${item.method}-${item.path}`" class="openapi-operation-card">
                <div class="openapi-operation-card__head">
                  <span class="openapi-method" :class="`openapi-method--${item.method.toLowerCase()}`">{{ item.method }}</span>
                  <code>{{ item.path }}</code>
                </div>
                <p>{{ item.summary || 'No summary provided' }}</p>
                <span v-if="item.hasRequestBody" class="openapi-request-badge">request body</span>
              </article>
            </div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.developer-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.developer-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(280px, 1fr);
  gap: 18px;
  padding: 32px;
  border-radius: 24px;
  background: linear-gradient(135deg, #dfe7f4, #f7f9fc);
  box-shadow: 0 18px 36px rgba(31, 48, 83, 0.08);
}

.developer-kicker {
  margin: 0 0 10px;
  color: #6d7da0;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
}

.developer-hero h1 {
  margin: 0 0 12px;
  color: #2d3c58;
}

.developer-hero p {
  margin: 0;
  color: #5b6b84;
  line-height: 1.8;
}

.developer-metrics {
  display: grid;
  gap: 12px;
}

.metric-ribbon,
.docs-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 18px;
  border: 1px solid rgba(67, 88, 125, 0.1);
  padding: 20px;
}

.metric-ribbon span {
  display: block;
  color: #7b8aa1;
}

.metric-ribbon strong {
  color: #2d3c58;
  font-size: 1.2rem;
}

.docs-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 18px;
}

.docs-viewer {
  display: grid;
  gap: 0;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(67, 88, 125, 0.1);
  background: #f7f9fc;
}

.docs-viewer__bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 12px 14px;
  background: linear-gradient(180deg, rgba(233, 239, 250, 0.94), rgba(247, 249, 252, 0.98));
  border-bottom: 1px solid rgba(67, 88, 125, 0.08);
}

.docs-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 8px;
  background: rgba(63, 81, 181, 0.1);
  color: #5d6d8a;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.docs-pill--accent {
  background: rgba(63, 81, 181, 0.16);
  color: #3f51b5;
}

.docs-pre {
  margin: 0;
  padding: 18px 20px;
  white-space: pre-wrap;
  word-break: break-word;
  color: #3a4a67;
  line-height: 1.6;
}

.docs-pre--code {
  border-top: 1px solid rgba(67, 88, 125, 0.08);
  max-height: 760px;
  overflow: auto;
  background: #ffffff;
  font-family: "SFMono-Regular", "Menlo", "Monaco", "Consolas", monospace;
  font-size: 0.92rem;
  line-height: 1.7;
}

.openapi-visual {
  display: grid;
  gap: 16px;
  padding: 18px 20px;
  background: linear-gradient(180deg, rgba(247, 249, 252, 0.98), rgba(255, 255, 255, 0.96));
}

.openapi-visual__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.openapi-visual__meta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.openapi-visual__head h3 {
  margin: 0;
  color: #2d3c58;
  font-size: 1rem;
}

.openapi-visual__head span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  padding: 5px 10px;
  border-radius: 999px;
  background: #eef1fb;
  color: #3f51b5;
  font-size: 0.84rem;
  font-weight: 700;
}

.openapi-raw-link {
  color: #315c9a;
  font-size: 0.86rem;
  font-weight: 700;
  text-decoration: none;
}

.openapi-raw-link:hover {
  text-decoration: underline;
}

.openapi-operation-grid {
  display: grid;
  gap: 12px;
}

.openapi-operation-card {
  display: grid;
  gap: 10px;
  padding: 16px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid rgba(67, 88, 125, 0.1);
}

.openapi-operation-card p {
  margin: 0;
  color: #5b6b84;
  line-height: 1.7;
}

.openapi-operation-card__head {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.openapi-operation-card__head code {
  color: #26344f;
  font-size: 0.92rem;
  word-break: break-word;
}

.openapi-method {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 62px;
  padding: 6px 10px;
  border-radius: 999px;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.openapi-method--get {
  background: #0f9d58;
}

.openapi-method--post {
  background: #2563eb;
}

.openapi-method--put,
.openapi-method--patch {
  background: #d97706;
}

.openapi-method--delete {
  background: #dc2626;
}

.openapi-request-badge {
  display: inline-flex;
  width: fit-content;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(63, 81, 181, 0.1);
  color: #445779;
  font-size: 0.8rem;
  font-weight: 700;
}

@media (max-width: 900px) {
  .developer-hero,
  .docs-grid {
    grid-template-columns: 1fr;
  }
}
</style>
