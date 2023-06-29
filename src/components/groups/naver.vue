<template>
  <div>

    <button @click="authorize">Authorize with Naver</button>
    <button class="btn btn-primary btn-lg" style="border:none; background-color:#7AC6FF" v-on:click="calendar">calendar</button>
  </div>
</template> 

<script>
import axios from 'axios';
import { Alert } from 'bootstrap';

export default {
  data(){
    return{

    }
  },
  created:function(){ 
  },
 
  methods: {  
 
  authorize(){
    let clientId = "IiiFJKBOyzL3qvfXasPq"
    let redirectURI = "http://localhost:8181/api/naver/callback"

    const self = this
    self.$axios.get("http://localhost:8181/api/naver/go")
    .then(function(res){
      if(res.status == 200){
        alert(res.data.state)
        let state = res.data.state
        let apiURL = "https://nid.naver.com/oauth2.0/authorize?response_type=code";
            apiURL += "&client_id=" + clientId;
            apiURL += "&redirect_uri=" + redirectURI;
            apiURL += "&state=" + state;
        
           window.location.href=apiURL

      } else {
        alert(res.status)
      
      }
    })
  },
  calendar(){
    this.$axios.get('http://localhost:8181/api/naver/callback')
    .then(function(res){
      if(res.status == 200){
        alert(res.data)
        $axios.get('http://localhost:8181/api/naver/calendar')
        .then(function(res){
          if(res.status == 200){
            alert(res.data)
          }
        })
      }
    })
  }

  }
}   
    

</script>

<style lang="">
    
</style> -->
<template>
  <div>
    <button @click="login">Login</button>
  </div>
</template>

<script>
export default {
  mounted() {
    const clientId = 'IiiFJKBOyzL3qvfXasPq';
    const callbackUrl = 'http://localhost:8081/calendar';

    // Load Naver login script
    const script = document.createElement('script');
    script.src = 'https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js';
    script.charset = 'utf-8';
    document.head.appendChild(script);

    // Initialize Naver login
    script.onload = () => {
      const naverIdLogin = new window.naver_id_login(clientId, callbackUrl);
      this.naverIdLogin = naverIdLogin;
    };
  
  },
  methods: {
    login() {
      // Print access token value
      console.log(this.naverIdLogin.oauthParams.access_token)
      const access_token = this.naverIdLogin.oauthParams.access_token;
      // Retrieve Naver user profile
      let formData = new FormData()
      formData.append('access_token', access_token)
      
      this.$axios.get('http://localhost:8181/api/naver/calendar', {headers:{'access_token':access_token}})
      .then(function(res){
        if(res.status == 200){
          alert('complete')
          console.log(res.data)
        }
      })
      
  
  }}

};
</script>