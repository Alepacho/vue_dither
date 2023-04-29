<script setup lang="ts">
import { ref } from 'vue'
import DragAndDrop from '../components/DragAndDrop.vue'
import Button from '../components/Button.vue'
import { useImageStore } from '@/stores/image'
import router from '@/router'

const store = useImageStore()
// const file = ref<File | undefined>(undefined);

const handleFile = (data: any) => {
    console.log('handleFile', data)
    // file.value = dndfile.value;
    store.setImageURL(data.url)
}

const handleProceed = () => {
    console.log('handleProceed', store.imageURL)

    if (store.imageURL == undefined) {
        console.warn('Image is not loaded!')
        return
    }

    router.push({ name: 'edit' })
}
</script>

<template>
    <main class="min-h-screen">
        <h2 class="text-center pt-3">Dither Effect Tool!</h2>

        <div class="flex justify-items-center flex-col p-5">
            <div class="flex flex-row justify-center m-3">
                <DragAndDrop class="w-full" @on-get-file="handleFile" />
            </div>
            <div class="flex flex-row justify-center m-3">
                <Button
                    @click="handleProceed"
                    class="w-full"
                    :disabled="store.imageURL == undefined"
                >
                    Proceed
                </Button>
            </div>
        </div>

        <h2 class="pt-3">Available modes:</h2>
        <ul>
            <li class="text-base">monochrome</li>
            <!-- <li class="text-base"> ordered 2x2 </li>
			<li class="text-base"> ordered 4x4 </li>
			<li class="text-base"> ordered 8x8 </li>
			<li class="text-base"> ordered 16x16 </li> -->
        </ul>
    </main>
    <footer class="pt-3 pb-10">
        <hr />
        <div class="text-center pt-3">
            <RouterLink to="/about"> About this site. </RouterLink>
            <p>Made by Alepacho.</p>
        </div>
    </footer>
</template>
