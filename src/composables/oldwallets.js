import { ref } from 'vue'
import axios from 'axios'

export async function useOldWallets() {

  const oldWallets = ref([])
  const oldWalletIds = ref([])
  const orgEl = 'treasuryguild'
  const repoEl = 'treasury-system-v4'

  const csvWallets = `IOG,addr1vxm9rssxy335nxtph8x4jndrnxj7eyg0e66uv0u7k4dzyjsg6fr38,,,,,,,
`

  async function csvToObject(csv) {
    const lines = csv.split('\n');
    const result = {};
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.split(',');
      if (parts.length === 9) {
        const key = parts[0].trim();
        const value = parts[1].trim();
        result[key] = value;
      }
    }
    return result;
  } 

  async function process2() {
    
    for (let i in oldNames) {
        oldWallets.value.push(oldNames[i])
        oldWalletIds.value.push(i);
    }
  }

  
let oldNames = await csvToObject(csvWallets);
  await process2()

  return { oldWallets, oldWalletIds }
}
