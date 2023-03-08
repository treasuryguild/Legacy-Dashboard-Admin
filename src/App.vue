<script setup>
  import { onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from './store/index'
  import NavBar from './components/NavBar.vue'
  import ProjectUpdater from './components/ProjectUpdater.vue'

  const store = useStore()
  const route = useRoute()
  const router = useRouter()

  const group = route.params.group
  const project = route.params.project

  onMounted(() => {
    router.push('/')
  })
</script>

<template>
  <div>
  <div class="navbox">
    <Suspense>
    <NavBar />
    </Suspense>
    <div class="Selected">
        <h2 v-if="store.project">{{ store.project }}</h2>
        <h2 v-else>{{ store.group }}</h2>
    </div>
  </div>
  <!--
    <RouterLink style="margin: 0 5px" to="/">Home</RouterLink>
    <RouterLink style="margin: 0 5px" to="/dashboard">Dashboard</RouterLink> -->
    <RouterView></RouterView>
  
  <!-- <Suspense>
    <ProjectUpdater />
  </Suspense> -->
  </div>
</template>

<style scoped>
.navbox {
  display: flex;
  justify-content: space-around;
}

.Selected {
  padding: 2em;
}
</style>
