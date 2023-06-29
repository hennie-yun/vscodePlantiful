<template>
  <div class="form" :class="activeForm">
    <h3> plan + tiful </h3>
    <br />
    <div class="form-header">
      <div class="show-signup" @click="showSignup">회원가입</div>
      <div class="show-signin" @click="showSignin">로그인</div>
      <div class="show-reset" @click="showReset">PW 찾기</div>
    </div>
    <div class="form-elements">
      <div class="form-element">
        <input v-model="email" type="text" placeholder="email" :disabled="isVisible">
      </div>

      <div class="form-element">
        <input v-model="pwd" type="password" placeholder="Password">
      </div>

      <div v-if="activeForm == 'signup'" class="form-element">
        <input type="text" @input="autoHyphen($event.target)" maxlength="13" v-model="phone" placeholder="phone number">
      </div>

      <div v-if="activeForm == 'signup'" class="form-element">
        <input type="text" v-model="nickname" placeholder="nickname">
      </div>

      <div style="margin-top : 10px;">
        <!-- <label v-if="activeForm == 'signup'" class="form-element" >
          {{ uploadButtonText }} -->
          <input type="file" id="img-input-file" class="form-element"  @change="handleFileUpload" />
        <!-- </label> -->
      </div>
      <div class="form-element" v-show="isVisible" style="display: flex;">
        <input type="text" placeholder="인증번호를 입력하세요" @input="updateEmailCheck" style="flex: 1; margin-right: 5px;">
        <button @click="emailcheck" style="width: 65px; height:40px;">확인</button>
      </div>

      <div class="form-element">
        <button id="submit-btn" @click="handleButtonClick">{{ submitText }}</button>
      </div><br />

      <div>
        <img :src="require('@/assets/image/kakao.png')" @click="kakaoLogin" />
      </div>
    </div>
  </div>
</template>
 
<script>


export default {
  name: 'login',
  data() {
    return {
      email: this.$route.query.email,
      email: '',
      pwd: '',
      nickname: '',
      phone: '',
      echeck: '',
      img: '',
      isVisible: false,
      uploadButtonText: '프로필 사진 업로드',
      activeForm: "signup",
      submitText: "이메일 인증"
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
    showSignup() {
      this.activeForm = "signup";
      this.submitText = "Sign Up";
    },
    showSignin() {
      this.activeForm = "signin";
      this.submitText = "Sign In";
    },
    showReset() {
      this.activeForm = "reset";
      this.submitText = "Reset";
    },
    handleButtonClick() {
      if (this.activeForm === 'signup') {
        this.sendEmail();
      } else if (this.activeForm === 'sendEmail') {
        this.join();
      } else if (this.activeForm === 'signin') {
        this.login();
      } else if (this.activeForm === 'reset') {
        this.reset();
      }
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
              self.isVisible = true;
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
      } else {
        alert('인증번호가 일치하지 않습니다.');
      }
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

    kakaoLogin() {
      const redirect_uri = 'http://localhost:8182/kakaojoin';
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


<style scoped> 
.form {
   position: absolute;
   top: 30%;
   left: 50%;
   transform: translate(-50%, -50%);
   width: 300px;
   height: 250px;
   padding: 10px;
 }

 .form .form-header {
   height: 30px;
   display: flex;
   align-items: center;
   text-align: center;
 }

 .form .form-header>div {
   width: calc(100% / 3);
   color: #ddd;
   font-size: 18px;
   font-weight: 600;
   cursor: pointer;
 }

 .form.signup .form-header div.show-signup {
   color: #7AC6FF;
 }

 .form.signin .form-header div.show-signin {
   color: #7AC6FF;
 }

 .form.reset .form-header div.show-reset {
   color: #7AC6FF;
 }

 .form .form-elements {
   margin-top: 15px;

 }

 .form .form-elements .form-element {
   height: 50px;
   opacity: 1;
   margin-top: 15px;
   overflow: hidden;
   transition: all 500ms ease-in-out;

 }

 .form .form-elements input {
   width: 100%;
   padding: 10px;
   font-size: 16px;
   margin: 5px 0px;
   border-radius: 10px;
   box-sizing: border-box;
   background: #f5f5f5;
 }

 .form .form-elements button {
   width: 100%;
   padding: 10px;
   font-size: 16px;
   font-weight: 600;
   margin-top: 5px;
   border-radius: 10px;
   background: #7AC6FF;
   color: #f5f5f5;
   cursor: pointer;
   border: none;
   outline: none;
 }

 .form.show-signin.form-elements>div:nth-child(3) {
   height: 0px;
   opacity: 0;
 }

 /* .form.reset .form-elements>div:nth-child(3) {
   height: 0px;
   opacity: 0;
 } */

 .form-elements input:focus {
   outline: none !important;
   border-color: #7AC6FF;

 }
</style>
