<template>
  <div class="mt-12">
    <div class="container bg-white">
      <!-- Breadcrumb -->
      <Breadcrumb :items="breadcrumbItems" />

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <UIcon name="i-heroicons:arrow-path" class="text-4xl text-sec animate-spin" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 text-lg">{{ error }}</p>
        <ButtonPrimary label="Go Back" @click="router.back()" class="mt-4" />
      </div>

      <!-- Hire Details -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-4">

        <!-- ===================== LEFT COLUMN ===================== -->
        <div class="lg:col-span-2">

          <!-- Provider Header -->
          <div class="flex items-start justify-between gap-4 mb-6">
            <div class="flex items-start gap-4">
              <!-- Avatar -->
              <div class="relative flex-shrink-0">
                <img
                  :src="item.providerAvatar || '/demo/images/avatar/placeholder.svg'"
                  :alt="item.providerName"
                  class="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <UIcon
                  v-if="item.isVerified"
                  name="i-heroicons:check-badge-solid"
                  class="absolute -bottom-1 -right-1 text-xl text-blue-500 bg-white rounded-full"
                />
              </div>
              <div class="flex-1">
                <!-- Name / rating / location -->
                <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ item.title }}</h1>
                <p class="text-sec font-semibold text-sm mb-1">{{ item.providerName }}</p>

                <!-- Stars + location inline -->
                <div class="flex items-center gap-3 flex-wrap">
                  <div class="flex items-center gap-1">
                    <template v-for="star in 5" :key="star">
                      <UIcon
                        :name="star <= Math.round(item.rating) ? 'i-heroicons:star-solid' : 'i-heroicons:star'"
                        class="text-sm text-yellow-400"
                      />
                    </template>
                    <span class="text-sm font-semibold text-gray-700 ml-1">{{ item.rating }}</span>
                    <span class="text-sm text-gray-500">({{ item.reviewCount }} reviews)</span>
                  </div>
                  <div v-if="item.location" class="flex items-center gap-1 text-gray-500 text-sm">
                    <UIcon name="i-heroicons:map-pin" class="text-sec" />
                    <span>{{ item.location }}</span>
                  </div>
                  <div v-if="item.workingMode" class="flex items-center gap-1 text-gray-500 text-sm">
                    <UIcon name="i-heroicons:computer-desktop" class="text-sec" />
                    <span>{{ item.workingMode }}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              class="flex items-center justify-center h-8 w-8 rounded-full transition-colors hover:bg-sec/10"
              :aria-label="item.isFavorite ? 'Remove favorite' : 'Add favorite'"
              @click="handleToggleFavorite"
            >
              <UIcon
                :name="item.isFavorite ? 'i-heroicons:heart-solid' : 'i-heroicons:heart'"
                class="text-base text-sec"
              />
            </button>
          </div>
          <hr class="border-gray-200 mb-6" />
          <!-- Description -->
          <div v-if="item.description" class="mb-8">
            <h2 class="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Description</h2>
            <p class="text-gray-600 leading-relaxed whitespace-pre-line">
              {{ item.description }}
            </p>
          </div>

          <!-- Features & Skills -->
          <div v-if="hireFeatures.length" class="mb-8">
            <h2 class="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Features &amp; Skill</h2>
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="(feat, idx) in hireFeatures"
                  :key="idx"
                  class="flex items-start gap-2"
                >
                  <span class="text-xs font-semibold text-gray-500 w-36 shrink-0">{{ feat.label }}</span>
                  <span :class="feat.highlight ? 'text-sec font-semibold text-sm' : 'text-gray-700 text-sm'">
                    {{ feat.value }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Portfolio Highlights -->
          <div class="mb-8">
            <h2 class="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">My Portfolio</h2>

            <div v-if="portfolioItems.length" class="border border-gray-200 rounded-2xl p-4 mb-4">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
                <div class="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-[3/2]">
                  <img
                    v-if="activePortfolioItem.imageUrl"
                    :src="activePortfolioItem.imageUrl"
                    :alt="activePortfolioItem.title || 'Portfolio image'"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <UIcon name="i-heroicons:photo" class="text-4xl" />
                  </div>

                  <div v-if="portfolioItems.length > 1" class="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
                    <UIcon name="i-heroicons:photo" class="text-sm" />
                    <span>{{ portfolioItems.length }}</span>
                  </div>
                </div>

                <div class="flex flex-col justify-between">
                  <div>
                    <p class="text-sm text-gray-500 mb-1">From: {{ activePortfolioItem.from }}</p>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">{{ activePortfolioItem.title || 'Untitled project' }}</h3>
                    <p class="text-gray-700 leading-relaxed mb-3 text-sm">
                      {{ activePortfolioItem.description }}
                    </p>

                    <div v-if="activePortfolioItem.tags && activePortfolioItem.tags.length" class="flex flex-wrap gap-2 mb-6">
                      <span
                        v-for="(tag, idx) in activePortfolioItem.tags"
                        :key="`active-port-tag-${idx}`"
                        class="px-3 py-1.5 text-sm rounded-full border border-gray-300 text-gray-700"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p class="text-gray-500 text-sm">Project cost</p>
                      <p class="text-gray-900 font-bold text-xl">{{ activePortfolioItem.costRange }}</p>
                    </div>
                    <div>
                      <p class="text-gray-500 text-sm">Project duration</p>
                      <p class="text-gray-900 font-bold text-xl">{{ activePortfolioItem.duration }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="portfolioItems.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <button
                v-for="(project, idx) in portfolioItems.slice(0, 6)"
                :key="`portfolio-thumb-${idx}`"
                type="button"
                class="relative aspect-[4/3] rounded-lg overflow-hidden border"
                :class="idx === selectedPortfolioIndex ? 'border-sec ring-2 ring-sec/30' : 'border-gray-200'"
                @click="openPortfolio(idx)"
              >
                <img
                  v-if="project.imageUrl"
                  :src="project.imageUrl"
                  :alt="project.title || `Portfolio ${idx + 1}`"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <UIcon name="i-heroicons:photo" class="text-2xl" />
                </div>
              </button>
            </div>

            <div v-else class="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
              No portfolio data available.
            </div>
          </div>

          <!-- Map -->
          <div v-if="item.latitude && item.longitude" class="mb-8 bg-white rounded-lg overflow-hidden border border-gray-200">
            <MapView
              :latitude="item.latitude"
              :longitude="item.longitude"
              :title="item.title"
            />
          </div>

          <!-- Ratings & Reviews -->
          <div class="mb-8">
            <h2 class="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">Ratings and Reviews</h2>

            <!-- Overall score row -->
            <div class="flex items-center gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
              <div class="text-center">
                <p class="text-5xl font-bold text-gray-900">{{ item.rating }}</p>
                <div class="flex justify-center gap-0.5 mt-1">
                  <template v-for="star in 5" :key="star">
                    <UIcon
                      :name="star <= Math.round(item.rating) ? 'i-heroicons:star-solid' : 'i-heroicons:star'"
                      class="text-yellow-400 text-base"
                    />
                  </template>
                </div>
                <p class="text-gray-500 text-xs mt-1">{{ item.reviewCount }} Total Reviews</p>
              </div>

              <!-- Rating bars -->
              <div class="flex-1 space-y-2">
                <div v-for="n in [5,4,3,2,1]" :key="n" class="flex items-center gap-2">
                  <span class="text-xs text-gray-500 w-3">{{ n }}</span>
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-yellow-400 h-2 rounded-full transition-all"
                      :style="{ width: ratingBarWidth(n) + '%' }"
                    ></div>
                  </div>
                  <span class="text-xs text-gray-400 w-8 text-right">{{ ratingPercent(n) }}%</span>
                </div>
              </div>
            </div>

            <!-- Write a review (auth + eligibility gated) -->
            <div v-if="authStore.isAuthenticated" class="mb-6">
              <div v-if="reviewEligibility.loading" class="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <UIcon name="i-heroicons:arrow-path" class="animate-spin" /> Checking booking status...
              </div>
              <div v-else-if="reviewEligibility.alreadyReviewed"
                class="flex items-center gap-2 p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
                <UIcon name="i-heroicons:check-circle-solid" class="text-xl text-green-600" />
                <span class="text-green-700 text-sm font-medium">You've already reviewed this service. Thank you!</span>
              </div>
              <div v-else-if="reviewEligibility.eligible"
                class="mb-4 border border-gray-200 rounded-xl p-5 bg-gray-50">
                <h3 class="text-base font-semibold text-gray-800 mb-4">Share your experience</h3>
                <div class="flex gap-1 mb-4">
                  <button v-for="star in 5" :key="star" type="button"
                    @click="reviewForm.rating = star"
                    class="text-3xl leading-none transition-colors"
                    :class="star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'">★</button>
                </div>
                <p v-if="reviewErrors.rating" class="text-red-500 text-xs mb-2">{{ reviewErrors.rating }}</p>
                <textarea
                  v-model="reviewForm.comment"
                  placeholder="Tell others what you thought about this service..."
                  rows="3"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-sec mb-2"
                />
                <p v-if="reviewErrors.comment" class="text-red-500 text-xs mb-2">{{ reviewErrors.comment }}</p>
                <ButtonPrimary label="Submit Review" size="md" variant="solid"
                  :isLoading="reviewForm.submitting" @click="submitReview" />
              </div>
              <div v-else
                class="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                <UIcon name="i-heroicons:information-circle" class="text-xl text-blue-500" />
                <span class="text-blue-700 text-sm">Book and complete a hire to leave a review.</span>
              </div>
            </div>

            <RatingsAndReviews v-if="item.id" :adId="String(item.id)" :key="reviewRefreshKey" />
          </div>

          <!-- FAQ -->
          <div class="mb-8">
            <h2 class="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">FAQ</h2>
            <div class="space-y-2">
              <div
                v-for="(faq, idx) in faqs"
                :key="idx"
                class="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  @click="toggleFaq(idx)"
                >
                  <span class="font-medium text-gray-800 text-sm">{{ faq.question }}</span>
                  <UIcon
                    :name="openFaq === idx ? 'i-heroicons:chevron-up' : 'i-heroicons:chevron-down'"
                    class="text-gray-500 text-base flex-shrink-0 ml-2"
                  />
                </button>
                <div v-show="openFaq === idx" class="px-4 pb-3 text-sm text-gray-600 bg-gray-50">
                  {{ faq.answer }}
                </div>
              </div>
            </div>
          </div>

        </div>
        <!-- ===================== END LEFT COLUMN ===================== -->


        <!-- ===================== RIGHT SIDEBAR ===================== -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">

            <!-- Package Tabs -->
            <div class="flex border-b border-gray-200">
              <button
                v-for="pkg in packageTabs"
                :key="pkg.key"
                class="flex-1 py-3 text-sm font-semibold transition-colors"
                :class="activePackage === pkg.key
                  ? 'text-sec border-b-2 border-sec bg-orange-50'
                  : 'text-gray-500 hover:text-gray-700'"
                @click="activePackage = pkg.key"
              >
                {{ pkg.label }}
              </button>
            </div>

            <div class="p-5">

              <!-- Price -->
            <div class="mb-3">
              <p class="text-sm font-bold text-gray-900 uppercase mb-2">
                {{ packageTabs.length ? (currentPackage.name || currentPackage.label || 'Package') : 'Service Packages' }}
              </p>
              <p class="text-3xl font-bold text-sec">
                <template v-if="packageTabs.length">
                  {{ currentPackage.currency || '' }} {{ currentPackage.price || '' }}
                </template>
                <template v-else>
                  {{ item.currency || '' }} {{ item.fixedProjectPrice || item.price || item.hourlyRate || '' }}
                </template>
              </p>
              <p v-if="!packageTabs.length && item.hourlyRate" class="text-sm text-gray-600 mt-1">
                {{ item.currency || '' }}{{ item.hourlyRate }}/hour
              </p>
            </div>

              <!-- Session description -->
              <p class="text-sm text-gray-600 mb-4">{{ currentPackage.description }}</p>


              <!-- Delivery badge -->
              <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <UIcon name="i-heroicons:clock" class="text-sec" />
                <span>{{ currentPackage.delivery }}</span>
              </div>

              <!-- Feature checklist -->
              <ul class="space-y-2 mb-6">
                <li
                  v-for="(feature, idx) in currentPackage.features"
                  :key="idx"
                  class="flex items-center gap-2 text-sm text-gray-700"
                >
                  <UIcon name="i-heroicons:check" class="text-green-500 flex-shrink-0" />
                  <span>{{ feature }}</span>
                </li>
              </ul>

              <!-- CTA buttons -->
              <div class="space-y-3 mb-4">
                <ButtonPrimary
                  label="Hire Now"
                  :isBlock="true"
                  size="lg"
                  variant="solid"
                  class="w-full"
                  :isLoading="isHiring"
                  @click="handleHireNow"
                />
                <ButtonPrimary
                  label="Contact me"
                  :isBlock="true"
                  size="lg"
                  variant="outline"
                  class="w-full"
                  @click="handleContact"
                />
              </div>


              <hr class="border-gray-200 mb-4" />

              <!-- Hourly flexibility box -->
              <div class="bg-orange-50 rounded-xl p-4">
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                    <UIcon name="i-heroicons:bolt" class="text-sec text-base" />
                  </div>
                  <div class="flex-1">
                    <p class="text-xs font-semibold text-gray-800 mb-1">Need flexibility when hiring?</p>
                    <p class="text-xs text-gray-500">
                      Hire by the hour. Ideal for long-term projects with flexible hours and weekly payments.
                    </p>
                    <div class="flex items-center justify-between mt-2">
                      <span class="text-xs font-bold text-gray-700">
                        {{
                          item.hourlyRate != null && item.hourlyRate !== ''
                            ? `${item.currency || ''}${item.hourlyRate}/hour`
                            : item.price != null && item.price !== ''
                            ? `${item.currency || ''}${item.price}/hour`
                            : ''
                        }}
                      </span>
                      <button
                        class="text-xs font-semibold text-sec hover:underline"
                        @click="handleHourlyOffer"
                      >
                        Request hourly offer
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <!-- ===================== END RIGHT SIDEBAR ===================== -->

      </div>
    </div>

    <!-- Similar Services -->
    <SimilarRentals
      v-if="!isLoading && item.id"
      :categoryId="String(item.categoryId || '')"
      :currentItemId="String(item.id || '')"
      title="Similar Services For You"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import ButtonPrimary from '~/components/ui/buttons/button-primary.vue'
import { apiService } from '~/services/apiService'
import { API_ENDPOINTS, API_BASE_URL } from '~/utils/constants/api'
import Breadcrumb from '~/components/ui/breadcrumb.vue'
import MapView from '~/components/ui/MapView.vue'
import SimilarRentals from '~/components/common/SimilarRentals.vue'
import RatingsAndReviews from '~/components/common/RatingsAndReviews.vue'
import { useAuthStore } from '~/store/index.js'
import { useFavorites } from '~/composables/useFavorites'
import { useApiFeedback } from '~/composables/useApiFeedback'

// ── Route & Auth ──────────────────────────────────────────────────────────────
const route = useRoute()
const router = useRouter()
const itemId = computed(() => route.params.id)
const authStore = useAuthStore()
const { notifyError, notifyInfo, redirectToLogin, handleFavoriteApiError } = useApiFeedback()

// ── Breadcrumb ────────────────────────────────────────────────────────────────
const breadcrumbItems = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Categories', to: '/categories' },
  ...(item.value.categoryId
    ? [{ label: item.value.categoryName || 'Software', to: `/categories/${item.value.categoryId}` }]
    : []),
  { label: item.value.title || 'Service' },
])

