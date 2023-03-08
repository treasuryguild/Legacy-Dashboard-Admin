// mouse.js
import { ref } from 'vue'
import axios from 'axios'
import { useGetTxs } from './gettransactions'

// by convention, composable function names start with "use"
export async function useGetNewTxs() {
  
    const orgEl = 'treasuryguild'
    const repoEl = 'treasury-system-v4'
    const projectJ = 'Swarm'
    const fundJ = 'TreasuryWallet'
    const poolJ = 'Swarm-Treasury-Wallet'
    const txs = ref()
    
    const { transactions, transactionsUrls, transactionDates, transactionIds } =  await useGetTxs(orgEl, repoEl, projectJ, fundJ, poolJ)
    txs.value = transactions.value

  async function test1() {
    console.log('Testing')
  }
  

  await test1()
  return { txs }
}
