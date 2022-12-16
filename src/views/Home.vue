<script setup>
import { useStore } from '../store/index'
import { ref } from 'vue'
import { useUpdateWallets } from '../composables/updatewallets'
import { useUpdateGroups } from '../composables/updategroups'

const store = useStore()
const getGroups = ref([])
const getProjects = ref([])

async function groups() {
  const { status } = await useUpdateGroups()
  console.log(status.value)
}

async function wallets() {
  const { status } = await useUpdateWallets()
  console.log(status.value)
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
        <button @click="groups()">Update Groups</button>
    </div>
    <div>
        <button @click="wallets()">Update Wallets</button>
    </div>
</template>