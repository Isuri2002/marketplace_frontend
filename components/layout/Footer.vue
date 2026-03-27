<template>
  <footer class="bg-gray-200 py-16 px-4">
    <div class="container mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        <!-- Any Questions Section -->
        <div class="lg:col-span-2">
          <TextSm title="Any Questions" ccustomClass="text-black mb-4"/>
          <p class="text-muted text-sm mb-6 max-w-md">
            Have a question? We're here to help! Visit our Help Center or reach out to our support team for quick assistance.
          </p>
            <NuxtLink to="/help-center">
              <ButtonPrimary 
                label="Ask Question"
                color="blue"
                variant="solid"
              />
            </NuxtLink>
        </div>

        <!-- Need a Help Section -->
        <div>
          <TextSm title="Need a Help?" ccustomClass="text-black mb-4"/>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/help-center" class="text-muted hover:text-sec transition-colors">
                Help
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="text-muted hover:text-sec transition-colors">
                Contact Us
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Rentals Section -->
        <div>
          <TextSm title="Rentals" ccustomClass="text-black mb-4"/>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/rent?category=vehicles" class="text-muted hover:text-sec transition-colors">
                Cars & Vehicles
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/rent?category=apartments" class="text-muted hover:text-sec transition-colors">
                Apartments
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/partners" class="text-muted hover:text-sec transition-colors">
                Partners
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/locations" class="text-muted hover:text-sec transition-colors">
                Locations
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Legal Section -->
        <div>
          <TextSm title="Legal" ccustomClass="text-black mb-4"/>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/terms" class="text-muted hover:text-sec transition-colors">
                Terms
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/faq" class="text-muted hover:text-sec transition-colors">
                FAQ
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Section with Logo and Social Icons -->
      <div class="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-300">
        <!-- Logo Section -->
        <div class="flex items-center gap-2 mb-6 md:mb-0">
          <img src="~/assets/images/footerlogo.png" alt="Rentit Logo" class="h-24 w-auto">
          
        </div>

        <!-- Social Media Icons -->
        <div class="flex items-center gap-6">
          <a 
            href="https://facebook.com" 
            target="_blank"
            class="text-black hover:text-sec transition-colors"
            aria-label="Facebook"
          >
            <svg class="w-6 h-6 fill-black hover:fill-sec transition-colors" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank"
            class="text-black hover:text-sec transition-colors"
            aria-label="Twitter"
          >
            <svg class="w-6 h-6 fill-black hover:fill-sec transition-colors" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank"
            class="text-black hover:text-sec transition-colors"
            aria-label="Instagram"
          >
            <svg class="w-6 h-6 fill-black hover:fill-sec transition-colors" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Copyright -->
      <div class="text-center text-muted text-sm mt-8">
        <p>&copy; {{ currentYear }} Rentit. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import ButtonPrimary from '~/components/ui/buttons/button-primary.vue'
import TextSm from '~/components/ui/titles/title-sm.vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

