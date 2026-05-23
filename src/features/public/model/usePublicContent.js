import { onMounted, ref } from 'vue'
import {
  getPublicCategories,
  getPublicLinks,
  getPublicMarkets,
  getPublicNews,
  getPublicProfile
} from '../../../modules/backend/api'

export function usePublicContent() {
  const profile = ref(null)
  const categories = ref([])
  const markets = ref([])
  const news = ref([])
  const quickLinks = ref([])

  async function loadPublicData() {
    try {
      const [profileData, categoriesData, marketsData, newsData, linksData] = await Promise.all([
        getPublicProfile(),
        getPublicCategories(),
        getPublicMarkets(),
        getPublicNews(),
        getPublicLinks()
      ])

      profile.value = profileData
      categories.value = categoriesData.items ?? []
      markets.value = marketsData.items ?? []
      news.value = newsData.items ?? []
      quickLinks.value = linksData.items ?? []
    } catch {
      profile.value = null
    }
  }

  onMounted(loadPublicData)

  return {
    profile,
    categories,
    markets,
    news,
    quickLinks,
    loadPublicData
  }
}
