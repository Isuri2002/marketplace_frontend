<template>
  <div class="bg-[#f5f5f5]">
    <section class="relative overflow-hidden bg-prim pt-20 lg:pt-24">
      <div
        class="absolute inset-0 bg-cover bg-center opacity-95"
        :style="{ backgroundImage: `url(${rentHeroImage})` }"
      />
      <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,22,145,0.78),rgba(17,22,145,0.45),rgba(17,22,145,0.2))]" />

      <div class="relative mx-auto max-w-[1320px] px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-28">
        <div class="grid items-stretch gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div class="rounded-[28px] bg-white/10 p-6 text-white backdrop-blur-[2px] sm:p-8 lg:p-10">
            <span class="inline-flex rounded-full bg-sec px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white">
              Live rent listings
            </span>
            <h1 class="mt-4 max-w-[580px] text-3xl font-bold leading-tight sm:text-4xl lg:text-[52px] lg:leading-[1.02]">
              Discover the latest products in our rental marketplace.
            </h1>
            <p class="mt-4 max-w-[520px] text-sm leading-6 text-white/85 sm:text-base">
              Browse real rent listings, filter by category or location, and move from discovery to booking without leaving the rent flow.
            </p>

            <div class="mt-6 flex flex-wrap gap-3">
              <span class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">Verified listings</span>
              <span class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">Fast booking</span>
              <span class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">Top categories</span>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <article
              v-for="spotlight in heroSpotlights"
              :key="spotlight.id"
              class="group relative min-h-[220px] overflow-hidden rounded-[28px] border-[5px] border-sec shadow-[0_20px_50px_rgba(0,0,0,0.18)] cursor-pointer"
              @click="goToItem(spotlight.id)"
            >
              <div
                class="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                :style="{ backgroundImage: `url(${spotlight.image})` }"
              />
              <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,22,145,0.05),rgba(7,9,44,0.85))]" />
              <div class="relative flex h-full flex-col justify-end p-5 text-white">
                <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">{{ spotlight.category }}</p>
                <h2 class="mt-2 text-xl font-bold leading-tight">{{ spotlight.title }}</h2>
                <p class="mt-3 text-sm font-semibold text-sec">LKR {{ Number(spotlight.price || 0).toLocaleString() }} / {{ spotlight.period }}</p>
              </div>
            </article>
          </div>
        </div>

        <div class="relative mx-auto -mb-16 mt-6 max-w-[1120px] rounded-[24px] bg-white p-3 shadow-[0_22px_60px_rgba(17,22,145,0.18)] sm:p-4">
          <div class="grid gap-3 md:grid-cols-[1fr_1.1fr_0.95fr_auto]">
            <div class="rounded-[18px] border border-[#e5e7ef] px-4 py-3">
              <label class="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8c8fa8]">Category</label>
              <select v-model="searchState.category" class="mt-1 w-full bg-transparent text-sm font-semibold text-[#2b2c4f] focus:outline-none">
                <option value="">All rentals</option>
                <option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option>
              </select>
            </div>
            <div class="rounded-[18px] border border-[#e5e7ef] px-4 py-3">
              <label class="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8c8fa8]">What are you looking for</label>
              <input
                v-model.trim="searchState.keyword"
                type="text"
                class="mt-1 w-full bg-transparent text-sm font-semibold text-[#2b2c4f] placeholder:text-[#8c8fa8] focus:outline-none"
                placeholder="Camera, SUV, villa, projector"
                @keyup.enter="submitSearch"
              />
            </div>
            <div class="rounded-[18px] border border-[#e5e7ef] px-4 py-3">
              <label class="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8c8fa8]">Location</label>
              <select v-model="searchState.location" class="mt-1 w-full bg-transparent text-sm font-semibold text-[#2b2c4f] focus:outline-none">
                <option value="">All locations</option>
                <option v-for="item in locations" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>
            <button class="flex items-center justify-center rounded-[18px] bg-purple px-5 py-4 text-sm font-bold text-white transition hover:bg-[#8f157e]" @click="submitSearch">
              <UIcon name="i-heroicons:magnifying-glass" class="mr-2 text-base" />
              Search
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-[1320px] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <section class="overflow-hidden rounded-[24px] bg-[#171717] shadow-lg">
        <div class="flex min-h-[155px] items-center justify-between gap-6 bg-[radial-gradient(circle_at_18%_50%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_82%_36%,rgba(254,127,14,0.32),transparent_16%),linear-gradient(90deg,#111111_0%,#1a1a1f_45%,#232328_100%)] px-5 py-6 sm:px-7 lg:px-8">
          <div class="max-w-[420px] text-white">
            <span class="inline-flex rounded-lg bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]">Live marketplace</span>
            <h2 class="mt-4 text-2xl font-bold uppercase leading-tight sm:text-[32px]">Fresh listings added to rent</h2>
            <p class="mt-3 text-sm leading-6 text-white/75">
              Browse the newest rent ads, then jump into category collections for vehicles, stays, electronics and more.
            </p>
          </div>
          <div class="hidden h-14 w-14 rounded-full border border-white/10 bg-white/10 blur-[1px] lg:block" />
        </div>
      </section>

      <section class="mt-10">
        <div class="mb-5 flex items-end justify-between gap-4">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-purple">Latest arrivals</p>
            <h2 class="mt-1 text-[28px] font-bold leading-none text-prim">Trending Rentals</h2>
          </div>
          <NuxtLink to="/categories?section=rent" class="text-sm font-bold text-purple transition hover:text-[#861477]">
            See More
          </NuxtLink>
        </div>

        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <UIcon name="i-heroicons:arrow-path" class="text-4xl text-sec animate-spin" />
        </div>

        <div v-else-if="latestRentals.length === 0" class="rounded-[24px] bg-white p-8 text-center shadow-[0_8px_24px_rgba(17,22,145,0.08)] ring-1 ring-black/5">
          <p class="text-gray-500">No rent listings are available right now.</p>
        </div>

        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="item in latestRentals"
            :key="item.id"
            class="cursor-pointer overflow-hidden rounded-[22px] bg-white shadow-[0_8px_24px_rgba(17,22,145,0.08)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(17,22,145,0.12)]"
            @click="goToItem(item.id)"
          >
            <div class="relative">
              <div class="aspect-[1.22/1] bg-cover bg-center" :style="{ backgroundImage: `url(${item.image})` }" />
              <span class="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-prim">
                {{ item.badge }}
              </span>
            </div>

            <div class="p-4">
              <div class="flex items-start justify-between gap-3">
                <h3 class="text-base font-bold leading-6 text-[#1f213f]">{{ item.title }}</h3>
                <span class="rounded-full bg-[#fff1e6] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-sec">
                  {{ item.category }}
                </span>
              </div>

              <div class="mt-3 flex items-center justify-between text-sm">
                <span class="flex items-center gap-1 text-[#8b8ea6]">
                  <UIcon name="i-heroicons:map-pin" class="text-sm text-sec" />
                  {{ item.location }}
                </span>
                <span class="flex items-center gap-1 font-semibold text-[#343756]">
                  <UIcon name="i-heroicons:star-solid" class="text-sm text-sec" />
                  {{ item.rating || 'New' }}
                </span>
              </div>

              <div class="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p class="text-xl font-bold leading-none text-prim">LKR {{ Number(item.price || 0).toLocaleString() }}</p>
                  <p class="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a5a7ba]">Per {{ item.period }}</p>
                </div>
                <button
                  class="rounded-xl bg-sec px-4 py-2 text-xs font-bold text-white transition hover:bg-sec-700"
                  @click.stop="goToItem(item.id)"
                >
                  Book now
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <FeaturedRentals />
    <CarRentals />
    <GetAWayRentals />
    <ElectronicRentals />
    <FeaturedSectors section="rent" />
    <RatingsAndReviews section="rent" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import rentHeroImage from '~/assets/images/rent-hero.png'
