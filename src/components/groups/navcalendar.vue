<template lang="">
    <div id="naverIdLogin">
      
    </div>
</template>
<script>
export default {
    mounted() {
        const naverScript = document.createElement("script");
        naverScript.src = "https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js";
        naverScript.type = "text/javascript";
        document.head.appendChild(naverScript);

        naverScript.onload = () => {
           var naverIdLogin = new naverIdLogin("IiiFJKBOyzL3qvfXasPq", "http:localhost:8182/calendar")
           alert(naverIdLogin.oauthParams.access_token)    
            naverIdLogin.get_naver_userprofile(naverSignInCallback())
        function naverSignInCallback(){
            alert(naverIdLogin.getProfileData('email'))
            alert(naverIdLogin.getProfileData('nickname'))
            alert(naverIdLogin.getProfileData('age'))
        }
        }
        }
    }
    </script>
    <style>
  #naverIdLogin {
    display: none;

}
</style>