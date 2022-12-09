<script setup>
import { useStore } from '../store/index'
import { ref } from 'vue'

const store = useStore()
const getGroups = ref([])
const getProjects = ref([])

function test() {
  console.log(store.project)
}


</script>
<template>
    <div>
        Home 
        {{ store.name }}{{ store.number }}{{ store.group }}{{ store.project }}
        
        
        
        
    </div>
    <div>
        <button @click="store.changeName('Roberto')">Change name to Roberto</button>
    </div>
    <div>
        <button @click="store.changeNumber(2)">Change number to 2</button>
    </div>
    <div>
        <button @click="store.$reset">reset store</button>
    </div>
    <div>
        <button @click="test()">Update Groups</button>
    </div>
</template>