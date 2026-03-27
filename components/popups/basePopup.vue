<template>
    <Transition name="fade">
        <div v-if="props.isPopupVisible" @click="closePopup()"
            class="fixed inset-0 bg-[#0000004f] z-50">
            <div class="absolute top-1/2 left-1/2 w-full px-4 transform -translate-x-1/2 -translate-y-1/2">
                <div @click.stop class="relative mx-auto" :class="maxWidth">
                    <div v-if="showClose" class="p-4 absolute top-0 right-0">
                        <UIcon @click="closePopup()" class="text-[25px] text-black cursor-pointer"
                            name="material-symbols:close-rounded" dynamic />
                    </div>
                    <slot name="content"></slot>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>

const props = defineProps({
    isPopupVisible: Boolean,
    showClose: {
        type: Boolean,
        default: true
    },
    maxWidth: {
        type: String,
        default: 'max-w-3xl'
    }
});

const emits = defineEmits(['closePopup']);

const closePopup = () => {
    emits('closePopup');
};

</script>
