<template>
  <div class="mt-16 md:mt-20">
    <div class="container bg-white" v-if="preview">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-4">
        <div class="lg:col-span-2">
          <div class="flex items-start justify-between gap-4 mb-6">
            <div class="flex items-start gap-4">
              <div class="relative flex-shrink-0">
                <img
                  :src="previewAvatar || '/demo/images/avatar/placeholder.svg'"
                  :alt="preview.step1.title"
                  class="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <UIcon
                  name="i-heroicons:check-badge-solid"
                  class="absolute -bottom-1 -right-1 text-xl text-blue-500 bg-white rounded-full"
                />
              </div>

              <div class="flex-1">
                <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ preview.step1.title }}</h1>
                <p class="text-sec font-semibold text-sm mb-1">{{ categoryLabel }}</p>
                <div class="flex items-center gap-3 flex-wrap text-gray-500 text-sm">
                  <div v-if="locationLine" class="flex items-center gap-1">
                    <UIcon name="i-heroicons:map-pin" class="text-sec" />
                    <span>{{ locationLine }}</span>
                  </div>
                  <div v-if="preview.step3.workingMode" class="flex items-center gap-1">
                    <UIcon name="i-heroicons:computer-desktop" class="text-sec" />
                    <span>{{ preview.step3.workingMode }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr class="border-gray-200 mb-6" />

          <div v-if="preview.step1.description" class="mb-8">
            <h2 class="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Description</h2>
            <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ preview.step1.description }}</p>
          </div>

          <div v-if="hireFeatures.length" class="mb-8">
            <h2 class="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Features &amp; Skill</h2>
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div v-for="(feat, idx) in hireFeatures" :key="idx" class="flex items-start gap-2">
                  <span class="text-xs font-semibold text-gray-500 w-36 shrink-0">{{ feat.label }}</span>
                  <span class="text-sec font-semibold text-sm">{{ feat.value }}</span>
                </div>
              </div>
            </div>
          </div>

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
                </div>

                <div class="flex flex-col justify-between">
                  <div>
                    <p class="text-sm text-gray-500 mb-1">From: {{ activePortfolioItem.from }}</p>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">{{ activePortfolioItem.title || 'Untitled project' }}</h3>
                    <p class="text-gray-700 leading-relaxed mb-3 text-sm">{{ activePortfolioItem.description }}</p>

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
                @click="selectedPortfolioIndex = idx"
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

          <div v-if="preview.step3.latitude && preview.step3.longitude" class="mb-8 bg-white rounded-lg overflow-hidden border border-gray-200">
            <MapView
              :latitude="Number(preview.step3.latitude)"
              :longitude="Number(preview.step3.longitude)"
              :title="preview.step1.title"
            />
          </div>

          <div class="mb-8" v-if="preview.step6.faqs.length">
            <h2 class="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">FAQ</h2>
            <div class="space-y-2">
              <div
                v-for="(faq, idx) in preview.step6.faqs"
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

        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">
            <div class="flex border-b border-gray-200" v-if="packageTabs.length">
              <button
                v-for="pkg in packageTabs"
                :key="pkg.key"
                class="flex-1 py-3 text-sm font-semibold transition-colors"
                :class="activePackage === pkg.key ? 'text-sec border-b-2 border-sec bg-orange-50' : 'text-gray-500 hover:text-gray-700'"
                @click="activePackage = pkg.key"
              >
                {{ pkg.label }}
              </button>
            </div>

            <div class="p-5">
              <div class="mb-3">
                <p class="text-sm font-bold text-gray-900 uppercase mb-2">
                  {{ packageTabs.length ? (currentPackage.name || currentPackage.label || 'Package') : 'Service Packages' }}
                </p>
                <p class="text-3xl font-bold text-sec">
                  {{ packageTabs.length ? `AUD $ ${currentPackage.price || 0}` : `AUD $ ${fallbackPrice}` }}
                </p>
                <p v-if="preview.step5.hourlyProjectEnabled" class="text-sm text-gray-600 mt-1">
                  US$ {{ preview.step5.startingHourlyRate || 0 }}/hour
                </p>
              </div>

              <p class="text-sm text-gray-600 mb-4">{{ currentPackage.description || 'Review your package before posting.' }}</p>

              <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <UIcon name="i-heroicons:clock" class="text-sec" />
                <span>{{ currentPackage.delivery || 'Flexible delivery' }}</span>
              </div>

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

              <hr class="border-gray-200 mb-4" />

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
                        US$ {{ preview.step5.startingHourlyRate || fallbackPrice }}/hour
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-6 mt-2 pb-10">
        <div class="mb-4">
          <label class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input v-model="agreedToTnC" type="checkbox" class="rounded border-gray-300" />
            <span>
              I agree to
              <NuxtLink to="/terms" class="text-blue-600 underline">Terms and Conditions</NuxtLink>
            </span>
          </label>
        </div>

        <div class="flex flex-wrap justify-end gap-3">
          <BtnPrimary class="max-w-[200px] w-full" :is-block="true" size="xl" label="Edit" variant="outline" @click="editAd" />
          <BtnPrimary
            class="max-w-[200px] w-full"
            :is-disabled="draftLoad.disabled"
            :is-loading="draftLoad.isLoading"
            :is-block="true"
            size="xl"
            label="Save as draft"
            variant="outline"
            @click="createAd(true)"
          />
          <BtnPrimary
            class="max-w-[200px] w-full"
            :is-disabled="!agreedToTnC || postLoad.disabled"
            :is-loading="postLoad.isLoading"
            :is-block="true"
            size="xl"
            label="Post Now"
            @click="createAd(false)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BtnPrimary from '@/components/ui/buttons/button-primary.vue'
