<script setup>
  import { supabase } from '../supabase'
  import { onMounted, ref, toRefs } from 'vue'

  const props = defineProps(['session'])
  const { session } = toRefs(props)

  const loading = ref(true)
  const full_name = ref('')
  const website = ref('')
  const avatar_url = ref('')

  onMounted(() => {
    getProfile();
  })

  async function getProfile() {
    try {
      loading.value = true
      const { user } = session.value

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) throw error 

      if (data) {
        full_name.value = user.user_metadata.full_name
        avatar_url.value = user.user_metadata.avatar_url
      } else { updateProfile()}
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }

  async function updateProfile() {
    try {
      loading.value = true
      const { user } = session.value
      console.log('Updating')

      const updates = {
        id: user.id,
        full_name: user.user_metadata.full_name,
        avatar_url: user.user_metadata.avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) throw error
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
  const { error } = await supabase.auth.signOut()
}
</script>

<template>
  <div>
  <form class="form-widget" @submit.prevent>
    <div>
      <label for="avatar_url">Profile</label>
      <img
      :src="session.user.user_metadata.avatar_url"
      alt="Avatar"
      class="avatar image"
      :style="{ height: 10 + 'em', width: 10 + 'em' }"
    />
    </div>
    <div>
      <label for="email">Email</label>
      <input id="email" type="text" :value="session.user.email" disabled />
    </div>
    <div>
      <label for="full_name">Name</label>
      <input id="full_name" type="text" v-model="full_name" disabled />
    </div>

    <div>
      <button class="button block" @click="signOut" :disabled="loading">
        Sign Out
      </button>
    </div>
  </form>
  </div>
</template>