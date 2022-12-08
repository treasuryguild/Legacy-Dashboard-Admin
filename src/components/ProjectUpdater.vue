<script setup>
  import { supabase } from '../supabase'
  import { onMounted, ref } from 'vue'
  import { useGetAllProjects } from '../composables/getallprojects'
  import { useGetTxs } from '../composables/gettransactions'

  const orgEl = 'treasuryguild'
  const repoEl = 'treasury-system-v4'
  const projectJ = ref('')
  const fundJ = ref('')
  const poolJ = ref('')
  const loadDash = ref(false)

  const { projects, projectData, projectNames } = await useGetAllProjects()

  const loading = ref(true)
  const project = ref([])
  const txs = ref([])
  const updated_at = ref([])
  const projectinfo = ref([])
  const projectnames = ref([])
  const projecttxs = ref([])
  const selectedProject = ref([])
  const selProject = ref ({})
  const id = ref([])
  const idx = ref()
  const updatedx = ref()

  onMounted(() => {
    getProfile()
  })

  async function getProfile() {
    
    try {
      loading.value = true

      let { data, error, status } = await supabase
        .from('Projects')
        .select(`id, project, projectinfo, projectnames, updated_at, projecttxs`)
        

      if (error && status !== 406) throw error

      if (data) {
        for (let j in data) {
          id.value.push(data[j].id)
          updated_at.value.push(data[j].updated_at)
          project.value.push(data[j].project)
          projectinfo.value.push(data[j].projectinfo)
          projecttxs.value.push(data[j].projecttxs)
            if (!projectnames.value.includes(data[j].projectnames)) {
              projectnames.value.push(data[j].projectnames)
            }
        }
      }
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
    if (new Date(updated_at.value[0]).valueOf()+3600000 < Date.now()) {
      await updateProfile()
    } else {
      console.log('not yet',new Date(updated_at.value[0]).valueOf()+3600000,Date.now())
    }
  }

  async function updateProfile() {
    for (let i in projects.value) {
        console.log(i, projects.value[i])
      try {
      loading.value = true

      const updates = {
        id: i,
        project: projects.value[i],
        projectnames: projectNames.value[i],
        projectinfo: projectData.value[i],
        updated_at: new Date(),
      }

      let { error } = await supabase.from('Projects').upsert(updates)

      if (error) throw error
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
    }
    
  }

  function onChange(event) {
    selectedProject.value = []
    console.log(event.target.value)
    for (let i in projectinfo.value) {
        if (projectinfo.value[i].project == event.target.value) {
                selectedProject.value.push((project.value[i]).replace(/\..+$/, ''))
        }
    }
    console.log(selectedProject.value)
  }

  async function onChange2(event) {
    console.log(event.target.value, loadDash.value)
    let newname = event.target.value+'.json'
    for (let i in project.value) {
        if (newname == project.value[i]) {
            idx.value = id.value[i]
            updatedx.value = new Date(updated_at.value[i]).valueOf()
            selProject.value = projectinfo.value[i]
            projectJ.value = projectinfo.value[i].project.replace(/\s/g, '-')
            fundJ.value = ("Fund" + parseInt(projectinfo.value[i].fund.replace( /^\D+/g, '')))
            poolJ.value = projectinfo.value[i].proposal.replace(/\s/g, '-')
            txs.value = projecttxs.value[i]
        }
    }
     

    if (updatedx.value+3600000 < Date.now()) {
      const { transactions } =  await useGetTxs(orgEl, repoEl, projectJ.value, fundJ.value, poolJ.value)
      console.log(updatedx.value+3600000, Date.now(), transactions.value[0])
      try {
      loading.value = true

      const updates = {
        id: idx.value,
        projecttxs: transactions.value,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('Projects').upsert(updates)

      if (error) throw error
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
    }
    loadDash.value = true
  }

</script>

<template>
  <form class="form-widget">
    <select @change="onChange($event)" class="form-control">
      <option selected>Choose an option</option>
      <option v-for="i in projectnames" :key="i.id">
        {{ i }}
      </option>
    </select>
    <select @change="onChange2($event)" class="form-control">
      <option selected>Choose an option</option>
      <option v-for="i in selectedProject" :key="i.id">
        {{ i }}
      </option>
    </select>

  </form>
</template>