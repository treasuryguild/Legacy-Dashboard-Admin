import { ref } from 'vue'
import { useStore } from '../store/index';
import { supabase } from '../supabase'
import axios from 'axios'
import { useGetStakeWallet } from '../composables/getstakewallet'
import { useGetRewards } from '../composables/getrewards'

export async function useGetBalances(project_id, wallet) {

  const status3 = ref('')
  const loading = ref(true)

  const stakeWalletIdR = ref()
  const incomingStakeWalletIdR = ref()
  const taskType = ref('')
  let transactions = ref([]);

  async function checkBalances() {  
    try {
      loading.value = true

      let { data, error, status } = await supabase
        .from('transactions')
        .select(`tx_id, transaction_id, fee, transaction_date, wallet_balance_after, total_ada, epoch_no, tx_type, stake_address_id`)
        .eq('project_id', project_id)
        
      if (error && status !== 406) throw error

      if (data) {
        
        for (let j in data) {
            transactions.value.push({
                transaction_id: data[j].transaction_id,
                tx_id: data[j].tx_id,
                fee: data[j].fee,
                stake_address_id: data[j].stake_address_id,
                transaction_date: data[j].transaction_date,
                total_ada: data[j].total_ada,
                epoch_no: data[j].epoch_no,
                tx_type: data[j].tx_type
            });
        }
        transactions.value.sort((a, b) => a.transaction_date - b.transaction_date);
        console.log('Sorted txs',transactions.value);
      }
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }

  async function checkTxTypes(txid) {  
    try {
      loading.value = true
      let { data, error, status } = await supabase
        .from('contributions')
        .select(`task_type`)
        .eq('tx_id', txid)
        
      if (error && status !== 406) throw error
      if (data) {
            taskType.value = data[0].task_type
      }
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }

  async function updateBalances() {
    
    for (let i in transactions.value) {
      if (transactions.value[i].stake_address_id == null) {
      console.log('stakeWalletIdR.value',stakeWalletIdR.value)
      await checkTxTypes(transactions.value[i].tx_id)
      console.log('transactions.value[i].epoch_no',transactions.value[i].epoch_no)
      if (taskType.value == 'Incoming') {
        stakeWalletIdR.value = null
      } else {
        const { stakeWallet, stakeWalletId } = await useGetStakeWallet(transactions.value[i].transaction_id, wallet)
        stakeWalletIdR.value = stakeWalletId.value
        incomingStakeWalletIdR.value = stakeWalletId.value
        console.log(parseFloat(transactions.value[i].fee/1000000))
      }
      if (taskType.value == 'Incoming') {
        stakeWalletIdR.value = incomingStakeWalletIdR.value
      }
      

      try {
      loading.value = true

      const updates = {
        tx_id: transactions.value[i].tx_id,
        stake_address_id: stakeWalletIdR.value
      }

      let { error } = await supabase.from('transactions').upsert(updates)

      if (error) throw error
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }
  }
  }

  
  await checkBalances()
  await updateBalances()
  status3.value = 'done'

  return { status3 }
}
