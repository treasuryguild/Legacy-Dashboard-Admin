<script setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from '../store/index';

  const store = useStore()
  const route = useRoute()
  const group = route.params.group
  
  function test2() {
    console.log(store.group)
  }
</script>

<template>
   <main>
     <h2>Group {{ store.group }}</h2>
     <div>
        <button @click="test2()">Update Projects</button>
    </div>
   </main>
</template>