// ── Reactive state ─────────────────────────────────────────────────────────────
const isLoading = ref(true)
const error = ref(null)
const isHiring = ref(false)
const item = ref({})

const safeParseArray = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      return [value]
    }
  }
  return []
}

const getInfoField = (info, key) => {
  if (!info) return undefined
  if (typeof info.get === 'function') return info.get(key)
  return info[key]
}

const normalizeFeatureList = (value) => {
  return safeParseArray(value)
    .map((entry) => {
      if (typeof entry === 'string') return entry.trim()
      if (entry && typeof entry === 'object') {
        if (Array.isArray(entry.tags) && entry.tags.length) {
          return entry.tags.map((tag) => String(tag).trim()).filter(Boolean).join(', ')
        }
        if (typeof entry.description === 'string') {
          return entry.description.trim()
        }
      }
      return ''
    })
    .filter(Boolean)
}

const pickNonEmptyArray = (primary, fallback, fallbackNormalizer = safeParseArray) => {
  if (Array.isArray(primary) && primary.length) return primary
  return fallbackNormalizer(fallback)
}

const normalizeFaqList = (value) => {
  return safeParseArray(value)
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null
      const question = typeof entry.question === 'string' ? entry.question.trim() : ''
      const answer = typeof entry.answer === 'string' ? entry.answer.trim() : ''
      if (!question && !answer) return null
      return { question, answer }
    })
    .filter(Boolean)
}

