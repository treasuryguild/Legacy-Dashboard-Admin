// mouse.js
import { ref } from 'vue'
import axios from 'axios'

// by convention, composable function names start with "use"
export async function useGetAllProjects() {
  
  const projects = ref([])
  const projectData = ref([])
  const projectNames = ref([])
  const orgEl = 'treasuryguild'
  const repoEl = 'treasury-system-v4'

  async function getAllProjects() {
    const {data} = await axios.get(`https://api.github.com/repos/${orgEl}/${repoEl}/contents/proposals`);
    for (let key in data) {
      let downloadUrl = `https://raw.githubusercontent.com/${orgEl}/${repoEl}/main/proposals/${data[key].name}`;
      const downloadResponse = await axios.get(downloadUrl);
      projects.value.push(data[key].name)
      projectData.value.push(downloadResponse.data)
      projectNames.value.push(downloadResponse.data.project)
      
    }
  }

  await getAllProjects()
  
  return { projects, projectData, projectNames }
}
