<script setup>
import { useStore } from '../store/index'

const store = useStore()

</script>
<template>
    <div>
        Home 
        {{ store.name }}{{ store.number }}{{ store.group }}{{ store.project }}
        <button @click="store.changeName('Roberto')">Change name to Roberto</button>
        <button @click="store.changeNumber(2)">Change number to 2</button>
        <button @click="store.$reset">reset store</button>
    </div>
</template>