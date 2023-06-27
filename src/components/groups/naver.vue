<template>
  <div>

    <button @click="authorize">Authorize with Naver</button>
  </div>
</template> 

<script>
import axios from 'axios';

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
    let state = ""
    const self = this
    self.$axios.get("http://localhost:8181/api/naver/go")
    .then(function(res){
      if(res.status == 200){
        state = res.data.state
      

      } else {
        alert(res.status)
      
      }
    })
    let apiURL = "https://nid.naver.com/oauth2.0/authorize?response_type=code";
        apiURL += "&client_id=" + clientId;
        apiURL += "&redirect_uri=" + redirectURI;
        apiURL += "&state=" + state;
       self.$axios.get(apiURL)
        .then(function(res){
          if(res.status==200){
            alert(res.data)
          }
        })
  }
  }
}   
    

</script>

<style lang="">
    
</style>