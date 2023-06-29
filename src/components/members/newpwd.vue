<template>
  <section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-10 col-md-7 col-lg-5 col-xl-4">
          <div class="card bg-white text-black" style="border-radius: 25px;">
            <div class="card-body p-5 text-center" style="border-radius : 25px; background-color: #CEE2F1;">
              <div class="mb-md-5 mt-md-4 pb-5">
                <h3 class="fw-bold mb-2" style="color:#4A5157">비밀번호 재설정</h3>
                <br />
                <div class="form-outline form-white mb-4">
                  <input type="text" v-model="email" class="form-control form-control-md" placeholder="이메일"
                    :disabled="isVisible" />
                  <button class="btn btn-primary btn-sm" v-on:click="sendEmail" :disabled="isVisible">이메일인증</button>
                </div>
                <div class="form-outline form-white mb-4">
                  <input type="text" class="form-control form-control-md" placeholder="인증번호를 입력하세요!"
                    @input="updateEmailCheck" />
                  <button class="btn btn-primary btn-sm" v-on:click="emailcheck">확인</button>
                </div>
                <div class="form-outline form-white mb-4">
                  <input type="password" v-model="newPwd" v-show="isVisible" class="form-control form-control-md"
                    placeholder="새 비밀번호" />
                </div>
                <div class="form-outline form-white mb-4">
                  <input type="password" v-model="confirmPwd" v-show="isVisible" class="form-control form-control-md"
                    placeholder="새 비밀번호 확인" />
                </div>
                <button class="btn btn-primary btn-sm" @click="changePassword" v-show="isVisible">비밀번호 변경</button>
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
  name: 'newpwd',
  data() {
    return {
      email: this.$route.query.email,
      pwd: this.$route.query.pwd,
      echeck: '',
      isVisible: false,
      newPwd: '',
      confirmPwd: '',
    }
  },
  methods: {
    changePassword() {
      if (this.newPwd !== this.confirmPwd) {
        alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        return;
      }
      const self = this;
      self.$axios.put('http://localhost:8181/members/newpwd/' + this.email + '/' + this.pwd)
        .then(function (res) {
          if (res.status == 200) {
            let dto = res.data.dto
            alert('비밀번호 변경에 성공하셨습니다')
            console.log(dto)
            location.href = '/'
          } else {
            alert('에러코드 :' + res.status)
          }
        });
    },

    sendEmail() {
      const self = this;
      const form = new FormData();
      form.append('email', self.email);
      self.$axios.post('http://localhost:8181/members/emailpwdcheck', form)
        .then(function (res) {
          if (res.data.exist) {
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
        this.isVisible = true;
      } else {
        alert('인증번호가 일치하지 않습니다.');
      }
    }
  }
}
</script>

<style scoped>
template {
  font-family: 'Pretendard-Regular';
  font-weight: 900;
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
}

.btn.btn-primary.btn-sm {
  color: #4A5157;
  border: none;
  background-color: white;
}

.btn.btn-primary.btn-sm:hover {
  background-color: #AFDEFF;
}
</style>