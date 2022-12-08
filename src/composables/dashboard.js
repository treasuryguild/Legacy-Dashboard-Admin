import { ref } from 'vue'
import axios from 'axios'

export function useDashboard(data) {

  const processedData = ref()

  function process() {
    console.log('lessgo', data)
    processedData.value = data
  }

  process()

  return { processedData }
}
