<script setup>
  import { useRoute } from 'vue-router'
  import { useStore } from '../store/index';

  const store = useStore()
  const route = useRoute()

  const group = route.params.group
  const project = route.params.project

  function test3() {
    console.log(store.project)
  }
  
</script>

<template>
   <main>
     <h2>Project {{ store.project }}</h2>
     <div>
        <button @click="test3()">Update Transactions</button>
    </div>
   </main>
</template>
