<template>
  <div class="container nav-size-box bg-white py-12">
    <div class="max-w-3xl mx-auto bg-[#f5f5f5] rounded-md p-8 text-center">
      <h1 class="text-2xl font-bold text-gray-800 mb-3">Buy Form Coming Soon</h1>
      <p class="text-gray-600 mb-6">The buy flow is not designed yet. You can continue with rent/hire for now.</p>

      <div class="bg-white rounded-md border border-gray-200 p-4 text-left text-sm text-gray-700 mb-6">
        <p><span class="font-semibold">Section:</span> {{ route.query.section || 'buy' }}</p>
        <p><span class="font-semibold">Category ID:</span> {{ route.query.categoryId || '-' }}</p>
        <p><span class="font-semibold">Sub Category ID:</span> {{ route.query.subCategoryId || '-' }}</p>
      </div>

      <button class="px-6 py-2 bg-sec text-white rounded-md" @click="goBack">Back</button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()

const goBack = () => {
  navigateTo({ path: '/rent/rent-now', query: { section: 'buy' } })
}
</script>
