<template>
    <div class="relative">
        <p>Upload Images</p>
        <label for="img1"
            class="w-[100px] h-[100px] border rounded-md cursor-pointer flex justify-center items-center overflow-hidden relative bg-[#f3f3f36c]">
            <img class="max-w-full max-h-full" v-if="img1URL !== null" :src="img1URL" alt="">
            <UIcon v-if="!img1URL" class="text-[35px] text-light-gray"
                name="material-symbols:add-photo-alternate-outline-rounded" dynamic />
            <input class="w-0 opacity-0" type="file" name="" id="img1" accept=".jpg, .jpeg, .png, .webp"
                @change="img1Upload()" ref="img1">
        </label>
    </div>
</template>

<script setup>

</script>