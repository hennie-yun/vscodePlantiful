import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SubscribeBoardList from '../components/subscribeboard/SubscribeBoardList.vue'
import SubscribeBoardAdd from '../components/subscribeboard/SubscribeBoardAdd.vue'
import login from '../components/members/login.vue'
import join from '../components/members/join.vue'
import AfterLogin from '../components/AfterLogin.vue'
import calendar from '../components/calendars/calendar.vue'

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: 'login',
    component: login
  },
  {
    path: "/join",
    name: 'join',
    component: join
  },
  {
    path: "/afterlogin",
    component: AfterLogin,
    children: [
      {
        path: "",
        component: HomeView,
      },
      {
        path: '/calendar',
        name: 'calendar',
        component: calendar
      },
      {
        path: '/SubscribeBoardAdd',
        name: 'SubscribeBoardAdd',
        component: SubscribeBoardAdd
      },
      {
        path: '/SubscribeBoardList',
        name: 'SubscribeBoardList',
        component: SubscribeBoardList
      }
    ]
  }
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router