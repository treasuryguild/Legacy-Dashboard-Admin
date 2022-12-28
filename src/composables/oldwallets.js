import { ref } from 'vue'
import axios from 'axios'

export async function useOldWallets() {

  const oldWallets = ref([])
  const oldWalletIds = ref([])
  const orgEl = 'treasuryguild'
  const repoEl = 'treasury-system-v4'

  async function process2() {
    const names = JSON.parse(import.meta.env.VITE_OLD_NAMES)
    const wallets = JSON.parse(import.meta.env.VITE_OLD_WALLETS) // ****** import this somehow ************************
    console.log(names)
    for (let i in names) {
        oldWallets.value.push(wallets[i])
        oldWalletIds.value.push(names[i]);
    }
  }

  

  await process2()

  return { oldWallets, oldWalletIds }
}
