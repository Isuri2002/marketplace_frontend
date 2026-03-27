<template>
    <div :class="marginBottom ? 'mb-5' : ''">
        <span class="text-[15px]">{{ label }} <span class="text-red-500">{{ isRequired ? '*' : '' }}</span></span>
            <UInput
                :value="modelValue"
                :type="type"
                @input="handleInput"
                :size="size"
                :icon="icon"
                :color="error ? 'red' : color"
                :placeholder="placeholder"
                class="custom-input-sec"
            />
            <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
        </div>
</template>
  
<script setup>

const props = defineProps({
    label: String,
    isRequired: Boolean,
    name: String,
    modelValue: String,
    type: {
        type: String,
        default: 'text'
    },
    size: {
        type: String,
        default: 'md'
    },
    icon: {
        type: String,
        default: null
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
.custom-input-sec :deep(input:hover) {
    border-color: var(--sec-300) !important;
}

.custom-input-sec :deep(input:focus) {
    --tw-ring-opacity: 1;
    --tw-ring-color: rgb(254 127 14 / var(--tw-ring-opacity));
    border-color: var(--sec-300) !important;
}
</style>
  