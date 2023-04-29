import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export enum MODE {
    MONOCHROME,
    ORDERED_2X2,
    UNKNOWN
}

export const useEffectStore = defineStore('effect', () => {
    const processing = ref(false)

    const cancel = () => {
        processing.value = false
    }

    const loadImage = (url: string) => {
        return new Promise((resolve) => {
            const img = new Image()
            img.onload = () => {
                resolve(img)
            }
            img.src = url
        })
    }

    const toImageData = (img: HTMLImageElement) => {
        const c = document.createElement('canvas') as HTMLCanvasElement
        const w = img.width
        const h = img.height
        c.width = w
        c.height = h
        const ctx = c.getContext('2d')
        if (!ctx) {
            console.warn('no CTX!')
            return
        }

        ctx.clearRect(0, 0, w, h)

        ctx.drawImage(img, 0, 0)
        return ctx.getImageData(0, 0, w, h)
    }

    // const toImage = (data: ImageData) => {
    //     const c   = document.createElement('canvas') as HTMLCanvasElement;
    //     const w   = data.width;
    //     const h   = data.height;
    //     c.width   = w; c.height = h;
    //     const ctx = c.getContext("2d");
    //     if (!ctx) { console.warn("no CTX!"); return; }

    //     ctx.putImageData(data, 0, 0);
    //     var image = new Image();
    //     image.src = c.toDataURL();
    //     return image;
    // }

    const toImageURL = (data: ImageData) => {
        const c = document.createElement('canvas') as HTMLCanvasElement
        const w = data.width
        const h = data.height
        c.width = w
        c.height = h
        const ctx = c.getContext('2d')
        if (!ctx) {
            console.warn('no CTX!')
            return
        }

        ctx.clearRect(0, 0, w, h)
        ctx.putImageData(data, 0, 0)

        return c.toDataURL()
    }

    const dither = async (mode: MODE, url: string) => {
        console.log('dither', { mode, url })
        processing.value = true

        return new Promise(async (resolve) => {
            const matrix = [
                // [0, 2], [3, 1]
                [1, 9, 3, 11],
                [13, 5, 15, 7],
                [4, 12, 2, 10],
                [16, 8, 14, 6]
            ]
            const size = 4 // 2
            const mval = 15 + 1 // 3 + 1

            const img = (await loadImage(url)) as HTMLImageElement
            const imageData = toImageData(img)

            if (!imageData) {
                console.warn("Can't get image data!")
                processing.value = false
                resolve(undefined)
                return
            }

            const dataSize = imageData.height * imageData.width * 4
            console.log({ img, imageData, dataSize })
            for (let y = 0; y < imageData.height; y++) {
                for (let x = 0; x < imageData.width; x++) {
                    const i = (y * imageData.width + x) * 4 // bpp

                    const c = {
                        r: imageData.data[i + 0],
                        g: imageData.data[i + 1],
                        b: imageData.data[i + 2]
                    }

                    const b = matrix[x % size][y % size]
                    const intensity = c.r * 0.3 + c.g * 0.59 + c.b * 0.11
                    const dithered = intensity > (b * 255) / mval ? 255 : 0

                    imageData.data[i + 0] = dithered
                    imageData.data[i + 1] = dithered
                    imageData.data[i + 2] = dithered
                    // imageData.data[i + 3] = 255;
                }
            }

            const result = toImageURL(imageData)
            processing.value = false

            // console.log({ result })
            // resolve(undefined);
            resolve(result)
        })
    }

    return { processing, cancel, dither }
})
