<template lang="">
  <div>
    <div id="naver_id_login"></div>
  </div>
</template>
<script>
export default {
    name:'naveraccess',
    mounted(){
     
    // Load the Naver login script dynamically
    const script = document.createElement('script');
    script.src = 'https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js';
    script.charset = 'utf-8';
    document.head.appendChild(script);

    // Initialize the Naver login button
    script.onload = () => {
      window.naverLogin = new naver.LoginWithNaverId({
        clientId: 'IiiFJKBOyzL3qvfXasPq',
        callbackUrl: 'http://localhost:8182/naverlogin',
        isPopup: false,
        callbackHandle: false,
      });
      window.naverLogin.init();
    }
},
  methods: {
    loginWithNaver() {
      // Trigger the Naver login process
      window.naverLogin.login();
    },
  },
    }

</script>
<style lang="">
    
</style>