<template>
    <div>
        <div class="container pt-4">
            <h2 class="text-2xl font-bold mb-4">Favourite Ads</h2>
            <div v-if="isLoading" class="text-gray-500">Loading favorites...</div>
            <RentalCard 
                v-else
                :items="favoriteAds" 
                view-mode="grid" 
                :grid-cols="'grid-cols-2'"
                @favorite="handleFavorite" 
                @book="handleBook" 
            />
            <p v-if="!isLoading && favoriteAds.length === 0" class="text-gray-500">No favourite ads yet.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RentalCard from '~/components/common/RentalCard.vue'
import { apiService } from '~/services/apiService'
import { API_ENDPOINTS } from '~/utils/constants/api'
import { useFavorites } from '~/composables/useFavorites'

const safeAdImage = (imageName) => {
  const value = String(imageName || '').trim()
  if (!value || value.toLowerCase() === 'undefined' || value.toLowerCase() === 'null' || !value.startsWith('http')) {
    return '/placeholder.jpg'
  }
  return value
}

const { favoritedAdIds, loadFavorites: loadFavCache } = useFavorites()
const favoriteAds = ref([])
const isLoading = ref(false)
const toast = useToast()

onMounted(async () => {
  // Ensure cache is primed for UI consistency
  await loadFavCache()
  loadFavorites()
})

const loadFavorites = async () => {
  isLoading.value = true
  try {
    const response = await apiService.request(API_ENDPOINTS.FAVORITES.GET_ALL, {}, {})
    // Transform backend data to frontend format
    const results = (response.results || [])
      .filter(fav => fav.adId && fav.adId._id)
      .map(fav => ({
        id: fav.adId._id,
        _id: fav.adId._id, // Add both id and _id for compatibility
        title: fav.adId.title,
        description: fav.adId.description,
        image: safeAdImage(fav.adId.mainImage),
        price: fav.adId.price,
        period: fav.adId.rentFrequency,
        currency: '$',
        category: fav.adId.category?.name || 'Category',
        location: fav.adId.city || fav.adId.addressLine1 || 'Location',
        rating: '4.5', // Default rating, add to backend if needed
        section: fav.adId.section || 'rent',
        isFavorite: true,
      }))

    // If server returned no results but we have cached IDs, fetch those ads individually
    if ((results.length === 0 || !results.length) && favoritedAdIds.value.size > 0) {
      const ids = Array.from(favoritedAdIds.value)
      const fetched = []
      for (const id of ids) {
        try {
          const resp = await apiService.request(API_ENDPOINTS.ADS.GET_BY_ID(id))
          const ad = resp.ad || resp
          fetched.push({
            id: ad._id || ad.id,
            _id: ad._id || ad.id,
            title: ad.title,
            description: ad.description,
            image: safeAdImage(ad.mainImage),
            price: ad.price,
            period: ad.rentFrequency,
            currency: '$',
            category: ad.category?.name || 'Category',
            location: ad.city || ad.addressLine1 || 'Location',
            rating: '4.5',
            section: ad.section || 'rent',
            isFavorite: true,
          })
        } catch (err) {
          console.warn('Failed to fetch ad for cached favorite', id, err)
        }
      }
      favoriteAds.value = fetched
    } else {
      favoriteAds.value = results
    }

    console.log('Loaded favorites:', favoriteAds.value)
  } catch (error) {
    console.error('Failed to load favorites - Full error:', error)
    console.error('Error response:', error.response)
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to load favorites',
      icon: 'i-heroicons-exclamation-circle-solid',
      color: 'red',
    })
  } finally {
    isLoading.value = false
  }
}

const handleFavorite = (data) => {
  // Reload favorites after favorite state changes
  loadFavorites()
}

const handleBook = (item) => {
  // Navigate to ad detail or booking page
  navigateTo(`/items/${item.id}`)
}
</script>