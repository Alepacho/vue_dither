<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
// import { RouterLink } from 'vue-router';
import Button from '@/components/Button.vue'
import router from '@/router'

import { useImageStore } from '@/stores/image'
import { MODE, useEffectStore } from '@/stores/effect'

const store = useImageStore()
const effect = useEffectStore()
const url = ref('')
const mode = ref(MODE.MONOCHROME)
const result = ref<string | undefined>(undefined)

onBeforeMount(() => {
    if (store.imageURL == undefined) {
        console.log('image is null')
        router.push({ name: 'home' })
        return
    }

    url.value = store.imageURL
})

const handleExit = () => {
    console.log('goin back')
    store.clear()
    router.push({ name: 'home' })
}

const handleSelect = (e: Event) => {
    console.log('handleSelect', e)

    const target = e.target as HTMLSelectElement
    switch (target.value) {
        case 'monochrome':
            mode.value = MODE.MONOCHROME
            break
        case 'ordered 2x2':
            mode.value = MODE.ORDERED_2X2
            break
        default:
            console.warn('Unknown Mode:', target.value)
    }
}

const handleGenerate = (e: Event) => {
    effect
        .dither(mode.value, url.value)
        .then((res) => {
            console.log({ res })
            const r = res as string | undefined
            result.value = r
        })
        .catch((reason) => {
            console.warn('Unable to apply dither effect:', reason)
        })
}

const handleSave = (e: Event) => {
    if (result.value == undefined) {
        console.warn('no generated image!')
        return
    }
    var a = document.createElement('a')
    a.href = '' + result.value
    a.download = 'result.png'
    a.click()
}

const handleCancel = () => {
    effect.cancel()
}
</script>

<template>
    <div v-if="effect.processing == true" class="loading flex flex-col z-30">
        <h2 class="text-border text-white font-bold flex flex-row mb-10">Loading...</h2>
        <Button class="flex flex-row" @click="handleCancel"> Cancel </Button>
    </div>
    <div v-else></div>
    <div class="navbar justify-between mb-3">
        <!-- Editing: {{ store.imageURL }}  -->
        <div class="flex">
            <select class="m-1" @change="handleSelect">
                <option>monochrome</option>
                <!-- <option> ordered 2x2 </option> -->
            </select>
            <Button class="m-1" @click="handleGenerate"> Generate </Button>
            <Button class="m-1" @click="handleSave" :disabled="result == undefined"> Save </Button>
        </div>

        <Button class="flex m-1" @click="handleExit"> Exit </Button>
    </div>

    <div v-if="result != undefined">
        <h3>Generated Image:</h3>
        <div class="flex justify-center my-3">
            <img style="image-rendering: pixelated" :src="result" />
        </div>
    </div>
    <div v-else></div>

    <h3>Original Image:</h3>
    <div class="flex justify-center my-3">
        <img style="image-rendering: pixelated" :src="url" />
    </div>
</template>

<style scoped>
select {
    border: 1px solid black;
}

.navbar {
    border: 1px solid black;
    background: black;
    display: flex;
}

.loading {
    position: fixed;
    /* text-align: center; */
    left: 0;
    top: 0;
    /* margin: auto; */
    justify-content: center;
    align-items: center;
    background: rgb(0.5, 0.5, 0.5, 0.25);
    width: 100%;
    height: 100%;
}

.text-border {
    --text-border-color: black;
    text-shadow: 2px 0 var(--text-border-color), -2px 0 var(--text-border-color),
        0 2px var(--text-border-color), 0 -2px var(--text-border-color),
        1px 1px var(--text-border-color), -1px -1px var(--text-border-color),
        1px -1px var(--text-border-color), -1px 1px var(--text-border-color);
}
</style>
