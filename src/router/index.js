import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SubscribeBoardList from '../components/subscribeboard/SubscribeBoardList.vue'
import SubscribeBoardMyList from '../components/subscribeboard/SubscribeBoardMyList.vue'
import SubscribeBoardAdd from '../components/subscribeboard/SubscribeBoardAdd2.vue'
import SubscribeBoardDetail from '../components/subscribeboard/SubscribeBoardDetail.vue'
import SubscribeBoardDetailR from '../components/subscribeboard/SubscribeBoardDetailR.vue'
import SubscribePartyDetail from '../components/subscribeparty/SubscribePartyDetail.vue'
import login from '../components/members/login.vue'
import join from '../components/members/join.vue'
import AfterLogin from '../components/AfterLogin.vue'
import calendar from '../components/calendars/calendar.vue'
import mypage from '../components/members/mypage.vue'
import newpwd from '../components/members/newpwd.vue'
import editinfo from '../components/members/editinfo.vue'
import group from '../components/groups/group.vue'
import payment from '../components/pay/payment.vue'

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
      },
      {
        path: '/SubscribeBoardMyList',
        name: 'SubscribeBoardMyList',
        component: SubscribeBoardMyList
      },
      {
        path: '/SubscribeBoardDetail',
        name: 'SubscribeBoardDetail',
        component: SubscribeBoardDetail
      },
      {
        path: '/SubscribeBoardDetailR',
        name: 'SubscribeBoardDetailR',
        component: SubscribeBoardDetailR
      },
      
      {
        path: '/SubscribePartyDetail',
        name: 'SubscribePartyDetail',
        component: SubscribePartyDetail
      },
      {
        path: '/mypage',
        name: 'mypage',
        component: mypage
      },
      {
        path: '/newpwd',
        name : 'newpwd',
        component : newpwd
      },
      {
        path : '/editinfo',
        name : 'editinfo',
        component : editinfo
      },
      {
        path: '/group',
        name: 'group',
        component: group
      },
      {
        path: '/chatroom',
        name: 'chat',
        component: () => import('../components/chat/ChattingRoom.vue')
      },
      {
        path : '/chatlist',
        name : 'chatlist',
        component : () => import('../components/chat/ChatList.vue')
      },
      {
        path:'/payment',
        name: 'payment',
        component: payment
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router