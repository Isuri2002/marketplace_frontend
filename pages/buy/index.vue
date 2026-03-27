<template>
  <div class="min-h-[60vh] bg-[#f5f5f5] pt-24">
    <div class="container mx-auto px-4 py-10">
      <h1 class="text-3xl font-bold text-prim">Buy Marketplace</h1>
      <p class="mt-3 text-gray-600">
        Browse items available for purchase or post your own listing.
      </p>

      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink to="/categories?section=buy" class="rounded-md bg-sec px-5 py-2 text-white hover:bg-sec-700 transition-colors">
          Browse Buy Listings
        </NuxtLink>
        <NuxtLink to="/buy/form" class="rounded-md border border-prim px-5 py-2 text-prim hover:bg-prim hover:text-white transition-colors">
          Post a Buy Listing
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
