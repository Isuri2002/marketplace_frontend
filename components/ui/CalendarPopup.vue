<template>
  <div class="relative">
    <UInput
      :modelValue="formattedDate"
      readonly
      :placeholder="placeholder"
      class="cursor-pointer"
      @click="toggleCalendar"
    >
      <template #trailing>
        <UIcon name="i-heroicons:calendar" class="text-gray-400" />
      </template>
    </UInput>

    <!-- Calendar Popup -->
    <div
      v-if="isOpen"
      class="absolute z-50 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80"
      @click.stop
    >
      <!-- Year and Month Navigation -->
      <div class="flex items-center justify-between mb-4">
        <button
          @click="previousMonth"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <UIcon name="i-heroicons:chevron-left" class="text-xl" />
        </button>
        
        <div class="text-center font-semibold text-lg">
          {{ currentYear }}
        </div>
        
        <button
          @click="nextMonth"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <UIcon name="i-heroicons:chevron-right" class="text-xl" />
        </button>
      </div>

      <!-- Month Selector -->
      <div class="mb-4">
        <USelect
          v-model="currentMonth"
          :options="monthOptions"
          color=""
          class="w-full"
        />
      </div>

      <!-- Days of Week -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div
          v-for="day in daysOfWeek"
          :key="day"
          class="text-center text-xs font-medium text-gray-600 py-2"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-1 mb-4">
        <button
          v-for="(day, index) in calendarDays"
          :key="index"
          @click="selectDate(day)"
          :disabled="!day.isCurrentMonth || isDateDisabled(day.date)"
          :class="[
            'aspect-square flex items-center justify-center rounded-lg text-sm transition-colors',
            day.isCurrentMonth ? 'text-gray-900' : 'text-gray-300',
            day.isToday && 'font-bold',
            day.isSelected && 'bg-sec text-white font-semibold',
            !day.isSelected && day.isCurrentMonth && 'hover:bg-gray-100',
            isDateDisabled(day.date) && 'opacity-40 cursor-not-allowed'
          ]"
        >
          {{ day.day }}
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button
          @click="cancel"
          class="flex-1 py-2 px-4 border-2 border-sec text-sec rounded-lg font-semibold hover:bg-sec hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          @click="confirmDate"
          class="flex-1 py-2 px-4 bg-sec text-white rounded-lg font-semibold hover:bg-sec-700 transition-colors"
        >
          Set
        </button>
      </div>
    </div>

    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40"
      @click="cancel"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select date'
  },
  minDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectedDate = ref(props.modelValue || '')
const tempDate = ref(props.modelValue || '')
const currentMonth = ref(0)
const currentYear = ref(new Date().getFullYear())

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT']

const monthOptions = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' }
]

// Initialize with current date or selected date
watch(() => props.modelValue, (newVal) => {
  selectedDate.value = newVal
  if (newVal) {
    const date = new Date(newVal)
    currentMonth.value = date.getMonth()
    currentYear.value = date.getFullYear()
  }
}, { immediate: true })

// Format date for display
const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  const date = new Date(selectedDate.value)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
})

// Generate calendar days
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const prevLastDay = new Date(year, month, 0)
  
  const firstDayOfWeek = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  const daysInPrevMonth = prevLastDay.getDate()
  
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Previous month days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const date = new Date(year, month - 1, day)
    days.push({
      day,
      date: date.toISOString().split('T')[0],
      isCurrentMonth: false,
      isToday: false,
      isSelected: false
    })
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dateStr = date.toISOString().split('T')[0]
    days.push({
      day,
      date: dateStr,
      isCurrentMonth: true,
      isToday: dateStr === today.toISOString().split('T')[0],
      isSelected: dateStr === tempDate.value
    })
  }
  
  // Next month days to fill the grid
  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day)
    days.push({
      day,
      date: date.toISOString().split('T')[0],
      isCurrentMonth: false,
      isToday: false,
      isSelected: false
    })
  }
  
  return days
})

const toggleCalendar = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    tempDate.value = selectedDate.value
    if (selectedDate.value) {
      const date = new Date(selectedDate.value)
      currentMonth.value = date.getMonth()
      currentYear.value = date.getFullYear()
    } else {
      const now = new Date()
      currentMonth.value = now.getMonth()
      currentYear.value = now.getFullYear()
    }
  }
}

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const isDateDisabled = (date) => {
  if (!props.minDate) return false
  return new Date(date) < new Date(props.minDate)
}

const selectDate = (day) => {
  if (!day.isCurrentMonth || isDateDisabled(day.date)) return
  tempDate.value = day.date
}

const confirmDate = () => {
  selectedDate.value = tempDate.value
  emit('update:modelValue', tempDate.value)
  isOpen.value = false
}

const cancel = () => {
  tempDate.value = selectedDate.value
  isOpen.value = false
}
</script>
