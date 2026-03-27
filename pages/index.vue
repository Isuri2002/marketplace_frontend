<template>
  <HeroSection />
  <TrendingRentals/>
  <FeaturedSectors />
  <WhySection />
  
  <NewsletterAndBlog />
</template>

<script setup>
import HeroSection from '@/components/home/HeroSection.vue';
import WhySection from '@/components/home/WhySection.vue';
import TrendingRentals from '~/components/home/Trendingrentals.vue';
import FeaturedSectors from '~/components/home/FeaturedSectors.vue';
import NewsletterAndBlog from '@/components/home/NewsletterAndBlog.vue';
</script>