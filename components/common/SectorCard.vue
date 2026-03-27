<template>
  <div 
    class="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-80 group cursor-pointer"
    @click="handleExplore"
  >
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0">
      <img 
        :src="sector.image" 
        :alt="sector.title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div class="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
    </div>

    <!-- Content Overlay -->
    <div class="relative h-full flex flex-col justify-between p-6 text-white">
      <!-- Title & Subtitle -->
      <div class="text-center mt-8">
        <TitleLg :title="sector.title" :customClass="'!font-semibold'" />
        <p class="text-muted text-sm">{{ sector.subtitle }}</p>
      </div>

      <!-- Explore Button -->
      <ButtonPrimary 
        label="Explore"
        :isBlock="true"
        color="primary"
        variant="solid"
        size="lg"
      />
    </div>
  </div>
</template>

<script setup>
import ButtonPrimary from '~/components/ui/buttons/button-primary.vue'
import TitleLg from '~/components/ui/titles/title-lg.vue'

// Props
const props = defineProps({
  sector: {
    type: Object,
    required: true,
    default: () => ({
      image: '',
      title: '',
      subtitle: '',
      category: ''
    })
  }
})

// Emits
const emit = defineEmits(['explore'])

// Methods
const handleExplore = () => {
  emit('explore', props.sector)
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
