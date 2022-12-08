<script setup>
import { onMounted, ref, computed } from 'vue'
import { useGetWallet } from '../composables/getwallet'
import { useDashboard } from '../composables/dashboard'
import { supabase } from '../supabase'

const props = defineProps({
  txs: Object,
  pinfo: Object
})

const testing = ref()
const { processedData } = useDashboard(props.pinfo)
const { lovelace, tokens, tokenAmounts, nfts, nftPicture } = await useGetWallet(props.pinfo.wallet)

const testCompute = computed(() => {
  let y = {}
  y = processedData.value

  return y
})
</script>

<template>
  <h2>{{ testCompute }}</h2>
  <h2>{{ pinfo || 'No props passed yet' }}</h2>
</template>