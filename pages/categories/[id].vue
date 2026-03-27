<template>
  <div :key="categoryId" class="mt-20">
    <div class="container bg-white">
      <SearchBar
        section="rent"
        :initial-category="categoryId"
        :initial-keyword="route.query.keyword || ''"
        :initial-location="route.query.location || ''"
        @search="performSearch"
      />
      <Breadcrumb :items="breadcrumbItems" />

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <TitleLg :title="`${totalResults} Results : ${categoryName}`" />
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
        <ButtonPrimary label="Retry" @click="fetchCategoryItems" class="mt-4" />
      </div>

      <div v-else-if="items.length === 0" class="text-center py-20">
        <UIcon name="i-heroicons:inbox" class="text-6xl text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No Rent Listings Found</h3>
        <p class="text-gray-500">Try adjusting the keyword or location filters.</p>
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
import TitleLg from '~/components/ui/titles/title-lg.vue'
import { apiService } from '~/services/apiService'
import { API_ENDPOINTS } from '~/utils/constants/api'
import SearchBar from '~/components/common/SearchBar.vue'
import Breadcrumb from '~/components/ui/breadcrumb.vue'
import { useFavorites } from '~/composables/useFavorites'
import { matchRentFilters, normalizeRentAd } from '~/utils/rentAds'

const { loadFavorites, markFavoriteAds, addToFavorites, removeFromFavorites } = useFavorites()

const route = useRoute()
const router = useRouter()
const categoryId = computed(() => String(route.params.id || ''))

const categoryName = ref('Category')
const isLoading = ref(true)
const isLoadingMore = ref(false)
const error = ref(null)
const items = ref([])
const totalResults = ref(0)
const viewMode = ref(process.client ? localStorage.getItem('viewMode') || 'grid' : 'grid')
const sortBy = ref(process.client ? localStorage.getItem('sortBy') || 'recent' : 'recent')
const hasMore = ref(false)
const currentPage = ref(1)

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

const breadcrumbItems = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Rent', to: '/rent' },
  { label: categoryName.value || 'Category' }
])

const activeFilters = computed(() => ({
  keyword: String(route.query.keyword || ''),
  location: String(route.query.location || ''),
}))

const fetchCategoryDetails = async () => {
  try {
    const response = await apiService.request(API_ENDPOINTS.CATEGORIES.GET_BY_ID(categoryId.value), {}, { section: 'rent' })
    categoryName.value = response.categories?.name || response.categories?.[0]?.name || 'Category'
  } catch (err) {
    console.error('Error fetching category details:', err)
    categoryName.value = 'Category'
  }
}

const fetchCategoryItems = async (append = false) => {
  if (append) {
    isLoadingMore.value = true
  } else {
    isLoading.value = true
  }
  error.value = null

  try {
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

    const endpoint = API_ENDPOINTS.ADS.GET_BY_CATEGORY(categoryId.value)
    const response = await apiService.request(endpoint, {}, params)
    const mappedItems = markFavoriteAds(
      (response.results || [])
        .map((ad) => normalizeRentAd(ad, { categoryName: categoryName.value }))
        .filter((ad) => matchRentFilters(ad, activeFilters.value))
    )

    if (append) {
      items.value = [...items.value, ...mappedItems]
    } else {
      items.value = mappedItems
    }

    totalResults.value = items.value.length
    hasMore.value = response.page < response.totalPages
  } catch (err) {
    console.error('Error fetching category items:', err)
    error.value = 'Failed to load rent listings. Please try again.'
    items.value = []
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

const handleSortChange = () => {
  currentPage.value = 1
  fetchCategoryItems()
}

const loadMore = () => {
  currentPage.value++
  fetchCategoryItems(true)
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

  if (payload.category && payload.category !== categoryId.value) {
    router.push({ path: `/categories/${payload.category}`, query })
    return
  }

  router.push({ path: `/categories/${categoryId.value}`, query })
}

onMounted(async () => {
  await loadFavorites()
  await fetchCategoryDetails()
  await fetchCategoryItems()
})

watch(
  () => route.fullPath,
  async () => {
    currentPage.value = 1
    await fetchCategoryDetails()
    await fetchCategoryItems()
  }
)
</script>
