<script setup>
  import { useStore } from '../store/index';
  import { supabase } from '../supabase'
  import { ref } from 'vue'
  import { useWallets } from '../composables/wallets'

  const loading = ref(true)
  const wallet = ref([])
  const contributor_id = ref([])
  const updated_at = ref([])

  async function checkWallets() {
    
    try {
      loading.value = true

      let { data, error, status } = await supabase
        .from('contributors')
        .select(`contributor_id, wallet, updated_at`)
        
      if (error && status !== 406) throw error

      if (data) {
        for (let j in data) {
            contributor_id.value.push(data[j].contributor_id)
            wallet.value.push(data[j].wallet)
            updated_at.value.push(new Date(data[j].updated_at).valueOf())
        }
      }
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }

  async function updateWallets() {
    console.log( Math.max(...updated_at.value), Date.now())
    if (Math.max(...updated_at.value)+360000 < Date.now()) {
      const { wallets, walletIds } = await useWallets()
      
    for (let i in walletIds.value) {
        if (!contributor_id.value.includes(walletIds.value[i])) {
          console.log(i, walletIds.value[i], wallets.value[i])
      try {
      loading.value = true

      const updates = {
        contributor_id: walletIds.value[i],
        wallet: wallets.value[i],
        updated_at: new Date()
      }

      let { error } = await supabase.from('contributors').upsert(updates)

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

  
  await checkWallets()
  await updateWallets()
  
</script>

<template>
    <div>
        test
    </div>
</template>