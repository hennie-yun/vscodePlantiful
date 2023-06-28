<template>
  <section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card bg-white text-black" style="border-radius: 25px;">
            <div class="card-body p-5 text-center" style="border-radius : 25px; background-color: #CEE2F1;">
              <div class="mb-md-5 mt-md-4 pb-5">
                <h2 class="fw-bold mb-2" style="color:#4A5157">카카오톡 회원가입</h2>
                <br />
                <div class="form-outline form-white mb-4">
                  <input type="text" v-model="form.email" class="form-control form-control-lg" required disabled />
                </div>
                <div class="form-outline form-white mb-4">
                  <input type="text" v-model="form.nickname" class="form-control form-control-lg" />
                </div>
                <div class="form-outline form-white mb-4">
                  <input type="text" class="form-control form-control-lg" placeholder="전화번호" />
                </div>
                <div class="form-outline form-white mb-4">
                  <input type="file" id="img" class="form-control form-control-lg" />
                </div>
                <button class="btn btn-primary btn-lg" style="color :#4A5157; border: none; background-color: white;"
                  @click="onSubmit">join</button>
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
  name: 'kakaojoin',
  data() {
    return {
      code: this.$route.query.code,
      email: '',
      pwd: '',
      nickname: '',
      phone: '',
      echeck: '',
      img: '',
      form: {
        email: '',
        nickname: '',
        phone: '',
        pwd: '',
      },
      show: true
    };
  },
  created() {
    this.code = this.$route.query.code;
    console.log(this.code)
    this.getToken();
  },
  methods: {
    klogin() { //아이디 저장이 되어 있으면 갈 곳 
      const self = this;
      const loginform = new FormData();
      loginform.append('email', self.form.email)
      loginform.append('pwd', self.form.pwd)
      self.$axios.post('http://localhost:8181/members/login', loginform)
        .then(function (res) {
          if (res.status == 200) {
            if (res.data.flag) {
              location.href = "/afterlogin"
            }
          }
        });
    },
    getToken() { //토큰 냅다 받아~~ 
      const self = this;
      self.$axios.get('http://localhost:8181/kakaologin/' + self.code)
        .then((res) => {
          console.log(res)
          self.form.email = res.data.email;
          self.form.pwd = res.data.id;
          self.form.nickname = res.data.nickname;
          self.$axios.get('http://localhost:8181/members/getKakaomember/' + self.form.email)
            .then(function (res) {
              if (res.status == 200) {
                if (res.data.messeage) {
                  alert('회원가입을하세요')
                } else {
                  self.klogin()
                }
              }
            });
        });
    },
    onSubmit() {
      const self = this
      const form = new FormData()
      form.append('email', self.form.email)
      form.append('pwd', self.form.pwd)
      form.append('nickname', self.form.nickname)
      form.append('phone', self.phone)
      form.append('id', 1)
      if (document.getElementById('img').value !== '') {
        const file = document.getElementById('img').files[0]
        form.append('f', file)
      }
      self.$axios.post('http://localhost:8181/members', form, { headers: { "Content-Type": "multipart/form-data" } })
        .then(function (res) {
          if (res.status === 200) {
            let dto = res.data.dto
            console.log(dto)
            self.klogin();
          } else {
            alert('에러코드 :' + res.status)
          }
        })
        .catch(function (error) {
          alert('에러 :' + error)
        })
    },

  }
};
</script>
