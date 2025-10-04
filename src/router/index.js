import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'


const routes = [
  { path: '/', component: HomeView },
  { path: '/table/:id', component: HomeView }
]

const router = createRouter({
  history: createWebHistory('/Coral-Coffee/'),
  routes
})

export default router
