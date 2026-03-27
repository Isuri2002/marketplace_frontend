<template>
  <section>
    <div class="container !px-0">
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-12">
        <div class="flex-1 text-center">
          <span class="text-4xl md:text-5xl font-bold relative inline-block after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-2 after:w-4/5 after:h-0.5 after:bg-sec">
            <TitleLg title="Similar Rentals For You" class="!text-4xl !md:text-5xl" />
          </span>
        </div>
        <NuxtLink 
          to="/rent" 
          class="text-purple font-semibold text-lg hover:text-purple-800 transition-colors flex items-center gap-2"
        >
          See More
          <UIcon name="i-heroicons:chevron-right" class="text-xl" />
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex gap-6 overflow-x-hidden pb-4">
        <div v-for="n in 4" :key="n" class="flex-shrink-0 w-80 h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>

      <!-- Empty State -->
      <div v-else-if="!trendingItems.length" class="text-center py-10 text-gray-400">
        No similar rentals found.
      </div>

      <!-- Cards Container -->
      <div v-else class="relative">
        <!-- Scroll Container -->
        <div 
          ref="scrollContainer"
          class="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
          @scroll="handleScroll"
        >
          <div 
            v-for="(item, index) in trendingItems" 
            :key="index"
            class="flex-shrink-0 w-80"
          >
            <RentalCard 
              :item="item"
              :cardType="'hire'"
              :initialFavorite="item.isFavorite"
              @favorite="handleFavorite"
              @book="handleBooking"
            />
          </div>
        </div>

        <!-- Next Button -->
        <button
          v-show="showNextButton"
          @click="scrollNext"
          class="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-colors z-10"
        >
          <UIcon name="i-heroicons:chevron-right" class="text-2xl text-gray-700" />
        </button>

        <!-- Previous Button -->
        <button
          v-show="showPrevButton"
          @click="scrollPrev"
          class="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-colors z-10"
        >
          <UIcon name="i-heroicons:chevron-left" class="text-2xl text-gray-700" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import RentalCard from '~/components/common/RentalCard.vue'
import TitleLg from '~/components/ui/titles/title-lg.vue'
import { apiService } from '~/services/apiService'
import { API_BASE_URL, API_ENDPOINTS } from '~/utils/constants/api'
import { useFavorites } from '~/composables/useFavorites'

const props = defineProps({
  categoryId: {
    type: String,
    default: ''
  },
  currentItemId: {
    type: String,
    default: ''
  }
})

const { loadFavorites, markFavoriteAds } = useFavorites()

const trendingItems = ref([])
const isLoading = ref(true)

const transformAd = (ad) => ({
  id: ad._id || ad.id,
  image: ad.mainImage && String(ad.mainImage).trim().startsWith('http')
    ? ad.mainImage
    : '/demo/images/placeholder.jpg',
  title: ad.title,
  category: ad.category || { name: '' },
  location: ad.city || '',
  rating: ad.averageRating || 0,
  price: ad.price || 0,
  currency: 'LKR',
  section: ad.section || 'hire',
})


const fetchSimilarItems = async () => {
  try {
    isLoading.value = true
    let response

    if (props.categoryId) {
      response = await apiService.request({
        ...API_ENDPOINTS.ADS.GET_BY_CATEGORY(props.categoryId),
        url: `${API_ENDPOINTS.ADS.GET_BY_CATEGORY(props.categoryId).url}&limit=10`
      })
    } else {
      response = await apiService.request(API_ENDPOINTS.ADS.GET_BY_SECTION('hire', 10))
    }

    // Handle different response shapes: { results: [] } / { ads: [] } / []
    const raw = response?.results ?? response?.ads ?? response?.data ?? response
    const results = Array.isArray(raw) ? raw : []

    // Exclude the current item from similar items
    const filtered = results.filter(ad => {
      const adId = String(ad._id || ad.id || '')
      return adId !== props.currentItemId
    })
    const mapped = filtered.map(transformAd)

    await loadFavorites()
    trendingItems.value = markFavoriteAds(mapped)
  } catch (err) {
    console.error('Error fetching similar items:', err)
  } finally {
    isLoading.value = false
  }
}

// Re-fetch when category or item id changes after initial mount
watch(() => [props.categoryId, props.currentItemId], fetchSimilarItems)

// Scroll controls
const scrollContainer = ref(null)
const showNextButton = ref(true)
const showPrevButton = ref(false)

const scrollNext = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: 400,
      behavior: 'smooth'
    })
  }
}

const scrollPrev = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: -400,
      behavior: 'smooth'
    })
  }
}

const handleScroll = () => {
  if (!scrollContainer.value) return
  
  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
  
  showPrevButton.value = scrollLeft > 0
  showNextButton.value = scrollLeft < scrollWidth - clientWidth - 10
}

// Event handlers
const handleFavorite = ({ item, isFavorite }) => {
  console.log('Favorite toggled:', item.title, isFavorite)
}

const handleBooking = (item) => {
  navigateTo(`/hire/${item.id}`)
}

// Check scroll buttons on mount and resize
onMounted(async () => {
  await fetchSimilarItems()   // props are already set when component mounts
  handleScroll()
  window.addEventListener('resize', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleScroll)
})
</script>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
