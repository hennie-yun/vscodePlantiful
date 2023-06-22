<template>
  <section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card bg-white text-black" style="border-radius: 25px;">
            <div class="card-body p-5 text-center" style="border-radius : 25px; background-color: #CEE2F1;">
              <div class="mb-md-5 mt-md-4 pb-5">
                <h2 class="fw-bold mb-2" style="color:#4A5157">회원가입</h2>
                <br />
                <div class="form-outline form-white mb-4">
                  <input type="text" v-model="email" class="form-control form-control-lg" placeholder="email" />
                  <button class="btn btn-primary btn-sm" style=" color :#4A5157 ;border: none; background-color: white;"
                    v-on:click="sendEmail">이메일인증</button>
                </div>
                <div class="form-outline form-white mb-4">
                  <input type="text" class="form-control form-control-lg" placeholder="인증번호를 입력!" @input="updateEmailCheck" />
                  <button class="btn btn-primary btn-sm" style=" color :#4A5157 ;border: none; background-color: white;"
                  v-on:click="emailcheck">확인</button>
                </div>
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
                <button class="btn btn-primary btn-lg" style="color :#4A5157; border: none; background-color: white;"
                  v-on:click="join" v-show="isVisible">join</button>
                  
                  
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
      phone: '',
      echeck: '',
      isVisible: false
    }
  },
  methods: {
    join() {
      const self = this
      const form = new FormData()
      form.append('email', self.email)
      form.append('pwd', self.pwd)
      form.append('nickname', self.nickname)
      form.append('phone', self.phone)
      if(document.getElementById('img').value != null) {
        const file = document.getElementById('img').files[0];
        form.append('f', file);      
        alert(this.email+"/"+this.pwd+"/"+this.nickname+"/"+this.phone +"/"+file)
      } 
      
      self.$axios.post('http://localhost:8181/members', form, 
          {headers : {'Content-Type' : 'multipart/form-data'}})
        .then(function (res) {
          if (res.status == 200) {
            let dto = res.data.dto
            console.log(dto)
            location.href="/" 
          } else {
            alert('에러코드 :' + res.status)
          }
        });
    },
    
  sendEmail() {
    const self = this;
    const form = new FormData();
    form.append('email', self.email);
    self.$axios.post('http://localhost:8181/members/email', form)
      .then(function (res) {
        if(res.data.exist){
          alert(res.data.exist)
        } else if (res.status == 200) {         
          alert('이메일이 발송되었습니다');
          const key = res.data.key;
          alert(key);
          self.emailKey = key; // 서버에서 받은 인증 키 값을 저장
        } else {
          alert('잘못된 이메일입니다');
        }
      })
  },
  updateEmailCheck(event) {
    this.echeck = event.target.value;
  },
  emailcheck() {
    const self = this;
    if (self.echeck === self.emailKey) {
      alert('확인 완료');
      this.isVisible =true;
    } else {
      alert('인증번호가 일치하지 않습니다.');
    }
  }
}
}
</script>

<style>
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
}
</style>