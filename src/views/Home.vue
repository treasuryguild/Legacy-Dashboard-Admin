<script setup>
import { useStore } from '../store/index'
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { useUpdateWallets } from '../composables/updatewallets'
import { useUpdateGroups } from '../composables/updategroups'

const store = useStore()
const getGroups = ref([])
const getProjects = ref([])

const loading = ref(true)

const session = ref()
const full_name = ref('')
const avatar_url = ref('')
const user_id = ref('')

const andre = ref(false)
const miro = ref(false)

onMounted(() => {
    supabase.auth.getSession().then(({ data }) => {
      session.value = data.session
      if (session.value) {
        getProfile()
        //downloadImage()
        console.log(data.session.user.user_metadata.full_name)
      }
    })

    supabase.auth.onAuthStateChange((_, _session) => {
      session.value = _session
    })
  })

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
  } else if (user_id.value == "8acfcf02-533f-4ea2-8baa-2b91b8be82d9") {
    miro.value = true
  }
}

async function groups() {
  const { status } = await useUpdateGroups()
  console.log(status.value)
}

async function wallets() {
  const { status } = await useUpdateWallets()
  console.log(status.value)
}

let numbers = [10, 20, 30, 40];
let compareTo = 25;

let closestNum = numbers[0];
let closestDiff = Math.abs(numbers[0] - compareTo);

for (let i = 1; i < numbers.length; i++) {
  let diff = Math.abs(numbers[i] - compareTo);
  if (diff < closestDiff) {
    closestDiff = diff;
    closestNum = numbers[i];
  }
}

console.log(closestNum); // 30

</script>
<template>
  <main v-if="andre">
    <div>
        Home 
        {{ store.name }}{{ store.number }}{{ store.group }}{{ store.project }} 
    </div>
    <div>
        <button @click="store.changeName('Roberto')">Change name to Roberto</button>
    </div>
    <div>
        <button @click="store.changeNumber(2)">Change number to 2</button>
    </div>
    <div>
        <button @click="store.$reset">reset store</button>
    </div>
    <div>
        <button @click="groups()">Update Groups</button>
    </div>
    <div>
        <button @click="wallets()">Update Wallets</button>
    </div>
  </main>
</template>