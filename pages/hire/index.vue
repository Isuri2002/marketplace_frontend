<template>
  <HeroSection />
  <TrendingHires/>
  <FeaturedHires />
  <RatingsAndReviews section="hire" />
  <FeaturedSectors />
  <Carhires/>
  <GetAWayHires/>
  <ElectronicHires/>
  <NewsletterAndBlog />
</template>

<script setup>
import HeroSection from '@/components/hire/hero.vue';
import TrendingHires from '~/components/hire/trendinghire.vue';
import NewsletterAndBlog from '~/components/home/NewsletterAndBlog.vue';
import RatingsAndReviews from '~/components/common/RatingsAndReviews.vue';
import FeaturedSectors from '~/components/home/FeaturedSectors.vue';
import FeaturedHires from '~/components/hire/featuredHires.vue';
import Carhires from '~/components/hire/carhires.vue';
import GetAWayHires from '~/components/hire/get-a-wayHires.vue';
import ElectronicHires from '~/components/hire/electronicHires.vue';
</script>