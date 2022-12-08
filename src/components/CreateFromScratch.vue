<script setup>
  import { supabase } from '../supabase'
  import { onMounted, ref } from 'vue'
  import { useGetAllProjects } from '../composables/getallprojects'
  
  const loadDash = ref(false)
  const loading = ref(true)
  const loading2 = ref(true)
  const groupnames = ref([])
  const groupids = ref([])

  const { projects, projectData } = await useGetAllProjects()

  async function getGroupId() {
    
    try {
      loading.value = true

      let { data, error, status } = await supabase
        .from('groups')
        .select(`group_id, group_name`)
        
      if (error && status !== 406) throw error

      if (data) {
        for (let j in data) {
          groupids.value.push(data[j].group_id)
          groupnames.value.push(data[j].group_name)
        }
      }
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }

  async function updateProjects() {
    let projectType = ""
    for (let i in projects.value) {
        console.log(i, projects.value[i])
        if (projectData.value[i].fund.substring(0, 4).toLowerCase() == "fund") {
          projectType = projectData.value[i].fund + " Proposal"
          console.log("projectType", projectType)
        } else {
          projectType = "Treasury Wallet"
        }
      try {
      loading.value = true

      const updates = {
        group_id: (groupids.value[groupnames.value.indexOf(projectData.value[i].project)]),
        project_name: projectData.value[i].proposal,
        project_type: projectType,
        budget_items: projectData.value[i].budgetItems,
        website: projectData.value[i].ideascale,
        wallet: projectData.value[i].wallet,
        updated_at: new Date()
      }

      let { error } = await supabase.from('projects').upsert(updates)

      if (error) throw error
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
    }
  }
  async function getGroupNames() {
    let groups = []
    for (let i in projects.value) {
        console.log(i, projects.value[i])
        if (!groups.includes(projectData.value[i].project)) {
        groups.push(projectData.value[i].project)
      try {
      loading2.value = true

      const updates2 = {
        group_name: projectData.value[i].project,
        updated_at: new Date()
      }

      let { error } = await supabase.from('groups').upsert(updates2)

      if (error) throw error
    } catch (error) {
      alert(error.message)
    } finally {
      loading2.value = false
    }
    }
  }
  }

  console.log(projectData.value)
  await getGroupNames();
  await getGroupId();
  await updateProjects();
</script>

<template>
    <div>
        Test
    </div>
</template>

