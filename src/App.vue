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
    <div>
      <a href="https://treasuryguild.io" target="_blank">
        <img src="./assets/TG.png" class="logo" alt="Treasury Guild logo" />
      </a>
      <a href="https://catalystswarm.com/" target="_blank">
        <img src="./assets/swarm.png" class="logo vue" alt="Catalyst Swarm logo" />
      </a>
    </div>
  </div>
    <RouterLink style="margin: 0 5px" to="/">Home</RouterLink>
    <RouterLink style="margin: 0 5px" to="/dashboard">Dashboard</RouterLink>
    <RouterView></RouterView>
  
  <!-- <Suspense>
    <ProjectUpdater />
  </Suspense> -->
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.navbox {
  display: flex;
  justify-content: space-around;
}

.Selected {
  padding: 2em;
}
</style>