import MapView from '@/components/ui/MapView.vue'
import { apiService } from '@/services/apiService'
import { API_BASE_URL, API_ENDPOINTS } from '@/utils/constants/api'

definePageMeta({
  middleware: 'auth',
})

const toast = useToast()
const router = useRouter()
const previewState = useState('hirePreviewData', () => null)
const agreedToTnC = ref(false)
const currentUserAvatar = ref('')

const draftLoad = reactive({
  disabled: false,
  isLoading: false,
})

const postLoad = reactive({
  disabled: false,
  isLoading: false,
})

const preview = computed(() => previewState.value?.form || null)
const categoryLabel = computed(() => previewState.value?.categoryLabel || 'Hire Service')
const previewAvatar = computed(() => currentUserAvatar.value || '')
const selectedPortfolioIndex = ref(0)
const openFaq = ref(null)

const fallbackPrice = computed(() => {
  if (!preview.value) return 0
  const packagePrice = preview.value.step5?.packages?.find((pkg) => pkg.name?.trim() && Number(pkg.price) > 0)?.price
  return Number(packagePrice || preview.value.step5?.startingHourlyRate || 0)
})

const locationLine = computed(() => {
  if (!preview.value) return ''
  const parts = [preview.value.step3.area, preview.value.step3.city].filter(Boolean)
  return parts.join(', ')
})

const visiblePackages = computed(() => {
  if (!preview.value?.step5?.packagesEnabled) return []
  return (preview.value.step5.packages || [])
    .filter((pkg) => pkg.name?.trim() && Number(pkg.price) > 0)
    .map((pkg) => ({
      ...pkg,
      label: pkg.label || (pkg.key ? pkg.key.charAt(0).toUpperCase() + pkg.key.slice(1) : 'Package'),
    }))
})

const packageTabs = computed(() => {
  return visiblePackages.value.map((pkg, idx) => ({
    key: pkg.key || `package-${idx + 1}`,
    label: pkg.label || `Package ${idx + 1}`,
  }))
})

const activePackage = ref('')

watch(
  packageTabs,
  (tabs) => {
    if (!tabs.length) {
      activePackage.value = ''
      return
    }
    if (!tabs.some((tab) => tab.key === activePackage.value)) {
      activePackage.value = tabs[0].key
    }
  },
  { immediate: true }
)

const currentPackage = computed(() => {
  if (!packageTabs.value.length) {
    return {
      name: '',
      label: 'Standard',
      price: fallbackPrice.value,
      description: '',
      delivery: '',
      features: [],
    }
  }

  const selected = visiblePackages.value.find((pkg) => pkg.key === activePackage.value)
  if (!selected) {
    return {
      name: '',
      label: 'Standard',
      price: fallbackPrice.value,
      description: '',
      delivery: '',
      features: [],
    }
  }

  return {
    name: selected.name,
    label: selected.label,
    price: selected.price,
    description: selected.description,
    delivery: selected.delivery,
    features: [selected.name, selected.revisions ? `${selected.revisions} revisions` : ''].filter(Boolean),
  }
})

const hireFeatures = computed(() => {
  if (!preview.value) return []
  const features = [
    { label: 'Languages speaking', value: (preview.value.step2.languages || []).join(', ') },
    { label: 'Experience Level', value: preview.value.step2.experienceLevel || '' },
    { label: 'Availability', value: preview.value.step3.availability || '' },
    { label: 'Response zone', value: preview.value.step3.timeZone || '' },
    { label: 'Completed Projects', value: preview.value.step2.completedProjects || '' },
    { label: 'Skills', value: (preview.value.step2.skills || []).join(', ') },
  ]
  return features.filter((feat) => feat.value && String(feat.value).trim())
})

const portfolioItems = computed(() => preview.value?.step4?.portfolioItems || [])

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
  const index = Math.max(0, Math.min(selectedPortfolioIndex.value, portfolioItems.value.length - 1))
  return portfolioItems.value[index]
})

