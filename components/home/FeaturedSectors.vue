<template>
  <section class="py-16">
    <div class="px-20">
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-12">
        <div class="flex-1 text-center">
          <span class="text-4xl md:text-5xl font-bold relative inline-block after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-2 after:w-4/5 after:h-0.5 after:bg-sec">
            <TitleLg title="Featured Sectors" class="!text-4xl !md:text-5xl" />
          </span>
        </div>
        <NuxtLink 
          to="/categories" 
          class="text-purple font-semibold text-lg hover:text-purple-800 transition-colors flex items-center gap-2"
        >
          See More
          <UIcon name="i-heroicons:chevron-right" class="text-xl" />
        </NuxtLink>
      </div>

      <!-- Cards Container -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <UIcon name="i-heroicons:arrow-path" class="text-4xl text-prim animate-spin" />
      </div>

      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 text-lg">{{ error }}</p>
      </div>

      <div v-else-if="featuredSectors.length === 0" class="text-center py-20">
        <p class="text-gray-500 text-lg">No featured sectors available</p>
      </div>

      <div v-else class="relative">
        <!-- Scroll Container -->
        <div 
          ref="scrollContainer"
          class="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
          @scroll="handleScroll"
        >
          <div 
            v-for="(sector, index) in featuredSectors" 
            :key="index"
            class="flex-shrink-0 w-80"
          >
            <SectorCard 
              :sector="sector"
              @explore="handleExplore"
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
import SectorCard from '~/components/common/SectorCard.vue'
import TitleLg from '~/components/ui/titles/title-lg.vue'
import { apiService } from '~/services/apiService'
import { API_BASE_URL, API_ENDPOINTS } from '~/utils/constants/api'

// Fetch featured categories from backend
const featuredSectors = ref([])
const isLoading = ref(true)
const error = ref(null)

const props = defineProps({ section: { type: String, required: false } })

const fetchFeaturedCategories = async () => {
  try {
    isLoading.value = true

    const params = props.section ? { section: props.section } : undefined
    const response = await apiService.request(API_ENDPOINTS.FEATURED_CATEGORIES.GET_ALL, {}, params)

    console.log('Featured categories response:', response)

    // Transform API data to component format
    featuredSectors.value = response.map(item => {
      const categoryId = item.category?.id || item.categoryId
      console.log('Category ID for', item.category?.name, ':', categoryId)
      return {
        image: item.image ? `${API_BASE_URL.replace('/v1', '')}/uploads/featured_category_images/${item.image}` : '/demo/images/placeholder.jpg',
        title: item.category?.name || 'Category',
        subtitle: item.category?.description || '',
        category: item.category?.name?.toLowerCase() || '',
        categoryId: categoryId
      }
    }).filter(sector => sector.categoryId) // Filter out sectors without valid category ID

    console.log('Mapped featured sectors:', featuredSectors.value)
  } catch (err) {
    console.error('Error fetching featured categories:', err)
    error.value = 'Failed to load featured categories'
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

// Event handler
const handleExplore = (sector) => {
  console.log('Explore sector:', sector.title)
  // Navigate to category page with categoryId
  if (sector.categoryId) {
    navigateTo(`/categories/${sector.categoryId}`)
  } else {
    navigateTo(`/categories/${sector.category}`)
  }
}

// Check scroll buttons on mount and resize
onMounted(async () => {
  await fetchFeaturedCategories()
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
