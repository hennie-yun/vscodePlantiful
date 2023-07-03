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
let str = ''

export default {
name: 'app',
  data() {
    return {
      loginId: null,
      // loginId : sessionStorage.getItem('loginId'),
      textTemp : str,
      active : false,
      arr : []
    }
  },

  created:function () {
    this.loginId = sessionStorage.getItem('loginId')
    let self = this
      self.$axios.get('http://localhost:8181/todolist/'+this.loginId)
        .then((ret) => {
          this.textTemp = ret.data.dto.text 
          str = ret.data.dto.text
        })
  },

  methods: {
    logout() {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('loginId')
      location.href = '/';
    },

    updateText(e){
        let inputText = e.target.innerText;
        str = inputText
      },

    openMenu(value) {
      if(typeof value === 'boolean') {
        this.active = value
      } else {
        this.active = !this.active
        let div = document.getElementById("todoList")
        div.style.top = "0px"
        // div.style.left = "0px"
        div.style.top = 150 + "px"
        // div.style.float = 1250 + "px"
        // div.style.top = x + "px"
        // div.style.left = y + "px"
      } 

      if(!this.active) this.saveText()
    },

    include () {
      return [document.querySelector('.included')]
    },

    closeMenu() {
      if(this.active) {
        this.saveText()
      }

      this.active = false
    },
    
    saveText() {
      let self = this
      let formData = new FormData()
      formData.append('email', this.loginId)
      formData.append('text', str)
      self.$axios.post('http://localhost:8181/todolist', formData)
      .then((ret)=> {
        this.textTemp = ret.data.dto.text
        str = ret.data.dto.text
      })
    },
  }, 

  watch : {
    textTemp : {
      handler : function() {
        this.arr = []
        let ret = this.arr.find((elem) => {
          return elem === 'undefined'
        })

        let ret2 = false
        this.arr.forEach((elem) => {
          if(elem.legnth == 0)
          ret2 = false
        })

        if(!ret || !ret2) {
          let newArr = str.split("\n")
          for(let singleLine of newArr) {
            let sl = {text : singleLine, status : null}
            this.arr.push(sl)
          }
        }
      }, 

      immediate : false
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

#todoList {
  width: 270px;
  height: 250px;
  left : 85%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #f8d374;
  white-space: pre;
  position: absolute;
  opacity: 1;
}

.is-selected label {
  text-decoration: line-through;
}

.input-group--active label {
  text-decoration: line-through;
}
</style>