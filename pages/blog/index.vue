<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-br from-indigo-900 to-purple-900 py-16">
      <div class="container mx-auto px-6">
        <h1 class="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          Blog & Reviews
        </h1>
        <p class="text-xl text-blue-200 text-center max-w-2xl mx-auto">
          Discover the latest rental tips, product reviews, and industry insights
        </p>
      </div>
    </div>

    <!-- Blog Content -->
    <div class="container mx-auto px-6 py-12">
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <UIcon name="i-heroicons:arrow-path" class="text-4xl text-prim animate-spin" />
      </div>

      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 text-lg">{{ error }}</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="post in blogPosts" 
          :key="post.id"
          class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          @click="goToBlogPost(post.slug)"
        >
          <div class="relative h-48">
            <img 
              :src="post.image || '/demo/images/portfolio-1.svg'"
              :alt="post.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute top-4 left-4">
              <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {{ post.category }}
              </span>
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
              {{ post.title }}
            </h3>
            <p class="text-gray-600 mb-4 line-clamp-3">
              {{ post.excerpt }}
            </p>
            <div class="flex items-center justify-between t ext-sm text-gray-500">
              <span>{{ formatDate(post.publishedAt) }}</span>
              <span class="text-blue-600 font-semibold hover:text-blue-800">
                Read More →
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="!isLoading && blogPosts.length > 0" class="text-center mt-12">
        <button 
          @click="loadMorePosts"
          :disabled="isLoadingMore"
          class="bg-prim hover:bg-prim-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          {{ isLoadingMore ? 'Loading...' : 'Load More Posts' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Meta tags for SEO
useHead({
  title: 'Blog & Reviews - Rental Market',
  meta: [
    { name: 'description', content: 'Read the latest rental tips, product reviews, and industry insights from our expert team.' }
  ]
});

// Reactive data
const isLoading = ref(true);
const isLoadingMore = ref(false);
const error = ref(null);
const blogPosts = ref([]);
const currentPage = ref(1);

// Mock expanded blog data
const mockBlogPosts = [
  {
    id: 1,
    title: 'GENKI Moonbase: We tested this lunar-inspired strip—here\'s what we think.',
    excerpt: 'Discover our complete review of this innovative rental solution that\'s taking the market by storm. We spent weeks testing this product to bring you honest insights.',
    category: 'GEAR REVIEW',
    image: '/demo/images/portfolio-1.svg',
    slug: 'genki-moonbase-review',
    publishedAt: '2026-02-08'
  },
  {
    id: 2,
    title: 'Hugge Snowball: Keep your cats hydrated and happy. Pet fountain review.',
    excerpt: 'Essential pet care rental equipment review. Find out if this automated pet fountain is worth adding to your rental inventory.',
    category: 'PET CARE',
    image: '/demo/images/portfolio-2.svg',
    slug: 'hugge-snowball-review',
    publishedAt: '2026-02-07'
  },
  {
    id: 3,
    title: 'Finder TW2: See the stars differently. Telescope review.',
    excerpt: 'Professional telescope rental analysis. Perfect for those looking to explore astronomy equipment rentals.',
    category: 'ASTRONOMY',
    image: '/demo/images/portfolio-3.svg',
    slug: 'finder-tw2-review',
    publishedAt: '2026-02-06'
  },
  {
    id: 4,
    title: 'Kneeflow: Unboxing quick relief for knee pain.',
    excerpt: 'Health equipment rental review. Comprehensive analysis of this therapeutic knee support system.',
    category: 'HEALTH',
    image: '/demo/images/portfolio-1.svg',
    slug: 'kneeflow-review',
    publishedAt: '2026-02-05'
  },
  {
    id: 5,
    title: '10 Essential Tips for First-Time Renters',
    excerpt: 'New to renting equipment? Here are the top 10 things you need to know before making your first rental.',
    category: 'TIPS & GUIDES',
    image: '/demo/images/portfolio-2.svg',
    slug: 'first-time-renter-tips',
    publishedAt: '2026-02-04'
  },
  {
    id: 6,
    title: 'The Ultimate Guide to Camera Equipment Rentals',
    excerpt: 'Everything you need to know about renting professional photography and videography equipment.',
    category: 'PHOTOGRAPHY',
    image: '/demo/images/portfolio-3.svg',
    slug: 'camera-equipment-rental-guide',
    publishedAt: '2026-02-03'
  }
];

// Load blog posts
const loadBlogPosts = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    blogPosts.value = mockBlogPosts;
  } catch (err) {
    console.error('Failed to load blog posts:', err);
    error.value = 'Failed to load blog posts. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

// Load more posts (pagination)
const loadMorePosts = async () => {
  isLoadingMore.value = true;
  
  try {
    // TODO: Replace with actual API call for more posts
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock adding more posts
    const morePosts = mockBlogPosts.map((post, index) => ({
      ...post,
      id: post.id + 100,
      title: `More ${post.title}`,
      publishedAt: '2026-02-02'
    }));
    
    blogPosts.value = [...blogPosts.value, ...morePosts.slice(0, 3)];
    currentPage.value++;
  } catch (err) {
    console.error('Failed to load more posts:', err);
  } finally {
    isLoadingMore.value = false;
  }
};

// Navigate to blog post
const goToBlogPost = (slug) => {
  // TODO: Navigate to individual blog post page
  console.log('Navigate to blog post:', slug);
  // navigateTo(`/blog/${slug}`);
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });
};

// Initialize component
onMounted(() => {
  loadBlogPosts();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>