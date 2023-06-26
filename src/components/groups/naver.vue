<template>
    <div>
        <div>hello</div>
      <button @click="signInWithNaver">Sign In with Naver</button>
    
    </div>
  </template>
  
  <script>
  export default {
   mounted() {
    const script = document.createElement('script')
    script.src = 'https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js'
    script.async = true
    script.charset = 'utf-8'
    document.head.appendChild(script)
    
    script.onload = () => {
    const naver_id_login = new window.naver_id_login("IiiFJKBOyzL3qvfXasPq", "http://localhost:8181/api/naver/callback")
    alert(naver_id_login.oauthParams.access_token)
    this.$axios.get('http://localhost:8181/api/naver/accesstoken', {headers:{'access_token':naver_id_login.oauthParams.access_token}})
     .then(function(res){

        if(res.status == 200){
            alert(res.data.flag)
        } else {
            alert(res.data.flag)
        }
     })
    }
   
},
name: 'naver',
methods: {
    signInWithNaver(){
        const naver_id_login = new window.naver_id_login("IiiFJKBOyzL3qvfXasPq", "http://localhost:8181/api/naver/callback")
        alert(naver_id_login.oauthParams.access_token)
    }
},
  };
  </script>
<style lang="">
    
</style>