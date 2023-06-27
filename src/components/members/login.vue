<template>
  <section class="vh-100">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card bg-white text-black" style="border-radius : 25px;">
            <div class="card-body p-5 text-center" style="border-radius : 25px; background-color: #CEE2F1;">
              <div class="mb-md-5 mt-md-4 pb-5">
                <h2 class="fw-bold mb-2" style="color :#4A5157;">Plantiful</h2>
                <br />
                <div class="form-outline form-white mb-4">
                  <input type="text" v-model="email" class="form-control form-control-lg" placeholder="email" />
                </div>
                <div class="form-outline form-white mb-4">
                  <input type="password" v-model="pwd" class="form-control form-control-lg" placeholder="password" />
                </div>
                <p class="small mb-5 pb-lg-2"><a class="text-black-50" href="/newpwd">Forgot password?</a></p>
                <button class="btn btn-primary btn-lg" style="border: none; background-color:white; color:#4A5157;"
                  v-on:click="login">Login</button>

                <div class="d-flex justify-content-center text-center mt-4 pt-1">
                  <img :src="require('@/assets/image/kakao.png')" @click="kakaoLogin" />
                </div>
              </div>
              <button @click="kakaoLogout"> 카카오 로그아웃
              </button>

              <div>
                <a href="/join" class="text-black-50 fw-bold">Sign Up</a>

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
      const redirect_uri = 'http://localhost:8081/calendar';
      const clientId = 'd54083f94196531e75d7de474142e52e';
      const Auth_url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}`;
      window.location.href = Auth_url;
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