const normalizePackageList = (value) => {
  return safeParseArray(value)
    .map((entry, idx) => {
      if (!entry || typeof entry !== 'object') return null
      const key = entry.key ? String(entry.key).trim().toLowerCase() : `package-${idx + 1}`
      const label = entry.label ? String(entry.label).trim() : `Package ${idx + 1}`
      const name = entry.name ? String(entry.name).trim() : ''
      const description = entry.description ? String(entry.description).trim() : ''
      const delivery = entry.delivery ? String(entry.delivery).trim() : ''
      const revisions = entry.revisions ? String(entry.revisions).trim() : ''
      const numericPrice = Number(entry.price)
      const price = Number.isFinite(numericPrice) ? numericPrice : 0

      return {
        key,
        label,
        name,
        price,
        description,
        delivery,
        revisions,
      }
    })
    .filter(Boolean)
}

const normalizePortfolioList = (value) => {
  const uploadsBase = API_BASE_URL.replace('/v1', '')

  return safeParseArray(value)
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null
      const rawImageUrl = entry.imageUrl ? String(entry.imageUrl).trim() : ''
      const normalizedRawImageUrl = rawImageUrl.toLowerCase()
      let imageUrl = ''
      if (rawImageUrl && normalizedRawImageUrl !== 'undefined' && normalizedRawImageUrl !== 'null') {
        if (rawImageUrl.startsWith('http')) {
          imageUrl = rawImageUrl
        } else if (rawImageUrl.startsWith('/public/')) {
          imageUrl = `${uploadsBase}${rawImageUrl}`
        } else if (rawImageUrl.startsWith('/')) {
          imageUrl = rawImageUrl
        } else {
          imageUrl = ''
        }
      }

      return {
        imageUrl,
        from: entry.from ? String(entry.from).trim() : '',
        title: entry.title ? String(entry.title).trim() : '',
        description: entry.description ? String(entry.description).trim() : '',
        tags: safeParseArray(entry.tags).map((tag) => String(tag).trim()).filter(Boolean),
        costRange: entry.costRange ? String(entry.costRange).trim() : '',
        duration: entry.duration ? String(entry.duration).trim() : '',
      }
    })
    .filter(Boolean)
}

