<template>
  <!-- Multiple Items View -->
  <div v-if="items && items.length > 0">
    <!-- Grid View -->
    <div
      v-if="viewMode === 'grid'"
      :class="gridCols === 'xl:grid-cols-4' ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${gridCols} gap-6` : 'flex flex-wrap gap-6'"
    >
      <div
        v-for="(singleItem, index) in items"
        :key="index"
        :class="gridCols === 'xl:grid-cols-4' ? 'bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300' : 'w-[302px] flex-shrink-0 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'"
      >
        <!-- Image Section -->
        <div class="relative">
          <img 
            :src="singleItem.image" 
            :alt="singleItem.title" 
            class="w-full h-48 object-cover"
          />
        </div>

        <!-- Content Section -->
        <div class="p-4">
          <!-- Title and Favorite -->
          <div class="flex items-center justify-between mb-1">
            <TitleSm :title="singleItem.title" :customClass="'!text-gray-900 !mb-0'" />
            <ButtonPrimary 
              :icon="singleItem.isFavorite ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'" 
              variant="link" 
              size="sm" 
              label="" 
              :class="singleItem.isFavorite ? 'text-sec' : 'text-gray-400'" 
              @click="toggleFavoriteForItem(singleItem)" 
            />
          </div>

          <!-- Category -->
          <p class="text-muted text-sm mb-2">
            {{ singleItem.category?.name || singleItem.category }}
          </p>

          <!-- Location and Rating -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-1 text-muted">
              <UIcon name="i-heroicons:map-pin" class="text-lg" />
              <span class="text-sm">{{ singleItem.location }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons:star-solid" class="text-lg text-yellow-400" />
              <span class="text-muted font-semibold">{{ singleItem.rating }}</span>
            </div>
          </div>

          <!-- Pricing -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1">
              <span class="text-black font-bold text-lg">{{ singleItem.currency }} {{ singleItem.price }}</span>
              <span v-if="isRentCardFor(singleItem) && singleItem.rentFrequency" class="text-muted text-sm">/{{ rentFrequencyLabel(singleItem.rentFrequency) }}</span>
            </div>
            <ButtonPrimary label="Book Now" @click="handleBookNowForItem(singleItem)" />
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="space-y-4">
      <div
        v-for="(singleItem, index) in items"
        :key="index"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        @click="handleBookNowForItem(singleItem)"
      >
        <!-- Title and Category -->
        <div class="p-6 pb-0">
          <div class="flex items-center gap-2 mb-2">
            <TitleSm :title="singleItem.title" :customClass="'!text-gray-900 !mb-0'" />
            <span class="text-gray-400 text-lg">{{ singleItem.category?.name || singleItem.category }}</span>
          </div>
        </div>

        <!-- Flex: Image left, Description right -->
        <div class="flex">
          <img
            :src="singleItem.image"
            :alt="singleItem.title"
            class="w-80 h-56 object-cover flex-shrink-0"
          />
          <div class="p-6 flex-1 relative">
            <p class="text-gray-500 text-sm leading-relaxed line-clamp-4">
              {{ singleItem.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamcolaboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in' }}
            </p>
            <!-- Rating in upper right corner -->
            <div class="absolute top-0 right-0 flex items-center gap-1">
              <UIcon name="i-heroicons:star-solid" class="text-xl text-yellow-400" />
              <span class="text-gray-900 font-semibold text-lg">{{ singleItem.rating }}</span>
            </div>
            <!-- Fav in bottom right corner -->
            <div class="absolute bottom-0 right-0">
              <ButtonPrimary 
                :icon="singleItem.isFavorite ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'" 
                variant="link" 
                size="sm" 
                label="" 
                :class="singleItem.isFavorite ? 'text-sec' : 'text-gray-400'" 
                @click.stop="toggleFavoriteForItem(singleItem)" 
              />
            </div>
          </div>
        </div>

        <!-- Price -->
        <div class="p-6">
          <div class="flex items-center gap-1">
            <TitleSm :title="`${singleItem.currency} ${singleItem.price}`" :customClass="'!text-black !mb-0'" />
            <span class="text-gray-500 text-base">/{{ singleItem.period }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Single Item View -->
  <div v-else-if="item">
    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <!-- Image Section -->
      <div class="relative">
        <img 
          :src="item.image" 
          :alt="item.title" 
          class="w-full h-48 object-cover"
        />
      </div>

      <!-- Content Section -->
      <div class="p-4">
        <!-- Title and Favorite -->
        <div class="flex items-center justify-between mb-1">
          <TitleSm :title="item.title" :customClass="'!text-gray-900 !mb-0'" />
          <ButtonPrimary 
            :icon="isFavorite ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'" 
            variant="link" 
            size="sm" 
            label="" 
            :class="isFavorite ? 'text-sec' : 'text-gray-400'" 
            @click="toggleFavorite" 
          />
        </div>

        <!-- Category -->
        <p class="text-muted text-sm mb-2">
          {{ item.category?.name || item.category }}
        </p>

        <!-- Location and Rating -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-1 text-muted">
            <UIcon name="i-heroicons:map-pin" class="text-lg" />
            <span class="text-sm">{{ item.location }}</span>
          </div>
          <div class="flex items-center gap-1">
            <UIcon name="i-heroicons:star-solid" class="text-lg text-yellow-400" />
            <span class="text-muted font-semibold">{{ item.rating }}</span>
          </div>
        </div>

        <!-- Pricing -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <span class="text-black font-bold text-lg">{{ item.currency }} {{ item.price }}</span>
            <span v-if="isRentCard && item.rentFrequency" class="text-muted text-sm">/{{ rentFrequencyLabel(item.rentFrequency) }}</span>
          </div>
          <ButtonPrimary label="Book Now" @click="handleBookNow" />
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex gap-6 cursor-pointer" @click="handleBookNow">
      <img
        :src="item.image"
        :alt="item.title"
        class="w-80 h-56 object-cover rounded-lg flex-shrink-0"
      />
      <div class="flex-1 flex flex-col">
        <!-- Header with Title, Category and Rating -->
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <h3 class="text-2xl font-bold text-gray-900">{{ item.title }}</h3>
              <span class="text-gray-400 text-lg">{{ item.category?.name || item.category }}</span>
            </div>
            <div class="flex items-center gap-1 text-gray-500">
              <UIcon name="i-heroicons:map-pin" class="text-lg" />
              <span class="text-sm">{{ item.location }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons:star-solid" class="text-xl text-yellow-400" />
              <span class="text-gray-900 font-semibold text-lg">{{ item.rating }}</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="flex-1 mb-4">
          <p class="text-gray-500 text-sm leading-relaxed line-clamp-4">
            {{ item.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamcolaboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in' }}
          </p>
        </div>

        <!-- Price -->
        <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div class="flex items-center gap-1">
            <span class="text-black font-bold text-2xl">{{ item.currency }} {{ item.price }}</span>
            <span class="text-gray-500 text-base">/{{ item.period }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import ButtonPrimary from '~/components/ui/buttons/button-primary.vue'
import TitleSm from '~/components/ui/titles/title-sm.vue'
import { apiService } from '~/services/apiService'
import { API_ENDPOINTS } from '~/utils/constants/api'
import { useFavorites } from '~/composables/useFavorites'
import { useApiFeedback } from '~/composables/useApiFeedback'

// Props
const props = defineProps({
  item: {
    type: Object,
    default: null
  },
  items: {
    type: Array,
    default: () => []
  },
  initialFavorite: {
    type: Boolean,
    default: false
  },
  viewMode: {
    type: String,
    default: 'grid'
  },
  gridCols: {
    type: String,
    default: 'xl:grid-cols-4'
  },
  cardType: {
    type: String,
    default: 'rent',
    validator: (v) => ['rent', 'hire', 'buy'].includes(v)
  }
})

// Card type helpers
// Determine card type for single `item` or fallback to prop
const resolvedCardType = (obj) => {
  if (props.cardType) return props.cardType
  // Try object level 'section' first, then fallback to props.item
  const section = obj?.section || props.item?.section
  if (section) return section
  return 'rent'
}

const isRentCard = computed(() => resolvedCardType(props.item) === 'rent')
const isHireCard = computed(() => resolvedCardType(props.item) === 'hire')
// const isBusinessCard removed; only rent/hire/buy remain

// Per-item helpers for lists
const isRentCardFor = (itm) => (props.cardType ? props.cardType === 'rent' : (itm?.section || 'rent') === 'rent')
const isHireCardFor = (itm) => (props.cardType ? props.cardType === 'hire' : (itm?.section || 'rent') === 'hire')

// Map rentFrequency enum to display label
const rentFrequencyLabel = (freq) => {
  const map = { hourly: 'Hr', daily: 'Day', weekly: 'Week', monthly: 'Month' }
  return map[freq] || freq
}

const displayPeriodFor = (itm) => {
  if (itm?.rentFrequency) return rentFrequencyLabel(itm.rentFrequency)
  return itm?.period || ''
}

// Format a large number to a short string (200000 → 200K, 1500000 → 1.5M)
const formatShortPrice = (num) => {
  if (!num && num !== 0) return ''
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(num % 1_000_000 !== 0 ? 1 : 0) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(num % 1_000 !== 0 ? 1 : 0).replace(/\.0$/, '') + 'K'
  return String(num)
}

// Format number with commas (e.g. 150000 → 150,000)
const formatNumber = (num) => {
  if (!num && num !== 0) return ''
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(num % 1_000_000 !== 0 ? 1 : 0) + 'M'
  return num.toLocaleString()
}

// Emits
const emit = defineEmits(['favorite', 'book'])

// State
const isFavorite = ref(props.initialFavorite)
const { notifyError, handleFavoriteApiError } = useApiFeedback()

const { loadFavorites, isFavorite: isFavGlobal, addToFavorites, removeFromFavorites } = useFavorites()

onMounted(async () => {
  // Ensure global favorites are loaded
  await loadFavorites()

  if (props.item) {
    // Respect prop first, otherwise consult global cache
    isFavorite.value = props.item.isFavorite ?? isFavGlobal(props.item.id || props.item._id)
  }

  if (props.items && props.items.length > 0) {
    props.items.forEach(item => {
      if (item.isFavorite === undefined) {
        item.isFavorite = isFavGlobal(item.id || item._id)
      }
    })
  }
})

watch(() => props.items, (newItems) => {
  if (newItems && newItems.length > 0) {
    newItems.forEach(item => {
      if (item.isFavorite === undefined) {
        item.isFavorite = false
      }
    })
  }
}, { deep: true })

// Methods
const toggleFavorite = async () => {
  // Use _id if id is not available
  const itemId = props.item.id || props.item._id
  if (!itemId) {
    console.error('No valid id found on item:', props.item)
    notifyError('Invalid item ID')
    return
  }

  // Determine operation based on CURRENT state before flipping
  const wasAlreadyFavorite = isFavorite.value
  
  // Optimistic UI update
  isFavorite.value = !isFavorite.value

  try {
    // Use previous state to decide operation
    if (wasAlreadyFavorite) {
      const res = await apiService.request(API_ENDPOINTS.FAVORITES.REMOVE(itemId))
      console.log('REMOVE favorite response:', res)
      removeFromFavorites(itemId)
    } else {
      const res = await apiService.request(API_ENDPOINTS.FAVORITES.ADD(itemId))
      console.log('ADD favorite response:', res)
      addToFavorites(itemId)
    }
    // Refresh global cache after server response
    await loadFavorites()
    emit('favorite', { item: props.item, isFavorite: isFavorite.value })
  } catch (error) {
    handleFavoriteApiError(error, {
      onAlreadyInFavorites: () => {
        isFavorite.value = true
        addToFavorites(itemId)
        emit('favorite', { item: props.item, isFavorite: isFavorite.value })
      },
      onFavoriteNotFound: () => {
        isFavorite.value = false
        removeFromFavorites(itemId)
        emit('favorite', { item: props.item, isFavorite: isFavorite.value })
      },
      onUnhandled: () => {
        // Revert on other errors
        isFavorite.value = wasAlreadyFavorite
        console.error('Failed to update favorite:', error)
      },
      defaultMessage: 'Failed to update favorite'
    })
  }
}

const toggleFavoriteForItem = async (singleItem) => {
  // Use _id if id is not available
  const itemId = singleItem.id || singleItem._id
  if (!itemId) {
    console.error('No valid id found on item:', singleItem)
    notifyError('Invalid item ID')
    return
  }

  // Prevent multiple clicks - check if already processing
  if (singleItem._processing) {
    return
  }
  singleItem._processing = true

  // Determine operation based on CURRENT state before flipping
  const wasAlreadyFavorite = singleItem.isFavorite
  
  // Optimistic UI update
  singleItem.isFavorite = !singleItem.isFavorite

  try {
    // Use previous state to decide operation
    if (wasAlreadyFavorite) {
      const res = await apiService.request(API_ENDPOINTS.FAVORITES.REMOVE(itemId))
      console.log('REMOVE favorite response:', res)
      removeFromFavorites(itemId)
    } else {
      const res = await apiService.request(API_ENDPOINTS.FAVORITES.ADD(itemId))
      console.log('ADD favorite response:', res)
      addToFavorites(itemId)
    }
    // Refresh global cache after server response
    await loadFavorites()
    emit('favorite', { item: singleItem, isFavorite: singleItem.isFavorite })
  } catch (error) {
    handleFavoriteApiError(error, {
      onAlreadyInFavorites: () => {
        singleItem.isFavorite = true
        addToFavorites(itemId)
        emit('favorite', { item: singleItem, isFavorite: singleItem.isFavorite })
      },
      onFavoriteNotFound: () => {
        singleItem.isFavorite = false
        removeFromFavorites(itemId)
        emit('favorite', { item: singleItem, isFavorite: singleItem.isFavorite })
      },
      onUnhandled: () => {
        singleItem.isFavorite = wasAlreadyFavorite
        console.error('Failed to update favorite:', error)
      },
      defaultMessage: 'Failed to update favorites'
    })
  } finally {
    singleItem._processing = false
  }
}

const router = useRouter()

const navigateToItem = (item) => {
  const id = item?.id || item?._id
  if (id) {
    const type = resolvedCardType(item)
    if (type === 'hire') {
      router.push(`/hire/${id}`)
    } else {
      router.push(`/items/${id}`)
    }
    return true
  }
  return false
}

const handleBookNow = () => {
  // prefer navigating if route exists, otherwise emit event
  if (!navigateToItem(props.item)) {
    emit('book', props.item)
  }
}

const handleBookNowForItem = (singleItem) => {
  if (!navigateToItem(singleItem)) {
    emit('book', singleItem)
  }
}
</script>


