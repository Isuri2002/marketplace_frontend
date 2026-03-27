<template>
  <div class="container nav-size-box bg-white py-28">
    
      <p class="mb-6 font-bold text-2xl text-gray-800">Fill in the Details</p>

      <div class="flex items-center justify-center gap-2 sm:gap-5 mb-8 text-[11px] sm:text-xs text-gray-500">
        <div v-for="n in 6" :key="n" class="flex items-center gap-2 sm:gap-4">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-sm sm:text-lg font-semibold"
            :class="step >= n ? 'border-sec text-sec' : 'border-gray-500 text-gray-600'">
            {{ n }}
          </div>
          <span v-if="n < 6" class="hidden sm:inline text-xl text-gray-500">&rarr;</span>
        </div>
      </div>

      <div class="max-w-2xl mx-auto bg-white">
        <div v-if="submitError" class="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
          {{ submitError }}
        </div>
        <p class="mb-5 font-bold text-gray-800">
          {{
            step === 1
              ? 'Service Details'
              : step === 2
              ? 'Features & Skills'
              : step === 3
              ? 'Contact details'
              : step === 4
              ? 'Portfolio'
              : step === 5
              ? 'Pricing Details'
              : 'FAQs'
          }}
        </p>

        <div v-if="step === 1" class="space-y-4">
          <Input
            v-model="form.step1.title"
            label="Title"
            type="text"
            size="lg"
            color="gray"
            :is-required="true"
            placeholder="Type Service Title"
          />

          <div>
            <label class="block text-sm text-gray-700 mb-1">Service Category <span class="text-red-500">*</span></label>
            <div class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 flex items-center justify-between text-gray-600">
              <span>{{ selectedCategoryLabel }}</span>
              <button type="button" class="text-blue-500 text-sm" @click="isCategoryPopupOpen = true">Change</button>
            </div>
          </div>
          <PopupCategories
            :isPopupVisible="isCategoryPopupOpen"
            section="hire"
            stayOnPage
            @closePopup="isCategoryPopupOpen = false"
            @categorySelected="onCategorySelect"
          />

          <Area
            v-model="form.step1.description"
            label="Description"
            size="lg"
            color="gray"
            :is-required="true"
            placeholder="More Details = More response"
          />



        </div>

        <div v-else-if="step === 2" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              v-model="form.step2.experienceLevel"
              label="Experience level"
              size="lg"
              color="gray"
              placeholder="Choose experience level"
              :options="['Junior', 'Mid-Level', 'Senior', 'Expert']"
            />
            <Select
              v-model="form.step2.completedProjects"
              label="Completed projects"
              size="lg"
              color="gray"
              placeholder="No of projects completed"
              :options="['1-5', '6-20', '21-50', '50+']"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-700 mb-1">Language speaking <span class="text-red-500">*</span></label>
            <p class="text-xs text-gray-500 mb-2">Select a language from the dropdown and click “Add Item” to add it to your list.</p>
            <div class="flex gap-2">
              <Select
                v-model="languageInput"
                :options="languageOptions"
                label=""
                size="md"
                color="gray"
                placeholder="Choose a language"
                :margin-bottom="false"
                class="flex-1"
                :ui="languageSelectUi"
              />
              <BtnPrimary type="button" :is-block="false" size="sm" variant="outline" label="Add Item" @click="addLanguage" />
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="(lang, idx) in form.step2.languages"
                :key="`lang-${idx}`"
                class="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
              >
                <span>{{ lang }}</span>
                <button
                  type="button"
                  class="text-gray-400 hover:text-gray-800"
                  @click="removeLanguage(idx)"
                >
                  ×
                </button>
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-700 mb-1">Skills <span class="text-red-500">*</span></label>
            <p class="text-xs text-gray-500 mb-2">Type a skill and click “Add Item” to add it to the list.</p>
            <div class="flex gap-2">
              <input
                v-model="skillInput"
                type="text"
                class="flex-1 border border-gray-300 rounded-md px-3 py-2"
                placeholder="Type a skill"
              />
              <BtnPrimary type="button" :is-block="false" size="sm" variant="outline" label="Add Item" @click="addSkill" />
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="(skill, idx) in form.step2.skills"
                :key="`skill-${idx}`"
                class="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
              >
                <span>{{ skill }}</span>
                <button
                  type="button"
                  class="text-gray-400 hover:text-gray-800"
                  @click="removeSkill(idx)"
                >
                  ×
                </button>
              </span>
            </div>
          </div>

          <div v-if="form.step2.features.length" class="space-y-2">
            <p class="text-sm font-semibold text-gray-700">Added Features</p>
            <div
              v-for="(feature, featureIdx) in form.step2.features"
              :key="`feature-${featureIdx}`"
              class="border border-gray-200 rounded-lg p-3"
            >
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <span class="text-sm font-semibold text-gray-700">{{ feature.title || feature.tags?.join(', ') }}</span>
              </div>
              <p class="text-sm text-sec">{{ feature.description }}</p>
            </div>
          </div>

          <div class="text-center">
            <BtnPrimary type="button" :is-block="false" size="sm" variant="outline" label="Add New Feature" @click="openFeaturePopup" />
          </div>
        </div>

        <div v-else-if="step === 3" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              v-model="form.step3.workingMode"
              label="working mode"
              size="lg"
              color="gray"
              :is-required="true"
              placeholder="Remote/hybrid/onsite"
              :options="['Remote', 'Hybrid', 'Onsite']"
            />
            <Select
              v-model="form.step3.availability"
              label="Availability"
              size="lg"
              color="gray"
              placeholder="weekdays"
              :options="['Weekdays', 'Weekends', 'Anytime']"
            />
          </div>

          <div v-if="isRemoteMode" class="space-y-4">
            <Input
              v-model="form.step3.country"
              label="Country"
              type="text"
              size="lg"
              color="gray"
              :is-required="true"
              placeholder="Enter your country"
            />

            <Select
              v-model="form.step3.timeZone"
              label="Time Zone"
              size="lg"
              color="gray"
              :is-required="true"
              placeholder="Choose your time zone"
              :options="timeZoneOptions"
            />

            <Input
              v-model="form.step3.workingHours"
              label="Working Hours"
              type="text"
              size="lg"
              color="gray"
              :is-required="true"
              placeholder="e.g. 09:00 AM - 05:00 PM"
            />
          </div>

          <div v-else-if="isHybridOrOnsiteMode" class="space-y-4">
            <Select
              v-model="form.step3.serviceAtClientPlace"
              label="Do you visit client's location to provide service?"
              size="lg"
              color="gray"
              placeholder="Choose Yes/No"
              :options="['Yes', 'No']"
            />

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                v-model="form.step3.city"
                label="City"
                type="text"
                size="lg"
                color="gray"
                :is-required="true"
                placeholder="Enter city"
              />

              <Input
                v-model="form.step3.area"
                label="Area/Suburb"
                type="text"
                size="lg"
                color="gray"
                :is-required="true"
                placeholder="Enter area/suburb"
              />
            </div>

            <Input
              v-model="form.step3.coverageRadius"
              label="Coverage Radius"
              type="text"
              size="lg"
              color="gray"
              :is-required="true"
              placeholder="e.g. 10 km"
            />

            <Input
              v-model="form.step3.address"
              label="Address"
              type="text"
              size="lg"
              color="gray"
              :is-required="true"
              placeholder="Enter service address"
            />

            <div class="h-64 bg-gray-100 border border-gray-300 rounded-md overflow-hidden">
              <MapView
                :latitude="Number(form.step3.latitude) || 7.8731"
                :longitude="Number(form.step3.longitude) || 80.7718"
                :zoom="7"
                :selectable="true"
                title="Drop marker to set location"
                @selected="setLocationFromMap"
              />
            </div>

            <p class="text-sm text-gray-600 mt-1">Click on the map to set your location <span class="text-red-500">*</span></p>
            <p v-if="isLoadingAddress" class="text-sm text-blue-600 mt-1 flex items-center gap-1">
              <UIcon name="i-heroicons:arrow-path" class="animate-spin" />
              Fetching address details...
            </p>
            <p v-else-if="selectedLocation" class="text-sm text-green-600 mt-1">
              Selected: {{ selectedLocation.lat.toFixed(6) }}, {{ selectedLocation.lng.toFixed(6) }}
            </p>
          </div>
        </div>

        <div v-else-if="step === 4" class="space-y-5">
          <div class="border border-gray-200 rounded-lg p-4">
            <p class="text-sm font-semibold text-gray-700 mb-3">Add Portfolio Card</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <Input
                  v-model="portfolioItemDraft.title"
                  label="Title"
                  is-required
                  type="text"
                  size="lg"
                  color="gray"
                  placeholder="e.g. Animation Specialist"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm text-gray-700 mb-1">
                  Description <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="portfolioItemDraft.description"
                  rows="3"
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Short summary of the project"
                ></textarea>
              </div>

              <Input
                v-model="portfolioItemDraft.imageUrl"
                label="Image URL"
                is-required
                type="text"
                size="lg"
                color="gray"
                placeholder="https://..."
              />
              <Input
                v-model="portfolioItemDraft.from"
                label="From (e.g. January 2023)"
                type="text"
                size="lg"
                color="gray"
                placeholder="From date"
              />
              <Input
                v-model="portfolioItemDraft.costRange"
                label="Project cost"
                type="text"
                size="lg"
                color="gray"
                placeholder="$5000-$10000"
              />
              <Input
                v-model="portfolioItemDraft.duration"
                label="Project duration"
                type="text"
                size="lg"
                color="gray"
                placeholder="3-6 months"
              />
              <div class="sm:col-span-2">
                <label class="block text-sm text-gray-700 mb-1">Tags</label>
                <div class="flex gap-2">
                  <Input
                    v-model="portfolioTagInput"
                    type="text"
                    size="lg"
                    color="gray"
                    placeholder="Type a tag and press Add"
                  />
                  <BtnPrimary type="button" class="w-32" label="Add" @click="addPortfolioTag" />
                </div>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span
                    v-for="(tag, idx) in portfolioItemDraft.tags"
                    :key="`port-tag-${idx}`"
                    class="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                  >
                    <span>{{ tag }}</span>
                    <button type="button" class="text-gray-400 hover:text-gray-800" @click="removePortfolioTag(idx)">×</button>
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex items-center gap-2">
              <BtnPrimary
                type="button"
                class="flex-1"
                :label="editingPortfolioIndex >= 0 ? 'Save Portfolio Card' : 'Add Portfolio Card'"
                @click="addPortfolioItem"
              />
              <button
                v-if="editingPortfolioIndex >= 0"
                type="button"
                class="text-sm text-gray-500 hover:text-gray-800"
                @click="cancelPortfolioEdit"
              >
                Cancel
              </button>
            </div>
          </div>

          <div v-if="form.step4.portfolioItems.length" class="space-y-3">
            <p class="text-sm font-semibold text-gray-700">Added portfolio cards</p>
            <div class="space-y-3">
              <div
                v-for="(item, idx) in form.step4.portfolioItems"
                :key="`portfolio-item-${idx}`"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex flex-wrap items-start gap-4">
                  <div class="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                    <img v-if="item.imageUrl" :src="item.imageUrl" alt="Portfolio image" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0 space-y-1">
                    <p class="text-sm font-semibold text-gray-800">{{ item.title || 'Untitled' }}</p>
                    <p class="text-xs text-gray-500">{{ item.from }}</p>
                    <p class="text-xs text-gray-600 line-clamp-3">{{ item.description }}</p>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <span v-for="(tag, tIdx) in item.tags" :key="`item-${idx}-tag-${tIdx}`" class="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                        {{ tag }}
                      </span>
                    </div>
                    <div class="mt-2 text-xs text-gray-600">
                      <span class="mr-4"><strong>Cost:</strong> {{ item.costRange }}</span>
                      <span><strong>Duration:</strong> {{ item.duration }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button type="button" class="text-blue text-sm" @click="editPortfolioItem(idx)">Edit</button>
                    <button type="button" class="text-red-500 text-sm" @click="removePortfolioItem(idx)">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="step === 5" class="space-y-5">
          <div class="flex items-center justify-between">
            <p class="font-semibold text-gray-800">Hourly Rate Settings</p>
            <label class="inline-flex items-center cursor-pointer">
              <input v-model="form.step5.hourlyProjectEnabled" type="checkbox" class="sr-only peer" />
              <span class="w-10 h-6 bg-gray-300 rounded-full relative peer-checked:bg-sec after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4"></span>
            </label>
          </div>

          <div v-if="form.step5.hourlyProjectEnabled" class="grid grid-cols-1 gap-4">
            <Input
              v-model="form.step5.startingHourlyRate"
              label="Starting Hourly Rate ($/hr)"
              type="number"
              size="lg"
              color="gray"
              placeholder="0.00"
            />
          </div>

          <div class="flex items-center justify-between pt-2">
            <p class="font-semibold text-gray-800">Service Packages</p>
            <label class="inline-flex items-center cursor-pointer">
              <input v-model="form.step5.packagesEnabled" type="checkbox" class="sr-only peer" />
              <span class="w-10 h-6 bg-gray-300 rounded-full relative peer-checked:bg-sec after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4"></span>
            </label>
          </div>

          <div v-if="form.step5.packagesEnabled" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="pkg in form.step5.packages" :key="pkg.key" class="border rounded-md p-3" :class="pkg.key === 'standard' ? 'border-sec' : 'border-gray-200'">
              <p class="text-xs font-bold mb-2 uppercase" :class="pkg.key === 'standard' ? 'text-sec' : 'text-gray-500'">{{ pkg.label }}</p>
              <Input v-model="pkg.name" label="Package Name" type="text" size="sm" color="gray" placeholder="Package name" />
              <Input v-model="pkg.price" label="Fixed Price ($)" type="number" size="sm" color="gray" placeholder="0" />
              <Area v-model="pkg.description" label="Description" size="sm" color="gray" placeholder="Brief description of this package" />
              <div class="grid grid-cols-2 gap-2">
                <Select v-model="pkg.delivery" label="Delivery" size="sm" color="gray" placeholder="Delivery" :options="['1 Day', '2 Days', '7 Days', '14 Days']" />
                <Input v-model="pkg.revisions" label="Revisions" type="text" size="sm" color="gray" placeholder="1" />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="space-y-5">
          <div class="flex items-center justify-between">
            <p class="font-semibold text-gray-800">Frequently Asked Questions</p>
            <BtnPrimary type="button" :is-block="false" size="sm" variant="outline" label="Add FAQ" @click="openFaqPopup" />
          </div>

          <div v-if="form.step6.faqs.length" class="space-y-4">
            <div
              v-for="(faq, idx) in form.step6.faqs"
              :key="`faq-${idx}`"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex justify-between items-start">
                <p class="font-semibold text-gray-800">{{ faq.question }}</p>
                <button type="button" class="text-red-500 text-sm" @click="removeFaq(idx)">Remove</button>
              </div>
              <p class="text-sm text-gray-600 mt-2">{{ faq.answer }}</p>
            </div>
          </div>

          <div v-else class="text-sm text-gray-500">
            Add FAQs that clients commonly ask. These will appear on your listing.
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <BtnPrimary v-if="step > 1" type="button" variant="outline" color="blue" :is-block="false" label="Back" @click="step--" />
          <BtnPrimary v-if="step < 6" type="button" :is-block="false" label="Next" @click="goToNextStep" />
          <BtnPrimary
            v-else
            type="button"
            :is-block="false"
            :label="isSubmitting ? 'Preparing...' : 'Preview Ad'"
            :disabled="isSubmitting"
            @click="goToPreview"
          />
        </div>
      </div>

      <BasePopup :isPopupVisible="isFeaturePopupOpen" :showClose="false" :max-width="'max-w-xl'" @closePopup="closeFeaturePopup">
        <template #content>
          <div class="bg-white rounded-xl overflow-hidden shadow-xl">
            <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <p class="font-semibold text-gray-800">Add New Feature</p>
              <button type="button" class="text-gray-500 hover:text-gray-800 text-xl leading-none" @click="closeFeaturePopup">×</button>
            </div>

            <div class="px-5 py-4 space-y-4">
              <p class="text-2xl font-bold text-gray-800">Add a New Feature</p>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Feature Name <span class="text-red-500">*</span></label>
                <input
                  v-model="featureNameInput"
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Type feature and press Enter"
                  @keydown="onFeatureNameKeydown"
                />
              </div>

              <div v-if="pendingFeatureTags.length" class="flex flex-wrap gap-2">
                <span
                  v-for="(tag, idx) in pendingFeatureTags"
                  :key="`pending-tag-${idx}`"
                  class="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                >
                  <span>{{ tag }}</span>
                  <button type="button" class="text-gray-400 hover:text-gray-800" @click="removeFeatureTag(idx)">×</button>
                </span>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description <span class="text-red-500">*</span></label>
                <textarea
                  v-model="featureDescriptionInput"
                  rows="4"
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Describe what this section covers..."
                ></textarea>
              </div>

              <p v-if="featurePopupError" class="text-sm text-red-600">{{ featurePopupError }}</p>
            </div>

            <div class="px-5 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <BtnPrimary type="button" :is-block="false" variant="outline" label="Cancel" @click="closeFeaturePopup" />
              <BtnPrimary type="button" :is-block="false" label="Create" @click="createFeature" />
            </div>
          </div>
        </template>
      </BasePopup>

      <BasePopup :isPopupVisible="isFaqPopupOpen" :showClose="false" :max-width="'max-w-xl'" @closePopup="closeFaqPopup">
        <template #content>
          <div class="bg-white rounded-xl overflow-hidden shadow-xl">
            <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <p class="font-semibold text-gray-800">Add FAQ</p>
              <button type="button" class="text-gray-500 hover:text-gray-800 text-xl leading-none" @click="closeFaqPopup">×</button>
            </div>

            <div class="px-5 py-4 space-y-4">
              <p class="text-2xl font-bold text-gray-800">Add a New FAQ</p>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Question <span class="text-red-500">*</span></label>
                <textarea
                  v-model="faqQuestionInput"
                  rows="2"
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Type the question"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Answer <span class="text-red-500">*</span></label>
                <textarea
                  v-model="faqAnswerInput"
                  rows="4"
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Type the answer"
                ></textarea>
              </div>

              <p v-if="faqPopupError" class="text-sm text-red-600">{{ faqPopupError }}</p>
            </div>

            <div class="px-5 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <BtnPrimary type="button" :is-block="false" variant="outline" label="Cancel" @click="closeFaqPopup" />
              <BtnPrimary type="button" :is-block="false" label="Create" @click="createFaq" />
            </div>
          </div>
        </template>
      </BasePopup>

      <SuccessConfirmation
        :isVisible="isSuccessPopupOpen"
        :message="successMessage"
        @closePopup="closeSuccessPopup"
      />
    
  </div>
</template>

<script setup>
import Input from '@/components/ui/inputs/input.vue'
import Select from '@/components/ui/inputs/select.vue'
import Area from '@/components/ui/inputs/area.vue'
import BtnPrimary from '@/components/ui/buttons/button-primary.vue'
import BasePopup from '@/components/popups/basePopup.vue'
import PopupCategories from '@/components/rent/categories.vue'
import MapView from '@/components/ui/MapView.vue'
import SuccessConfirmation from '@/components/popups/successConfirmation.vue'
import { apiService } from '@/services/apiService'
import { API_ENDPOINTS } from '@/utils/constants/api'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const categoryData = useState('categoryData', () => ({ categoryId: '', subCategoryId: '' }))
const hirePreviewData = useState('hirePreviewData', () => null)

const isCategoryPopupOpen = ref(false)
const isFeaturePopupOpen = ref(false)
const isSuccessPopupOpen = ref(false)
const successMessage = ref('')

const step = ref(1)
const languageInput = ref('')
const skillInput = ref('')
const portfolioTagInput = ref('')
const featureNameInput = ref('')
const featureDescriptionInput = ref('')
const featurePopupError = ref('')
const pendingFeatureTags = ref([])

const portfolioItemDraft = reactive({
  imageUrl: '',
  from: '',
  title: '',
  description: '',
  tags: [],
  costRange: '',
  duration: '',
})

const editingPortfolioIndex = ref(-1)

const categories = ref([])
const isSubmitting = ref(false)
const submitError = ref('')

const isLoadingAddress = ref(false)
const selectedLocation = ref(null)

const isFaqPopupOpen = ref(false)
const faqQuestionInput = ref('')
const faqAnswerInput = ref('')
const faqPopupError = ref('')

const form = reactive({
  step1: {
    title: '',
    description: ''
  },
  step2: {
    experienceLevel: '',
    completedProjects: '',
    languages: [],
    skills: [],
    features: []
  },
  step3: {
    workingMode: '',
    availability: '',
    serviceAtClientPlace: '',
    country: '',
    timeZone: '',
    workingHours: '',
    city: '',
    area: '',
    coverageRadius: '',
    address: '',
    latitude: '',
    longitude: ''
  },
  step4: {
    portfolioItems: []
  },
  step5: {
    hourlyProjectEnabled: false,
    startingHourlyRate: '',
    packagesEnabled: false,
    packages: [
      { key: 'basic', label: 'Basic', name: '', price: '', description: '', delivery: '', revisions: '' },
      { key: 'standard', label: 'Standard', name: '', price: '', description: '', delivery: '', revisions: '' },
      { key: 'premium', label: 'Premium', name: '', price: '', description: '', delivery: '', revisions: '' },
    ]
  },
  step6: {
    faqs: []
  }
})

const selectedCategoryLabel = computed(() => {
  const categoryId = route.query.categoryId || categoryData.value.categoryId
  if (!categoryId) return 'Software'

  const category = categories.value.find((cat) => cat._id === categoryId || cat.id === categoryId)
  if (category) return category.name

  // While categories are still loading, avoid showing raw ID.
  return categories.value.length === 0 ? 'Loading...' : categoryId
})

const isRemoteMode = computed(() => form.step3.workingMode === 'Remote')
const isHybridOrOnsiteMode = computed(() => ['Hybrid', 'Onsite'].includes(form.step3.workingMode))

const timeZoneOptions = [
  'UTC-12:00',
  'UTC-11:00',
  'UTC-10:00',
  'UTC-09:00',
  'UTC-08:00',
  'UTC-07:00',
  'UTC-06:00',
  'UTC-05:00',
  'UTC-04:00',
  'UTC-03:00',
  'UTC-02:00',
  'UTC-01:00',
  'UTC+00:00',
  'UTC+01:00',
  'UTC+02:00',
  'UTC+03:00',
  'UTC+04:00',
  'UTC+05:00',
  'UTC+05:30',
  'UTC+06:00',
  'UTC+07:00',
  'UTC+08:00',
  'UTC+09:00',
  'UTC+10:00',
  'UTC+11:00',
  'UTC+12:00',
  'UTC+13:00',
  'UTC+14:00',
]

const hydrateFormFromPreview = (savedForm) => {
  form.step1 = {
    ...form.step1,
    ...(savedForm?.step1 || {}),
  }
  form.step2 = {
    ...form.step2,
    ...(savedForm?.step2 || {}),
    languages: [...(savedForm?.step2?.languages || [])],
    skills: [...(savedForm?.step2?.skills || [])],
    features: [...(savedForm?.step2?.features || [])],
  }
  form.step3 = {
    ...form.step3,
    ...(savedForm?.step3 || {}),
  }
  form.step4 = {
    ...form.step4,
    portfolioItems: [...(savedForm?.step4?.portfolioItems || [])],
  }
  form.step5 = {
    ...form.step5,
    ...(savedForm?.step5 || {}),
    packages: (savedForm?.step5?.packages || form.step5.packages).map((pkg, index) => ({
      key: pkg?.key || ['basic', 'standard', 'premium'][index] || 'basic',
      label: pkg?.label || ['Basic', 'Standard', 'Premium'][index] || 'Basic',
      name: pkg?.name || '',
      price: pkg?.price || '',
      description: pkg?.description || '',
      delivery: pkg?.delivery || '',
      revisions: pkg?.revisions || '',
    })),
  }
  form.step6 = {
    ...form.step6,
    faqs: [...(savedForm?.step6?.faqs || [])],
  }
}

onMounted(async () => {
  try {
    const result = await apiService.request(API_ENDPOINTS.CATEGORIES.GET)
    categories.value = result.categories || []
  } catch (error) {
    // ignore; display fallback text
  }

  // If latitude/longitude were previously set (e.g., during edit), show the selected location
  if (form.step3.latitude && form.step3.longitude) {
    selectedLocation.value = {
      lat: Number(form.step3.latitude),
      lng: Number(form.step3.longitude),
    }
  }

  if (hirePreviewData.value?.form) {
    hydrateFormFromPreview(hirePreviewData.value.form)
    if (hirePreviewData.value.categoryId) {
      categoryData.value.categoryId = hirePreviewData.value.categoryId
    }
    if (hirePreviewData.value.subCategoryId) {
      categoryData.value.subCategoryId = hirePreviewData.value.subCategoryId
    }
  }
})

const languageOptions = [
  'Afrikaans',
  'Albanian',
  'Amharic',
  'Arabic',
  'Armenian',
  'Azerbaijani',
  'Basque',
  'Belarusian',
  'Bengali',
  'Bosnian',
  'Bulgarian',
  'Catalan',
  'Cebuano',
  'Chichewa',
  'Chinese (Simplified)',
  'Chinese (Traditional)',
  'Corsican',
  'Croatian',
  'Czech',
  'Danish',
  'Dutch',
  'English',
  'Esperanto',
  'Estonian',
  'Filipino',
  'Finnish',
  'French',
  'Frisian',
  'Galician',
  'Georgian',
  'German',
  'Greek',
  'Gujarati',
  'Haitian Creole',
  'Hausa',
  'Hawaiian',
  'Hebrew',
  'Hindi',
  'Hmong',
  'Hungarian',
  'Icelandic',
  'Igbo',
  'Indonesian',
  'Irish',
  'Italian',
  'Japanese',
  'Javanese',
  'Kannada',
  'Kazakh',
  'Khmer',
  'Korean',
  'Kurdish',
  'Kyrgyz',
  'Lao',
  'Latin',
  'Latvian',
  'Lithuanian',
  'Luxembourgish',
  'Macedonian',
  'Malagasy',
  'Malay',
  'Malayalam',
  'Maltese',
  'Maori',
  'Marathi',
  'Mongolian',
  'Myanmar (Burmese)',
  'Nepali',
  'Norwegian',
  'Nyanja',
  'Odia (Oriya)',
  'Pashto',
  'Persian',
  'Polish',
  'Portuguese',
  'Punjabi',
  'Romanian',
  'Russian',
  'Samoan',
  'Scots Gaelic',
  'Serbian',
  'Sesotho',
  'Shona',
  'Sindhi',
  'Sinhala',
  'Slovak',
  'Slovenian',
  'Somali',
  'Spanish',
  'Sundanese',
  'Swahili',
  'Swedish',
  'Tajik',
  'Tamil',
  'Tatar',
  'Telugu',
  'Thai',
  'Turkish',
  'Turkmen',
  'Ukrainian',
  'Urdu',
  'Uyghur',
  'Uzbek',
  'Vietnamese',
  'Welsh',
  'Xhosa',
  'Yiddish',
  'Yoruba',
  'Zulu',
]

const addLanguage = () => {
  const value = languageInput.value.trim()
  if (!value) return
  if (!form.step2.languages.includes(value)) {
    form.step2.languages.push(value)
  }
  languageInput.value = ''
}

const removeLanguage = (idx) => {
  form.step2.languages.splice(idx, 1)
}

const languageSelectUi = {
  popper: {
    placement: 'bottom-start',
    strategy: 'fixed',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: [],
        },
      },
      {
        name: 'preventOverflow',
        options: {
          mainAxis: true,
          altAxis: false,
        },
      },
    ],
  },
}

