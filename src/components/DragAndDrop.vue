<script setup lang="ts">
import { ref } from 'vue'
const inputRef = ref()
const isDragging = ref(false)
const file = ref<File | undefined>(undefined)
const url = ref<string | undefined>(undefined)

const emit = defineEmits(['on-get-file'])

const emitResult = () => {
    emit('on-get-file', { url: url.value, file: file.value })
}

const onFileSelect = (e: Event) => {
    console.log('Select!', e)

    const target = e.target as HTMLInputElement
    if (target && target.files) {
        file.value = target.files[0]
        url.value = URL.createObjectURL(file.value)
        emitResult()
    }
}

const onFormClick = (e: Event) => {
    console.log('Click', e)
    console.log('inputRef', inputRef)
    if (inputRef.value) {
        inputRef.value.click()
    }
}

const onDragOver = (e: Event) => {
    e.preventDefault()
    isDragging.value = true
}

const onDragLeave = (e: Event) => {
    e.preventDefault()
    isDragging.value = false
}

const onFormDrop = (e: DragEvent) => {
    e.preventDefault()
    console.log('Drop!', e)

    if (e.dataTransfer) {
        file.value = e.dataTransfer.files[0]
        url.value = URL.createObjectURL(file.value)
        emitResult()
    }
}
</script>

<template>
    <div
        class="dnd-box"
        @click="onFormClick"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onFormDrop"
    >
        <input
            type="file"
            ref="inputRef"
            accept="image/*"
            @change="onFileSelect"
            style="display: none"
        />

        <div v-if="file != undefined" class="flex justify-center p-2 min-h-48">
            <img :src="url" draggable="false" class="overflow-hidden" />
        </div>
        <p class="text-center m-24" v-else>Select file</p>
    </div>
</template>

<style scoped>
.dnd-box {
    border: 2px dashed gray;
}

.dnd-box:hover {
    border-color: black;
}
.dnd-box:active {
    color: white;
    background: black;
}
</style>
