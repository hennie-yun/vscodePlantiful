<template>
    <div>
      <button @click="kakaoLogout"> 카카오 로그아웃</button>
      <router-view></router-view>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AfterLogin',
    methods: {
    kakaoLogout() {
      const redirect_uri = 'http://localhost:8182/login';
      const clientId = 'd54083f94196531e75d7de474142e52e';
      const Auth_url = `https://kauth.kakao.com/oauth/logout?client_id=${clientId}&logout_redirect_uri=${redirect_uri}`;
      location.href = Auth_url;
    },
  }
  }
  </script>
  
  <style scoped>
  </style>