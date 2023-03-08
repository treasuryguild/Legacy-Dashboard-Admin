import { ref } from 'vue'
import { useStore } from '../store/index';
import { supabase } from '../supabase'
import axios from 'axios'
import { useGetFee } from '../composables/getfee'

export async function useGetFees(project_id) {

  const status2 = ref('')
  const loading = ref(true)
  const tx_id = ref([])
  const transaction_id = ref([])
  const fee = ref([])
  const feeUpdate = ref([])
  const timeUpdate = ref([])
  const updated_at = ref([])
  const epochNoR = ref()
  const store = useStore()

  async function checkTxIds() {  
    try {
      loading.value = true

      let { data, error, status } = await supabase
        .from('transactions')
        .select(`tx_id, transaction_id, updated_at, fee`)
        .eq('project_id', project_id)
        
      if (error && status !== 406) throw error

      if (data) {
        for (let j in data) {
            transaction_id.value.push(data[j].transaction_id)
            tx_id.value.push(data[j].tx_id)
            fee.value.push(data[j].fee)
            //data[j].fee > 0 ? fee.value.push(data[j].fee) : fee.value.push(0)
            updated_at.value.push(new Date(data[j].updated_at).valueOf())
        }
      }
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }

  async function updateFees() {
    let dateTest = []
    for (let i in transaction_id.value) {
      if (!fee.value[i] > 0) { 
        const { singleFee, timeR, epochNo } = await useGetFee(transaction_id.value[i])
        dateTest[i] = timeR.value
        if (dateTest[i] == dateTest[i-1]) {
          timeUpdate.value = timeR.value + 1
        }else {
          timeUpdate.value = timeR.value
        }
        feeUpdate.value = singleFee.value    
        epochNoR.value = epochNo.value
        console.log('fee and time update',feeUpdate.value, timeUpdate.value)
      try {
      loading.value = true

      const updates = {
        tx_id: tx_id.value[i],
        fee: feeUpdate.value,
        transaction_date: timeUpdate.value,
        epoch_no: epochNoR.value
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

  
  await checkTxIds()
  await updateFees()
  status2.value = 'done'

  return { status2 }
}
