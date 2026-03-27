<template>
  <section class="py-16">
    <div class="px-20">
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-12">
        <div class="flex-1 text-center">
          <span class="text-4xl md:text-5xl font-bold relative inline-block after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-2 after:w-4/5 after:h-0.5 after:bg-sec">
            <TitleLg title="Electronic Rentals" class="!text-4xl !md:text-5xl" />
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

const isRentSectionAd = (ad = {}) => {
  if (Array.isArray(ad.sections) && ad.sections.length > 0) {
    return ad.sections.includes('rent')
  }
  return (ad.section || '').toLowerCase() === 'rent'
}


const fetchTrending = async () => {
  try {
    isLoading.value = true

    // attempt to find a category for electronics rentals
    let mapped = []
    try {
      const catResp = await apiService.request(API_ENDPOINTS.CATEGORIES.GET)
      const electronicCat = (catResp?.categories || []).find(c => {
        const name = (c.name || '').toLowerCase()
        return name.includes('electronic') || name.includes('camera') || name.includes('computer') || name.includes('laptop')
      })
      if (electronicCat) {
        const electronicCatId = electronicCat?.id || electronicCat?._id
        if (electronicCatId) {
          const adResp = await apiService.request(
            API_ENDPOINTS.ADS.GET_BY_CATEGORY(electronicCatId),
            {},
            { section: 'rent', limit: 10 }
          )
          const results = adResp?.results || adResp || []
          mapped = results.filter(isRentSectionAd).map(transformAd)
        }
      }
    } catch (e) {
      console.warn('electronic category lookup failed', e)
    }

    // fallback to generic rent section if nothing found
    if (!mapped || mapped.length === 0) {
      const response = await apiService.request(API_ENDPOINTS.ADS.GET_BY_SECTION('rent', 10))
      const results = response?.results || response || []
      mapped = results.filter(isRentSectionAd).map(transformAd)
    }

    // annotate favorites
    await loadFavorites()

    trendingItems.value = markFavoriteAds(mapped)
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
