<template>
  <div>
    
    <button v-on:click="token">네이버 연동하기</button>
  </div>
</template>

<script>



export default {
  name: 'naver',
  

  data(){
    return {
      code: '',
      state: ''
    }
  },
  mounted() {
    
   this.token()
    
  },
  methods: {
    token(){
      var link = document.location.href.split("?")[1]
       let code = link.split("=")[1].split("&")[0]
       let state = link.split("&")[1].split("&")[0].split("=")[1]
    
      console.log(code)
      console.log(state)
      console.log("click"+code)
      console.log("click"+state)
      

      let formData = new FormData()
      formData.append("code", code)
      formData.append("state", state)

      const CLIENT_ID = "IiiFJKBOyzL3qvfXasPq"
      const CLIENT_SECRET = "PtvyRoMmt_";
      
      const redirectURI = encodeURIComponent("http://localhost:8181/api/naver/callback");
      let apiURL = "https://nid.naver.com/oauth2.0/token?"

      apiURL += "grant_type=authorization_code&";
      apiURL += "client_id=" + CLIENT_ID;
      apiURL += "&client_secret=" + CLIENT_SECRET;
      apiURL += "&redirect_uri=" + redirectURI;
      apiURL += "&code=" + code;
      apiURL += "&state=" + state;
     
     
    //location.href = apiURL

      this.$axios.get(apiURL)
      .then(function(res){
        alert(res.data)
    })
       
      //   this.$axios.get("http://localhost:8181/api/naver/calendar")
      //     .then(function(res){
      //       console.log(res.data)
      // })

    }  
    }
  
  

};
</script>
<style scoped>
@font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 00;
    font-style: normal;
}
</style>