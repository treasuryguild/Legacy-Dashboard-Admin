import { ref } from 'vue'
import { useStore } from '../store/index';
import { supabase } from '../supabase'
import axios from 'axios'

export async function useGetTxAmounts(project_id, project_name) {

  const status4 = ref('')
  const loading = ref(true)

  let transactions = ref([]);
  const tx_id = ref([])
  const tx_type = ref([])
  const txhash_id = ref([])
  const total_ada = ref([])
  const transaction_id = ref([])
  const stake_address_id = ref([])
  const wallet_balance_after = ref([])
  const all_stake_address_ids = ref([])
  const stake_address_value = ref([])

  const tx_out_sums = ref([])
  const tx_out_ids = ref([])
  const tx_out_values = ref([])
  let walletBalance = ref(0)
  let finalVal = ref(0)
  let outValues = ref(0)
  let dateLength = 600000000000; // all transactions
  const tx_out_amounts = ref([])

  const fee = ref([])
  const feeUpdate = ref([])
  const timeUpdate = ref([])
  const epochNoR = ref()
  const store = useStore()

  if (project_name == "Swarm Treasury Wallet") {
    dateLength = 600000000 // plus minus 6 days = 600000000
  }

  async function getTxIds() {  
    try {
      loading.value = true

      let { data, error, status } = await supabase
        .from('transactions')
        .select(`tx_id, transaction_id, total_ada, stake_address_id, tx_type, fee, transaction_date, wallet_balance_after`)
        .eq('project_id', project_id)
        
      if (error && status !== 406) throw error

      if (data) {
        for (let j in data) {
          transactions.value.push({
            transaction_id: data[j].transaction_id,
            tx_id: data[j].tx_id,
            fee: data[j].fee,
            transaction_date: data[j].transaction_date,
            stake_address_id: data[j].stake_address_id,
            total_ada: data[j].total_ada,
            wallet_balance_after: data[j].wallet_balance_after,
            tx_type: data[j].tx_type
        });
            transaction_id.value.push(data[j].transaction_id)
            stake_address_id.value.push(data[j].stake_address_id)
            tx_id.value.push(data[j].tx_id)
            tx_type.value.push(data[j].tx_type)
            total_ada.value.push(data[j].total_ada)
            fee.value.push(data[j].fee)
            wallet_balance_after.value.push(data[j].wallet_balance_after)
        }
      }
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }

  async function getTxHashId() {
    for (let i in transactions.value) {
      if ((parseInt(transactions.value[i].transaction_date) + dateLength) > parseInt(Date.now())) { //over here
      await axios.get('https://postgrest-api.mainnet.dandelion.link/tx', {
          params: {
              hash: `eq.\\x${transactions.value[i].transaction_id}`,
              select: 'id, out_sum'
          }
      }).then(response => {
          console.log('tx', response.data[0].id, response.data[0].out_sum, transactions.value[i].total_ada) 
          transactions.value[i].txhash_id = response.data[0].id
          transactions.value[i].tx_out_sums = response.data[0].out_sum
      }).catch(error => {
          console.log(error);
      });
    }
    }   
  }

  async function getStakeWallet() {
    for (let j in transactions.value) {
      if ((parseInt(transactions.value[j].transaction_date) + dateLength) > parseInt(Date.now())) { // over here
      let result = []
      let result2 = 0
      all_stake_address_ids.value = []
      await axios.get('https://postgrest-api.mainnet.dandelion.link/tx_out', {
          params: {
              tx_id: `eq.${transactions.value[j].txhash_id}`,
              select: 'value, stake_address_id'
          }
      }).then(response => {
          console.log('tx_out', response.data.length ,response.data[0].value, response.data[0].stake_address_id ) 
          for (let i in response.data) {
            console.log("pushing")
            all_stake_address_ids.value[i] = response.data[i].stake_address_id
          } 
          result = all_stake_address_ids.value.filter(value => (stake_address_id.value.filter(value => value !== null)).includes(value))
          console.log("result",result)
          if (result.length > 0) {
            result2 = all_stake_address_ids.value.find(value => (stake_address_id.value.filter(value => value !== null)).includes(value));
            console.log("result2",result2)
            transactions.value[j].tx_out_ids = result2
          } else {
            transactions.value[j].tx_out_ids = null  
          }
      }).catch(error => {
          console.log(error);
      });
    }
    }
    console.log("tx_out_ids",transactions.value)
  }

  async function getTxValues() {
    for (let i in transactions.value) {
      if ((parseInt(transactions.value[i].transaction_date) + dateLength) > parseInt(Date.now())) { // over here
      outValues.value = 0
      if (transactions.value[i].tx_out_ids != null) {
        await axios.get('https://postgrest-api.mainnet.dandelion.link/tx_out', {
          params: {
            tx_id: `eq.${transactions.value[i].txhash_id}`,
            stake_address_id: `eq.${transactions.value[i].tx_out_ids}`,
            select: 'value'
          }
        }).then(response => {
            console.log('value', response.data, response.data[0].value, transactions.value[i].total_ada) 
            if (response.data.length >= 1) {
              
              transactions.value[i].tx_out_values = 0
              for (let j in response.data) {
                transactions.value[i].tx_out_values = transactions.value[i].tx_out_values + response.data[j].value
                if (transactions.value[i].tx_type == "Incoming" && (Math.abs((response.data[j].value/1000000) - transactions.value[i].total_ada)) <= 1) { // risk of having same approx amounts -> (Math.abs((response.data[j].value/1000000) - transactions.value[i].total_ada)
                  transactions.value[i].tx_out_values = response.data[j].value
                  break;
                }
              }
      
              
            } else if (response.data.length = 0) {
              transactions.value[i].tx_out_values = 0 - transactions.value[i].fee
            } else {
              transactions.value[i].tx_out_values = response.data[0].value
            }   
        }).catch(error => {
            console.log(error);
        });
      } else {
        transactions.value[i].tx_out_values = 0
      }
    }
    } 
    console.log('tx_out_values.value', transactions.value)   
  }

  async function getFinalAmounts() {
    for (let i in transactions.value) {
      if ((parseInt(transactions.value[i].transaction_date) + dateLength) > parseInt(Date.now())) { // over here
      transactions.value[i].tx_out_amounts = (transactions.value[i].tx_out_sums - transactions.value[i].tx_out_values)/1000000
      if (!transactions.value[i].tx_out_amounts > 0) {
        if (transactions.value[i].tx_type == "Staking") {
          transactions.value[i].tx_out_amounts = 2
        } else if (transactions.value[i].tx_type == "Voting" || transactions.value[i].tx_type == "Internal transfer") {
          transactions.value[i].tx_out_amounts = 0
        } else if (transactions.value[i].tx_type == "Rewards Withdrawal") {
          transactions.value[i].tx_out_values = transactions.value[i].total_ada*1000000
        }
      }
    }
    }
    
    console.log("tx_out_amounts.value",transactions.value)
  }
  

  async function updateTxAmounts() {
    transactions.value.sort((a, b) => a.transaction_date - b.transaction_date);
    let adaAmount = 0
    for (let i in transactions.value) {
      if ((parseInt(transactions.value[i].transaction_date) + dateLength) > parseInt(Date.now())) { // over here
      if (transactions.value[i].tx_type == "Incoming" || transactions.value[i].tx_type == "Rewards Withdrawal") {
        if (transactions.value[i].tx_type == "Rewards Withdrawal") {
          adaAmount = transactions.value[i].total_ada
          if (transactions.value[i].wallet_balance_after == null) {
            walletBalance.value = walletBalance.value + transactions.value[i].total_ada - (transactions.value[i].fee/1000000)
          } else {
            walletBalance.value = transactions.value[i].wallet_balance_after
          }
          
        } else {
          adaAmount = transactions.value[i].tx_out_values/1000000
          if (transactions.value[i].wallet_balance_after == null) {
            walletBalance.value = walletBalance.value + (transactions.value[i].tx_out_values/1000000)
          } else {
            walletBalance.value = transactions.value[i].wallet_balance_after
          }
        }
        
        try {
          loading.value = true
    
          const updates = {
            tx_id: transactions.value[i].tx_id,
            wallet_balance_after: walletBalance.value,
            total_ada: adaAmount
          }
    
          let { error } = await supabase.from('transactions').upsert(updates)
    
          if (error) throw error
          } catch (error) {
            alert(error.message)
          } finally {
            loading.value = false
          }
      } else { 
        if (transactions.value[i].wallet_balance_after == null) {
          walletBalance.value = walletBalance.value - (transactions.value[i].tx_out_amounts + transactions.value[i].fee/1000000)
        } else {
          walletBalance.value = transactions.value[i].wallet_balance_after
        }
        
        if (walletBalance.value < 0.5) {
          walletBalance.value = 0
        }
        try {
        loading.value = true
  
        const updates = {
          tx_id: transactions.value[i].tx_id,
          total_ada: transactions.value[i].tx_out_amounts,
          wallet_balance_after: walletBalance.value,
          stake_address_id: transactions.value[i].tx_out_ids
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
  }

  
  await getTxIds()
  await getTxHashId()
  await getStakeWallet()
  await getTxValues()
  await getFinalAmounts()
  await updateTxAmounts()

  status4.value = 'done'

  return { status4 }
}
