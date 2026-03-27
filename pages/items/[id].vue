<template>
  <div class="bg-[#f5f5f5] pt-20 lg:pt-24">
    <div class="mx-auto max-w-[1320px] px-4 pb-16 sm:px-6 lg:px-8">
      <div class="mb-5">
        <Breadcrumb :items="breadcrumbItems" />
      </div>

      <div v-if="isLoading" class="flex items-center justify-center py-24">
        <UIcon name="i-heroicons:arrow-path" class="text-4xl text-sec animate-spin" />
      </div>

      <div v-else-if="error" class="rounded-[24px] bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
        <p class="text-lg font-medium text-red-500">{{ error }}</p>
        <ButtonPrimary label="Go Back" class="mt-4" @click="router.back()" />
      </div>

      <div v-else>
        <section class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div class="overflow-hidden rounded-[24px] bg-white p-3 shadow-sm ring-1 ring-black/5 sm:p-4">
              <div class="overflow-hidden rounded-[20px] bg-[#f7f7fa]">
                <img
                  :src="selectedImage"
                  :alt="item.title"
                  class="h-[340px] w-full object-cover sm:h-[460px] lg:h-[560px]"
                />
              </div>
            </div>

            <div class="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
              <button
                v-for="(image, index) in allImages"
                :key="`${image}-${index}`"
                class="overflow-hidden rounded-[16px] border bg-white p-1 transition"
                :class="selectedImage === image ? 'border-sec shadow-[0_8px_20px_rgba(254,127,14,0.2)]' : 'border-transparent ring-1 ring-black/5 hover:border-[#e7e7ef]'"
                @click="selectedImage = image"
              >
                <img
                  :src="image"
                  :alt="`${item.title} thumbnail ${index + 1}`"
                  class="h-16 w-full rounded-[12px] object-cover sm:h-20"
                />
              </button>
            </div>
          </div>

          <div>
            <div class="sticky top-24 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
              <div class="flex items-start justify-between gap-4">
                <span class="inline-flex rounded-full bg-[#eef3ff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-prim">
                  {{ item.categoryName || 'Electronics' }}
                </span>
                <button
                  class="flex h-10 w-10 items-center justify-center rounded-full border border-[#ececf4] text-purple transition hover:border-purple"
                  @click="handleToggleFavorite"
                >
                  <UIcon :name="item.isFavorite ? 'i-heroicons:heart-solid' : 'i-heroicons:heart'" class="text-lg" />
                </button>
              </div>

              <h1 class="mt-4 text-[30px] font-bold leading-tight text-[#1d2140] sm:text-[34px]">
                {{ item.title }}
              </h1>

              <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                <div class="flex items-center gap-1 text-sec">
                  <UIcon v-for="star in 5" :key="star" name="i-heroicons:star-solid" class="text-sm" />
                </div>
                <span class="font-semibold text-[#2f3358]">{{ item.rating }}</span>
                <span class="text-[#9a9db3]">{{ item.reviewCount }} reviews</span>
              </div>

              <div class="mt-6">
                <div class="flex items-end gap-2">
                  <span class="text-[36px] font-bold leading-none text-sec">{{ displayPrice }}</span>
                  <span class="pb-1 text-sm text-[#8f92a8]">/ {{ item.period }}</span>
                </div>
                <p class="mt-2 text-xs text-[#a4a7ba]">(LKR {{ item.price }}/{{ item.period.toLowerCase() }})</p>
              </div>

              <div class="mt-6 grid gap-3 sm:grid-cols-2">
                <div class="rounded-[16px] border border-[#ebeaf3] px-4 py-3">
                  <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a9db3]">Pick up</p>
                  <CalendarPopup
                    v-model="startDate"
                    :min-date="minDate"
                    placeholder="mm/dd/yyyy"
                    class="mt-2"
                  />
                </div>
                <div class="rounded-[16px] border border-[#ebeaf3] px-4 py-3">
                  <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a9db3]">Drop off</p>
                  <CalendarPopup
                    v-model="endDate"
                    :min-date="startDate || minDate"
                    placeholder="mm/dd/yyyy"
                    class="mt-2"
                  />
                </div>
              </div>

              <div class="mt-4 flex items-center gap-2 text-sm text-[#6f738f]">
                <UIcon name="i-heroicons:map-pin" class="text-sec" />
                <span>{{ item.location }}</span>
              </div>

              <ButtonPrimary
                label="Book Now"
                :isBlock="true"
                size="lg"
                class="mt-6"
                :isLoading="isBooking"
                @click="handleBookNow"
              />

              <p class="mt-3 text-center text-xs text-[#a1a5bb]">
                Free cancellation up to 24 hours before pickup
              </p>
            </div>
          </div>
        </section>

        <section class="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div class="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
              <div class="flex flex-wrap gap-6 border-b border-[#ececf4] pb-4">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  class="relative text-sm font-semibold transition"
                  :class="activeTab === tab.id ? 'text-sec' : 'text-[#8d90a7] hover:text-[#4a4e73]'"
                  @click="activeTab = tab.id"
                >
                  {{ tab.label }}
                  <span
                    v-if="activeTab === tab.id"
                    class="absolute -bottom-4 left-0 h-[2px] w-full rounded-full bg-sec"
                  />
                </button>
              </div>

              <div class="pt-6">
                <div v-if="activeTab === 'overview'">
                  <h2 class="text-xl font-bold text-[#1d2140]">Product Overview</h2>
                  <p class="mt-4 whitespace-pre-line text-sm leading-7 text-[#646984]">
                    {{ item.description }}
                  </p>

                  <h3 class="mt-8 text-lg font-bold text-[#1d2140]">Key Features</h3>
                  <div class="mt-4 grid gap-3 sm:grid-cols-2">
                    <div
                      v-for="feature in keyFeatures"
                      :key="feature"
                      class="rounded-[16px] border border-[#ededf5] bg-[#fafafe] px-4 py-3 text-sm font-medium text-[#5b607c]"
                    >
                      <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons:bolt" class="text-sec" />
                        <span>{{ feature }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else-if="activeTab === 'specs'" class="grid gap-3 sm:grid-cols-2">
                  <div
                    v-for="spec in specs"
                    :key="spec.label"
                    class="rounded-[16px] border border-[#ededf5] bg-[#fafafe] px-4 py-3"
                  >
                    <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9a9db3]">{{ spec.label }}</p>
                    <p class="mt-2 text-sm font-semibold text-[#2f3358]">{{ spec.value }}</p>
                  </div>
                </div>

                <div v-else-if="activeTab === 'location'" class="overflow-hidden rounded-[16px]">
                  <MapView :location="item.location" />
                </div>

                <div v-else class="text-sm text-[#646984]">
                  See reviews in the section below.
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
            <h3 class="text-lg font-bold text-[#1d2140]">Rental Summary</h3>
            <div class="mt-4 space-y-3 text-sm text-[#646984]">
              <p><span class="font-semibold text-[#2f3358]">Owner:</span> {{ item.ownerName || 'Earnit' }}</p>
              <p><span class="font-semibold text-[#2f3358]">Category:</span> {{ item.categoryName || 'Electronics' }}</p>
              <p><span class="font-semibold text-[#2f3358]">Pickup:</span> {{ startDate || '-' }}</p>
              <p><span class="font-semibold text-[#2f3358]">Drop off:</span> {{ endDate || '-' }}</p>
            </div>
          </div>
        </section>

        <div class="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 class="mb-6 text-xl font-bold text-gray-900">Ratings &amp; Reviews</h2>

          <div v-if="authStore.isAuthenticated" class="mb-8">
            <div v-if="reviewEligibility.loading" class="mb-6 flex items-center gap-2 text-sm text-gray-400">
              <UIcon name="i-heroicons:arrow-path" class="animate-spin" />
              Checking booking status...
            </div>

            <div v-else-if="reviewEligibility.alreadyReviewed" class="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4">
              <UIcon name="i-heroicons:check-circle-solid" class="text-xl text-green-600" />
              <span class="text-sm font-medium text-green-700">You've already reviewed this item. Thank you!</span>
            </div>

            <div v-else-if="reviewEligibility.eligible" class="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h3 class="mb-4 text-base font-semibold text-gray-800">Share your experience</h3>
              <div class="mb-4 flex gap-1">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  @click="reviewForm.rating = star"
                  class="text-3xl leading-none transition-colors"
                  :class="star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'"
                >★</button>
              </div>
              <p v-if="reviewErrors.rating" class="mb-2 text-xs text-red-500">{{ reviewErrors.rating }}</p>
              <textarea
                v-model="reviewForm.comment"
                placeholder="Tell others what you thought about this item..."
                rows="3"
                class="mb-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sec"
              ></textarea>
              <p v-if="reviewErrors.comment" class="mb-2 text-xs text-red-500">{{ reviewErrors.comment }}</p>
              <ButtonPrimary
                label="Submit Review"
                size="md"
                variant="solid"
                :isLoading="reviewForm.submitting"
                @click="submitReview"
              />
            </div>

            <div v-else class="mb-6 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <UIcon name="i-heroicons:information-circle" class="text-xl text-blue-500" />
              <span class="text-sm text-blue-700">Book and complete a rental to leave a review.</span>
            </div>
          </div>

          <RatingsAndReviews v-if="item.id" :adId="String(item.id)" :key="reviewRefreshKey" />
        </div>

        <SimilarRentals
          v-if="!isLoading && item.id"
          :categoryId="String(item.categoryId || '')"
          :currentItemId="String(item.id || '')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import ButtonPrimary from '~/components/ui/buttons/button-primary.vue'