// ── Package tabs ───────────────────────────────────────────────────────────────
const activePackage = ref('premium')
const selectedPortfolioIndex = ref(0)

const packageTabs = computed(() => {
  if (Array.isArray(item.value.packages) && item.value.packages.length) {
    return item.value.packages.map((pkg, idx) => ({
      key: pkg.key || `package-${idx + 1}`,
      label: pkg.label || pkg.name || `Package ${idx + 1}`,
    }))
  }
  return []
})

const packageConfig = computed(() => {
  if (Array.isArray(item.value.packages) && item.value.packages.length) {
    return item.value.packages.reduce((acc, pkg, idx) => {
      const key = pkg.key || `package-${idx + 1}`
      acc[key] = {
        name: pkg.name || '',
        label: pkg.label || `Package ${idx + 1}`,
        currency: item.value.currency || 'AUD $',
        price: pkg.price || item.value.price || 0,
        description: pkg.description || `${pkg.name || pkg.label || 'Service package'}`,
        delivery: pkg.delivery || 'Flexible delivery',
        features: [pkg.name, pkg.revisions ? `${pkg.revisions} revisions` : ''].filter(Boolean),
      }
      return acc
    }, {})
  }

  return {}
})

const currentPackage = computed(() => {
  const config = packageConfig.value
  if (config[activePackage.value]) return config[activePackage.value]
  const firstKey = Object.keys(config)[0]
  return firstKey ? config[firstKey] : { currency: item.value.currency || 'AUD $', price: item.value.price || 0, description: '', delivery: '', features: [] }
})

