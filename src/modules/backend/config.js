const hostname = window.location.hostname
const isUntoldPublicHost =
  hostname === 'site.untoldapp.work' || hostname.endsWith('.untoldapp.work')

export const backendConfig = {
  platform:
    import.meta.env.VITE_PLATFORM_API_URL ||
    (isUntoldPublicHost
      ? 'https://api.untoldapp.work'
      : 'http://localhost:8084')
}
