<template>
    <div :class="marginBottom ? 'mb-5' : ''">
        <span class="text-[15px]">{{ label }} <span class="text-red-500">{{ isRequired ? '*' : '' }}</span></span>
        <USelect
            :value="modelValue"
            @input="handleInput"
            :size="size"
            :color="error ? 'red' : color"
            :placeholder="placeholder"
            :options="options"
            :icon="icon"
            :ui="ui"
            class="custom-select-sec"
        />
            <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
    </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
    label: String,
    isRequired: Boolean,
    name: String,
    modelValue: String,
    size: {
        type: String,
        default: 'md'
    },
    color: {
        type: String,
        default: 'gray'
    },
    placeholder: String,
    error: String,
    marginBottom: {
        type: Boolean,
        default: true
    },
    options: {
        type: Array,
        default: []
    },
    icon: {
        type: String,
        default: null
    },
    iconColor: {
        type: String,
        default: null
    }
});

const ui = computed(() => {
  if (props.iconColor) {
    return { icon: { base: `text-${props.iconColor}` } }
  }
  return {}
})

const emit = defineEmits(['update:modelValue'])

function handleInput(event) {
    emit('update:modelValue', event.target.value)
}

</script>

<style scoped>
.custom-select-sec :deep(button:hover) {
    border-color: var(--sec-300) !important;
}

.custom-select-sec :deep(button:focus) {
    --tw-ring-opacity: 1;
    --tw-ring-color: rgb(254 127 14 / var(--tw-ring-opacity));
    border-color: var(--sec-300) !important;
}

.custom-select-sec :deep(button:focus-visible),
.custom-select-sec :deep(button[aria-expanded='true']) {
    outline: none !important;
    border-color: var(--sec-300) !important;
    box-shadow: 0 0 0 1px var(--sec-300) !important;
}

.custom-select-sec :deep([role='combobox']:focus),
.custom-select-sec :deep([role='combobox'][aria-expanded='true']) {
    --tw-ring-opacity: 1 !important;
    --tw-ring-color: rgb(254 127 14 / var(--tw-ring-opacity)) !important;
    border-color: var(--sec-300) !important;
    box-shadow: 0 0 0 1px var(--sec-300) !important;
}

/* Override any Nuxt UI primary (green) ring classes */
.custom-select-sec :deep(.ring-green-500),
.custom-select-sec :deep(.focus\:ring-green-500:focus),
.custom-select-sec :deep(.focus\:ring-primary-500:focus),
.custom-select-sec :deep(.ring-primary-500) {
    --tw-ring-opacity: 1 !important;
    --tw-ring-color: rgb(254 127 14 / var(--tw-ring-opacity)) !important;
}
</style>