// ── Hire features table ────────────────────────────────────────────────────────
const hireFeatures = computed(() => {
  const info = item.value.additionalInfo || {}
  const languages = pickNonEmptyArray(item.value.languages, getInfoField(info, 'languages'))
  const skills = pickNonEmptyArray(item.value.skills, getInfoField(info, 'skills'))
  const languagesString = Array.isArray(languages) ? languages.join(', ') : languages
  const skillsString = Array.isArray(skills) ? skills.join(', ') : skills

  const normalizeFeatureEntries = (value) => {
    const raw = safeParseArray(value)
    if (!Array.isArray(raw)) return []

    return raw
      .map((entry) => {
        if (!entry) return null

        if (typeof entry === 'string') {
          const label = entry.trim()
          return label ? { label, value: '' } : null
        }

        if (typeof entry === 'object') {
          const tags = Array.isArray(entry.tags)
            ? entry.tags
            : typeof entry.tags === 'string'
            ? entry.tags.split(',')
            : []

          const label =
            (entry.title || entry.label || entry.name || entry.key || '') ||
            (Array.isArray(tags) ? tags.join(', ') : '')
          const value = entry.description || entry.value || entry.detail || entry.text || ''

          const trimmedLabel = typeof label === 'string' ? label.trim() : ''
          const trimmedValue = typeof value === 'string' ? value.trim() : ''

          if (!trimmedLabel && !trimmedValue) return null
          return { label: trimmedLabel || trimmedValue, value: trimmedValue, highlight: true }
        }

        return null
      })
      .filter(Boolean)
  }

  const baseFeatures = [
    {
      label: 'Languages speaking',
      value: languagesString || getInfoField(info, 'languagesSpoken') || '',
      highlight: true,
    },
    {
      label: 'Experience Level',
      value: item.value.experienceLevel || getInfoField(info, 'experienceLevel') || getInfoField(info, 'experience') || '',
      highlight: true,
    },
    {
      label: 'Availability',
      value: item.value.availability || getInfoField(info, 'availability') || '',
      highlight: true,
    },
    {
      label: 'Response time',
      value: getInfoField(info, 'responseTime') || '',
      highlight: true,
    },
    {
      label: 'Completed Projects',
      value: item.value.completedProjects || getInfoField(info, 'completedProjects') || '',
      highlight: true,
    },
    {
      label: 'Skills',
      value: skillsString || '',
      highlight: true,
    },
  ]

  const featureEntries = normalizeFeatureEntries(item.value.customFeatures || item.value.features || getInfoField(info, 'features'))

  const baseFeaturesFiltered = baseFeatures.filter((feat) => {
    const value = typeof feat.value === 'string' ? feat.value.trim() : feat.value
    return Boolean(value)
  })

  const allFeatures = [...baseFeaturesFiltered, ...featureEntries]

  return allFeatures.filter((feat) => {
    const label = typeof feat.label === 'string' ? feat.label.trim() : feat.label
    const value = typeof feat.value === 'string' ? feat.value.trim() : feat.value
    return Boolean(label || value)
  })
})

