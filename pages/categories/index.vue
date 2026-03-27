<template>
  <div class="mt-12">
    <div class="container bg-white">
      <SearchBar
        section="rent"
        :initial-category="route.query.category || ''"
        :initial-keyword="route.query.keyword || ''"
        :initial-location="route.query.location || ''"
        @search="performSearch"
      />
      <Breadcrumb :items="breadcrumbItems" />

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <TitleLg :title="`${totalResults} Results : All Rent Categories`" />
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center p-1">
            <ButtonPrimary
              :variant="viewMode === 'grid' ? 'solid' : 'outline'"
              label="Grid"
              size="sm"
              icon="i-heroicons:squares-2x2"
              @click="viewMode = 'grid'"
              class="p-2"
            />
            <ButtonPrimary
              :variant="viewMode === 'list' ? 'solid' : 'outline'"
              label="List"
              size="sm"
              icon="i-heroicons:list-bullet"
              @click="viewMode = 'list'"
              class="p-2"
            />
          </div>

          <div class="flex items-center gap-2">
            <span class="text-gray-600 text-sm">Sort By:</span>
            <USelect
              v-model="sortBy"
              :options="sortOptions"
              size="md"
              @change="handleSortChange"
            />
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <UIcon name="i-heroicons:arrow-path" class="text-4xl text-prim animate-spin" />
      </div>

      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 text-lg">{{ error }}</p>
        <ButtonPrimary label="Retry" @click="fetchAllItems" class="mt-4" />
      </div>

      <div v-else-if="items.length === 0" class="text-center py-20">
        <UIcon name="i-heroicons:inbox" class="text-6xl text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No Rent Listings Found</h3>
        <p class="text-gray-500">Try changing the category, keyword, or location filters.</p>
      </div>

      <RentalCard
        :items="items"
        :viewMode="viewMode"
        cardType="rent"
        @favorite="handleFavorite"
        @book="handleViewDetails"
      />

      <div v-if="!isLoading && items.length > 0" class="text-center mt-12">
        <ButtonPrimary
          v-if="hasMore"
          label="See More"
          variant="outline"
          size="lg"
          :isLoading="isLoadingMore"
          @click="loadMore"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import RentalCard from '~/components/common/RentalCard.vue'
import ButtonPrimary from '~/components/ui/buttons/button-primary.vue'
import { apiService } from '~/services/apiService'
import { API_ENDPOINTS } from '~/utils/constants/api'
import TitleLg from '~/components/ui/titles/title-lg.vue'
import SearchBar from '~/components/common/SearchBar.vue'
import Breadcrumb from '~/components/ui/breadcrumb.vue'
import { useFavorites } from '~/composables/useFavorites'
import { matchRentFilters, normalizeRentAd } from '~/utils/rentAds'

const { loadFavorites, markFavoriteAds, addToFavorites, removeFromFavorites } = useFavorites()

const route = useRoute()
const router = useRouter()

const breadcrumbItems = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Rent', to: '/rent' },
  { label: 'Categories' },
])

const isLoading = ref(true)
const isLoadingMore = ref(false)
const error = ref(null)
const items = ref([])
const totalResults = ref(0)
const viewMode = ref(process.client ? localStorage.getItem('viewMode') || 'grid' : 'grid')
const sortBy = ref(process.client ? localStorage.getItem('sortBy') || 'recent' : 'recent')
const hasMore = ref(false)
const currentPage = ref(1)
const allowedCategoryIds = ref([])
const categoryNamesMap = ref({})

if (process.client) {
  watch(viewMode, (newVal) => localStorage.setItem('viewMode', newVal))
  watch(sortBy, (newVal) => localStorage.setItem('sortBy', newVal))
}

const sortOptions = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Highest Rated', value: 'rating' }
]

const activeFilters = computed(() => ({
  keyword: String(route.query.keyword || ''),
  location: String(route.query.location || ''),
}))

const fetchAllowedCategories = async () => {
  try {
    const response = await apiService.request(API_ENDPOINTS.NAVIGATION.GET_ALL)
    const navItems = Array.isArray(response) ? response : []
    const rentItems = navItems.filter((item) => {
      if (!item?.category?.id) return false
      if (!Array.isArray(item.sections) || item.sections.length === 0) return true
      return item.sections.includes('rent')
    })

    allowedCategoryIds.value = rentItems.map((item) => item.category.id)
    categoryNamesMap.value = rentItems.reduce((acc, item) => {
      acc[item.category.id] = item.category.name || 'Category'
      return acc
    }, {})
  } catch (err) {
    console.error('Error fetching allowed categories:', err)
    allowedCategoryIds.value = []
    categoryNamesMap.value = {}
  }
}

const filteredItems = (results = []) =>
  results
    .map((ad) => {
      const categoryId = ad.category?.id || ad.category?._id || ad.category
      return normalizeRentAd(ad, { categoryName: categoryNamesMap.value[categoryId] })
    })
    .filter((ad) => {
      if (allowedCategoryIds.value.length > 0 && !allowedCategoryIds.value.includes(ad.categoryId)) return false
      return matchRentFilters(ad, activeFilters.value)
    })

const fetchAllItems = async (append = false) => {
  if (append) {
    isLoadingMore.value = true
  } else {
    isLoading.value = true
  }
  error.value = null

  try {
    if (allowedCategoryIds.value.length === 0) {
      await fetchAllowedCategories()
    }

    const params = {
      page: currentPage.value,
      limit: 12,
      populate: 'category',
      section: 'rent',
    }

    if (activeFilters.value.keyword) {
      params.similarTitle = activeFilters.value.keyword
    }

    if (sortBy.value === 'price_asc') params.sortBy = 'price:asc'
    if (sortBy.value === 'price_desc') params.sortBy = 'price:desc'
    if (sortBy.value === 'rating') params.sortBy = 'rating:desc'

    const response = await apiService.request(API_ENDPOINTS.ADS.GET_ALL, {}, params)
    const results = filteredItems(response.results || [])
    const markedItems = markFavoriteAds(results)

    if (append) {
      items.value = [...items.value, ...markedItems]
    } else {
      items.value = markedItems
    }

    totalResults.value = items.value.length
    hasMore.value = response.page < response.totalPages
  } catch (err) {
    console.error('Error fetching rent items:', err)
    error.value = 'Failed to load rent listings. Please try again.'
    items.value = []
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

const handleSortChange = () => {
  currentPage.value = 1
  fetchAllItems()
}

const loadMore = () => {
  currentPage.value++
  fetchAllItems(true)
}

const handleFavorite = ({ item, isFavorite }) => {
  item.isFavorite = isFavorite
  if (isFavorite) {
    addToFavorites(item.id)
  } else {
    removeFromFavorites(item.id)
  }
}

const handleViewDetails = (item) => {
  navigateTo(`/items/${item.id}`)
}

const performSearch = (payload) => {
  const query = {}
  if (payload.keyword) query.keyword = payload.keyword
  if (payload.location) query.location = payload.location
  router.push({ path: '/categories', query: { ...query, section: 'rent' } })
}

onMounted(async () => {
  await loadFavorites()
  await fetchAllowedCategories()
  await fetchAllItems()
})

watch(
  () => route.fullPath,
  async () => {
    currentPage.value = 1
    await fetchAllItems()
  }
)
</script>
