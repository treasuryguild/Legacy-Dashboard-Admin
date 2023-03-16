<script setup>
  import { ref, onMounted } from 'vue'
  import { supabase } from '../supabase'
  import { useRoute } from 'vue-router'
  import { useStore } from '../store/index';
  import { useGetAllTransactions } from '../composables/updatetransactions'
  import { useGetFees } from '../composables/getfees'
  import { useGetBalances } from '../composables/getbalances'
  import { useGetTxAmounts } from '../composables/gettxamounts'
  import { useDeleteProjectTxs } from '../composables/deleteprojecttxs'
  import { useDeleteLatestTxs } from '../composables/deletelatesttxs'

  const store = useStore()
  const route = useRoute()

  const session = ref()
  const full_name = ref('')
  const avatar_url = ref('')
  const user_id = ref('')

  const andre = ref(false)
  const miro = ref(false)

  const project_id = ref()
  const wallet = ref()
  const loading = ref(true)

  const group = route.params.group
  const project = route.params.project

  onMounted(() => {
    supabase.auth.getSession().then(({ data }) => {
      session.value = data.session
      if (session.value) {
        getProfile()
        getProjectId()
        //downloadImage()
        console.log(data.session.user.user_metadata.full_name)
      }
    })

    supabase.auth.onAuthStateChange((_, _session) => {
      session.value = _session
    })
  })

  async function getProjectId() {
        
        try {
          loading.value = true
    
          let { data, error, status } = await supabase
            .from('projects')
            .select(`project_id, wallet`)
            .eq('project_name', store.project)
            .single()
            
          if (error && status !== 406) throw error
          console.log(data)
          if (data) {
            project_id.value = data.project_id,
            wallet.value = data.wallet
          }
        } catch (error) {
          alert(error.message)
        } finally {
          loading.value = false
        }
      }

async function txs() {
  loading.value = true;
  const { status } = await useGetAllTransactions()
  console.log(status.value)
  loading.value = false;
  location.reload(true);
}

async function txs2() {
  loading.value = true;
  const { status } = await useGetAllTransactions()
  console.log(status.value)
  loading.value = false;
  location.reload(true);
}

async function fees() {
  const { status2 } = await useGetFees(project_id.value)
  console.log(status2.value)
}

async function balances() {
  const { status3 } = await useGetBalances(project_id.value, wallet.value)
  console.log(status3.value)
}

async function txamounts() {
  const { status4 } = await useGetTxAmounts(project_id.value)
  console.log(status4.value)
}

async function deleteLatestTxs() {
  const { status5 } = await useDeleteLatestTxs(project_id.value)
  console.log(status5.value)
  location.reload(true);
}

async function deleteProjectTxs() {
  const { status6 } = await useDeleteProjectTxs(project_id.value)
  console.log(status6.value)
  location.reload(true);
}

async function doEverything() {
  loading.value = true
  const { status } = await useGetAllTransactions()
  console.log(status.value)
  const { status2 } = await useGetFees(project_id.value)
  console.log(status2.value)
  const { status3 } = await useGetBalances(project_id.value, wallet.value)
  console.log(status3.value)
  const { status4 } = await useGetTxAmounts(project_id.value, store.project)
  console.log(status4.value)
  loading.value = false
  location.reload(true);
}
  
async function getProfile() {
    try {
      loading.value = true
      const { user } = session.value
        full_name.value = user.user_metadata.full_name
        avatar_url.value = user.user_metadata.avatar_url
        user_id.value = user.id
        console.log("user",user)
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
    if (user_id.value == "34d0bcdd-3872-499f-934d-a72d80582d1f") {
      andre.value = true
    } else if (user_id.value == "15c4ce56-0bbe-435e-8e56-2cdfc877804e") {
      miro.value = true
    }
  }
</script>

<template>
  <main>
    <h2>Project {{ store.project }}</h2>
  <div class="main">
  <div v-if="miro && !loading" class="buttonbox">
    <div>
        <button class="bigbutton" @click="doEverything()">Update Transactions</button>
    </div>
    <div>
          <button @click="txs2()">Dandelion is down Update tx Button</button>
    </div>
  </div>
  <div v-if="andre && !loading" class="buttonbox">
    <div>
      <div>
          <button @click="txs()">Update Transactions (Dandelion is down)</button>
      </div>
      <div>
          <button @click="fees()">Update Fees</button>
      </div>
      <div>
          <button @click="balances()">Update Balances</button>
      </div>
      <div>
          <button @click="txamounts()">Update tx amounts</button>
      </div>
    </div>
    <div>
      Refresh page before each delete and update
      <div>
          <button class="bigbutton" @click="doEverything()">Do everything</button>
      </div>
      Refresh page before each delete and update
      <div>
          <button class="bigbutton" @click="deleteLatestTxs()">Delete Latest project txs</button>
      </div>
      Refresh page before each delete and update
      <div>
          <button class="bigbutton" @click="deleteProjectTxs()">Delete all project txs</button>
      </div>
      <h2>If Balances are incorrect, make changes to load all txs</h2>
    </div>
  </div>
  <div v-if="loading" class="fade-in-out">Updating...</div>
  <div v-if="loading" class="stay"> Dont leave this window</div>
  </div>
  </main>
</template>

<style>

.main {
  display: flex;
  flex-wrap: wrap;
}

.bigbutton {
  color: aqua;
  width: 500px;
  height: 100px;
}
.buttonbox {
  display: flex;
  flex-wrap: wrap;
}
/* Define the animation */
@keyframes fade-in-out {
  0% { opacity: 0; } /* Start with 0% opacity */
  50% { opacity: 1; } /* Fade in to 100% opacity */
  100% { opacity: 0; } /* Fade out to 0% opacity */
}

/* Apply the animation to the text element */
.fade-in-out {
  margin: 1.0em;
  font-size: 2.5em;
  animation: fade-in-out 2s ease-in-out infinite; /* Use the defined animation */
}
.stay{
  margin: 1.0em;
  font-size: 2.5em;
  color:aqua
}
</style>
