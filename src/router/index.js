import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SubscribeBoardList from '../components/subscribeboard/SubscribeBoardList.vue'
import SubscribeBoardAdd from '../components/subscribeboard/SubscribeBoardAdd.vue'
import SubscribeBoardDetail from '../components/subscribeboard/SubscribeBoardDetail.vue'
import Calendar from '../components/calendars/calendar'
import login from '../components/members/login.vue'
import join from '../components/members/join.vue'
import test from '../components/subscribeboard/test.vue'
import AfterLogin from '../components/AfterLogin.vue'
import calendar from '../components/calendars/calendar.vue'

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: '/test',
    name:'test',
    component: test
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