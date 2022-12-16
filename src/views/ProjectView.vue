<script setup>
  import { useRoute } from 'vue-router'
  import { useStore } from '../store/index';
  import { useGetAllTransactions } from '../composables/updatetransactions'

  const store = useStore()
  const route = useRoute()

  const group = route.params.group
  const project = route.params.project

  async function txs() {
  const { status } = await useGetAllTransactions()
  console.log(status.value)
}
  
</script>

<template>
   <main>
     <h2>Project {{ store.project }}</h2>
     <div>
        <button @click="txs()">Update Transactions</button>
    </div>
   </main>
</template>
