import { ref } from 'vue'
import { useStore } from '../store/index';
import { supabase } from '../supabase'
import axios from 'axios'

export async function useGetStakeWalletAtIncoming(txid) {
  
  const stakeWallet = ref()
  const stakeWalletId = ref(0)
  const txId = ref()
  
  const store = useStore()

  async function getTxId(id) {
    await axios.get('https://postgrest-api.mainnet.dandelion.link/tx', {
        params: {
            hash: `eq.\\x${id}`,
            select: 'id'
        }
    }).then(response => {
        console.log('txid', response.data[0].id ) 
        txId.value = response.data[0].id
    }).catch(error => {
        console.log(error);
    });
  }

  async function getStakeWalletId(hashTxId) {
    await axios.get('https://postgrest-api.mainnet.dandelion.link/tx_out', {
        params: {
            tx_id: `eq.${hashTxId}`,
            select: 'stake_address_id'
        }
    }).then(response => {
        console.log('Stake_address_id', response.data, response.data[0].stake_address_id )   
        if (response.data.length > 1) {
            stakeWalletId.value = response.data[0].stake_address_id
        } else {
            stakeWalletId.value = null
        }
    }).catch(error => {
        console.log(error);
    });
  }

  async function getStakeWallet(stakeWalletId) {
    await axios.get('https://postgrest-api.mainnet.dandelion.link/stake_address', {
        params: {
            id: `eq.${stakeWalletId}`,
            select: 'view'
        }
    }).then(response => {
        console.log('View stake address', response.data[0].view);
        stakeWallet.value = response.data[0].view
    }).catch(error => {
        console.log(error);
    });
  }


  await getTxId(txid)
  await getStakeWalletId(txId.value)
  if (!stakeWalletId.value == null) {
    await getStakeWallet(stakeWalletId.value)
  }

  return { stakeWallet, stakeWalletId }
}
