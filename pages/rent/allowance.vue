<template>
    <div class="container nav-size-box bg-white">
        <div class="max-w-[840px] mx-auto">
            <p class="text-sm font-bold uppercase tracking-[0.2em] text-sec">Rent Posting</p>
            <h1 class="mt-3 text-3xl font-bold text-prim">Posting Allowance</h1>
            <p class="mt-4 text-gray-600 leading-7">
                Before publishing a rent listing, make sure the item is available, the price is accurate, and the photos clearly show the condition of the product.
            </p>

            <div class="mt-8 grid gap-4 md:grid-cols-2">
                <div class="rounded-2xl border border-[#ececf4] p-5">
                    <h2 class="text-lg font-semibold text-prim">What to prepare</h2>
                    <ul class="mt-3 space-y-2 text-sm text-gray-600">
                        <li>Clear main photo and supporting images</li>
                        <li>Correct daily, weekly, or monthly rent frequency</li>
                        <li>Pickup location and accurate contact details</li>
                        <li>Any extra item conditions in additional information</li>
                    </ul>
                </div>
                <div class="rounded-2xl border border-[#ececf4] p-5">
                    <h2 class="text-lg font-semibold text-prim">Before you post</h2>
                    <ul class="mt-3 space-y-2 text-sm text-gray-600">
                        <li>Use a title people can search for easily</li>
                        <li>Keep the item available for the selected period</li>
                        <li>Add the correct city and map pin location</li>
                        <li>Review the listing before publishing it live</li>
                    </ul>
                </div>
            </div>

            <div class="mt-10 flex justify-end">
                <BtnPrimary label="Continue to Category Selection" size="lg" @click="router.push('/rent/rent-now')" />
            </div>
        </div>
    </div>
</template>

<script setup>
import BtnPrimary from '@/components/ui/buttons/button-primary.vue';

const router = useRouter();
</script>
