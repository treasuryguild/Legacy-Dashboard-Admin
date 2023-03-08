<script setup>
import { useStore } from '../store/index'
import CreateFromScratch from '../components/CreateFromScratch.vue'
import UpdateWallets from '../components/UpdateWallets.vue'
import axios from 'axios';
import { supabase } from '../supabase'
import { useGetNewTxs } from '../composables/getnewtxs'

async function txs() {
  const { txs } = await useGetNewTxs()
  console.log(txs.value)
}

/*
const data = {
  "data": {
    "addresses" : ["addr1q9zza9phav9nmyntc4xg4zvf6gv4mpnkxzgk6yacs3tlefpunkgr6lzht0qhwn9rpqs4z7zlctnpwu40gftfvl8ca62ss258m7"]
  }
};

const headers = {
  'Content-Type': 'application/json'
};

axios.post('https://postgrest-api.mainnet.dandelion.link/rpc/get_tx_history_for_addresses', data, {headers})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });
*/

axios.get('https://postgrest-api.mainnet.dandelion.link')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });
  console.log("testing dates", Date.now(), new Date(), new Date("Mon Feb 11 2023 11:47:00 GMT+0200 (South Africa Standard Time)").getTime())
  try {
      let { data, error, status } = await supabase
        .from('contributions')
        .select()
        .ilike('task_label', '%Content%')
        
      if (error && status !== 406) throw error

      if (data) {
          console.log(data)
      }
    } catch (error) {
      alert(error.message)
    }
 
  /* 
  axios.post('https://postgrest-api.mainnet.dandelion.link/rpc/get_metadata', {
  metadatum: "20201210"
})
.then(response => {
  // handle success
  console.log(response.data);
})
.catch(error => {
  // handle error
  console.log(error);
});
*/
/*
axios.get('https://postgrest-api.mainnet.dandelion.link/tx_metadata', {
  params: {
    id: "eq.15"
  }
})
.then(response => {
  // handle success
  console.log(response.data);
})
.catch(error => {
  // handle error
  console.log(error);
});
*/
/*
axios.get('https://postgrest-api.mainnet.dandelion.link/tx_metadata', {
  params: {
    "json->>NetworkId": "eq.SPOCRA"
  }
})
.then(response => {
  // handle success
  console.log(response.data);
})
.catch(error => {
  // handle error
  console.log(error);
});
*/



//top works

/*
axios.get('https://postgrest-api.mainnet.dandelion.link/stake_registration', {
    params: {
        addr_id: 'eq.4531831',
        select: 'epoch_no, tx_id, addr_id'
    }
}).then(response => {
    console.log('stake_registration', response.data);
}).catch(error => {
    console.log(error);
});

axios.get('https://postgrest-api.mainnet.dandelion.link/tx_out', {
    params: {
        tx_id: 'eq.54375340',
        stake_address_id: 'eq.5068666', 
        //address: 'eq.addr1qxhxg0mwzahfv8x4nr5s9zmffssxueqsnxxv282kz2c30nykg8fw8x99crukwyc7yftwfgxmhsu2xx0n8elfvj7mljlqm45kgs',
        select: 'stake_address_id, value, address'
    }      // nice one, check the length and get all the values, then subtract from out_sum to get total out.
}).then(response => {
    console.log('tx_out', response.data ) 
}).catch(error => {
    console.log(error);
});

axios.get('https://postgrest-api.mainnet.dandelion.link/tx', {
    params: {
        hash: 'eq.\\x6ecc4f84cc9498112520fcbc23c728e33a2034c3ae3ad75c9b80dcdc074634a6',
        select: 'id, out_sum, fee'
    }
}).then(response => {
    console.log( 'tx', response.data ) 
}).catch(error => {
    console.log(error);
});

axios.get('https://postgrest-api.mainnet.dandelion.link/reward', {
    params: {
        addr_id: 'eq.5068666',
        select: 'amount, earned_epoch, spendable_epoch'
    }
}).then(response => {
    console.log('reward', response.data ) 
}).catch(error => {
    console.log(error);
});
*/
const store = useStore()

</script>
<template>
    <div>
        Dashboard
        {{ store.name }}
        {{ store.number }}
    </div>
    <div>
        <button @click="txs()">Update Transactions</button>
    </div>
</template>