const skillOptions = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'C++',
  'Go',
  'Ruby',
  'PHP',
  'Swift',
  'Kotlin',
  'SQL',
  'NoSQL',
  'HTML',
  'CSS',
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  'Django',
  'Flask',
  'Spring',
  'Laravel',
  'Ruby on Rails',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'CI/CD',
  'GraphQL',
  'REST APIs',
  'Machine Learning',
  'Data Science',
  'UI/UX',
  'SEO',
  'Project Management',
  'Agile',
  'Scrum',
  'DevOps',
  'Mobile Development',
  'Game Development',
  'Blockchain',
]

const addSkill = () => {
  const value = skillInput.value.trim()
  if (!value) return
  if (!form.step2.skills.includes(value)) {
    form.step2.skills.push(value)
  }
  skillInput.value = ''
}

const removeSkill = (idx) => {
  form.step2.skills.splice(idx, 1)
}

const addFeatureTag = () => {
  const value = featureNameInput.value.trim()
  if (!value) return
  if (!pendingFeatureTags.value.includes(value)) {
    pendingFeatureTags.value.push(value)
  }
  featureNameInput.value = ''
}

const removeFeatureTag = (idx) => {
  pendingFeatureTags.value.splice(idx, 1)
}

const onFeatureNameKeydown = (event) => {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    addFeatureTag()
  }
}