import CalendarPopup from '~/components/ui/CalendarPopup.vue'
import { apiService } from '~/services/apiService'
import { API_ENDPOINTS } from '~/utils/constants/api'
import Breadcrumb from '~/components/ui/breadcrumb.vue'
import MapView from '~/components/ui/MapView.vue'
import SimilarRentals from '~/components/common/SimilarRentals.vue'
import RatingsAndReviews from '~/components/common/RatingsAndReviews.vue'
import { useAuthStore } from '~/store/index.js'
import { useFavorites } from '~/composables/useFavorites'
import { buildAdImages, normalizeAdditionalInfo, normalizeRentAd } from '~/utils/rentAds'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(true)
const error = ref(null)
const isBooking = ref(false)
const item = ref({})
const selectedImage = ref('')
const allImages = ref([])
const startDate = ref('')
const endDate = ref('')
const activeTab = ref('overview')
const minDate = ref(new Date().toISOString().split('T')[0])
const reviews = ref([])
const isReviewsLoading = ref(false)
const toast = useToast()

const tabs = [
  { id: 'overview', label: 'Description' },
  { id: 'specs', label: 'Technical Specs' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'location', label: 'Location' }
]

const breadcrumbItems = computed(() => [
  { label: 'Rentals', to: '/rent' },
  { label: item.value.categoryName || 'Electronics', to: '/categories' },
  { label: item.value.title || 'Item' }
])

