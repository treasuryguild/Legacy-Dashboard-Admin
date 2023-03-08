import { ref } from 'vue'
import { useStore } from '../store/index';
import { supabase } from '../supabase'
import { useWallets } from '../composables/wallets'

export async function useDeleteLatestTxs(project_id) {

  const status5 = ref('')
  const loading = ref(true)
  let dateLength = ref()
  //Math.floor(date.getTime() / 1000)
  dateLength.value = new Date(Date.now() - 18000000).toISOString().slice(0, 10)//new Date((date.getTime()) - 18000000)
  
  const store = useStore()

  async function deleteDistributions() {
    
    try {
      loading.value = true

      let { data, error, status } = await supabase
        .from('distributions')
        .delete()
        .eq('project_id',project_id)
        .gte('created_at', dateLength.value)
        
      if (error && status !== 406) throw error

      if (data) {
        console.log("distributions",data)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }

  async function deleteContributions() {
    
    try {
        loading.value = true
  
        let { data, error, status } = await supabase
          .from('contributions')
          .delete()
          .eq('project_id',project_id)
          .gte('created_at', dateLength.value)
          
        if (error && status !== 406) throw error
  
        if (data) {
          console.log("contributions",data)
        }
      } catch (error) {
        alert(error.message)
      } finally {
        loading.value = false
      }
    }

  async function deleteTransactions() {
    
    try {
        loading.value = true
  
        let { data, error, status } = await supabase
          .from('transactions')
          .delete()
          .eq('project_id',project_id)
          .gte('created_at', dateLength.value)
          
        if (error && status !== 406) throw error
  
        if (data) {
          console.log("transactions",data)
        }
      } catch (error) {
        alert(error.message)
      } finally {
        loading.value = false
      }
    }
  
  await deleteDistributions()
  await deleteContributions()
  await deleteTransactions()
  
  console.log("dateLength", dateLength.value)

  status5.value = 'done'

  return { status5 }
}
