import { ref } from 'vue'
import { useStore } from '../store/index';
import { supabase } from '../supabase'
import { useWallets } from '../composables/wallets'

export async function useDeleteProjectTxs(project_id) {

  const status6 = ref('')
  const loading = ref(true)
  const wallet = ref([])
  const contributor_id = ref([])
  const updated_at = ref([])
  const store = useStore()

  async function deleteDistributions() {
    
    try {
      loading.value = true

      let { data, error, status } = await supabase
        .from('distributions')
        .delete()
        .eq('project_id',project_id)
        
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

  status6.value = 'done'

  return { status6 }
}
