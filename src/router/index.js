import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SubscribeBoardList from '../components/subscribeboard/SubscribeBoardList.vue'
import SubscribeBoardAdd from '../components/subscribeboard/SubscribeBoardAdd.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/SubscribeBoardAdd',
    name: 'SubscribeBoardAdd',
    component:SubscribeBoardAdd
  },
  {
    path: '/SubscribeBoardList',
    name: 'SubscribeBoardList',
    component:SubscribeBoardList
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
