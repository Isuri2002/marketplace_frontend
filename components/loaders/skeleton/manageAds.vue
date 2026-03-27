<template>
    <div>
        <div class="mb-2 flex justify-between">
            <USkeleton class="w-[200px] h-[20px]"></USkeleton>
            <USkeleton class="w-[100px] h-[20px]"></USkeleton>
        </div>
        <div class="flex gap-3">
            <USkeleton class="w-[200px] h-[150px] flex-shrink-0"></USkeleton>
            <div class="w-full flex flex-col gap-2">
                <USkeleton class="w-full h-[20px]"></USkeleton>
                <USkeleton class="w-full h-[20px]"></USkeleton>
                <USkeleton class="w-full h-[20px]"></USkeleton>
                <USkeleton class="w-full h-[20px]"></USkeleton>
            </div>
        </div>
        <UDivider class="my-5" />
    </div>
</template>
<script setup>

</script>