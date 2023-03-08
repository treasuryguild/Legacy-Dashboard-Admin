<script setup>
  import { useStore } from '../store/index';
  import { supabase } from '../supabase'
  import { onMounted, ref } from 'vue'  
  import { useRoute } from 'vue-router'

//CSS javascript below
var count = 1
setTimeout(demo, 500)
setTimeout(demo, 700)
setTimeout(demo, 900)
setTimeout(reset, 2000)

setTimeout(demo, 2500)
setTimeout(demo, 2750)
setTimeout(demo, 3050)

var mousein = false
function demo() {
   if(mousein) return
   document.getElementById('demo' + count++)
      .classList.toggle('hover')
}

function demo2() {
   if(mousein) return
   document.getElementById('demo2')
      .classList.toggle('hover')
}

function reset() {
   count = 1
   var hovers = document.querySelectorAll('.hover')
   for(var i = 0; i < hovers.length; i++ ) {
      hovers[i].classList.remove('hover')
   }
}

document.addEventListener('mouseover', function() {
   mousein = true
   reset()
})
//CSS javaScript above

//Navbar javascript below
  const route = useRoute()
  const store = useStore()

  const loadGroup = ref(false)
  const loading = ref(true)
  const full_name = ref('')
  const avatar_url = ref('')

  const group_project_name = ref([])
  const group_updated_at = ref([])
  const groupname = ref([])
  const groupid = ref([])

  const selProject = ref ('')
  const selGroup = ref ('')
  
  const projectGroupId = ref()

  async function getProfile() {
    try {
      loading.value = true
      const { user } = session.value
        full_name.value = user.user_metadata.full_name
        avatar_url.value = user.user_metadata.avatar_url
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }


const session = ref()

  onMounted(() => {
    supabase.auth.getSession().then(({ data }) => {
      session.value = data.session
      if (session.value) {
        getProfile()
        getGroups()
        //downloadImage()
        console.log(data.session.user.user_metadata.full_name)
      }
    })

    supabase.auth.onAuthStateChange((_, _session) => {
      session.value = _session
    })
  })

  async function getGroups() {
    
    try {
      loading.value = true

      let { data, error, status } = await supabase
        .from('groups')
        .select(`group_id, group_name, updated_at`)
        
      if (error && status !== 406) throw error

      if (data) {
        for (let j in data) {
          groupid.value.push(data[j].group_id)
          group_updated_at.value.push(data[j].updated_at)
          groupname.value.push(data[j].group_name)
        }
      }
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }


async function onChange(i) {
    loadGroup.value = true
    selGroup.value = `${i}`
    group_project_name.value = []
    store.changeProject('')
    store.changeGroup(i)
    for (let j in groupname.value) {
      if (groupname.value[j] == i) {
         projectGroupId.value = groupid.value[j]
      }
    }
    try {
      loading.value = true

      let { data, error, status } = await supabase
        .from('projects')
        .select(`project_name`)
        .eq('group_id', projectGroupId.value)
        
      if (error && status !== 406) throw error

      if (data) {
        for (let j in data) {
          group_project_name.value.push(data[j].project_name)
        }
      }

    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
    
    window.scrollTo(0, 0);
}

function onChange2(i) { 
    selProject.value = `/${selGroup.value}/${i}`
    store.changeProject(i)
    window.scrollTo(0, 0);
}

function onChange3() {
  loadGroup.value = false
}

</script>

<template>
    <nav>
		<menu>
         <menuitem @click="store.$reset"><RouterLink to="/" @click="onChange3()">Home</RouterLink></menuitem>
			<menuitem id="demo1">
				<a>Search</a>
				<menu>
               <menuitem><RouterLink to="/wallet">Wallet</RouterLink></menuitem>
					<menuitem id="demo2">
						<a>Groups</a>
						<menu>
                     <menuitem id="demo3"><RouterLink :to="`/search/${i}`" v-for="i in groupname" :key="i.id" @click="onChange(i)">{{ i }}</RouterLink></menuitem>
						</menu>
					</menuitem>
               <menuitem id="demo2">
						<a>Projects</a>
						<menu>
                     <menuitem v-if="loadGroup" id="demo3"><RouterLink :to="`/search/${selGroup}/${i}`" v-for="i in group_project_name" :key="i.id" @click="onChange2(i)">{{ i }}</RouterLink></menuitem>
                     <menuitem v-else id="demo3"><a>Select Group</a></menuitem>
						</menu>
					</menuitem>
				</menu>
			</menuitem>
		</menu>
	</nav>
   <div class="navcont">
    <p v-if="session"> {{ full_name }}</p>
    <p v-else >Please sign in</p>
    <RouterLink to="/profile">
      <img
          v-if="session"
          :src="session.user.user_metadata.avatar_url"
          alt="Avatar"
          class="Avatar"
          :style="{ height: 2 + 'em', width: 2 + 'em' }"
        />
        <img
          v-else
          src='https://live.staticflickr.com/5204/5281085864_614284bbd0.jpg'
          alt="Avatar"
          class="Avatar"
          :style="{ height: 2 + 'em', width: 2 + 'em' }"
        />
    </RouterLink>
    </div>
</template>

<style scoped>
html, body{
   padding:0px;
   margin:0px;
   background:#191A1D;
   font-family: 'Karla', sans-serif;
   width:100vw;
}
body * {
   margin:0;
   padding:0;
}

/* HTML Nav Styles */
/* HTML Nav Styles */
/* HTML Nav Styles */
nav menuitem {
   position:relative;
   display:block;
   opacity:0;
   cursor:pointer;
}

nav menuitem > menu {
   position: absolute;
   pointer-events:none;
}
nav > menu { display:flex; }

nav > menu > menuitem { pointer-events: all; opacity:1; }
menu menuitem a { white-space:nowrap; display:block; }
   
menuitem:hover > menu {
   pointer-events:initial;
}
menuitem:hover > menu > menuitem,
menu:hover > menuitem{
   opacity:1;
}
nav > menu > menuitem menuitem menu {
   transform:translateX(100%);
   top:0; right:0;
}
/* User Styles Below Not Required */
/* User Styles Below Not Required */
/* User Styles Below Not Required */

nav { 
   margin-top: 40px;
   margin-left: 40px;
}

nav a {
   background:rgb(23, 74, 193);
   color:#FFF;
   min-width:190px;
   transition: background 0.5s, color 0.5s, transform 0.5s;
   margin:0px 6px 6px 0px;
   padding:8px 40px;
   box-sizing:border-box;
   border-radius:3px;
   box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
   position:relative;
}

nav a:hover:before {
   content: '';
   top:0;left:0;
   position:absolute;
   background:rgba(0, 0, 0, 0.2);
   width:100%;
   height:100%;
}

nav > menu > menuitem > a + menu:after{
   content: '';
   position:absolute;
   border:10px solid transparent;
   border-top: 10px solid white;
   left:12px;
   top: -30px;  
}
nav menuitem > menu > menuitem > a + menu:after{ 
   content: '';
   position:absolute;
   border:10px solid transparent;
   border-left: 10px solid white;
   top: 10px;
   left:-180px;
   transition: opacity 0.6, transform 0s;
}

nav > menu > menuitem > menu > menuitem{
   transition: transform 0.6s, opacity 0.6s;
   transform:translateY(150%);
   opacity:0;
}
nav > menu > menuitem:hover > menu > menuitem,
nav > menu > menuitem.hover > menu > menuitem{
   transform:translateY(0%);
   opacity: 1;
}

menuitem > menu > menuitem > menu > menuitem{
   transition: transform 0.6s, opacity 0.6s;
   transform:translateX(195px) translateY(0%);
   opacity: 0;
} 
menuitem > menu > menuitem:hover > menu > menuitem,  
menuitem > menu > menuitem.hover > menu > menuitem{  
   transform:translateX(0) translateY(0%);
   opacity: 1;
}
.navcont {
  display: flex;
  justify-content: flex-end;
}
p {
  margin: 1em;
}
.Avatar {
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  margin: 0.7em;
}
.Avatar:hover {
  filter: brightness(1.2);
  transform: scale(1.2);
  border: 2px solid #65b5f6;
}
</style>