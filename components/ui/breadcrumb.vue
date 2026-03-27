<template>
  <div class="flex items-center gap-2 text-sm py-4">
    <template v-for="(item, index) in items" :key="index">
      <NuxtLink v-if="item.to" :to="item.to" class="text-gray-600 hover:text-sec">
        {{ item.label }}
      </NuxtLink>
      <span v-else class="text-gray-900 font-medium">
        {{ item.label }}
      </span>
      <UIcon v-if="index < items.length - 1" name="i-heroicons:chevron-right" class="text-gray-400" />
    </template>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>