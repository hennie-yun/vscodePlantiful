<template>
  <section class="vh-100 custom-font">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-10 col-md-7 col-lg-5 col-xl-4">
          <div class="card bg-white text-black" style="border-radius : 25px;">
            <div class="card-body p-5 text-center" style="border-radius : 25px; background-color: #CEE2F1;">
              <div class="mb-sm-5 mt-sm-4 pb-5"> 
                <h3 class="fw-bold mb-2" style="color :#4A5157;"> plan + tiful </h3>
                <br />
                <div class="form-outline form-white mb-4">
                  <input type="text" v-model="email" class="custom-font form-control form-control-md" placeholder="이메일" />
                </div>
                <div class="form-outline form-white mb-4">
                  <input type="password" v-model="pwd" class="custom-font form-control form-control-md" placeholder="비밀번호" />
                </div>
                <p class="small mb-5 pb-lg-2">
                  <a href="/newpwd" class="custom-font text-black-50" >비밀번호 찾기</a></p>
                
                
                  <button class="btn btn-primary btn-md custom-font" v-on:click="login">로그인</button>

                <div class="custom-font d-flex justify-content-center text-center mt-4 pt-1">
                  <img :src="require('@/assets/image/kakao.png')" @click="kakaoLogin" />
                </div>
              </div>
               <div>
                <a href="/join" class="custom-font text-black-50 fw-bold">회원가입</a>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

 
<script>

export default {
  name: 'login',
  data() {
    return {
      email: this.$route.query.email,
      email: '',
      pwd: ''
    }
  },
  methods: {
  
    kakaoLogin() {
      const redirect_uri = 'http://localhost:8182/kakaojoin';
      const clientId = 'd54083f94196531e75d7de474142e52e';
      const Auth_url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}`;
      location.href = Auth_url;
    },
    kakaoLogout() {
      const redirect_uri = 'http://localhost:8182/login';
      const clientId = 'd54083f94196531e75d7de474142e52e';
      const Auth_url = `"https://kauth.kakao.com/oauth/logout?client_id=${clientId}&logout_redirect_uri=${redirect_uri}`;
      location.href = Auth_url;
    },
    login() {
      const self = this;
      const form = new FormData();
      form.append('email', self.email)
      form.append('pwd', self.pwd)
      self.$axios.post('http://localhost:8181/members/login', form)
        .then(function (res) {
          if (res.status == 200) {
            if (res.data.flag) {
              sessionStorage.setItem('token', res.data.token)
              sessionStorage.setItem('loginId', res.data.loginId)
              location.href = "/calendar"
            } else {
              alert('로그인 실패')
            }

          } else {
            alert('걍 에러')
          }
        });
    },

  }
}
</script>
<style scoped>
.custom-font {
  font-family: 'Pretendard-Regular';
  font-weight: 700;
}
.btn.btn-primary.btn-md {
  color: #4A5157;
  border: none;
  background-color: white;
}
.btn.btn-primary.btn-md:hover {
  background-color: #DCC1E8;
}
</style>