import { createRouter, createWebHistory } from 'vue-router'
import { t } from '../assets/languages'
import AboutPage from '../views/About/AboutPage.vue'
import LoginPage from '../views/Auth/LoginPage.vue'
import IdentityVerificationPage from '../views/Auth/IdentityVerificationPage.vue'
import DashboardPage from '../views/Dashboard/DashboardPage.vue'
import AdminPage from '../views/Dashboard/components/AdminPage.vue'
import ParticipantsPage from '../views/Dashboard/components/ParticipantsPage.vue'
import PaymentsPage from '../views/Dashboard/components/PaymentsPage.vue'
import SettlementsPage from '../views/Dashboard/components/SettlementsPage.vue'
import SupportPage from '../views/Dashboard/components/SupportPage.vue'
import TransactionsPage from '../views/Dashboard/components/TransactionsPage.vue'
import DevelopersPage from '../views/Developers/DevelopersPage.vue'
import HomePage from '../views/Home/HomePage.vue'
import store from '../store'

const routes = [
  { path: '/', name: 'HomePage', component: HomePage },
  { path: '/login', name: 'LoginPage', component: LoginPage },
  { path: '/about', name: 'AboutPage', component: AboutPage },
  { path: '/developers', name: 'DevelopersPage', component: DevelopersPage },
  { path: '/onboarding/identity', name: 'IdentityVerificationPage', component: IdentityVerificationPage, meta: { requiresAuth: true } },
  { path: '/dashboard', name: 'Dashboard', component: DashboardPage, meta: { requiresAuth: true } },
  { path: '/dashboard/payments', name: 'PaymentsPage', component: PaymentsPage, meta: { requiresAuth: true } },
  { path: '/dashboard/support', name: 'SupportPage', component: SupportPage, meta: { requiresAuth: true } },
  { path: '/dashboard/admin', name: 'AdminPage', component: AdminPage, meta: { requiresAuth: true } },
  { path: '/dashboard/settlements', name: 'SettlementsPage', component: SettlementsPage, meta: { requiresAuth: true, requiresIdentified: true } },
  { path: '/dashboard/participants', name: 'ParticipantsPage', component: ParticipantsPage, meta: { requiresAuth: true, requiresIdentified: true } },
  { path: '/dashboard/transactions', name: 'TransactionsPage', component: TransactionsPage, meta: { requiresAuth: true, requiresIdentified: true } },
  { path: '/portal', redirect: '/dashboard' },
  { path: '/portal/payments', redirect: '/dashboard/payments' },
  { path: '/portal/support', redirect: '/dashboard/support' },
  { path: '/portal/admin', redirect: '/dashboard/admin' },
  { path: '/portal/admin/approvals', redirect: '/dashboard/admin' },
  { path: '/portal/admin/config', redirect: '/dashboard/admin' },
  { path: '/portal/admin/companies', redirect: '/dashboard/admin' },
  { path: '/portal/admin/users', redirect: '/dashboard/admin' },
  { path: '/portal/admin/security', redirect: '/dashboard/admin' },
  { path: '/portal/settlements', redirect: '/dashboard/settlements' },
  { path: '/portal/participants', redirect: '/dashboard/participants' },
  { path: '/portal/transactions', redirect: '/dashboard/transactions' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  await store.initializeSession()

  if (to.meta.requiresAuth && !store.isAuthenticated.value) {
    next({ name: 'LoginPage', query: { redirect: to.fullPath } })
    return
  }

  const user = store.user.value
  const isIdentified = user?.identificationStatus === 'identified'
  if (to.meta.requiresIdentified && !isIdentified) {
    next({ name: 'IdentityVerificationPage' })
    return
  }

  if (from.fullPath !== to.fullPath) {
    store.logAction(t('logs.routeChange', { from: from.fullPath || '/', to: to.fullPath }))
  }

  next()
})

export default router
