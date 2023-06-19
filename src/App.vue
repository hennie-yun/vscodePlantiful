<template>
        <nav>
     
          <div v-if="loginId == null">
            <router-link to="/join">회원가입</router-link> |
            <router-link to="/login">로그인</router-link> |
            <router-link to="/calendar">달력</router-link> 
          </div>
     
        </nav>
        <router-view/>
</template>
<script>



export default {
  data() {
    return {
      loginId: null,
      type: 0
    }
  },
  created: function () { // 이 컴포넌트가 시작될때 실행되는 함수
    this.loginId = sessionStorage.getItem('loginId')
    let type = sessionStorage.getItem('type')
    if (type == null) {
      this.type = 0
    } else {
      this.type = type
      if (type == 1) {
        this.$router.push('/orderhome')
      } else if (type == 2) {
        this.$router.push('/shophome')
      }
    }
    alert(this.type)
  },
  methods: {
    logout() {
      //const self = this;
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('loginId')
      sessionStorage.removeItem('type')
      location.href = '/'
      //self.$router.push('/login')
    },
    out() {
      const self = this
      let token = sessionStorage.getItem('token')
      this.loginId = sessionStorage.getItem('loginId')
      self.$axios.delete('/members/' + this.loginId, { Headers: { 'token': token } })
        .then(function (res) {
          if (res.status == 200) {
            if (res.data.flag == true) {
              alert('탈퇴완료')
              // sessionStorage.removeItem('token')
              // sessionStorage.removeItem('loginId')
              // location.reload()
              self.logout()
            } else {
              alert('탈퇴 오류')
            }
          } else {
            alert('에러코드:' + res.status)
          }
        })
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
</style>