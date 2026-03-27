<template>
  <section class="py-10 border-t border-gray-200">
    <div class="px-6 md:px-20">

    <!-- inside the template, replace the h2 with: -->
    <TitleSm title="Ratings and Reviews" class="mb-8" />

      <!-- Loading skeleton -->
      <div v-if="isLoading" class="flex gap-5">
        <div
          v-for="i in 5"
          :key="i"
          class="flex-shrink-0 w-52 h-36 bg-gray-100 animate-pulse rounded-xl"
        />
      </div>

      <!-- No reviews -->
      <p v-else-if="reviews.length === 0" class="text-sm text-gray-400">
        No reviews yet for this item.
      </p>

      <!-- Carousel -->
      <div v-else class="relative">
        <div
          ref="scrollContainer"
          class="flex gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
          @scroll="handleScroll"
        >
          <div
            v-for="(review, index) in reviews"
            :key="review.id || index"
            class="flex-shrink-0 w-52 bg-white rounded-xl border border-gray-100 shadow-sm p-4"
          >
            <!-- User row -->
            <div class="flex items-center gap-2 mb-3">
              <div
                v-if="review.userAvatar"
                class="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
              >
                <img
                  :src="review.userAvatar"
                  :alt="review.userName"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600 font-semibold text-xs"
              >
                {{ initials(review.userName) }}
              </div>
              <span class="font-semibold text-sm text-gray-800 truncate leading-tight">
                {{ review.userName }}
              </span>
            </div>

            <!-- Comment -->
            <p class="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
              {{ review.comment }}
            </p>

            <!-- Stars -->
            <div class="flex gap-0.5">
              <span
                v-for="star in 5"
                :key="star"
                class="text-base leading-none"
                :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-200'"
              >
                ★
              </span>
            </div>
          </div>
        </div>

        <!-- Next arrow -->
        <button
          v-show="showNextButton"
          class="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
          @click="scrollNext"
        >
          <UIcon name="i-heroicons:chevron-right" class="text-xl text-gray-600" />
        </button>

        <!-- Prev arrow -->
        <button
          v-show="showPrevButton"
          class="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
          @click="scrollPrev"
        >
          <UIcon name="i-heroicons:chevron-left" class="text-xl text-gray-600" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { apiService } from '~/services/apiService'
import { API_ENDPOINTS } from '~/utils/constants/api'
import TitleSm from '~/components/ui/titles/title-sm.vue'

const props = defineProps({
  section: {
    type: String,
    required: false,
    default: '',
  },
  adId: {
    type: String,
    required: false,
    default: '',
  },
})

const reviews = ref([])
const isLoading = ref(true)
const scrollContainer = ref(null)
const showNextButton = ref(false)
const showPrevButton = ref(false)

const initials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0]?.[0]?.toUpperCase() || '?'
}

const handleScroll = () => {
  if (!scrollContainer.value) return
  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
  showPrevButton.value = scrollLeft > 10
  showNextButton.value = scrollLeft + clientWidth < scrollWidth - 10
}

const scrollNext = () => {
  scrollContainer.value?.scrollBy({ left: 280, behavior: 'smooth' })
}

const scrollPrev = () => {
  scrollContainer.value?.scrollBy({ left: -280, behavior: 'smooth' })
}

let resizeObserver = null

onMounted(async () => {
  try {
    let res
    if (props.adId) {
      res = await apiService.request(API_ENDPOINTS.REVIEWS.GET_BY_AD(props.adId, 20))
    } else if (props.section) {
      res = await apiService.request(API_ENDPOINTS.REVIEWS.GET_BY_SECTION(props.section, 20))
    } else {
      res = { results: [] }
    }

    const results = res?.results || []
    reviews.value = results.map((r) => ({
      id: r.id || r._id,
      userName: r.userId
        ? `${r.userId.firstName || ''} ${r.userId.lastName || ''}`.trim() || 'Anonymous'
        : 'Anonymous',
      userAvatar: null,
      comment: r.comment || '',
      rating: r.rating || 0,
    }))
  } catch {
    reviews.value = []
  } finally {
    isLoading.value = false
  }

  await nextTick()
  handleScroll()

  if (scrollContainer.value) {
    resizeObserver = new ResizeObserver(handleScroll)
    resizeObserver.observe(scrollContainer.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