const openFeaturePopup = () => {
  featureNameInput.value = ''
  featureDescriptionInput.value = ''
  featurePopupError.value = ''
  pendingFeatureTags.value = []
  isFeaturePopupOpen.value = true
}

const closeFeaturePopup = () => {
  isFeaturePopupOpen.value = false
}

const createFeature = () => {
  featurePopupError.value = ''

  if (featureNameInput.value.trim()) {
    addFeatureTag()
  }

  if (pendingFeatureTags.value.length === 0) {
    featurePopupError.value = 'Please add at least one feature name.'
    return
  }

  if (!featureDescriptionInput.value.trim()) {
    featurePopupError.value = 'Please add a description.'
    return
  }

  form.step2.features.push({
    title: pendingFeatureTags.value.join(', '),
    description: featureDescriptionInput.value.trim(),
  })

  closeFeaturePopup()
}

const openFaqPopup = () => {
  faqQuestionInput.value = ''
  faqAnswerInput.value = ''
  faqPopupError.value = ''
  isFaqPopupOpen.value = true
}

const closeFaqPopup = () => {
  isFaqPopupOpen.value = false
}

const createFaq = () => {
  faqPopupError.value = ''

  if (!faqQuestionInput.value.trim()) {
    faqPopupError.value = 'Please add a question.'
    return
  }

  if (!faqAnswerInput.value.trim()) {
    faqPopupError.value = 'Please add an answer.'
    return
  }

  form.step6.faqs.push({
    question: faqQuestionInput.value.trim(),
    answer: faqAnswerInput.value.trim(),
  })

  closeFaqPopup()
}

