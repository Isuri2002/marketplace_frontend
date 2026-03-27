<template>
    <div>
        <UButton :disabled="isLoading || isDisabled" class="duration-300" :class="buttonClass" :block="isBlock" :icon="icon" :size="size" :label="label"
            variant="link" :trailing="isTrailing" :loading="isLoading" @click="handleClick" />
    </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
    isBlock: {
        type: Boolean,
        default: false
    },
    icon: String,
    size: String,
    label: String,
    color: {
        type: String,
        default: 'primary'
    },
    variant: {
        type: String,
        default: 'solid',
    },
    isTrailing: {
        type: Boolean,
        default: false
    },
    isLoading: {
        type: Boolean,
        default: false
    },
    isDisabled: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['click']);

const buttonClass = computed(() => {
    const { color, variant } = props;
    
    if (variant === 'solid') {
        if (color === 'primary') return 'bg-sec hover:bg-sec-700 disabled:bg-sec-300 text-white hover:text-white';
        if (color === 'red') return 'bg-red-500 hover:bg-red-700 disabled:bg-red-300 text-white hover:text-white';
        if (color === 'blue') return 'bg-blue hover:bg-blue-700 disabled:bg-blue-300 text-white hover:text-white';
    } else if (variant === 'outline') {
        if (color === 'primary') return 'text-sec border border-sec hover:bg-sec hover:text-white disabled:text-sec-300';
        if (color === 'red') return 'text-red-500 border border-red-500 hover:bg-red-500 hover:text-white disabled:text-red-300';
        if (color === 'blue') return 'text-blue border border-blue hover:bg-blue hover:text-white disabled:text-blue-300';
    }
    
    return 'text-sec hover:text-sec-700 disabled:text-sec-300';
});

function handleClick() {
    emit('click')
}

</script>

<!-- :class="color === 'primary' && variant === 'solid' ? 'bg-prim hover:bg-prim-700 disabled:bg-prim-300' : color === 'red' && variant === 'solid' ? 'bg-red-500 hover:bg-red-700 disabled:bg-red-300' : color === 'red' && variant === 'outline' ? 'hover:bg-red hover:text-white disabled:bg-red-300' : color === 'blue' && variant === 'solid' ? 'bg-blue hover:bg-blue-700 disabled:bg-blue-300' : color === 'blue' && variant === 'outline' ? 'hover:bg-blue hover:text-white disabled:bg-blue-300': 'hover:bg-prim hover:text-white disabled:bg-prim-300'" -->
<!-- :class="variant === 'solid' ? 'bg-prim hover:bg-prim-700 disabled:bg-prim-300' : 'text-prim hover:text-prim-900 disabled:text-prim-300'"   -->