const toggleFaq = (idx) => {
  openFaq.value = openFaq.value === idx ? null : idx
}

onMounted(() => {
  loadUserAvatar()
  if (!preview.value) {
    router.push('/hire/form')
  }
})

const resolveAvatarUrl = (avatar) => {
  if (!avatar || typeof avatar !== 'string') return ''
  const trimmed = avatar.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http')) return trimmed
  if (trimmed.startsWith('/')) {
    const uploadsBase = API_BASE_URL.replace('/v1', '')
    return `${uploadsBase}${trimmed}`
  }
  const uploadsBase = API_BASE_URL.replace('/v1', '')
  return `${uploadsBase}/public/uploads/${trimmed}`
}

const loadUserAvatar = async () => {
  try {
    const response = await apiService.request(API_ENDPOINTS.AUTH.GET_USER_DATA)
    const avatarValue = response?.userData?.avatar || response?.userData?.profileImage || ''
    currentUserAvatar.value = resolveAvatarUrl(avatarValue)
  } catch {
    currentUserAvatar.value = ''
  }
}

const createAd = async (isDraft) => {
  if (!preview.value) {
    router.push('/hire/form')
    return
  }

  draftLoad.disabled = isDraft ? false : true
  draftLoad.isLoading = isDraft
  postLoad.disabled = isDraft ? true : false
  postLoad.isLoading = !isDraft

  try {
    const categoryId = previewState.value?.categoryId
    const subCategoryId = previewState.value?.subCategoryId

    const isPackagesEnabled = !!preview.value.step5.packagesEnabled
    const price = isPackagesEnabled
      ? Number((preview.value.step5.packages.find((pkg) => pkg.name.trim() && Number(pkg.price) > 0)?.price) || 0)
      : Number(preview.value.step5.startingHourlyRate) || 0

    const formData = new FormData()
    formData.append('title', preview.value.step1.title)
    formData.append('description', preview.value.step1.description)
    formData.append('section', 'hire')
    formData.append('category', categoryId)
    if (subCategoryId) formData.append('subCategory', subCategoryId)
    formData.append('priceType', 'Fixed')
    formData.append('price', String(price))
    formData.append('rentType', 'offered')
    formData.append('isShipping', false)

    formData.append('experienceLevel', preview.value.step2.experienceLevel || '')
    formData.append('completedProjects', preview.value.step2.completedProjects || '')
    formData.append('languages', JSON.stringify(preview.value.step2.languages || []))
    formData.append('skills', JSON.stringify(preview.value.step2.skills || []))
    formData.append('features', JSON.stringify(preview.value.step2.features || []))
    formData.append('workingMode', preview.value.step3.workingMode || '')
    formData.append('availability', preview.value.step3.availability || '')
    formData.append('serviceAtClientPlace', preview.value.step3.serviceAtClientPlace === 'Yes')
    formData.append('country', preview.value.step3.country || '')
    formData.append('timeZone', preview.value.step3.timeZone || '')
    formData.append('workingHours', preview.value.step3.workingHours || '')
    formData.append('city', preview.value.step3.city || '')
    formData.append('area', preview.value.step3.area || '')
    formData.append('coverageRadius', preview.value.step3.coverageRadius || '')
    formData.append('address', preview.value.step3.address || '')

    if (preview.value.step3.latitude !== '' && preview.value.step3.latitude !== null && preview.value.step3.latitude !== undefined) {
      formData.append('latitude', preview.value.step3.latitude)
    }
    if (preview.value.step3.longitude !== '' && preview.value.step3.longitude !== null && preview.value.step3.longitude !== undefined) {
      formData.append('longitude', preview.value.step3.longitude)
    }

    formData.append('portfolioItems', JSON.stringify(preview.value.step4.portfolioItems || []))
    formData.append('packages', JSON.stringify(preview.value.step5.packages || []))
    formData.append('hourlyRate', preview.value.step5.startingHourlyRate || '')
    formData.append('faqs', JSON.stringify(preview.value.step6.faqs || []))
    formData.append('isDraft', isDraft)

    await apiService.request(API_ENDPOINTS.ADS.CREATE_AD, formData)

    toast.add({
      title: 'Success!',
      description: isDraft ? 'Ad saved as draft' : 'Ad posted successfully',
      icon: 'i-heroicons-check-circle-solid',
      color: 'green',
    })

    previewState.value = null
    router.push('/user/profile')
  } catch (error) {
    toast.add({
      title: error.code === 401 ? 'Unauthorized!' : 'Error!',
      description: error.message ? error.message : 'Something went wrong. Please try again.',
      icon: 'i-heroicons-exclamation-circle-solid',
      color: 'red',
    })
  }

  draftLoad.disabled = false
  draftLoad.isLoading = false
  postLoad.disabled = false
  postLoad.isLoading = false
}

const editAd = () => {
  router.push('/hire/form')
}
</script>
