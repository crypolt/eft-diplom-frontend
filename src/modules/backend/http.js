import { getAccessToken } from '../../features/auth/model/authStorage'

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')

  if (!response.ok) {
    let message = `Request failed: ${response.status}`

    if (isJson) {
      try {
        const payload = await response.json()
        message =
          payload?.error?.message ||
          payload?.message ||
          payload?.data?.error?.message ||
          message
      } catch {
        message = `Request failed: ${response.status}`
      }
    }

    throw new Error(message)
  }

  if (isJson) {
    const payload = await response.json()

    if (payload && typeof payload === 'object') {
      if (payload.success === false && payload.error) {
        throw new Error(payload.error.message || `Request failed: ${response.status}`)
      }

      if (payload.success === true && Object.prototype.hasOwnProperty.call(payload, 'data')) {
        return payload.data
      }
    }

    return payload
  }

  return response.text()
}

export async function request(baseUrl, path, options = {}) {
  const accessToken = getAccessToken()

  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers ?? {})
    },
    ...options
  })

  return parseResponse(response)
}
