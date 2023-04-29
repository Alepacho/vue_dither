import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useImageStore = defineStore('image', () => {
    const imageURL = ref<string | undefined>(undefined)
    // const doubleCount = computed(() => count.value * 2)
    function setImageURL(image: string) {
        imageURL.value = image
    }

    function clear() {
        imageURL.value = undefined
    }

    return { imageURL, setImageURL, clear }
})
