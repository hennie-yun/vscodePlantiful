<template>
  <div>
    <Navbar v-if="loginId!=null">
      <router-link to="/calendar">달력</router-link> |
      <router-link to="/SubscribeBoardList">구독</router-link> |
      <router-link to="/mypage">마이페이지</router-link>|
      <router-link to="/editinfo">내 정보 수정</router-link>|
      <router-link to="/group">그룹</router-link>|
      <router-link to="/naver">확인</router-link>
      <router-link to="/chatlist">채팅</router-link>|
      <button v-on:click="logout">로그아웃</button> |
      <router-link to="/payment">결제</router-link>|
      <v-btn @click="openMenu($event)" :color="active ? 'primary' : undefined"
        icon="mdi-format-list-checks" v-click-outside="{handler:closeMenu, include}">
        </v-btn>
        <div id="checkList">
          <!-- <v-list-item v-for="(sl, index) in arr" :key="index">
            <v-checkbox hide-details density="compact" :label="sl.text" v-model="sl.status" :value="index" 
            :bind="{ 'is-selected': sl.status }" :class="{ 'is-selected': sl.status }"></v-checkbox>
          </v-list-item> -->
        </div>
        
    </NavBar>
    <RouterView></RouterView>
  </div>
  <div id="todoList" v-show="active" contenteditable @input="updateText($event)" 
    class="included text-left"> 
    {{ textTemp }}  
  </div>
</template> 


<script>
import NavBar from '@/components/outline/nav.vue'

export default {
  name: 'app',
  components: { NavBar },
  data() {
    return {
      loginId: null
    }
  },
  created() {
    this.loginId = sessionStorage.getItem('loginId')
    console.log(this.loginId);
  },
  methods: {
    logout() {
      console.log("logout")
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('loginId')
      location.href = '/';
    }   
  }
}


</script>