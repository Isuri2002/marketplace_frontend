<template>
  <div class="search-bar bg-white rounded-2xl m-4 p-4 flex items-center max-w-7xl mx-auto">
    <div class="flex-1">
      <SelectInput
        v-model="selectedCategory"
        :options="categoryOptions"
        :marginBottom="false"
        label=""
        placeholder="Select Category"
        class="border border-muted rounded-l-xl"
        icon="i-heroicons-bars-3"
        color="blue"
        size="xl"
        iconColor="blue"
      />
    </div>

    <div class="flex-1">
      <Input
        v-model="keyword"
        label=""
        :marginBottom="false"
        placeholder="What are you looking for"
        color="blue"
        size="xl"
        @keyup.enter="handleSearch"
      />
    </div>

    <div class="flex-1">
      <SelectInput
        v-model="location"
        :options="locationOptions"
        :marginBottom="false"
        label=""
        placeholder="Location"
        color="blue"
        icon="i-heroicons-map-pin"
        iconColor="blue"
        size="xl"
      />
    </div>

    <ButtonPrimary
      icon="i-heroicons-magnifying-glass"
      size="xl"
      color="blue"
      variant="solid"
      @click="handleSearch"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import ButtonPrimary from '~/components/ui/buttons/button-primary.vue'
import Input from '~/components/ui/inputs/input.vue'
import SelectInput from '~/components/ui/inputs/select.vue'
import { apiService } from '~/services/apiService'
import { API_ENDPOINTS } from '~/utils/constants/api'

const props = defineProps({
  section: {
    type: String,
    default: 'rent',
  },
  initialCategory: {
    type: String,
    default: '',
  },
  initialKeyword: {
    type: String,
    default: '',
  },
  initialLocation: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['search'])

const route = useRoute()

const selectedCategory = ref(props.initialCategory || '')
const keyword = ref(props.initialKeyword || '')
const location = ref(props.initialLocation || '')
const categoryOptions = ref([{ label: 'All Categories', value: '' }])

const locationOptions = [
  { label: 'All Locations', value: '' },
  { label: 'Colombo', value: 'Colombo' },
  { label: 'Kandy', value: 'Kandy' },
  { label: 'Galle', value: 'Galle' },
  { label: 'Jaffna', value: 'Jaffna' },
  { label: 'Negombo', value: 'Negombo' },
]

const syncFromProps = () => {
  selectedCategory.value = props.initialCategory || ''
  keyword.value = props.initialKeyword || ''
  location.value = props.initialLocation || ''
}

watch(
  () => [props.initialCategory, props.initialKeyword, props.initialLocation],
  () => syncFromProps()
)

watch(
  () => route.fullPath,
  () => {
    const routeKeyword = route.query.keyword || route.query.title || ''
    const routeLocation = route.query.location || ''
    const routeCategory = route.params.id || route.query.category || ''

    keyword.value = String(routeKeyword || '')
    location.value = String(routeLocation || '')
    selectedCategory.value = String(routeCategory || '')
  }
)

const fetchCategories = async () => {
  try {
    const response = await apiService.request(API_ENDPOINTS.NAVIGATION.GET_ALL)
    const navCategories = (response || []).filter((item) => {
      if (!item?.category?.id) return false
      if (!Array.isArray(item.sections) || item.sections.length === 0) return true
      return item.sections.includes(props.section)
    })

    const dynamicCategories = navCategories.map((item) => ({
      label: item.category.name,
      value: item.category.id,
    }))

    categoryOptions.value = [{ label: 'All Categories', value: '' }, ...dynamicCategories]
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const handleSearch = () => {
  const searchData = {
    section: props.section,
    category: selectedCategory.value,
    keyword: keyword.value.trim(),
    location: location.value,
  }

  emit('search', searchData)

  const query = {}
  if (searchData.keyword) query.keyword = searchData.keyword
  if (searchData.location) query.location = searchData.location
  if (!searchData.category) query.section = props.section

  if (searchData.category) {
    navigateTo({ path: `/categories/${searchData.category}`, query })
    return
  }

  navigateTo({ path: '/categories', query: { ...query, section: props.section } })
}

defineExpose({
  selectedCategory,
  keyword,
  location,
})

onMounted(() => {
  const routeKeyword = route.query.keyword || route.query.title || ''
  const routeLocation = route.query.location || ''
  const routeCategory = route.params.id || route.query.category || props.initialCategory

  keyword.value = String(routeKeyword || props.initialKeyword || '')
  location.value = String(routeLocation || props.initialLocation || '')
  selectedCategory.value = String(routeCategory || '')

  fetchCategories()
})
</script>

<style scoped>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }

  .search-bar > div {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .search-bar > div:last-of-type {
    border-bottom: none;
  }

  .search-bar button {
    width: 100%;
  }
}
</style>
