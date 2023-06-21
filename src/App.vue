<template>
  <div>
    <Navbar v-if="loginId!=null">
      <router-link to="/calendar">달력</router-link> |
      <router-link to="/SubscribeBoardList">구독</router-link>
    </NavBar>
    <RouterView></RouterView>
  </div>
</template> 

<script>
export default {
name: 'app',
  data() {
    return {
      loginId: null,
    }
  },
  created:function () {
    this.loginId = sessionStorage.getItem('loginId')
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