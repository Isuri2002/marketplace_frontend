<template>
  <section class="py-16">
    <div class="px-20">
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-12">
        <div class="flex-1 text-center">
          <span class="text-4xl md:text-5xl font-bold relative inline-block after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-2 after:w-4/5 after:h-0.5 after:bg-sec">
            <TitleLg title="Trending Rentals" class="!text-4xl !md:text-5xl" />
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

      <!-- Cards Container -->
      <div class="relative">
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
              :cardType="'rent'"
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
import { ref, onMounted, onUnmounted } from 'vue'
import RentalCard from '~/components/common/RentalCard.vue'
import TitleLg from '~/components/ui/titles/title-lg.vue'
import { apiService } from '~/services/apiService'
import { API_ENDPOINTS } from '~/utils/constants/api'
import { useFavorites } from '~/composables/useFavorites'
import { normalizeRentAd } from '~/utils/rentAds'

const { loadFavorites, markFavoriteAds } = useFavorites()

const trendingItems = ref([])
const isLoading = ref(true)

const transformAd = (ad) => normalizeRentAd(ad)

// Fallback sample ads
const sampleAds = [
  {
    id: 'sample-rent-1',
    image: '/demo/images/camera.jpg',
    title: 'Canon D3',
    category: { name: 'Camera' },
    location: 'Melbourne',
    rating: 4.6,
    price: 1000,
    currency: 'LKR',
    rentFrequency: 'hourly',
  },
  {
    id: 'sample-rent-2',
    image: '/demo/images/tent.jpg',
    title: 'Camping Tent',
    category: { name: 'Outdoor' },
    location: 'Victoria',
    rating: 4.4,
    price: 4500,
    currency: 'LKR',
    rentFrequency: 'daily',
  },
]

const fetchTrending = async () => {
  try {
    isLoading.value = true
    const response = await apiService.request(API_ENDPOINTS.ADS.GET_BY_SECTION('rent', 10))
    const results = response?.results || response || []
    const mapped = results.map(transformAd)

    // Ensure favorites cache is loaded and annotate items
    await loadFavorites()

    if (!mapped || mapped.length === 0) {
      trendingItems.value = markFavoriteAds(sampleAds.map(a => ({ ...a })))
    } else {
      trendingItems.value = markFavoriteAds(mapped)
    }
  } catch (err) {
    console.error('Error fetching trending rentals:', err)
  } finally {
    isLoading.value = false
  }
}

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
  navigateTo(`/items/${item.id}`)
}

// Check scroll buttons on mount and resize
onMounted(async () => {
  await fetchTrending()
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
