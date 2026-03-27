<template>
  <section class="pt-16">
    <!-- Newsletter Signup Section -->
    <div class="bg-prim rounded-2xl mx-6 md:mx-20 pt-20 text-center text-white mb-8">
      <TitleLg title="Get the newest campaigns in your inbox" class="mb-4 !text-3xl !md:text-4xl" />
      <p class="text-blue-100 mb-8 text-lg">
        Exclusive weekly updates with new products, drops, and special offers.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
        <input
          v-model="email"
          type="email"
          placeholder="Your email address"
          class="flex-1 px-4 py-3 rounded-lg border-0 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
        />
        <button
          @click="subscribeToNewsletter"
          :disabled="isSubscribing || !email"
          class="bg-purple hover:bg-prim disabled:bg-muted px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {{ isSubscribing ? 'SIGNING UP...' : 'SIGN ME UP' }}
        </button>
      </div>
      
      <p class="text-blue-200 text-sm mt-4 mb-6">
        By clicking "Sign me up" I have read and agree to Instagram's Terms of Use and Privacy Policy.
      </p>
      
      <!-- Blog Section -->
       <div class="bg-purple mt-10 py-6 rounded-2xl">
        <div class="bg-prim rounded-lg md:mx-20 p-12">
          <div class="text-center mb-12">
            <TitleLg title="Latest from the Blog" class="!text-3xl !md:text-4xl !text-white" />
          </div>

          <div v-if="isLoading" class="flex justify-center items-center py-20">
            <UIcon name="i-heroicons:arrow-path" class="text-4xl text-white animate-spin" />
          </div>

          <div v-else-if="error" class="text-center py-20">
            <p class="text-red-400 text-lg">{{ error }}</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Featured Blog Post (larger) -->
            <div v-if="blogPosts.length > 0" class="md:col-span-1 lg:col-span-2">
              <div class="bg-white rounded-lg overflow-hidden shadow-lg h-full">
                <div class="relative h-64 md:h-80">
                  <img 
                    :src="blogPosts[0].image || '/api/placeholder/400/300'"
                    :alt="blogPosts[0].title"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute bottom-4 left-4">
                    <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {{ blogPosts[0].category }}
                    </span>
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {{ blogPosts[0].title }}
                  </h3>
                  <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                    {{ blogPosts[0].excerpt }}
                  </p>
                  <button class="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors">
                    READ REVIEW →
                  </button>
                </div>
              </div>
            </div>

            <!-- Smaller Blog Posts -->
            <div class="space-y-6">
              <div 
                v-for="(post, index) in blogPosts.slice(1, 4)" 
                :key="index"
                class="bg-white rounded-lg overflow-hidden shadow-lg flex"
              >
                <div class="w-24 h-24 flex-shrink-0">
                  <img 
                    :src="post.image || '/api/placeholder/150/150'"
                    :alt="post.title"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="p-4 flex-1">
                  <h4 class="font-bold text-gray-800 text-sm mb-1 line-clamp-2">
                    {{ post.title }}
                  </h4>
                  <button class="text-blue-600 font-semibold text-xs hover:text-blue-800 transition-colors">
                    READ REVIEW →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Explore Blog Button -->
          <div class="text-center mt-12">
            <NuxtLink to="/blog">
              <ButtonPrimary 
                label="EXPLORE THE BLOG" 
                variant="outline"
                color="primary"
                size="lg"
                class="!text-white !px-8 !py-3"
              />
            </NuxtLink>
          </div>
        </div>
      </div>

    
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TitleLg from '~/components/ui/titles/title-lg.vue';
import ButtonPrimary from '~/components/ui/buttons/button-primary.vue';

// Reactive data
const email = ref('');
const isSubscribing = ref(false);
const isLoading = ref(true);
const error = ref(null);
const blogPosts = ref([]);

// Mock blog data (replace with actual API calls later)
const mockBlogPosts = [
  {
    id: 1,
    title: 'GENKI Moonbase: We tested this lunar-inspired strip—here\'s what we think.',
    excerpt: 'Discover our complete review of this innovative rental solution that\'s taking the market by storm.',
    category: 'GEAR REVIEW',
    image: '/api/placeholder/400/300',
    slug: 'genki-moonbase-review'
  },
  {
    id: 2,
    title: 'Hugge Snowball: Keep your cats hydrated and happy. Pet fountain review.',
    excerpt: 'Essential pet care rental equipment review.',
    category: 'PET CARE',
    image: '/api/placeholder/150/150',
    slug: 'hugge-snowball-review'
  },
  {
    id: 3,
    title: 'Finder TW2: See the stars differently. Telescope review.',
    excerpt: 'Professional telescope rental analysis.',
    category: 'ASTRONOMY',
    image: '/api/placeholder/150/150',
    slug: 'finder-tw2-review'
  },
  {
    id: 4,
    title: 'Kneeflow: Unboxing quick relief for knee pain.',
    excerpt: 'Health equipment rental review.',
    category: 'HEALTH',
    image: '/api/placeholder/150/150',
    slug: 'kneeflow-review'
  },
];

// Newsletter subscription
const subscribeToNewsletter = async () => {
  if (!email.value) return;
  
  isSubscribing.value = true;
  try {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message (you can use toast notification)
    console.log('Newsletter subscription successful:', email.value);
    email.value = '';
    
    // You can add toast notification here:
    // const toast = useToast();
    // toast.add({
    //   title: 'Success!',
    //   description: 'You have been subscribed to our newsletter.',
    //   color: 'green'
    // });
    
  } catch (err) {
    console.error('Newsletter subscription failed:', err);
    error.value = 'Failed to subscribe. Please try again.';
  } finally {
    isSubscribing.value = false;
  }
};

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