// ── Portfolio data ─────────────────────────────────────────────────────────────
const portfolioItems = computed(() => {
  if (Array.isArray(item.value.portfolioItems) && item.value.portfolioItems.length) {
    return item.value.portfolioItems
  }

  const normalizedLegacy = normalizePortfolioList(item.value.portfolioImages)
  return normalizedLegacy
})

const activePortfolioItem = computed(() => {
  if (!portfolioItems.value.length) {
    return {
      imageUrl: '',
      from: '',
      title: '',
      description: '',
      tags: [],
      costRange: '',
      duration: '',
    }
  }

  const safeIndex = Math.max(0, Math.min(selectedPortfolioIndex.value, portfolioItems.value.length - 1))
  return portfolioItems.value[safeIndex]
})

const openPortfolio = (idx) => {
  selectedPortfolioIndex.value = idx
}

// ── Rating bars ────────────────────────────────────────────────────────────────
const ratingDistribution = computed(() => item.value.ratingDistribution || { 5: 70, 4: 12, 3: 8, 2: 5, 1: 5 })
const ratingBarWidth = (star) => ratingDistribution.value[star] ?? 0
const ratingPercent = (star) => ratingDistribution.value[star] ?? 0

// ── FAQ ────────────────────────────────────────────────────────────────────────
const openFaq = ref(null)
const faqs = computed(() => {
  if (item.value.faqs && item.value.faqs.length) return item.value.faqs
  return []
})
const toggleFaq = (idx) => {
  openFaq.value = openFaq.value === idx ? null : idx
}

