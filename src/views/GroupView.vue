<script setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from '../store/index';

  const store = useStore()
  const route = useRoute()
  const group = route.params.group
  
</script>

<template>
   <main>
     <h2>Group {{ store.group }}</h2>
   </main>
</template>
