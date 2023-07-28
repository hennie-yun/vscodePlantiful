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
        <input v-model="email" type="text" placeholder="email" style="flex: 1; margin-right: 5px;">
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


      <div v-if="activeForm == 'signup'" style="display: flex;" class="form-element" :disabled="Visible">
        <input type="text" style="flex: 1; margin-right: 5px;" maxlength="11" v-model="phone"
          placeholder="전화번호( - 빼고 입력)">
        <button v-show="phonenumcheck" @click="checkinfo"
          style="font-size : 13px; width: 80px; height:40px;">본인인증</button>

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

      <div class="form-element">
        <button id="submit-btn" v-show="AllFieldsFilled" @click="handleButtonClick">{{ submitText }}</button>
        <p v-show="!AllFieldsFilled" style="margin-top :10px; text-align: center;"> 본인 인증 후 가입이 가능합니다</p>
      </div>
      <br />
      <div class="image-container">
        <img class="kakaoIdLogin" :src="require('@/assets/image/KakaoTalk_logo.png')" @click="kakaoLogin" />
        <img class="naverIdLogin" :src="require('@/assets/image/naverlogin.jpg')" @click="naverlogin" />
      </div>
    </div>
  </div>
</template>
 
<script>
const { IMP } = window;

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
      showPasswordMsg: false,
      phonenumcheck: true

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

    //본인인증 
    checkinfo() {
      const self = this;
      IMP.init("imp66001065");
      IMP.certification({
        pg: 'MIIiasTest',
        merchant_uid: 'merchant_' + new Date().getTime(),
        m_redirect_url: "http://localhost:8182/login"
      }, function (rsp) {
        if (rsp.success) {
          console.log(rsp.imp_uid);
          console.log(rsp.merchant_uid);
          const data = {
            imp_uid: rsp.imp_uid,
            email: self.email
          };
          self.$axios.get("http://localhost:8181/members/certifications/redirect", { params: data })
            .then(function (res) {
              console.log('전화번호빼옴' + res.data.phone);
              console.log('입력한 이름' + self.phone)
              if (res.data.phone != self.phone) {
                alert('입력하신 전화번호와 다릅니다');
                self.phone = '';
              } else {
                self.Visible = true; //전화번호 수정 못하게 막고 
                self.AllFieldsFilled = true; //가입버튼 보이게 하고 
                self.phonenumcheck = false; //본인인증 버튼 없애고 
              }
            });
        }
      })
    },


    //회원가입 하는 메서드들  
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

    //본인 인증이 끝난 뒤 이제 진짜 가입 진행 
    join() {
      const self = this;
      const form = new FormData();

      //이메일 입력했나 확인
      if (self.email == null || self.email == "") {
        alert('이메일을 입력해주세요');
      } else {
        form.append('email', self.email);
      }
      //전화번호 등록 
      form.append('phone', self.phone);

      //일반회원가입
      form.append('id', 0);

      // 비밀번호 정규식
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
      if (!passwordRegex.test(self.pwd)) {
        alert('비밀번호는 대문자 1개와 특수문자 1개를 포함한 8자리 이상만 가능합니다. \n 다시 입력 해주세요')
        self.pwd = '';
        return;
      } else {
        form.append('pwd', self.pwd);
      }
      if (self.nickname == null || self.nickname == "") {
        alert('닉네임을 입력해주세요');
      } else {
        form.append('nickname', self.nickname);
      }
      if (document.getElementById('img-input-file').value !== '') {
        const file = document.getElementById('img-input-file').files[0];
        form.append('f', file);
      }
      self.$axios.post('http://localhost:8181/members', form, { headers: { "Content-Type": "multipart/form-data" } })
        .then(function (res) {
          if (res.status === 200) {
            if (res.data.msg) {
              alert(res.data.msg);
              window.location.reload(true);
            } else {
              let dto = res.data.dto;
              console.log(dto);
              self.showSignin();
            }
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
              localStorage.setItem("activeTab", "/calendar")
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
        console.log("여기")
        console.log(self.email)
        self.$axios.get("http://localhost:8181/members/getmember/" + self.email)
          .then(function (res) {
            if (res.status == 200) {
              if (res.data.id == 1 || res.data.id == 2) {
                console.log(res.data.dto.id);
                console.log(res.data.id);
                alert("간편로그인 한 아이디 입니다. 간편로그인으로 로그인 해주세요")
              }
              else {
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
                      self.emailKey = key; // 서버에서 받은 인증 키 값을 저장
                    } else {
                      alert('잘못된 이메일입니다');
                    }
                  })
              }
            }
          });
      }
    },

    //카카오톡 로그인 하기  
    kakaoLogin() {
      const redirect_uri = 'http://localhost:8182/kakaojoin';
      const clientId = 'd54083f94196531e75d7de474142e52e';
      const Auth_url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}`;
      window.location.href = Auth_url;
    },

    //네이버 로그인 
    naverlogin() {
      let client_id = "IiiFJKBOyzL3qvfXasPq"
      let redirect_uri = encodeURIComponent("http://localhost:8182/naverjoin", "UTF-8")
      const state = this.generateRandomState()
      const apiURL = "https://nid.naver.com/oauth2.0/authorize?response_type=code"
        + "&client_id=" + client_id
        + "&redirect_uri=" + redirect_uri
        + "&state=" + state
      window.location.href = apiURL
    },
    // state 생성
    generateRandomState() {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let state = "";
      for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        state += characters.charAt(randomIndex);
      }
      return state;
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

 .image-container {
   display: flex;
   justify-content: center;
   align-items: center;
 }

 .naverIdLogin {
   height: 50px;
   width: 50px;
 }

 .kakaoIdLogin {
   height: 40px;
   width: 40px;
 }

 .naverIdLogin {
   height: 50px;
   width: 50px;
 }
</style>
