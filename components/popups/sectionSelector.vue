<template>
  <BasePopup :is-popup-visible="isVisible" :max-width="'max-w-lg'" @close-popup="closePopup">
    <template #content>
      <div class="max-w-lg w-full bg-white rounded-lg shadow-xl overflow-hidden mx-auto">
        <div class="px-8 py-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Choose Categories you want to Show</h2>
          
          <div class="grid grid-cols-3 gap-10">
            <!-- Rent Option -->
            <button
              @click="selectSection('rent')"
              class="flex items-center gap-2 p-4 border-2 border-sec/30 rounded-lg bg-sec/10 hover:bg-sec/20 transition-colors"
            >
              <UIcon name="i-heroicons:home" class="text-3xl text-sec" />
              <span class="text-sm font-semibold ">Rent</span>
              <UIcon name="i-heroicons:chevron-right" class="text-sec text-xl" />
            </button>

            <!-- Hire Option -->
            <button
              @click="selectSection('hire')"
              class="flex items-center gap-2 p-4 border-2 border-sec/30 rounded-lg bg-sec/10 hover:bg-sec/20 transition-colors"
            >
              <UIcon name="i-heroicons:briefcase" class="text-3xl text-sec" />
              <span class="text-sm font-semibold ">Hire</span>
              <UIcon name="i-heroicons:chevron-right" class="text-sec text-xl" />
            </button>

            <!-- Buy Option -->
            <button
              @click="selectSection('buy')"
              class="flex items-center gap-2 p-4 border-2 border-sec/30 rounded-lg bg-sec/10 hover:bg-sec/20 transition-colors"
            >
              <UIcon name="i-heroicons:shopping-bag" class="text-3xl text-sec" />
              <span class="text-sm font-semibold ">Buy</span>
              <UIcon name="i-heroicons:chevron-right" class="text-sec text-xl" />
            </button>
          </div>
        </div>
      </div>
    </template>
  </BasePopup>
</template>

<script setup>
import BasePopup from './basePopup.vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['closePopup'])
const router = useRouter()

const closePopup = () => {
  emits('closePopup')
}

const selectSection = (section) => {
  closePopup()

  // navigate to unified page with section query
  router.push({ path: '/rent/rent-now', query: { section } })
}
</script>
