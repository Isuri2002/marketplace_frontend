<template>
    <div>
        <p :class="['text-3xl sm:text-4xl font-bold', customClass]">{{ props.title }}</p>
    </div>
</template>

<script setup>

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    customClass: {
        type: String,
        default: ''
    }
})

</script>