<template>
    <div class="container nav-size-box bg-white">
        <div class="max-w-[840px] mx-auto">
            <p class="text-sm font-bold uppercase tracking-[0.2em] text-sec">Rent Posting</p>
            <h1 class="mt-3 text-3xl font-bold text-prim">Posting Rules & Regulations</h1>
            <p class="mt-4 text-gray-600 leading-7">
                Keep rent listings accurate and complete so renters can book with confidence. These rules help reduce disputes and improve listing quality.
            </p>

            <div class="mt-8 space-y-4">
                <div class="rounded-2xl border border-[#ececf4] p-5">
                    <h2 class="text-lg font-semibold text-prim">Listing quality</h2>
                    <p class="mt-2 text-sm text-gray-600">Use real photos, a clear title, and a description that matches the actual condition of the item.</p>
                </div>
                <div class="rounded-2xl border border-[#ececf4] p-5">
                    <h2 class="text-lg font-semibold text-prim">Availability</h2>
                    <p class="mt-2 text-sm text-gray-600">Only post items that are actually available to rent and keep your contact details updated.</p>
                </div>
                <div class="rounded-2xl border border-[#ececf4] p-5">
                    <h2 class="text-lg font-semibold text-prim">Pricing</h2>
                    <p class="mt-2 text-sm text-gray-600">Set the correct rent price and frequency so renters see the real amount before booking.</p>
                </div>
                <div class="rounded-2xl border border-[#ececf4] p-5">
                    <h2 class="text-lg font-semibold text-prim">Location</h2>
                    <p class="mt-2 text-sm text-gray-600">Choose the correct city and map location to make pickup and delivery arrangements easier.</p>
                </div>
            </div>

            <div class="mt-10 flex justify-end">
                <BtnPrimary label="Back to Rent Flow" size="lg" @click="router.push('/rent/rent-now')" />
            </div>
        </div>
    </div>
</template>

<script setup>
import BtnPrimary from '@/components/ui/buttons/button-primary.vue';

const router = useRouter();
</script>