const displayPrice = computed(() => `LKR ${Number(item.value.price || 0).toLocaleString()}`)

const keyFeatures = computed(() => {
  const base = [
    '24.5MP full-frame CMOS',
    '4K UHD video recording',
    '12 fps continuous shooting',
    'Dual-band Wi-Fi and Bluetooth'
  ]

  const dynamic = normalizeAdditionalInfo(item.value.additionalInfo)
    .map((entry) => entry?.label || entry?.value)
    .filter(Boolean)
    .slice(0, 4)

  return dynamic.length ? dynamic : base
})

const specs = computed(() => [
  { label: 'Category', value: item.value.categoryName || 'Electronics' },
  { label: 'Rental Type', value: item.value.period || 'Day' },
  { label: 'Location', value: item.value.location || 'Anuradhapura' },
  { label: 'Availability', value: 'In stock for selected dates' }
])

const { loadFavorites, isFavorite: isFavGlobal, addToFavorites, removeFromFavorites } = useFavorites()

const mapReview = (review = {}) => ({
  initials: `${review.userId?.firstName?.[0] || ''}${review.userId?.lastName?.[0] || ''}`.trim() || 'AN',
  name: `${review.userId?.firstName || ''} ${review.userId?.lastName || ''}`.trim() || 'Anonymous',
  date: review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently',
  quote: review.comment || 'No comment provided.',
  rating: review.rating || 0,
})