const removeFaq = (idx) => {
  form.step6.faqs.splice(idx, 1)
}

const addPortfolioTag = () => {
  const value = portfolioTagInput.value.trim()
  if (!value) return
  if (!portfolioItemDraft.tags.includes(value)) {
    portfolioItemDraft.tags.push(value)
  }
  portfolioTagInput.value = ''
}

const removePortfolioTag = (idx) => {
  portfolioItemDraft.tags.splice(idx, 1)
}

const addPortfolioItem = () => {
  submitError.value = ''

  const item = {
    imageUrl: portfolioItemDraft.imageUrl.trim(),
    from: portfolioItemDraft.from.trim(),
    title: portfolioItemDraft.title.trim(),
    description: portfolioItemDraft.description.trim(),
    tags: [...portfolioItemDraft.tags],
    costRange: portfolioItemDraft.costRange.trim(),
    duration: portfolioItemDraft.duration.trim(),
  }

  // Require title, description, and image URL for each portfolio card
  if (!item.title) {
    submitError.value = 'Please provide a title for the portfolio card.'
    return
  }

  if (!item.description) {
    submitError.value = 'Please provide a description for the portfolio card.'
    return
  }

  if (!item.imageUrl) {
    submitError.value = 'Please provide an image URL for the portfolio card.'
    return
  }

  if (editingPortfolioIndex.value >= 0) {
    form.step4.portfolioItems.splice(editingPortfolioIndex.value, 1, item)
    editingPortfolioIndex.value = -1
  } else {
    form.step4.portfolioItems.push(item)
  }

  // reset draft
  portfolioItemDraft.imageUrl = ''
  portfolioItemDraft.from = ''
  portfolioItemDraft.title = ''
  portfolioItemDraft.description = ''
  portfolioItemDraft.tags = []
  portfolioItemDraft.costRange = ''
  portfolioItemDraft.duration = ''
}

