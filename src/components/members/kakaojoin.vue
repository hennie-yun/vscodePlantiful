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
        pwd: ''
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
