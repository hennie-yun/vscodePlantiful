<template lang="">

    <div>
        <img id="naverIdLogin" :src="require('@/assets/image/naverlogin.png')" @click="naverlogin" />
      </div>

</template>
<script>
export default {
    name:'naveraccess',
    mounted(){
    
    },
  methods: {
  naverlogin(){
    let client_id = "IiiFJKBOyzL3qvfXasPq"
    let redirect_uri = encodeURIComponent("http://localhost:8182/naverjoin", "UTF-8")
    const state = this.generateRandomState()
    const apiURL = "https://nid.naver.com/oauth2.0/authorize?response_type=code"
    + "&client_id="+client_id
    + "&redirect_uri="+redirect_uri
    + "&state="+state
    window.location.href=apiURL
  },
  // state 생성
generateRandomState() {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let state = "";

      for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        state += characters.charAt(randomIndex);
      }

      return state;
    }
    }
  }

</script>
<style scoped>
    img {
      height: 50px;
    }
</style>