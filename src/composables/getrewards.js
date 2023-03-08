import { ref } from 'vue'
import { useStore } from '../store/index';
import { supabase } from '../supabase'
import axios from 'axios'

export async function useGetRewards(stakewalletid, epochArr) {
  
  const minEpoch = ref(0)
  const maxEpoch = ref(0)

  const epochTime = ref([])
  const rewards = ref([])
  const allRewards = ref([])
  const aggRewards = ref([])
  const allEpochs = ref([])
  let rewardsAgg = 0
  
  const store = useStore()

  async function getRewards(epochArr) {
    for (let i in epochArr) {
        await axios.get('https://postgrest-api.mainnet.dandelion.link/reward', {
            params: {
                addr_id: `eq.${stakewalletid}`,
                earned_epoch: `eq.${epochArr[i]}`,
                select: 'amount'
            }
        }).then(response => {
            console.log('Reward2', response.data[0].earned_epoch ) 
            rewards.value.push(response.data[0].amount)
        }).catch(error => {
            console.log(error, 'Zero rewards for ', epochArr[i]);
            rewards.value.push(0)
        });
    }
  }

  async function getAllRewards(epochArr) {
    minEpoch.value = Math.min(...epochArr)
    maxEpoch.value = Math.max(...epochArr)
    for (let i = 0; i < (maxEpoch.value - minEpoch.value); i++) {
        await axios.get('https://postgrest-api.mainnet.dandelion.link/reward', {
            params: {
                addr_id: `eq.${stakewalletid}`,
                earned_epoch: `eq.${minEpoch.value + i}`,
                select: 'amount'
            }
        }).then(response => {
            console.log('Total epochs', maxEpoch.value - minEpoch.value ) 
            allRewards.value.push(response.data[0].amount)
            allEpochs.value.push(minEpoch.value + i)
            rewardsAgg = rewardsAgg + allRewards.value[i]
            aggRewards.value.push(rewardsAgg)
        }).catch(error => {
            console.log(error, 'Zero rewards for ', epochArr[i]);
            allRewards.value.push(0)
        });
    }
  }


  await getRewards(epochArr)
  await getAllRewards(epochArr)

  return { rewards, aggRewards, allEpochs }
}
