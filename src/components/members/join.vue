<template>
  <section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card bg-white text-black" style="border-radius: 1rem;">
            <div class="card-body p-5 text-center">
              <div class="mb-md-5 mt-md-4 pb-5">
                <h2 class="fw-bold mb-2">Plantiful 회원가입</h2>
                <br/>
                <div class="form-outline form-white mb-4">
                  <input type="text" v-model="email" class="form-control form-control-lg" placeholder="email" />
                  <button class="btn btn-primary btn-sm" style="border: none; background-color: #7AC6FF;"
                    v-on:click="checkemail">이메일인증</button>
                  </div>
                  <div>
                  <input type="text" class="form-control form-control-lg mail-check-input" placeholder="인증번호 6자리를 입력해주세요!" disabled="disabled"
                    maxlength="6">
                  </div>
                <span id="mail-check-warn"></span>
              
              <div class="form-outline form-white mb-4">
                <input type="password" v-model="pwd" class="form-control form-control-lg" placeholder="password" />
              </div>
              <div class="form-outline form-white mb-4">
                <input type="text" v-model="nickname" class="form-control form-control-lg" placeholder="nickname" />
              </div>
              <div class="form-outline form-white mb-4">
                <input type="text" v-model="phone" class="form-control form-control-lg" placeholder="phone number" />
              </div>
              <div class="form-outline form-white mb-4">
                <input type="file" id="img" class="form-control form-control-lg" />
              </div>
              <button class="btn btn-primary btn-lg" style="border: none; background-color: #7AC6FF;"
                v-on:click="join">join</button>

                <!-- 소셜회원가입 -->
              <div class="d-flex justify-content-center text-center mt-4 pt-1">
                <a href="#!" class="text-white"><i class="fab fa-kakao-f fa-lg"></i></a>
                <a href="#!" class="text-white"><i class="fab fa-naver fa-lg mx-4 px-2"></i></a>
              </div>
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
  name: 'join',
  data() {
    return {
      email: '',
      pwd: '',
      nickname: '',
      phone: ''
    }
  },
  methods: {
    join() {
      const self = this;
      const form = new FormData();
      form.append('email', self.email)
      form.append('pwd', self.pwd)
      form.append('nickname', self.nickname)
      form.append('phone', self.phone)
      const file = document.getElementById('img')
      form.append('f', file.files);
      self.$axios.post('/members', form)
        .then(function (res) {
          if (res.status == 200) {
            let dto = res.data.dto
            alert(dto.id+"/"+dto.type)
            this.$router.push('/login')
          } else {
            alert('에러코드 :' + res.status)
          }
        });
    },
    //이메일체크 누르면 이메일 전송해주는 controller로 이동 / 그리고 
    checkemail(){
      const self = this;
      const form = new FormData();
      form.append('email', self.email)


    },
    
  }
}
</script>

<style>
.gradient-custom {
  /* fallback for old browsers */
  background: #CEE2F1;
}

.form-outline.form-white.mb-4 {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 10px;
}

.form-outline.form-white.mb-4 input[type="text"] {
  grid-column: 1;
}

.form-outline.form-white.mb-4 button {
  grid-column: 2;
}</style>