<template>
  <div class="form" :class="activeForm">
  
    <br />
    <div class="form-header">
      <div class="show-signup">카카오톡 간편 회원가입</div>
      </div>
    <div class="form-elements">
      <div class="form-element" style="display: flex;">
        <input v-model="form.email" type="text" style="flex: 1; margin-right: 5px;"
          required disabled />
      </div>
      <div  class="form-element">
        <input type="text" @input="autoHyphen($event.target)" maxlength="13" v-model="phone" placeholder="phone number">
      </div>
      <div class="form-element">
        <input type="text" v-model="form.nickname" required disabled />
      </div>
      <div style="margin-top : 10px;">
        <label  class="input-file-wrapper">
          <div class="upload-button-text" style="text-align: left; color : grey;">{{ uploadButtonText }}</div>
          <input type="file" id="img-input-file" class="form-element" style="display :none;" @change="handleFileUpload" />
        </label>
      </div>
<div class="form-element">
        <button id="submit-btn" @click="onSubmit()">카카오톡으로 회원가입 하기</button>
      </div>
    </div>
  </div>
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
        kakaotoken: ''
      },
      show: true,
      uploadButtonText: '프로필 사진 업로드',
    };
  },
  created() {
    this.code = this.$route.query.code;
    console.log(this.code)
    this.getToken();
  },
  methods: {
    autoHyphen(target) { //전화 번호 입력시 자동 하이픈 (-) 부여 
      target.value = target.value
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
    },
    handleFileUpload() {
      this.uploadButtonText = '프로필 사진 업로드 완료';
    },
    klogin() { //아이디 저장이 되어 있으면 갈 곳 
      const self = this;
      const loginform = new FormData();
      loginform.append('email', self.form.email)
      loginform.append('pwd', self.form.pwd)
      self.$axios.post('http://localhost:8181/members/login', loginform)
        .then(function (res) {
          sessionStorage.setItem('token', res.data.token)
          sessionStorage.setItem('loginId', res.data.loginId)
          const addform = new FormData();
          addform.append('email', self.form.email)
          addform.append('token', self.form.kakaotoken)
          console.log(self.form.kakaotoken)
          self.$axios.post('http://localhost:8181/tokensave', addform)
            .then(function (rep) {
              if (rep.status == 200) {
                alert('토큰세이브')            
              }
            });
          if (res.data.flag) {
            location.href = "/afterlogin"
          }
        })

    },
    getToken() { //토큰 냅다 받아~~ 
      const self = this;
      self.$axios.get('http://localhost:8181/kakaologin/' + self.code)
        .then((res) => {
          console.log(res)
          self.form.email = res.data.email;
          self.form.pwd = res.data.id;
          self.form.nickname = res.data.nickname;
          self.form.kakaotoken = res.data.accessToken;
          self.$axios.get('http://localhost:8181/members/getKakaomember/' + self.form.email)
            .then(function (res) {
              if (res.status == 200) {
                console.log(res.data.flag)
                if (res.data.flag == false) {
                  console.log(res.data.flag)
                  alert('회원가입을하세요')
                } else {
                  self.klogin()
                }
              }
            });
        });
    },
    onSubmit() {
      const self = this;
      const form = new FormData();
      //전화번호 11자리로 고정 
      if (self.phone.replace(/[^0-9]/g, '').length !== 11) {
        alert('전화번호는 11자리의 숫자로만 입력해야 합니다.');
        return;
      } else {
        form.append('phone', self.phone.replace(/[^0-9]/g, ''));
      }
      form.append('email', self.form.email);
      form.append('nickname', self.form.nickname);
      form.append('id', 1)
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

<style scoped> 
.form {
  font-family: 'Pretendard-Regular';
  font-weight: 600;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 250px;
  padding: 10px;
  color : darkgrey;
}
.form .form-header {
  height: 30px;
  display: flex;
  align-items: center;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form .form-header>div {
  color: #7AC6FF;
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  cursor: pointer;
}

.form.signup .form-header div.show-signup {
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


.form-elements input:focus {
  outline: none !important;
  border-color: #7AC6FF;

}
</style>