const removePortfolioItem = (idx) => {
  form.step4.portfolioItems.splice(idx, 1)
  if (editingPortfolioIndex.value === idx) {
    // cancel edit mode if the edited item is removed
    cancelPortfolioEdit()
  }
}

const editPortfolioItem = (idx) => {
  const item = form.step4.portfolioItems[idx]
  if (!item) return

  portfolioItemDraft.imageUrl = item.imageUrl || ''
  portfolioItemDraft.from = item.from || ''
  portfolioItemDraft.title = item.title || ''
  portfolioItemDraft.description = item.description || ''
  portfolioItemDraft.tags = [...(item.tags || [])]
  portfolioItemDraft.costRange = item.costRange || ''
  portfolioItemDraft.duration = item.duration || ''

  editingPortfolioIndex.value = idx
}

const cancelPortfolioEdit = () => {
  editingPortfolioIndex.value = -1
  portfolioItemDraft.imageUrl = ''
  portfolioItemDraft.from = ''
  portfolioItemDraft.title = ''
  portfolioItemDraft.description = ''
  portfolioItemDraft.tags = []
  portfolioItemDraft.costRange = ''
  portfolioItemDraft.duration = ''
}

const closeSuccessPopup = () => {
  isSuccessPopupOpen.value = false
  navigateTo('/hire')
}

