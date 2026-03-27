<template>
    <div :class="marginBottom ? 'mb-5' : ''">
        <span class="text-[15px]">{{ label }} <span class="text-red-500">{{ isRequired ? '*' : '' }}</span></span>
        <UTextarea 
            :value="modelValue" 
            @input="handleInput" 
            :size="size" 
            :color="error ? 'red' : color" 
            :placeholder="placeholder"
            class="custom-textarea-sec"
        />
        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
    </div>
</template>
  
<script setup>
import { UTextarea } from '#components'

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
    }
})

const emit = defineEmits(['update:modelValue'])

function handleInput(event) {
    emit('update:modelValue', event.target.value)
}
</script>

<style scoped>
.custom-textarea-sec :deep(textarea:focus) {
    --tw-ring-opacity: 1;
    --tw-ring-color: rgb(254 127 14 / var(--tw-ring-opacity));
    border-color: var(--sec-300) !important;
}
</style>
  