import { apiService } from '~/services/apiService'
import { API_ENDPOINTS } from '~/utils/constants/api'
import { normalizeRentAd } from '~/utils/rentAds'
import FeaturedRentals from '~/components/rent/fearturedRentals.vue'
import CarRentals from '~/components/rent/carRentals.vue'
import GetAWayRentals from '~/components/rent/get-a-wayRentals.vue'
import ElectronicRentals from '~/components/rent/electronicRentals.vue'
import FeaturedSectors from '~/components/home/FeaturedSectors.vue'
import RatingsAndReviews from '~/components/common/RatingsAndReviews.vue'

const router = useRouter()

const isLoading = ref(true)
const categories = ref([])
const latestRentals = ref([])
const heroSpotlights = ref([])
const searchState = ref({
  category: '',
  keyword: '',
  location: '',
})

const locations = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Nuwara Eliya', 'Ella']

const fetchCategories = async () => {
  try {
    const response = await apiService.request(API_ENDPOINTS.NAVIGATION.GET_ALL)
    categories.value = (response || [])
      .filter((item) => {
        if (!item?.category?.id) return false
        if (!Array.isArray(item.sections) || item.sections.length === 0) return true
        return item.sections.includes('rent')
      })
      .map((item) => item.category)
  } catch (error) {
    console.error('Failed to load rent categories:', error)
    categories.value = []
  }
}

const fetchRentListings = async () => {
  isLoading.value = true
  try {
    const response = await apiService.request(API_ENDPOINTS.ADS.GET_BY_SECTION('rent', 8), {}, { populate: 'category' })
    const mappedItems = (response.results || response || []).map((ad) => normalizeRentAd(ad))
    heroSpotlights.value = mappedItems.slice(0, 2)
    latestRentals.value = mappedItems.slice(0, 4)
  } catch (error) {
    console.error('Failed to load rent listings:', error)
    heroSpotlights.value = []
    latestRentals.value = []
  } finally {
    isLoading.value = false
  }
}

const submitSearch = () => {
  const query = {}
  if (searchState.value.keyword) query.keyword = searchState.value.keyword
  if (searchState.value.location) query.location = searchState.value.location

  if (searchState.value.category) {
    router.push({ path: `/categories/${searchState.value.category}`, query })
    return
  }

  router.push({ path: '/categories', query: { ...query, section: 'rent' } })
}

const goToItem = (id) => {
  if (!id) return
  router.push(`/items/${id}`)
}

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchRentListings()])
})
</script>
