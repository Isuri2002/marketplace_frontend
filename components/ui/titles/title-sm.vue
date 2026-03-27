<template>
    <div>
        <p :class="['text-xl font-bold', customClass]">{{ props.title }}</p>
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
        default: 'mb-5'
    }
})

</script>