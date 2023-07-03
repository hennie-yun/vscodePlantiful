<template lang="">
    <div>
        <p>Naver Login Access Pages</p>
    </div>
</template>
<script>
export default {
    
    name: 'naverlogin',
    mounted() {
    const script = document.createElement('script');
    script.src = 'https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js';
    script.charset = 'utf-8';
    document.head.appendChild(script);

    // Initialize the Naver login button
    
    new window.naver_id_login("Client Id", "callback URL");
    console.log("access token", naver_id_login.getAccessToken()); // 정상적 로그인이 된 경우 access token값 출력
      
},
}
</script>
<style lang="">
    
</style>