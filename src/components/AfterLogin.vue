<template>
  <div>
    {{ email }} 로그인 성공 <br />
    <button @click="kakaoLogout"> 카카오 로그아웃</button><br />
    <button @click="kakaoout"> 카카오 탈퇴</button>
    <!-- <router-view></router-view> -->
  </div>
</template>
  
<script>
export default {
  name: 'AfterLogin',
  data() {
    return {
      email: this.$route.query.email,
            dto: {
                nickname: '',
                phone: '',
                email: ''
            }

    }
  },
  created: function () {
        let token = sessionStorage.getItem('token')
        this.email = sessionStorage.getItem('loginId')
        console.log(this.email);
        const self = this;
        self.$axios.get('http://localhost:8181/members/getmember/' + self.email, { headers: { 'token': token } })
            .then(function (res) {
                if (res.status == 200) {
                  self.dto = res.data.dto
                    if (self.dto != null) {
                        self.email = self.dto.email
                    }
                }
              });
            },

  methods: {
    kakaoLogout() {
      const redirect_uri = 'http://localhost:8182/login';
      const clientId = 'd54083f94196531e75d7de474142e52e';
      const Auth_url = `https://kauth.kakao.com/oauth/logout?client_id=${clientId}&logout_redirect_uri=${redirect_uri}`;
      location.href = Auth_url;
    },
    kakaoout() {
      const self = this;
      self.$axios.delete('http://localhost:8181/tokensave/deltoken/' + self.email)
        .then(function (res) {
          if (res.status == 200) {
            if (res.data.flag) {
              alert('탈퇴완료')

              location.href = '/'
            }
          } else {
            alert('에러')
          }
        });

    }
  }
}
</script>
  
<style scoped></style>