<script setup lang="ts">
const emit = defineEmits(['click'])
</script>

<template>
    <button class="btn" @click="emit('click')">
        <slot></slot>
    </button>
</template>

<style scoped>
.btn {
    padding: 5px;
    background: white;
    border: 1px solid black;
}

.btn:disabled {
    color: gray;
    border: 1px solid gray;
}
/* .btn:hover,  */
.btn:active:not([disabled]) {
    color: white;
    background: black;
}
</style>