const setLocationFromMap = async ({ latitude, longitude }) => {
  isLoadingAddress.value = true
  selectedLocation.value = { lat: latitude, lng: longitude }
  form.step3.latitude = latitude
  form.step3.longitude = longitude

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
    )
    const data = await response.json()

    if (data && data.address) {
      const address = data.address

      const streetNumber = address.house_number || ''
      const streetName = address.road || address.street || ''
      if (streetNumber && streetName) {
        form.step3.address = `${streetNumber} ${streetName}`.trim()
      } else if (streetName) {
        form.step3.address = streetName
      }

      form.step3.area = address.suburb || address.neighbourhood || address.quarter || ''
      form.step3.city =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.county ||
        ''
    }
  } catch (error) {
    console.error('Failed to fetch address details:', error)
  } finally {
    isLoadingAddress.value = false
  }
}

/*
const validateStep = (currentStep) => {
  submitError.value = ''

  // Step 1: Basic details + image + category
  if (currentStep === 1) {
    if (!form.step1.title.trim() || !form.step1.description.trim()) {
      submitError.value = 'Please fill in title and description.'
      return false
    }
    if (!mainImg.value) {
      submitError.value = 'Please upload a photo to attract clients.'
      return false
    }
    const categoryId = route.query.categoryId || categoryData.value.categoryId
    if (!categoryId) {
      submitError.value = 'Please select a category.'
      isCategoryPopupOpen.value = true
      return false
    }
    return true
  }

  // Step 2: skills/experience
  if (currentStep === 2) {
    if (!form.step2.experienceLevel) {
      submitError.value = 'Please choose an experience level.'
      return false
    }
    if (!form.step2.completedProjects) {
      submitError.value = 'Please choose how many projects you have completed.'
      return false
    }
    if (form.step2.languages.length === 0 && form.step2.skills.length === 0) {
      submitError.value = 'Please add at least one language or skill.'
      return false
    }
    return true
  }

  // Step 3: contact/location
  if (currentStep === 3) {
    if (!form.step3.workingMode) {
      submitError.value = 'Please select a working mode.'
      return false
    }
    if (!form.step3.availability) {
      submitError.value = 'Please select availability.'
      return false
    }
    if (!form.step3.country) {
      submitError.value = 'Please enter your country.'
      return false
    }
    return true
  }

  // Step 4: portfolio (optional)
  if (currentStep === 4) {
    return true
  }

  // Step 5: pricing
  if (currentStep === 5) {
    const price = Number(form.step5.startingHourlyRate) || 0
    if (!price) {
      submitError.value = 'Please provide a price.'
      return false
    }
    return true
  }

  return true
}
*/

