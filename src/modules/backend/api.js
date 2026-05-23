import { backendConfig } from './config'
import { request } from './http'

export function getOAuthHealth() {
  return request(backendConfig.platform, '/api/health')
}

export function issueOAuthToken(payload) {
  return request(backendConfig.platform, '/api/oauth/token', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function registerUser(payload) {
  return request(backendConfig.platform, '/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function refreshOAuthToken(refreshToken) {
  return request(backendConfig.platform, '/api/oauth/token', {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: 'clearing-portal-web',
      refresh_token: refreshToken
    })
  })
}

export function getCurrentUser() {
  return request(backendConfig.platform, '/api/auth/me')
}

export function getMyAuthHistory() {
  return request(backendConfig.platform, '/api/auth/history')
}

export function logout() {
  return request(backendConfig.platform, '/api/auth/logout', {
    method: 'POST'
  })
}

export function verifyBiometrics(payload) {
  return request(backendConfig.platform, '/api/auth/biometric/verify', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function getCompanies() {
  return request(backendConfig.platform, '/api/companies')
}

export function createCompany(payload) {
  return request(backendConfig.platform, '/api/companies', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function createAdminCompany(payload) {
  return request(backendConfig.platform, '/api/admin/companies', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function deleteCompany(id) {
  return request(backendConfig.platform, `/api/admin/companies/${id}`, {
    method: 'DELETE'
  })
}

export function getMerchantAccounts() {
  return request(backendConfig.platform, '/api/merchant-accounts')
}

export function getPayments() {
  return request(backendConfig.platform, '/api/payments')
}

export function getSentPayments() {
  return request(backendConfig.platform, '/api/payments/sent')
}

export function getAssignedPayments() {
  return request(backendConfig.platform, '/api/payments/assigned')
}

export function purchaseEDS(payload) {
  return request(backendConfig.platform, '/api/payments/purchase-eds', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function getPaymentDetails(id) {
  return request(backendConfig.platform, `/api/payments/${id}`)
}

export function getPaymentSteps(id) {
  return request(backendConfig.platform, `/api/payments/${id}/steps`)
}

export function acceptAssignedPayment(id) {
  return request(backendConfig.platform, `/api/payments/${id}/accept`, {
    method: 'POST'
  })
}

export function rejectAssignedPaymentAction(id, payload = {}) {
  return request(backendConfig.platform, `/api/payments/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function getApprovalRequests() {
  return request(backendConfig.platform, '/api/admin/approvals')
}

export function approveRequest(id, payload = {}) {
  return request(backendConfig.platform, `/api/admin/approvals/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function rejectRequest(id, payload = {}) {
  return request(backendConfig.platform, `/api/admin/approvals/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function getAdminConfig() {
  return request(backendConfig.platform, '/api/admin/config')
}

export function updateAdminConfig(key, payload) {
  return request(backendConfig.platform, `/api/admin/config/${encodeURIComponent(key)}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function getAdminUsers() {
  return request(backendConfig.platform, '/api/admin/users')
}

export function createAdminUser(payload) {
  return request(backendConfig.platform, '/api/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateAdminUser(id, payload) {
  return request(backendConfig.platform, `/api/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function deleteAdminUser(id) {
  return request(backendConfig.platform, `/api/admin/users/${id}`, {
    method: 'DELETE'
  })
}

export function updateAdminUserRoles(id, payload) {
  return request(backendConfig.platform, `/api/admin/users/${id}/roles`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function getRoles() {
  return request(backendConfig.platform, '/api/admin/roles')
}

export function createRole(payload) {
  return request(backendConfig.platform, '/api/admin/roles', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateRole(id, payload) {
  return request(backendConfig.platform, `/api/admin/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function deleteRole(id) {
  return request(backendConfig.platform, `/api/admin/roles/${id}`, {
    method: 'DELETE'
  })
}

export function getPermissions() {
  return request(backendConfig.platform, '/api/admin/permissions')
}

export function createPermission(payload) {
  return request(backendConfig.platform, '/api/admin/permissions', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updatePermission(id, payload) {
  return request(backendConfig.platform, `/api/admin/permissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function deletePermission(id) {
  return request(backendConfig.platform, `/api/admin/permissions/${id}`, {
    method: 'DELETE'
  })
}

export function getCompanyAccesses() {
  return request(backendConfig.platform, '/api/admin/company-accesses')
}

export function getAdminAuthHistory() {
  return request(backendConfig.platform, '/api/admin/auth-history')
}

export function grantCompanyAccess(payload) {
  return request(backendConfig.platform, '/api/admin/company-accesses', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function getSupportTickets() {
  return request(backendConfig.platform, '/api/support/tickets')
}

export function createSupportTicket(payload) {
  return request(backendConfig.platform, '/api/support/tickets', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function getSupportMessages(id) {
  return request(backendConfig.platform, `/api/support/tickets/${id}/messages`)
}

export function createSupportMessage(id, payload) {
  return request(backendConfig.platform, `/api/support/tickets/${id}/messages`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function getClearingHealth() {
  return request(backendConfig.platform, '/api/health')
}

export function getDashboardSummary() {
  return request(backendConfig.platform, '/api/dashboard/summary')
}

export function getSettlements() {
  return request(backendConfig.platform, '/api/settlements')
}

export function createSettlement(payload) {
  return request(backendConfig.platform, '/api/settlements', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function confirmSettlement(id) {
  return request(backendConfig.platform, `/api/settlements/${id}/confirm`, {
    method: 'POST'
  })
}

export function cancelSettlement(id) {
  return request(backendConfig.platform, `/api/settlements/${id}/cancel`, {
    method: 'POST'
  })
}

export function getParticipants() {
  return request(backendConfig.platform, '/api/participants')
}

export function createParticipant(payload) {
  return request(backendConfig.platform, '/api/participants', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function getTransactions() {
  return request(backendConfig.platform, '/api/transactions')
}

export function getRiskHealth() {
  return request(backendConfig.platform, '/api/health')
}

export function getCollateralSummary() {
  return request(backendConfig.platform, '/api/collateral/summary')
}

export function getRiskAlerts() {
  return request(backendConfig.platform, '/api/risk/alerts')
}

export function createSettlementsBatch(items) {
  return Promise.all(items.map((item) => createSettlement(item)))
}

export function getDailyReport() {
  return request(backendConfig.platform, '/api/reports/daily')
}

export function getGatewayHealth() {
  return request(backendConfig.platform, '/api/health')
}

export function getPublicProfile() {
  return request(backendConfig.platform, '/api/public/profile')
}

export function getPublicCategories() {
  return request(backendConfig.platform, '/api/public/categories')
}

export function getPublicMarkets() {
  return request(backendConfig.platform, '/api/public/markets')
}

export function getPublicNews() {
  return request(backendConfig.platform, '/api/public/news')
}

export function getPublicLinks() {
  return request(backendConfig.platform, '/api/public/links')
}

export function getIntegrationGuide() {
  return request(backendConfig.platform, '/api/developers/guide')
}

export function getOpenAPISpec() {
  return request(backendConfig.platform, '/api/developers/openapi')
}

export function getWebhookHealth() {
  return request(backendConfig.platform, '/api/health')
}

export function getWebhooks() {
  return request(backendConfig.platform, '/api/integrations/webhooks')
}

export function sendWebhookTest() {
  return request(backendConfig.platform, '/api/integrations/webhooks/test', {
    method: 'POST'
  })
}
