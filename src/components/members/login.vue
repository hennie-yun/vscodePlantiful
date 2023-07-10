<template>
  <div class="form" :class="activeForm">
    <p style="font-family:'TheJamsil5Bold'; text-align:center; font-weight: 500; font-size : 35px;"> plan + tiful </p>
    <br />
    <div class="form-header">
      <div class="show-signup" @click="showSignup">회원가입</div>
      <div class="show-signin" @click="showSignin">로그인</div>
      <div class="show-reset" @click="showReset">PW 찾기</div>
    </div>
    <div class="form-elements">
      <div class="form-element" style="display: flex;">
        <input v-model="email" type="text" placeholder="email" style="flex: 1; margin-right: 5px;" :disabled="Visible">
        <button @click="joinsendEmail" style="font-size : 13px; width: 80px; height:40px;" v-show="loginmailcheck">메일
          인증</button>
      </div>


      <div v-if="activeForm == 'signup'" class="form-element">
        <input v-model="pwd" type="password" placeholder="비밀번호" @focus="showPasswordMessage" @blur="hidePasswordMessage"
          @input="checkPassword">
      </div>
      <span v-if="!passwordValid && showPasswordMsg" style="font-size: 13px; color :#7AC6FF;  font-weight: bold;">대문자와
        특수문자를 포함한 8자리 이상만 가능합니다.</span>


      <div v-if="activeForm == 'signin'" class="form-element">
        <input v-model="pwd" type="password" placeholder="비밀번호">
      </div>


      <div v-if="activeForm == 'signup'" class="form-element">
        <input type="text" @input="autoHyphen($event.target)" maxlength="13" v-model="phone" placeholder="phone number">
      </div>

      <div v-if="activeForm == 'signup'" class="form-element">
        <input type="text" v-model="nickname" placeholder="nickname">
      </div>

      <div style="margin-top : 10px;">
        <label v-if="activeForm === 'signup'" class="input-file-wrapper">
          <div class="upload-button-text" style="text-align: left; color : grey;">{{ uploadButtonText }}</div>
          <input type="file" id="img-input-file" class="form-element" style="display :none;" @change="handleFileUpload" />
        </label>
      </div>

      <div class="form-element" v-show="isVisible" style="display: flex;">
        <input type="text" placeholder="인증번호를 입력하세요" @input="updateEmailCheck" style="flex: 1; margin-right: 5px;">
        <button @click="emailcheck" style="width: 65px; height:40px;">확인</button>
      </div>

      <div class="form-element">
        <button id="submit-btn" v-show="AllFieldsFilled" @click="handleButtonClick">{{ submitText }}</button>
        <p v-show="!AllFieldsFilled" style="margin-top :10px; text-align: center;">이메일 인증 후 가입이 가능합니다</p>
      </div>
      <br />
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
      Visible: false,
      loginmailcheck: true,
      AllFieldsFilled: false,
      uploadButtonText: '프로필 사진 업로드',
      activeForm: "signup",
      submitText: "가입",
      passwordValid: false,
      showPasswordMsg: false
    }
  },

  methods: {
    //버튼 이름 바꿔주는메서드들 
    showSignup() { //회원가입 페이지 
      this.activeForm = "signup";
      this.submitText = "가입";
      location.href = "/";
    },
    showSignin() { //로그인 페이지 
      this.activeForm = "signin";
      this.submitText = "로그인";
      this.loginmailcheck = false; //이메일인증 버튼 없애고 
      this.AllFieldsFilled = true; //로그인 버튼 보이게 하고 
    },
    showReset() { //임시비밀번호 전송 
      this.activeForm = "reset";
      this.submitText = "임시 비밀번호 전송";
      this.AllFieldsFilled = true; //임시비밀번호 전송 버튼 보이게 하고 
      this.loginmailcheck = false; //이메일인증 버튼 없애고 
    },
    handleButtonClick() {
      //같은 버튼 클릭 -> 다른 메서드 진행 
      if (this.activeForm === 'signup') {
        this.join();
      } else if (this.activeForm === 'signin') {
        this.login();
      } else if (this.activeForm === 'reset') {
        this.findpwdsendEmail();
      }
    },
    //회원가입을 위한 이메일 전송 메서드 
    joinsendEmail() {
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
              if (res.data.message) {
                alert(res.data.message)
              } else {
                alert('이메일이 발송되었습니다');
                self.isVisible = true;
                const key = res.data.key;
                alert(key);
                self.emailKey = key; // 서버에서 받은 인증 키 값을 저장
              }
            } else {
              alert('오류');
            }
          })
      }
    },
    //인증번호 체크하는거 
    updateEmailCheck(event) {
      this.echeck = event.target.value;
    },
    //이메일 인증 완료 되면 
    emailcheck() {
      const self = this;
      if (self.echeck === self.emailKey) {
        alert('확인 완료');
        self.Visible = true; //입력한 이메일 수정 못하게 막고 
        self.isVisible = false; //인증번호 입력하는 칸도 없애고 
        self.loginmailcheck = false; //메일 전송 버튼도 없애고 
        self.AllFieldsFilled = true; // 이제서야 가입 버튼 보이게 하기
      } else {
        alert('인증번호가 일치하지 않습니다.');
      }
    },
    //회원가입 하는 메서드들  

    autoHyphen(target) { //전화 번호 입력시 자동 하이픈 (-) 부여 
      target.value = target.value
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
    },

    //사진 완료 시 업로드 완료 되었다 표시해 줌 
    handleFileUpload() {
      this.uploadButtonText = '사진 업로드 완료';
    },

    // 비밀번호 정규식
    checkPassword() {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
      this.passwordValid = passwordRegex.test(this.pwd);
    },
    showPasswordMessage() {
      this.showPasswordMsg = true;
    },
    hidePasswordMessage() {
      this.showPasswordMsg = false;
    },

    //이메일 인증이 끝난 뒤 이제 진짜 가입 진행 
    join() {
      const self = this;
      const form = new FormData();

      //전화번호 11자리로 고정 
       if (self.phone.replace(/[^0-9]/g, '').length !== 11) {
        alert('전화번호는 11자리의 숫자로만 입력해야 합니다.');
        return;
      } else if (!self.phone.startsWith('010')) {
        alert('전화번호 형식이 잘 못 되었습니다');
        return;
      } else {
        form.append('phone', self.phone.replace(/[^0-9]/g, ''));
      }

      form.append('email', self.email);

      // 비밀번호 정규식
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
      if (!passwordRegex.test(self.pwd)) {
        alert('비밀번호는 대문자 1개와 특수문자 1개를 포함한 8자리 이상만 가능합니다. \n 다시 입력 해주세요')
        self.pwd = '';
        return;
      } else {
        form.append('pwd', self.pwd);
      }
      form.append('nickname', self.nickname);
      if (document.getElementById('img-input-file').value !== '') {
        const file = document.getElementById('img-input-file').files[0];
        form.append('f', file);
      }
      self.$axios.post('http://localhost:8181/members', form, { headers: { "Content-Type": "multipart/form-data" } })
        .then(function (res) {
          if (res.status === 200) {
            let dto = res.data.dto;
            console.log(dto);
            self.showSignin();
          } else {
            alert('에러코드 :' + res.status);
          }
        })
        .catch(function (error) {
          alert('에러 :' + error);
        });
    },

    //로그인하는 메서드 시작 
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

    //임시비밀번호 전송하는 메서드 
    findpwdsendEmail() {
      if (this.email == '') {
        alert('이메일을 입력해주세요')
      } else {
        const self = this;
        const form = new FormData();
        form.append('email', self.email);
        self.$axios.post('http://localhost:8181/members/emailpwdcheck', form)
          .then(function (res) {
            if (res.data.exist) {
              alert(res.data.exist)
            } else if (res.status == 200) {
              alert('이메일이 발송되었습니다');
              alert('전달 드린 임시비밀번호로 로그인 하세요')
              self.showSignin();
              const key = res.data.key;
              alert(key);
              self.emailKey = key; // 서버에서 받은 인증 키 값을 저장
            } else {
              alert('잘못된 이메일입니다');
            }
          })
      }
    },

    //카카오톡 로그인 하기  
    kakaoLogin() {
      const redirect_uri = 'http://localhost:8182/kakaojoin';
      const clientId = 'd54083f94196531e75d7de474142e52e';
      const Auth_url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}`;
      window.location.href = Auth_url;
    }
  }
}
</script>

<style scoped> .form {
   font-family: 'Pretendard-Regular';
   font-weight: 400;
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

 .form .form-elements label {
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

 .form.reset .form-elements>div:nth-child(2) {
   height: 0px;
   opacity: 0;
 }

 .form-elements input:focus {
   outline: none !important;
   border-color: #7AC6FF;

 }
</style>