const fetchItemDetails = async () => {
  isLoading.value = true
  error.value = null

  try {
    const id = route.params.id
    if (!id || id === 'undefined') {
      throw new Error('Invalid item ID')
    }

    await loadFavorites()

    const endpoint = API_ENDPOINTS.ADS.GET_BY_ID(id)
    const response = await apiService.request({
      ...endpoint,
      url: `${endpoint.url}?populate=category,user`
    })

    const ad = response.ad || response
    const mappedAd = normalizeRentAd(ad)
    const images = buildAdImages(ad)
    allImages.value = images
    selectedImage.value = images[0] || mappedAd.image

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    startDate.value = today.toISOString().split('T')[0]
    endDate.value = tomorrow.toISOString().split('T')[0]

    item.value = {
      ...mappedAd,
      address: mappedAd.address,
      rating: mappedAd.rating || 'New',
      reviewCount: ad.reviewCount || 0,
      ownerName: ad.user?.name || ad.ownerName || 'Earnit',
      additionalInfo: normalizeAdditionalInfo(ad.additionalInfo),
      isFavorite: ad.isFavorite ?? isFavGlobal(ad.id || ad._id)
    }
    await fetchReviews(item.value.id)
  } catch (err) {
    console.error('Error fetching item details:', err)
    error.value = 'Failed to load item details. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const fetchReviews = async (adId) => {
  if (!adId) {
    reviews.value = []
    return
  }

  isReviewsLoading.value = true
  try {
    const response = await apiService.request(API_ENDPOINTS.REVIEWS.GET_BY_AD(adId, 10))
    reviews.value = (response.results || []).map(mapReview)
  } catch (err) {
    console.error('Error fetching ad reviews:', err)
    reviews.value = []
  } finally {
    isReviewsLoading.value = false
  }
}

const handleBookNow = async () => {
  if (!startDate.value || !endDate.value) {
    toast.add({
      title: 'Dates required',
      description: 'Please select pickup and drop off dates.',
      icon: 'i-heroicons-exclamation-circle-solid',
      color: 'red',
    })
    return
  }

  const target = `/bookings/${item.value.id}?startDate=${encodeURIComponent(startDate.value)}&endDate=${encodeURIComponent(endDate.value)}`

  if (!authStore.isAuthenticated) {
    router.push(`/auth/login?redirect=${encodeURIComponent(target)}`)
    return
  }

  isBooking.value = true
  try {
    await router.push(target)
  } catch (err) {
    console.error('Error navigating to booking:', err)
  } finally {
    isBooking.value = false
  }
}

const handleToggleFavorite = async () => {
  const id = item.value.id
  if (!id) return

  if (!authStore.isAuthenticated) {
    router.push(`/auth/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }

  const wasAlreadyFavorite = item.value.isFavorite
  item.value.isFavorite = !item.value.isFavorite

  try {
    if (wasAlreadyFavorite) {
      await apiService.request(API_ENDPOINTS.FAVORITES.REMOVE(id))
      removeFromFavorites(id)
    } else {
      await apiService.request(API_ENDPOINTS.FAVORITES.ADD(id))
      addToFavorites(id)
    }
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || ''
    if (message.includes('Ad already in favorites')) {
      item.value.isFavorite = true
      addToFavorites(id)
    } else if (message.includes('Favorite not found')) {
      item.value.isFavorite = false
      removeFromFavorites(id)
    } else {
      item.value.isFavorite = wasAlreadyFavorite
      toast.add({
        title: 'Error',
        description: message || 'Failed to update favorite',
        icon: 'i-heroicons-exclamation-circle-solid',
        color: 'red',
      })
    }
  }
}

// Review form state (Airbnb-style: only allowed after confirmed booking)
const reviewRefreshKey = ref(0)
const reviewEligibility = reactive({ loading: false, eligible: false, alreadyReviewed: false })
const reviewForm = reactive({ rating: 0, comment: '', submitting: false })
const reviewErrors = reactive({ rating: '', comment: '' })

const checkReviewEligibility = async (adId) => {
  if (!authStore.isAuthenticated) return
  reviewEligibility.loading = true
  try {
    const res = await apiService.request(API_ENDPOINTS.BOOKINGS.CHECK_REVIEW(adId))
    reviewEligibility.eligible = res.eligible
    reviewEligibility.alreadyReviewed = res.alreadyReviewed
  } catch {
    reviewEligibility.eligible = false
  } finally {
    reviewEligibility.loading = false
  }
}

const submitReview = async () => {
  reviewErrors.rating = ''
  reviewErrors.comment = ''
  if (!reviewForm.rating) { reviewErrors.rating = 'Please select a rating.'; return }
  if (!reviewForm.comment.trim()) { reviewErrors.comment = 'Please write a comment.'; return }

  reviewForm.submitting = true
  try {
    await apiService.request(API_ENDPOINTS.REVIEWS.ADD, {
      adId: item.value.id,
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
    })
    reviewEligibility.alreadyReviewed = true
    reviewForm.rating = 0
    reviewForm.comment = ''
    reviewRefreshKey.value++  // re-mount RatingsAndReviews to reload the list
  } catch (err) {
    reviewErrors.comment = err?.message || 'Failed to submit review. Please try again.'
  } finally {
    reviewForm.submitting = false
  }
}

// Open image gallery (could implement a modal/lightbox)
const openImageGallery = () => {
  // TODO: Implement image gallery modal
  console.log('Open image gallery')
}

// Initialize component
onMounted(async () => {
  await fetchItemDetails()
  if (item.value.id) {
    checkReviewEligibility(item.value.id)
  }
})
</script>
