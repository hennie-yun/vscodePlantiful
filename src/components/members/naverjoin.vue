<template>
  <div class="form" :class="activeForm">

    <br />
    <div>
    </div>
    <div class="form-header">
      <img :src="require('@/assets/image/naverlogin.jpg')" style="width: 30%; height:25%;" />
    </div>
    <div class="form-elements">
      <div class="form-element" style="display: flex;">
        <input v-model="form.email" type="text" style="flex: 1; margin-right: 5px;" required disabled />
      </div>

      <div style="display: flex;" class="form-element" :disabled="Visible">
        <input type="text" style="flex: 1; margin-right: 5px;" maxlength="11" v-model="phone"
          placeholder="전화번호( - 빼고 입력)">
        <button v-show="phonenumcheck" @click="checkinfo"
          style="font-size : 13px; width: 80px; height:40px;">본인인증</button>
      </div>


      <div class="form-element">
        <input type="text" v-model="form.nickname" required disabled />
      </div>
      <div style="margin-top : 10px;">
        <label class="input-file-wrapper">
          <div class="upload-button-text" style="text-align: left; color : grey;">{{ uploadButtonText }}</div>
          <input type="file" id="img-input-file" class="form-element" style="display :none;" @change="handleFileUpload" />
        </label>
      </div>
      <div class="form-element">
        <button id="submit-btn" @click="onSubmit()">네이버로 회원가입 하기</button>
      </div>
    </div>
    <div class="button-wrapper">
      <router-link to="/" class="custom-link">돌아가기</router-link>
    </div>
  </div>
</template>


<script>

export default {
  name: 'naverjoin',
  data() {
    return {
      code: this.$route.query.code,
      state: this.$route.query.state,
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
        navertoken: ''
      },
      show: true,
      uploadButtonText: '프로필 사진 업로드',
      phonenumcheck :true
    };
  },
  created() {
    this.code = this.$route.query.code;
    this.state = this.$route.query.state;
    console.log(this.code)
    console.log(this.state)
    this.getToken(this.code, this.state);
  },
  methods: {
    
    handleFileUpload() {
      this.uploadButtonText = '사진이 업로드 되었습니다';
    },

    klogin() { //아이디 저장이 되어 있으면 갈 곳 
      const self = this;
      const loginform = new FormData();
      loginform.append('email', self.form.email)
      loginform.append('pwd', self.form.pwd)
      self.$axios.post('http://localhost:8181/members/login', loginform)
        .then(function (res) { //결과 
          if (res.status == 200) {
            sessionStorage.setItem('token', res.data.token)
            sessionStorage.setItem('loginId', res.data.loginId)
            const addform = new FormData();
            addform.append('email', self.form.email)
            addform.append('token', self.form.navertoken)
            console.log(self.form.navertoken)
            self.$axios.post('http://localhost:8181/api/naver/token', addform)
              .then(function (rep) {
                if (rep.status == 200) {
                  location.href = "/calendar"
                } else {
                  alert('여기서 오류다~ ')
                }
              });
          }
        })
    },
    getToken() {
      const self = this;
      let formData = new FormData();
      formData.append('code', self.code);
      formData.append('state', self.state);
      self.$axios.post('http://localhost:8181/api/naver/login', formData)
        .then((res) => {
          if (res.status == 200) {
            if (res.data.userinfo.message) {
              alert(res.data.userinfo.message);
              location.href = "/"
            } else {
              console.log(res.data);
              self.form.email = res.data.userinfo.naverResponse.email;
              self.form.pwd = res.data.userinfo.naverResponse.id;
              self.form.nickname = res.data.userinfo.naverResponse.nickname;
              self.form.navertoken = res.data.access_token;
            }
            self.$axios.get('http://localhost:8181/members/getKakaomember/' + self.form.email)
              .then(function (res) {
                if (res.status == 200) {
                  console.log(res.data.flag);
                  if (res.data.flag == false) {
                    console.log(res.data.flag);
                  } else {
                    self.klogin();
                  }
                }
              });
          }
        });
    },
 //본인인증 
 checkinfo() {
      const self = this;
      IMP.init("imp66001065");
      IMP.certification({
        pg: 'MIIiasTest',
        merchant_uid: 'merchant_' + new Date().getTime(),
        m_redirect_url: "http://localhost:8182/kakaojoin"
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
              self.phonenumcheck = false; //본인인증 버튼 없애고 
              }
            });
        }
      })
    },
    onSubmit() {
      const self = this;
      const form = new FormData();

      if (self.phone == null || self.phone == "") {
        alert("휴대폰 본인 인증을 해주세요");
        return;
      } else {
        form.append('phone', self.phone);
      }
      form.append('email', self.form.email);
      form.append('nickname', self.form.nickname);
      form.append('pwd', self.form.pwd)
      form.append('id', 2)
      if (document.getElementById('img-input-file').value !== '') {
        const file = document.getElementById('img-input-file').files[0];
        form.append('f', file);
      }
      self.$axios.post('http://localhost:8181/members', form, { headers: { "Content-Type": "multipart/form-data" } })
        .then(function (res) {
          if (res.status === 200) {
            let dto = res.data.dto;
            console.log(dto);
            self.klogin();
          } else {
            alert('에러코드 :' + res.status);
          }
        })
        .catch(function (error) {
          alert('에러 :' + error);
        });
    },


  }
};
</script>

<style scoped> .form {
   font-family: 'Pretendard-Regular';
   font-weight: 500;
   position: absolute;
   top: 30%;
   left: 50%;
   transform: translate(-50%, -50%);
   width: 300px;
   height: 250px;
   padding: 10px;
   color: darkgrey;
 }

 .form .form-header {

   display: flex;
   align-items: center;
   text-align: center;
   display: flex;
   align-items: center;
   justify-content: center;
 }


 .form.signup .form-header div.show-signup {
   color: #7AC6FF;

 }

 .show-signup {
   font-family: 'Pretendard-Regular';
   font-weight: 400;
   font-size: 40px;
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


 .form-elements input:focus {
   outline: none !important;
   border-color: #7AC6FF;

 }

 .button-wrapper {
   display: flex;
   justify-content: center;
   gap: 15px;
   margin-top: 10px;
 }

 .button-wrapper .custom-link {
   /* 공통 스타일 속성들 */
   border: none;
   background-color: transparent;
   padding: 5px 10px;
   color: #000;
   text-decoration: none;
   position: relative;
   overflow: hidden;
 }

 .button-wrapper .custom-link::before {
   content: '';
   position: absolute;
   width: 100%;
   height: 2px;
   bottom: 0;
   left: 0;
   background-color: transparent;
   visibility: hidden;
   transform: scaleX(0);
   transition: all 0.3s ease-in-out;
 }

 .button-wrapper .custom-link:hover::before {
   visibility: visible;
   background-color: #7AC6FF;
   transform: scaleX(1);
 }

 .button-wrapper .custom-link:hover {
   color: #7AC6FF;
 }
</style>