// TODO: validation is temporarily disabled for testing
const goToNextStep = () => {
  // if (validateStep(step.value)) {
  //   step.value += 1
  //   submitError.value = ''
  // }
  step.value += 1
}

const goToPreview = async () => {
  submitError.value = ''
  if (isSubmitting.value) return

  if (!form.step1.title.trim() || !form.step1.description.trim()) {
    submitError.value = 'Please fill in title and description.'
    step.value = 1
    return
  }


  const categoryId = route.query.categoryId || categoryData.value.categoryId
  const subCategoryId = route.query.subCategoryId || categoryData.value.subCategoryId

  if (!categoryId) {
    submitError.value = 'Please select a category.'
    isCategoryPopupOpen.value = true
    return
  }

  if (!form.step3.workingMode) {
    submitError.value = 'Please select a working mode.'
    step.value = 3
    return
  }

  // For hybrid/on-site sellers, location details are required.
  if (['Hybrid', 'Onsite'].includes(form.step3.workingMode)) {
    if (!form.step3.city.trim()) {
      submitError.value = 'Please enter your city.'
      step.value = 3
      return
    }
    if (!form.step3.area.trim()) {
      submitError.value = 'Please enter your area/suburb.'
      step.value = 3
      return
    }
    if (!form.step3.coverageRadius.trim()) {
      submitError.value = 'Please enter your coverage radius.'
      step.value = 3
      return
    }
    if (!form.step3.address.trim()) {
      submitError.value = 'Please enter your service address.'
      step.value = 3
      return
    }
    if (!form.step3.latitude || !form.step3.longitude) {
      submitError.value = 'Please select a location on the map.'
      step.value = 3
      return
    }
  }

  const isHourlyEnabled = !!form.step5.hourlyProjectEnabled
  const isPackagesEnabled = !!form.step5.packagesEnabled

  // Require at least one pricing mode to be enabled
  if (!isHourlyEnabled && !isPackagesEnabled) {
    submitError.value = 'Please enable either hourly pricing or service packages.'
    step.value = 5
    return
  }

  // If hourly pricing is enabled, require a rate
  if (isHourlyEnabled) {
    const hourlyPrice = Number(form.step5.startingHourlyRate) || 0
    if (!hourlyPrice) {
      submitError.value = 'Please provide a valid hourly rate when using hourly pricing.'
      step.value = 5
      return
    }
  }

  // If service packages are enabled, require at least one package to have a name and price
  if (isPackagesEnabled) {
    const hasValidPackage = form.step5.packages.some((pkg) => pkg.name.trim() && Number(pkg.price) > 0)
    if (!hasValidPackage) {
      submitError.value = 'Please add at least one service package with a name and price.'
      step.value = 5
      return
    }
  }

  isSubmitting.value = true
  try {
    hirePreviewData.value = {
      categoryId,
      subCategoryId: subCategoryId || '',
      categoryLabel: selectedCategoryLabel.value,
      form: JSON.parse(JSON.stringify(form)),
    }
    await navigateTo('/hire/post-review')
  } finally {
    isSubmitting.value = false
  }
}

const onCategorySelect = ({ categoryId, subCategoryId }) => {
  // Avoid full navigation; just update shared state so the label updates immediately.
  categoryData.value.categoryId = categoryId
  categoryData.value.subCategoryId = subCategoryId
}

</script>
