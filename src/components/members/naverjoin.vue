<template>
  <div class="form" :class="activeForm">
  
    <br />
    <div>
  </div>
    <div class="form-header">
      <img :src="require('@/assets/image/naverlogin.jpg')" style="width: 30%; height:25%;"/>
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
    autoHyphen(target) { //전화 번호 입력시 자동 하이픈 (-) 부여 
      target.value = target.value
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
    },

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
                location.href="/calendar"            
              } else {
                alert ('여기서 오류다~ ')
              }
            });
          }
          })
        },
    getToken(code, state) { //토큰 냅다 받아~~ 
      const self = this;
      let formData = new FormData()
      formData.append('code', self.code)
      formData.append('state', self.state)
      self.$axios.post('http://localhost:8181/api/naver/login', formData)
        .then((res) => {
          if(res.status==200){
            if(res.data.userinfo.message){
              alert(res.data.userinfo.message);
              location.href = "/"
            } else {
          console.log(res.data)
           self.form.email = res.data.userinfo.naverResponse.email;
           self.form.pwd = res.data.userinfo.naverResponse.id;
           self.form.nickname = res.data.userinfo.naverResponse.nickname;
           self.form.navertoken = res.data.access_token;
            }
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
          }
        });
    },
    
    onSubmit() {
      const self = this;
      const form = new FormData();
      //전화번호 11자리로 고정 
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

<style scoped> 
.form {
  font-family: 'Pretendard-Regular';
  font-weight: 500;
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

.show-signup{
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

.button-wrapper .custom-link::before{
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