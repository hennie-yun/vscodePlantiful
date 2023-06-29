<template>
  <section class="vh-100 gradient-custom">
    <div class="container py-5 h-90">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-10 col-md-7 col-lg-5 col-xl-4">
          <div class="card bg-white text-black" style="border-radius: 25px;">
            <div class="card-body p-5 text-center" style="border-radius : 25px; background-color: #CEE2F1;">
              <div class="mb-md-5 mt-md-4 pb-5">
                <h3 class="fw-bold mb-2" style="color:#4A5157">회원가입</h3>
                <br />
                <div class="form-outline form-white mb-4">
                  <input type="text" v-model="email" class="form-control form-control-md" placeholder="이메일"
                    :disabled="isVisible" />
                  <button class="btn btn-primary btn-sm" v-on:click="sendEmail" :disabled="isVisible">이메일인증</button>
                </div>
                <div class="form-outline form-white mb-4">
                  <input type="text" class="form-control form-control-md" placeholder="인증번호를 입력하세요"
                    @input="updateEmailCheck" />
                  <button class="btn btn-primary btn-sm" @click="emailcheck">확인</button>
                </div>
                <div class="form-outline form-white mb-4">
                  <input type="password" v-model="pwd" class="form-control form-control-md" placeholder="비밀번호" />
                </div>
                <div class="form-outline form-white mb-4">
                  <input type="text" v-model="nickname" class="form-control form-control-md" placeholder="닉네임" />
                </div>
                <div class="form-outline form-white mb-4">
                  <input type="text" @input="autoHyphen($event.target)" maxlength="13" v-model="phone"
                    class="form-control form-control-md" placeholder="전화번호" />
                </div>


                <label class="input-file-button" for="img-input-file">
                  {{ uploadButtonText }}
                </label>
                <input type="file" id="img-input-file" style="display: none;" @change="handleFileUpload" /><br />
                <br />
                <button class="btn btn-primary btn-sm" @click="join" v-show="isVisible">회원가입</button>
                <div class="d-flex justify-content-center text-center mt-4 pt-1">
                  <img :src="require('@/assets/image/kakao.png')" @click="kakaoLogin" />
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
      img: '',
      isVisible: false,
      uploadButtonText : '프로필 사진 업로드'
    }
  },


  methods: {
    autoHyphen(target) {
      target.value = target.value
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
    },
    handleFileUpload() {
      this.uploadButtonText = '업로드 완료';
    },
    join() {
      const self = this;
      const form = new FormData();
      if (this.phone.replace(/[^0-9]/g, '').length !== 11) {
        alert('전화번호는 11자리의 숫자로만 입력해야 합니다.');
        alert(this.phone.replace(/[^0-9]/g, '').length)
        return;
      } else {
        form.append('phone', this.phone.replace(/[^0-9]/g, ''));
      } form.append('email', self.email);
      form.append('pwd', self.pwd);
      form.append('nickname', self.nickname);
      if (document.getElementById('img-input-file').value !== '') {
        const file = document.getElementById('img-input-file').files[0]
        form.append('f', file)
      }
      self.$axios.post('http://localhost:8181/members', form, { headers: { "Content-Type": "multipart/form-data" } })
        .then(function (res) {
          if (res.status === 200) {
            let dto = res.data.dto
            console.log(dto)
            location.href = '/'
          } else {
            alert('에러코드 :' + res.status)
          }
        })
        .catch(function (error) {
          alert('에러 :' + error)
        })
    },

    sendEmail() {
      const self = this;
      if (this.email == '') {
        alert('이메일을 입력해주세요')
      } else {
        const form = new FormData();
        form.append('email', self.email);
        self.$axios.post('http://localhost:8181/members/email', form)
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
      }
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
    },
    kakaoLogin() {
      const redirect_uri = 'http://localhost:8182/kakaojoin';
      const clientId = 'd54083f94196531e75d7de474142e52e';
      const Auth_url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}`;
      location.href = Auth_url;
    }
  }
}

</script>

<style scoped>
.form-outline.form-white.mb-4 {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 5px;
}

.form-outline.form-white.mb-4 input[type="text"] {
  grid-column: 1;
}

.form-outline.form-white.mb-4 button {
  grid-column: 2;
}

template {
  font-family: 'Pretendard-Regular';
  font-weight: 900;
}

.input-file-button {
  padding: 6px 25px;
  background-color: white;
  border-radius: 4px;
  color: #4A5157;
  cursor: pointer;
}

.input-file-button:hover {
  background-color: #FFD9C7;
}

.btn.btn-primary.btn-sm {
  color: #4A5157;
  border: none;
  background-color: white;
}

.btn.btn-primary.btn-sm:hover {
  background-color: #FFD9C7;
}
</style>