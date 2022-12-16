import { ref } from 'vue'
import { useStore } from '../store/index';
import { supabase } from '../supabase'
import { useGetAllProjects } from '../composables/getallprojects'

export async function useUpdateGroups() {

  const status = ref('')
  const loading = ref(true)
  const loading2 = ref(true)
  const groupnames = ref([])
  const groupids = ref([])
  const project_name = ref([])
  const project_group_id = ref([])

  const { projects, projectData } = await useGetAllProjects()

  const store = useStore()

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

  async function getProjects() {  
    try {
      loading.value = true

      let { data, error, status } = await supabase
        .from('projects')
        .select(`group_id, project_name`)
        
      if (error && status !== 406) throw error

      if (data) {
        for (let j in data) {
          project_group_id.value.push(data[j].group_id)
          project_name.value.push(data[j].project_name)
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
        } else {
          projectType = "Treasury Wallet"
        }
        if (!project_name.value.includes(projectData.value[i].proposal)) {
          project_name.value.push(projectData.value[i].proposal)

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
  }

  async function getGroupNames() {
    for (let i in projects.value) {
        console.log(i, projects.value[i])
        if (!groupnames.value.includes(projectData.value[i].project)) {
          groupnames.value.push(projectData.value[i].project)
        
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
  await getGroupId();
  console.log('finished GroupIds')
  await getGroupNames();
  console.log('finished GroupNames')
  await getProjects()
  console.log('finished ProjectNames')
  await updateProjects();
  console.log('finished UpdateProjects')
  status.value = 'done'

  return { status }
}