// ── Favourites ─────────────────────────────────────────────────────────────────
const { loadFavorites, isFavorite: isFavGlobal, addToFavorites, removeFromFavorites } = useFavorites()

const handleToggleFavorite = async () => {
  const id = item.value.id || item.value._id
  if (!id) {
    notifyError('Invalid item ID.')
    return
  }

  if (!authStore.isAuthenticated) {
    notifyInfo('Please login to manage favorites.', 'Login required')
    redirectToLogin(router, route.fullPath)
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
    handleFavoriteApiError(err, {
      onAlreadyInFavorites: () => {
        item.value.isFavorite = true
        addToFavorites(id)
      },
      onFavoriteNotFound: () => {
        item.value.isFavorite = false
        removeFromFavorites(id)
      },
      onUnhandled: () => {
        item.value.isFavorite = wasAlreadyFavorite
      },
      defaultMessage: 'Failed to update favorite. Please try again.',
      alreadyMessage: 'This item is already in your favorites.',
      notFoundMessage: 'This item is not in your favorites.',
    })
  }
}

// ── Hire Now / Contact ──────────────────────────────────────────────────────────
const handleHireNow = async () => {
  const target = `/bookings/${item.value.id}?package=${activePackage.value}`
  if (!authStore.isAuthenticated) {
    router.push(`/auth/login?redirect=${encodeURIComponent(target)}`)
    return
  }
  isHiring.value = true
  try {
    await router.push(target)
  } finally {
    isHiring.value = false
  }
}

