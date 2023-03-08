import { ref } from 'vue'
import { useStore } from '../store/index';
import { supabase } from '../supabase'
import axios from 'axios'

export async function useGetFee(txid) {
  
  const singleFee = ref(0)
  const blockId = ref(0)
  const epochNo = ref(0)
  const timeR = ref(0)
  
  const store = useStore()

  async function getFee(txid) {
    await axios.get('https://postgrest-api.mainnet.dandelion.link/tx', {
            params: {
                hash: `eq.\\x${txid}`,
                select: 'fee, block_id'
            }
        }).then(response => {
            console.log('fee', response.data[0].fee);
            singleFee.value = response.data[0].fee
            blockId.value = response.data[0].block_id
        }).catch(error => {
            console.log(error);
        });
  }

  async function getTime(blockId) {
    await axios.get('https://postgrest-api.mainnet.dandelion.link/block', {
        params: {
            id: `eq.${blockId}`,
            select: 'time, epoch_no'
        }
    }).then(response => {
        console.log('Time', response.data);
        timeR.value = (new Date(response.data[0].time)).getTime() 
        epochNo.value = response.data[0].epoch_no
    }).catch(error => {
        console.log(error);
    });
  }

  
  await getFee(txid)
  await getTime(blockId.value)

  return { singleFee, timeR, epochNo }
}
