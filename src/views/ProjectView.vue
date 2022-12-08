<script setup>
  import { useRoute } from 'vue-router'
  import { useStore } from '../store/index';

  const store = useStore()
  const route = useRoute()

  const group = route.params.group
  const project = route.params.project
  
</script>

<template>
   <main>
     <h2>Project {{ store.project }}</h2>
   </main>
</template>
