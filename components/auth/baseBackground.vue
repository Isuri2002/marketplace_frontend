<template>
    <div class="min-h-screen p-2 bg-[#EFF9F4] bg-[url('../../assets/images/bg-auth.png')] bg-no-repeat bg-contain bg-bottom grid place-items-center">
        <div class="max-w-[500px] w-full py-10 px-3 sm:px-10 rounded-lg bg-white shadow-lg">
            <slot name="inputs"></slot>
            <div class="my-5 flex flex-col items-center">
                <span class="text-light-gray">or continue with</span>
                <div class="mt-3 flex gap-5">
                    <UButton class="px-7" :ui="{ rounded: 'rounded-medium' }" color="gray" icon="devicon:google"></UButton>
                    <UButton class="px-7" :ui="{ rounded: 'rounded-medium' }" color="gray" icon="logos:facebook"></UButton>
                </div>
            </div>
            <slot name="footer"></slot>
        </div>
    </div>
</template>