const handleContact = () => {
  if (!authStore.isAuthenticated) {
    router.push(`/auth/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }
  // TODO: open contact/message modal
  console.log('Contact provider')
}

const handleHourlyOffer = () => {
  if (!authStore.isAuthenticated) {
    router.push(`/auth/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }
  // TODO: open hourly offer request modal
  console.log('Request hourly offer')
}

// ── Reviews ─────────────────────────────────────────────────────────────────────
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
    reviewRefreshKey.value++
  } catch (err) {
    reviewErrors.comment = err?.message || 'Failed to submit review.'
  } finally {
    reviewForm.submitting = false
  }
}

// ── Fetch hire ad ───────────────────────────────────────────────────────────────
const fetchHireDetails = async () => {
  isLoading.value = true
  error.value = null
  try {
    const id = itemId.value
    if (!id || id === 'undefined') throw new Error('Invalid item ID')

    await loadFavorites()

    const endpoint = API_ENDPOINTS.ADS.GET_BY_ID(id)
    const response = await apiService.request({
      ...endpoint,
      url: `${endpoint.url}?populate=category,user`,
    })

    const ad = response.ad || response

    item.value = {
      id: String(ad._id || ad.id),
      title: ad.title,
      description: ad.description,
      price: ad.price,
      currency: 'AUD $',
      fixedProjectPrice: ad.fixedProjectPrice || getInfoField(ad.additionalInfo, 'fixedProjectPrice') || null,
      hourlyRate: ad.hourlyRate || getInfoField(ad.additionalInfo, 'hourlyRate') || getInfoField(ad.additionalInfo, 'startingHourlyRate') || null,
      location: ad.location || ad.city || '',
      workingMode: ad.workingMode || getInfoField(ad.additionalInfo, 'workingMode') || '',
      latitude: ad.latitude,
      longitude: ad.longitude,
      rating: ad.rating || 0,
      reviewCount: ad.reviewCount || 0,
      ratingDistribution: ad.ratingDistribution || null,
      categoryId: ad.category?.id || ad.categoryId,
      categoryName: ad.category?.name || ad.categoryName,
      providerName:
        (ad.userId?.firstName || ad.userId?.lastName)
          ? `${ad.userId?.firstName || ''} ${ad.userId?.lastName || ''}`.trim()
          : ad.ownerName || '',
      providerAvatar: ad.userId?.avatar ? `${API_BASE_URL}/public/uploads/${ad.userId.avatar}` : null,
      isVerified: ad.userId?.isVerified ?? true,
      additionalInfo: ad.additionalInfo || {},
      experienceLevel: ad.experienceLevel || getInfoField(ad.additionalInfo, 'experienceLevel') || '',
      completedProjects: ad.completedProjects || getInfoField(ad.additionalInfo, 'completedProjects') || '',
      availability: ad.availability || getInfoField(ad.additionalInfo, 'availability') || '',
      languages: pickNonEmptyArray(ad.languages, getInfoField(ad.additionalInfo, 'languages')),
      skills: pickNonEmptyArray(ad.skills, getInfoField(ad.additionalInfo, 'skills')),
      features: pickNonEmptyArray(ad.features, getInfoField(ad.additionalInfo, 'features'), normalizeFeatureList),
      packages: normalizePackageList(ad.packages || getInfoField(ad.additionalInfo, 'packages')),
      portfolioItems: normalizePortfolioList(ad.portfolioItems || getInfoField(ad.additionalInfo, 'portfolioItems')),
      portfolioImages: ad.portfolioImages || [],
      faqs: pickNonEmptyArray(ad.faqs, getInfoField(ad.additionalInfo, 'faqs'), normalizeFaqList),
      isFavorite: ad.isFavorite ?? isFavGlobal(String(ad._id || ad.id)),
    }

    selectedPortfolioIndex.value = 0
  } catch (err) {
    console.error('Error fetching hire details:', err)
    error.value = 'Failed to load service details. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// ── Lifecycle ───────────────────────────────────────────────────────────────────
onMounted(async () => {
  await fetchHireDetails()
  if (item.value.id) {
    checkReviewEligibility(item.value.id)
  }
})
</script>
