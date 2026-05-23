<template>
  <section class="identity-page">
    <div class="identity-card">
      <p class="micro-label">{{ copy.kicker }}</p>
      <h1>{{ copy.title }}</h1>
      <p class="lead-copy">{{ copy.lead }}</p>

      <div class="status-strip">
        <div>
          <span>{{ copy.currentStatus }}</span>
          <strong>{{ currentUser?.identificationStatus || 'unidentified' }}</strong>
        </div>
        <div>
          <span>{{ copy.kycLevel }}</span>
          <strong>{{ currentUser?.kycLevel || 'minimal' }}</strong>
        </div>
        <div>
          <span>{{ copy.biometric }}</span>
          <strong>{{ currentUser?.biometricStatus || 'pending' }}</strong>
        </div>
      </div>

      <div class="camera-card">
        <div class="camera-copy">
          <h2>{{ copy.cameraTitle }}</h2>
          <p>{{ copy.cameraDesc }}</p>
        </div>

        <div class="camera-preview">
          <video
            v-if="cameraOpened"
            ref="videoElement"
            autoplay
            muted
            playsinline
            class="camera-video"
          ></video>
          <div v-else class="camera-placeholder">
            {{ copy.cameraClosed }}
          </div>
        </div>
      </div>

      <label class="consent-line">
        <input v-model="consentAccepted" type="checkbox" />
        {{ copy.consent }}
      </label>

      <div class="action-row">
        <button class="ghost-button" :disabled="loading" @click="openCamera">
          {{ cameraOpened ? copy.cameraActive : copy.cameraOpen }}
        </button>
        <button class="btn primary" :disabled="loading || !consentAccepted || !cameraOpened" @click="submit">
          {{ loading ? copy.verifyLoading : copy.verify }}
        </button>
      </div>

      <p v-if="cameraMessage" class="hint-text">{{ cameraMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '../../assets/languages'
import { useSession } from '../../features/auth/model/session'

const router = useRouter()
const { currentUser, submitBiometricVerification } = useSession()
const copy = t('identity')

const videoElement = ref(null)
const mediaStream = ref(null)
const cameraOpened = ref(false)
const consentAccepted = ref(false)
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const cameraMessage = ref('')

async function openCamera() {
  error.value = ''
  cameraMessage.value = ''

  if (!navigator.mediaDevices?.getUserMedia) {
    error.value = copy.unsupported
    return
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user'
      },
      audio: false
    })

    mediaStream.value = stream
    cameraOpened.value = true
    cameraMessage.value = copy.opened

    if (videoElement.value) {
      videoElement.value.srcObject = stream
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : copy.openError
  }
}

async function submit() {
  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const response = await submitBiometricVerification({
      faceScanToken: `local-face-${Date.now()}`,
      deviceId: navigator.userAgent || 'local-device',
      biometricScore: 92,
      livenessPassed: true,
      consentAccepted: consentAccepted.value
    })

    successMessage.value = t('identity.success', { walletTier: response.walletTier })
    stopCamera()
    await router.push('/dashboard')
  } catch (err) {
    error.value = err instanceof Error ? err.message : copy.error
  } finally {
    loading.value = false
  }
}

function stopCamera() {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop())
    mediaStream.value = null
  }
  cameraOpened.value = false
}

onBeforeUnmount(() => {
  stopCamera()
})
</script>

<style scoped>
.identity-page {
  display: flex;
  justify-content: center;
}

.identity-card {
  width: min(100%, 880px);
  background: #fff;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 20px 48px rgba(29, 46, 81, 0.1);
}

.identity-card h1,
.camera-copy h2 {
  margin: 0 0 12px;
  color: #2d3c58;
}

.status-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin: 24px 0;
}

.status-strip div {
  background: #eef1fb;
  border-radius: 16px;
  padding: 16px;
}

.status-strip span {
  display: block;
  color: #73839d;
  margin-bottom: 6px;
}

.camera-card {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(260px, 0.9fr);
  gap: 18px;
  padding: 18px;
  border-radius: 18px;
  background: #f7f8fd;
  margin-bottom: 18px;
}

.camera-copy p {
  margin: 0;
  color: #5b6b84;
  line-height: 1.7;
}

.camera-preview {
  min-height: 220px;
  border-radius: 18px;
  overflow: hidden;
  background: #e8ecf8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-placeholder {
  color: #73839d;
  text-align: center;
  padding: 20px;
}

.consent-line {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #51627c;
  margin-bottom: 18px;
}

.consent-line input {
  width: auto;
}

.action-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.success {
  color: #2e7d32;
  margin-top: 16px;
}

.error {
  color: #c62828;
  margin-top: 16px;
}

@media (max-width: 780px) {
  .camera-card {
    grid-template-columns: 1fr;
  }
}
</style>
