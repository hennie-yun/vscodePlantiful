import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SubscribeBoardList from '../components/subscribeboard/SubscribeBoardList.vue'
import SubscribeBoardMyList from '../components/subscribeboard/SubscribeBoardMyList.vue'
import SubscribeBoardAdd from '../components/subscribeboard/SubscribeBoardAdd2.vue'
import SubscribeBoardDetail from '../components/subscribeboard/SubscribeBoardDetail.vue'
import SubscribeBoardDetailR from '../components/subscribeboard/SubscribeBoardDetailR.vue'
import SubscribePartyDetail from '../components/subscribeparty/SubscribePartyDetail.vue'
import login from '../components/members/login.vue'
import AfterLogin from '../components/AfterLogin.vue'
import calendar from '../components/calendars/calendar.vue'
import mypage from '../components/members/mypage.vue'
import editinfo from '../components/members/editinfo.vue'
import group from '../components/groups/group.vue'
import naver from '../components/groups/naver.vue'
import navercalendar from '../components/groups/navcalendar.vue'
import naverlogin from '../components/groups/naverlogin.vue'
import naveraccess from '../components/groups/naveraccess.vue'
import payment from '../components/pay/payment.vue'
import kakaojoin from '../components/members/kakaojoin.vue'
import naverjoin from '../components/groups/naverjoin.vue'

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
    path: "/kakaojoin",
    name: 'kakaojoin',
    component: kakaojoin
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
      },
      {
        path:'/naver',
        name: 'naver',
        component: naver
      },
      {
        path:'/navercalendar',
        name: 'navercalendar',
        component: navercalendar
      },
      {
        path: "/naverlogin",
        name: "naverlogin",
        component: naverlogin
      },
      {
        path: "/naveraccess",
        name: "naveraccess",
        component: naveraccess
      },
      {
        path : '/concertlist',
        name : 'concertlist',
        component : () => import('@/components/concert/concertList.vue'),
        props: true,
      },
      {
        path : '/concertdetail',
        name : 'concertdetail',
        component : () => import('@/components/concert/concertDetail.vue'),
        props: true,
      },
      {
        path: "/naverjoin",
        name: "naverjoin",
        component: naverjoin
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (from.name === null && sessionStorage.getItem('currentPage')) {
    const currentPage = sessionStorage.getItem('currentPage')
    next({ path: currentPage })
  } else {
    sessionStorage.setItem('currentPage', from.path)
    next()
  }
});

export default router