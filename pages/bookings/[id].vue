<template>
  <div class="mt-12">
    <div class="container bg-white">
      <SearchBar
        section="rent"
        :initial-keyword="route.query.keyword || ''"
        :initial-location="route.query.location || ''"
        @search="performSearch"
      />
      <Breadcrumb :items="breadcrumbItems" />

      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <UIcon name="i-heroicons:arrow-path" class="text-4xl text-sec animate-spin" />
      </div>

      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 text-lg">{{ error }}</p>
        <ButtonPrimary label="Go Back" @click="router.back()" class="mt-4" />
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-8">
        <div class="flex items-center justify-center gap-6 mb-8">
          <div v-for="(stepItem, index) in steps" :key="stepItem.id" class="flex items-center">
            <div
              class="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold"
              :class="step >= stepItem.id ? 'border-sec text-sec' : 'border-gray-400 text-gray-500'"
            >
              <UIcon v-if="step > stepItem.id" name="i-heroicons:check" class="text-lg" />
              <span v-else>{{ stepItem.id }}</span>
            </div>
            <div class="ml-2 text-sm" :class="step >= stepItem.id ? 'text-sec' : 'text-gray-500'">
              {{ stepItem.label }}
            </div>
            <div
              v-if="index < steps.length - 1"
              class="w-10 h-0.5 mx-4"
              :class="step > stepItem.id ? 'bg-sec' : 'bg-gray-300'"
            />
          </div>
        </div>

        <div v-if="step === 1" class="max-w-3xl mx-auto">
          <h2 class="text-xl font-bold text-gray-900 mb-1">Your Information</h2>
          <p class="text-sm text-gray-500 mb-6">Confirm your contact details before reserving this rental.</p>

          <div class="space-y-5">
            <div>
              <label class="text-sm font-medium text-gray-700">Full Name *</label>
              <input
                v-model="form.fullName"
                type="text"
                class="mt-2 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sec"
                placeholder="Type your full name"
              />
              <p v-if="formErrors.fullName" class="mt-1 text-sm text-red-500">{{ formErrors.fullName }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Email *</label>
              <input
                v-model="form.email"
                type="email"
                class="mt-2 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sec"
                placeholder="Type your email"
              />
              <p v-if="formErrors.email" class="mt-1 text-sm text-red-500">{{ formErrors.email }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Phone Number</label>
              <div class="mt-2 grid grid-cols-3 gap-2">
                <input
                  v-model="form.phoneCode"
                  type="text"
                  class="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sec"
                  placeholder="+94"
                />
                <input
                  v-model="form.phoneNumber"
                  type="text"
                  class="col-span-2 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sec"
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div class="rounded-xl bg-[#fafafe] border border-[#ececf4] p-4">
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#9a9db3]">Rental Summary</p>
              <div class="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p class="font-semibold text-[#222644]">{{ ad?.title }}</p>
                  <p class="text-sm text-[#70748f]">{{ ad?.location }}</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-sec">{{ totalAmountLabel }}</p>
                  <p class="text-sm text-[#70748f]">{{ unitCountLabel }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-8">
            <ButtonPrimary label="Cancel" variant="outline" color="blue" @click="router.back()" />
            <ButtonPrimary
              label="Next"
              :isLoading="isSubmitting"
              @click="handleCreateBooking"
            />
          </div>
        </div>

        <div v-else-if="step === 2" class="max-w-3xl mx-auto">
          <h2 class="text-xl font-bold text-gray-900 mb-1">Review Your Reservation</h2>
          <p class="text-sm text-gray-500 mb-6">Check the booking details before moving to payment.</p>

          <div class="space-y-4 rounded-xl border border-[#ececf4] bg-[#fafafe] p-5">
            <div class="flex items-center justify-between gap-4">
              <span class="font-medium">Reservation Item</span>
              <span>#{{ ad?.title || 'Rental Item' }}</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="font-medium">Booking Reference</span>
              <span>{{ booking?.id || booking?._id || 'Pending' }}</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="font-medium">Booking Dates Count</span>
              <span>{{ unitCountLabel }} ({{ pricePerUnitLabel }})</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="font-medium">Pickup</span>
              <span>{{ startDate }}</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="font-medium">Drop Off</span>
              <span>{{ endDate }}</span>
            </div>
            <div class="flex items-center justify-between gap-4 text-red-500">
              <span class="font-medium">Total Fee</span>
              <span class="font-semibold">{{ totalAmountLabel }}</span>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-8">
            <ButtonPrimary label="Back" variant="outline" color="blue" @click="step = 1" />
            <ButtonPrimary label="Continue to Payment" @click="step = 3" />
          </div>
        </div>

        <div v-else class="max-w-3xl mx-auto">
          <h2 class="text-xl font-bold text-gray-900 mb-1">Billing Information</h2>
          <p class="text-sm text-gray-500 mb-6">Enter your payment details to finish the reservation request.</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="border rounded-md p-4 flex items-center justify-center">
              <span class="font-semibold text-gray-700">Mastercard</span>
            </div>
            <div class="border rounded-md p-4 flex items-center justify-center">
              <span class="font-semibold text-gray-700">VISA</span>
            </div>
            <div class="border rounded-md p-4 flex items-center justify-center">
              <span class="font-semibold text-gray-700">AMEX</span>
            </div>
          </div>

          <div class="space-y-5">
            <div>
              <label class="text-sm font-medium text-gray-700">Card Number</label>
              <input
                v-model="payment.cardNumber"
                type="text"
                class="mt-2 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sec"
                placeholder="XXXX-XXXX-XXXX-XXXX"
              />
              <p v-if="paymentErrors.cardNumber" class="mt-1 text-sm text-red-500">{{ paymentErrors.cardNumber }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Card Holder Name</label>
              <input
                v-model="payment.cardName"
                type="text"
                class="mt-2 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sec"
                placeholder="Type card holder name"
              />
              <p v-if="paymentErrors.cardName" class="mt-1 text-sm text-red-500">{{ paymentErrors.cardName }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700">CVC</label>
                <input
                  v-model="payment.cvc"
                  type="text"
                  class="mt-2 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sec"
                  placeholder="CVC Number"
                />
                <p v-if="paymentErrors.cvc" class="mt-1 text-sm text-red-500">{{ paymentErrors.cvc }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  v-model="payment.expiry"
                  type="text"
                  class="mt-2 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sec"
                  placeholder="MM/YY"
                />
                <p v-if="paymentErrors.expiry" class="mt-1 text-sm text-red-500">{{ paymentErrors.expiry }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-8">
            <ButtonPrimary label="Back" variant="outline" color="blue" @click="step = 2" />
            <ButtonPrimary label="Confirm Booking" :isLoading="isCompletingPayment" @click="handleCompletePayment" />
          </div>
        </div>
      </div>
    </div>

    <SuccessConfirmation
      :is-visible="showSuccessPopup"
      message="Your booking request has been submitted successfully."
      @closePopup="closeSuccessPopup"
    />

    <ErrorConfirmation
      :is-visible="showErrorPopup"
      :message="popupErrorMessage"
      @closePopup="showErrorPopup = false"
      @tryAgain="retryPayment"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import SearchBar from '~/components/common/SearchBar.vue'
import Breadcrumb from '~/components/ui/breadcrumb.vue'
import ButtonPrimary from '~/components/ui/buttons/button-primary.vue'
import SuccessConfirmation from '~/components/popups/successConfirmation.vue'
import ErrorConfirmation from '~/components/popups/errorConfirmation.vue'
import { apiService } from '~/services/apiService'
import { API_ENDPOINTS } from '~/utils/constants/api'
import { useAuthStore } from '~/store/index.js'
import { normalizeRentAd } from '~/utils/rentAds'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const steps = [
  { id: 1, label: 'Details' },
  { id: 2, label: 'Review' },
  { id: 3, label: 'Payment' },
]

const step = ref(1)
const isLoading = ref(true)
const isSubmitting = ref(false)
const isCompletingPayment = ref(false)
const error = ref(null)
const ad = ref(null)
const booking = ref(null)
const showSuccessPopup = ref(false)
const showErrorPopup = ref(false)
const popupErrorMessage = ref('')

const form = reactive({
  fullName: '',
  email: '',
  phoneCode: '+94',
  phoneNumber: '',
})

const payment = reactive({
  cardNumber: '',
  cardName: '',
  cvc: '',
  expiry: '',
})

const formErrors = reactive({
  fullName: '',
  email: '',
})

const paymentErrors = reactive({
  cardNumber: '',
  cardName: '',
  cvc: '',
  expiry: '',
})

const startDate = ref(route.query.startDate || '')
const endDate = ref(route.query.endDate || '')

const breadcrumbItems = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Rent', to: '/rent' },
  { label: ad.value?.categoryName || 'Rental Item', to: ad.value?.categoryId ? `/categories/${ad.value.categoryId}` : '/categories' },
  { label: ad.value?.title || 'Booking' },
])

const performSearch = (payload) => {
  const query = {}
  if (payload.keyword) query.keyword = payload.keyword
  if (payload.location) query.location = payload.location
  if (payload.category) {
    navigateTo({ path: `/categories/${payload.category}`, query })
    return
  }
  navigateTo({ path: '/categories', query: { ...query, section: 'rent' } })
}

const initDates = () => {
  if (startDate.value && endDate.value) return
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  startDate.value = today.toISOString().split('T')[0]
  endDate.value = tomorrow.toISOString().split('T')[0]
}

const fetchAd = async () => {
  const id = route.params.id
  try {
    const endpoint = API_ENDPOINTS.ADS.GET_BY_ID(id)
    const response = await apiService.request({
      ...endpoint,
      url: `${endpoint.url}?populate=category`,
    })
    ad.value = normalizeRentAd(response.ad || response)
  } catch (err) {
    error.value = 'Failed to load item details. Please try again.'
  }
}

const fetchBooking = async (bookingId) => {
  try {
    const response = await apiService.request(API_ENDPOINTS.BOOKINGS.GET_BY_ID(bookingId))
    booking.value = response.booking || response
    step.value = 2
  } catch (err) {
    console.error('Failed to load booking:', err)
  }
}

const unitCount = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  const diffMs = end.getTime() - start.getTime()
  if (Number.isNaN(diffMs) || diffMs <= 0) return 0

  const frequency = ad.value?.rentFrequency || 'daily'
  let unitMs = 1000 * 60 * 60 * 24
  if (frequency === 'hourly') unitMs = 1000 * 60 * 60
  if (frequency === 'weekly') unitMs = 1000 * 60 * 60 * 24 * 7
  if (frequency === 'monthly') unitMs = 1000 * 60 * 60 * 24 * 30

  return Math.max(1, Math.ceil(diffMs / unitMs))
})

const unitLabel = computed(() => {
  const frequency = ad.value?.rentFrequency || 'daily'
  if (frequency === 'hourly') return 'Hours'
  if (frequency === 'weekly') return 'Weeks'
  if (frequency === 'monthly') return 'Months'
  return 'Days'
})

const unitCountLabel = computed(() => `${String(unitCount.value).padStart(2, '0')} ${unitLabel.value}`)
const pricePerUnitLabel = computed(() => `LKR ${Number(ad.value?.price || 0).toLocaleString()} per ${unitLabel.value.slice(0, -1).toLowerCase()}`)
const totalAmountLabel = computed(() => `LKR ${Number(booking.value?.totalAmount ?? unitCount.value * (ad.value?.price || 0)).toLocaleString()}`)

const validateStepOne = () => {
  formErrors.fullName = form.fullName.trim() ? '' : 'Full name is required.'
  formErrors.email = /\S+@\S+\.\S+/.test(form.email) ? '' : 'A valid email is required.'
  return !formErrors.fullName && !formErrors.email
}

const validatePayment = () => {
  paymentErrors.cardNumber = /^\d{12,19}$/.test(payment.cardNumber.replace(/\D/g, '')) ? '' : 'Enter a valid card number.'
  paymentErrors.cardName = payment.cardName.trim() ? '' : 'Card holder name is required.'
  paymentErrors.cvc = /^\d{3,4}$/.test(payment.cvc) ? '' : 'Enter a valid CVC.'
  paymentErrors.expiry = /^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry) ? '' : 'Use MM/YY format.'
  return !paymentErrors.cardNumber && !paymentErrors.cardName && !paymentErrors.cvc && !paymentErrors.expiry
}

const handleCreateBooking = async () => {
  if (!validateStepOne()) return

  isSubmitting.value = true
  try {
    const phone = `${form.phoneCode} ${form.phoneNumber}`.trim()
    const payload = {
      adId: route.params.id,
      startDate: startDate.value,
      endDate: endDate.value,
      fullName: form.fullName,
      email: form.email,
      phone: phone === form.phoneCode ? '' : phone,
      currency: 'LKR',
    }
    const response = await apiService.request(API_ENDPOINTS.BOOKINGS.CREATE, payload)
    booking.value = response.booking || response
    step.value = 2
    router.replace({ query: { ...route.query, bookingId: booking.value.id || booking.value._id } })
  } catch (err) {
    popupErrorMessage.value = err?.message || err?.error || 'Failed to create booking.'
    showErrorPopup.value = true
  } finally {
    isSubmitting.value = false
  }
}

const handleCompletePayment = async () => {
  if (!validatePayment()) return

  isCompletingPayment.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    showSuccessPopup.value = true
  } catch (err) {
    popupErrorMessage.value = 'Unable to complete payment right now. Please try again.'
    showErrorPopup.value = true
  } finally {
    isCompletingPayment.value = false
  }
}

const closeSuccessPopup = () => {
  showSuccessPopup.value = false
  router.push('/user/profile')
}

const retryPayment = () => {
  showErrorPopup.value = false
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push(`/auth/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }

  initDates()
  await fetchAd()

  const bookingId = route.query.bookingId
  if (bookingId) {
    await fetchBooking(bookingId)
  }

  isLoading.value = false
})
</script>
