import { createRouter, createWebHistory } from 'vue-router'
//로그인 페이지 보이게 homeview를 로그인 페이지로 설정 
import Homeview from '../components/members/login.vue'
import SubscribeBoardList from '../components/subscribeboard/SubscribeBoardList.vue'
import SubscribeBoardAdd from '../components/subscribeboard/SubscribeBoardAdd.vue'
import SubscribeBoardDetail from '../components/subscribeboard/SubscribeBoardDetail.vue'
import Calendar from '../components/calendars/calendar'
import login from '../components/members/login.vue'
import join from '../components/members/join.vue'
import test from '../components/subscribeboard/test.vue'

const routes = [
  // 제일처음 시작할때 나올 로그인 화면 
  {
    path: '/',
    name: 'home',
    component: Homeview
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
    path: '/calendar',
    name: 'calendar',
    component: Calendar
  },
  {
    path: "/join",
    name: 'join',
    component: join
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
  },
  {
    path: '/SubscribeBoardDetail',
    name: 'SubscribeBoardDetail',
    component: SubscribeBoardDetail
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router
