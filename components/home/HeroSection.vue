<template>
  <div class="min-h-screen md:min-h-[120vh] flex items-center justify-center relative overflow-hidden">
    <!-- Background Image Slot -->
    <div class="absolute inset-0 z-0">
      <slot name="background-image">
        <!-- use CSS background so image covers entire hero area (position moved lower) -->
        <div class="absolute inset-0 bg-center bg-cover" :style="{ backgroundImage: `url(${heroImage})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center 30%' }"></div>
      </slot>
    </div>

    <!-- Content Container -->
    <div class="absolute z-10 container top-24 md:top-28 left-10 text-white font-staatliches">
      <slot name="content">
        <h1 class="text-4xl md:text-6xl font-md mb-4">
          <p class="leading-none md:leading-tight">
            <span class="text-[#442120]">A</span> SECURE <span class="text-[#442120] text-7xl">MARKETPLACE</span> <br>
            TO <span class="text-[#442120] text-8xl">FUEL</span> SRI LANKAN'S <span class="text-[#442120] text-8xl">FUTURE.</span> <br>
            <span class="text-[#442120]">RENT</span>,<span class="text-[#442120]">INVEST</span>,<span class="text-[#442120]">HELP</span> INNOVATE <br>
            & <span class="text-[#442120]">GROW</span> TOGETHER.
          </p>
        </h1>
        <p class="text-xl md:text-2xl mb-8 pt-10 max-w-2xl text-left text-[#442120]">
          Fast listings. Verified users. Zero hassle.
        </p>
        
      </slot>
    </div>
    <SearchBar @search="performSearch" class="absolute z-10 bottom-20"/>
  </div>
</template>

<script setup>
// Import the hero image from assets
import heroImage from '~/assets/images/hero.png'
import SearchBar from '../common/SearchBar.vue';

// You can add reactive data here if needed
// For example, to dynamically change content or images

// const heroTitle = ref('Welcome to Rental Market')
// const heroDescription = ref('Find your perfect rental property...')
// const backgroundImage = ref('/path/to/image.jpg')
</script>

