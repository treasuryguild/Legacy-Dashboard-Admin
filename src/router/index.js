import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Wallet from '../views/Wallet.vue'
import ProjectView from '../views/ProjectView.vue'
import GroupView from '../views/GroupView.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/dashboard', component: Dashboard },
    { path: '/wallet', component: Wallet },
    { path: '/search/:group', component: GroupView },
    { path: '/search/:group/:project', component: ProjectView }
]

const history = createWebHistory()

const router = createRouter({
    history,
    routes
})

export default router;