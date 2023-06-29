<template>
  <div class ="klogin">
    <b-form class="form" @submit="onSubmit" @reset="onReset" v-if="show">
      <h2>카카오 회원가입</h2>
      이름: <input type="text" v-model="form.email" required disabled />
      닉네임: <input type="text" v-model="form.nickname" required disabled />
      전화번호: <input type="text" v-model="form.phone" required />
      아이디: <input type="text" v-model="form.id" required />
      비밀번호: <input type="text" v-model="form.pwd" required />
      <button type="submit">등록</button>
      
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'kakaojoin',
  data() {
    return {
      codes: '',
      form: {
        email: '',
        nickname: '',
        id : null,
        phone: '',
        pwd: '',
        kakaotoken : ''

      },
      show: true
    };
  },
  created() {
    this.codes = this.$route.query.code;
    this.getToken();
  },
  methods: {
    klogin() {
      const self = this;
      const loginform = new FormData();
      loginform.append('email', self.form.email)
      loginform.append('pwd', self.form.pwd)
      self.$axios.post('http://localhost:8181/members/login', loginform)
        .then(function (res) {
          sessionStorage.setItem('token', res.data.token)
          sessionStorage.setItem('loginId', res.data.loginId)
          const addform = new FormData();
          addform.append('email', self.form.email)
          addform.append('token', self.form.kakaotoken)         
          console.log(self.form.kakaotoken)
          self.$axios.post('http://localhost:8181/tokensave', addform)
          .then(function (rep) {
          if (rep.status == 200) {
            alert('토큰세이브')
          }
        });
            if (res.data.flag) {
              location.href = "/afterlogin"
            }
          })
        
    },
    getToken() { //토큰 냅다 받아~~ 
      const self = this;
      self.$axios.get('http://localhost:8181/kakaologin/' + self.code)
        .then((res) => {
          console.log(res)
          self.form.email = res.data.email;
          self.form.pwd = res.data.id;
          self.form.nickname = res.data.nickname;
          self.form.kakaotoken = res.data.accessToken;
          self.$axios.get('http://localhost:8181/members/getKakaomember/' + self.form.email)
            .then(function (res) {
              if (res.status == 200) {
                if (res.data.flag === false) {
                alert('회원가입을하세요')
                } else {
                  self.klogin()
                }
              }
            });

      self.$axios
        .post('http://localhost:8181/memebers/login', self.form)
        .then((res) => {
          if (res.data !== null) {
            document.cookie = `accessToken=${res.data}`;
            this.$axios.defaults.headers.common['x-access-token'] = res.data;
            location.href = '/calendar';
          }
        });
    },
    getToken() {
      const self = this;
      self.$axios
        .get('http://localhost:8181/kakaojoin', { code: self.codes })
        .then((res) => {
          this.form.email = res.data.email;
          this.form.pwd = res.data.id;
          this.form.nickname = res.data.nickname;
          this.klogin();
        });
    },
    onSubmit(event) {
      const self = this;
      event.preventDefault();
      self.$axios.post('http://localhost:8181/members', self.form).then((res) => {
        console.log(res.status);
        this.klogin();
      });
    },
    onReset() {
      this.form.phone = '';
    }
  }
};
</script>
