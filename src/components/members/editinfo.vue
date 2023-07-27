<template>
  <div class="fontchange" id="mypage" style="display: flex;   flex-direction: column; align-items: center;">
    <div class="container">
      <div class="out" @click="out" style="float: right;">탈퇴하기
      </div>
      <div class="middle">
        <div>

          <div v-if="changeimg">
            <img :src="changeimg" @click="imgedit"
              style="margin-top: -40px; margin-bottom:30px; width: 200px; border-radius: 50%; height: 200px;" />
          </div>
          <div v-else>
            <img :src="'http://localhost:8181/members/plantiful/' + dto.email" @error="replaceImg" @click="imgedit"
              style="margin-top: -40px; margin-bottom:30px; width: 200px; border-radius: 50%; height: 200px;" />
          </div>

          <span style="position:absolute; margin-top: -50px; margin-left:130px;" @click="imgedit">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square"
              viewBox="0 0 16 16">
              <path
                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
            </svg>
          </span>
        </div>


        <div>
          <div v-show="isVisible" class="button-container">

            <div class="filebox">
              <label for="file">파일찾기</label>
              <input type="file" id="file" @change="previewImage" accept="image/*">
            </div>




            <div class="button-wrapper">
              <button @click="editimg">수정</button>
              <button @click="delimg">삭제</button>
              <button @click="cancelEdit">취소</button>
            </div>
          </div>
        </div>



        <div>
          <span class="info"> {{ dto.email }} </span>
        </div>
        <br />

        <div class="fullcontainer">
          <div v-if="dto.id == 0" class="input-container">
            <label for="pwd">비밀번호</label>
            <input v-if="changepwd == false" type="password" v-model="pwd" @click="checkpwd" class="input-field">
            <input v-if="changepwd == true" v-model="pwd" type="text" placeholder="비밀번호" @focus="showPasswordMessage"
              @blur="hidePasswordMessage" @input="checkPassword" class="input-field">
          </div>

          <span v-if="!passwordValid && showPasswordMsg" style="font-size: 13px; color :#7AC6FF;  font-weight: bold;">대문자와
            특수문자를 포함한 8자리 이상만 가능합니다.</span>


          <div class="input-container">
            <label for="nickname"> 닉네임</label>
            <input id="nickname" type="text" v-model="nickname" class="input-field">
          </div>

          <div class="input-container">
            <label for="phone">전화번호</label>
            <input class="input-field" type="text" maxlength="11" v-model="phone" placeholder="phone number"
              @click="checkphonenum" v-show="phonecheck">
            <input class="input-field" type="text" maxlength="11" v-model="phone" placeholder="phone number"
              @click="checkphonenum" v-show="!phonecheck">
          </div>
        </div>


        <br />
        <div class="button-wrapper">
          <button @click="edit">수정</button>
          <router-link to="/mypage" class="custom-link">돌아가기</router-link>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
import img from '@/assets/image/account.png';

export default {
  name: 'editinfo',
  data() {
    return {
      email: this.$route.query.email,
      dto: {
        nickname: '',
        phone: '',
        email: '',
        id: ''
      },
      paydto: {
        paidamount: 0
      },
      phonke : '',
      isVisible: false,
      changeimg: null,
      pwd: '',
      changepwd: false,
      passwordValid: false,
      showPasswordMsg: false,
      phonecheck: true
    };
  },

  // 시작하자마자 해당 아이디의 정보를 빼와서 뿌려줌
  created() {
    let token = sessionStorage.getItem('token');
    this.email = sessionStorage.getItem('loginId');
    const self = this;
    self.$axios.get('http://localhost:8181/members/getmember/' + self.email, {
      headers: { 'token': token }
    }).then(function (res) {
      if (res.status == 200) {
        self.dto = res.data.dto;
        if (self.dto != null) {
          self.email = self.dto.email;
          self.pwd = self.dto.pwd;
          self.nickname = self.dto.nickname;
          self.phone = self.dto.phone;
          self.id = self.dto.id;
          if (self.dto.img) {
            self.img = 'http://localhost:8181/members/plantiful/' + self.dto.email;
          }
        } else {
          alert('없는 아이디 혹은 만료된 세션 아이디입니다');
        }
      } else {
        alert('에러');
      }
    });
    self.$axios.get('http://localhost:8181/payment/getcash/' + self.email)
      .then((res) => {
        if (res.status == 200) {
          if (res.data.paydto != null) {
            this.paydto = res.data.paydto;
            this.paidamount = this.paydto.paidamount;
          } else {

          }
        }
      });
  },
  methods: {
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
    cancelEdit() {
      this.isVisible = false;
    },

    editimg() {
      const self = this;
      const fileInput = document.getElementById('file');
      if (fileInput.files.length > 0) {
        const form = new FormData();
        const file = fileInput.files.item(0);
        form.append('file', file);
        self.$axios.post('http://localhost:8181/members/' + self.email + '/updateImg', form, { headers: { "Content-Type": "multipart/form-data" } })
          .then(function (res) {
            if (res.status == 200) {
              alert(res.data.message);
              self.isVisible = false;
              self.img = 'http://localhost:8181/members/plantiful/' + self.email;
              window.location.reload(true);
            }
          })
          .catch(function (error) {
            console.error(error);
          });
      } else {
        console.error('No file selected.');
      }
    },
    delimg() {
      const self = this;
      const form = new FormData()
      form.append('email', self.email)
      self.$axios.post('http://localhost:8181/members/delprofile', form)
        .then(function (res) {
          if (res.status == 200) {
            alert('이미지가 삭제 되었습니다')
            window.location.reload(true);
          }
        });
      self.isVisible = false;
    },
    imgedit() {
      this.isVisible = true;
    },
    previewImage(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.changeimg = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    replaceImg(e) {
      e.target.src = img;
    },
    checkpwd() {
      const self = this;
      const existingPwd = prompt("기존 비밀번호를 입력하세요");

      // 기존 비밀번호 확인
      if (existingPwd === self.dto.pwd) {
        self.pwd = ''; // 새 비밀번호를 초기화
        self.changepwd = true;
      } else {
        alert('기존 비밀번호가 일치하지 않습니다.');
      }
    },
    checkphonenum() {
      const self = this;
      IMP.init("imp66001065");
      IMP.certification({
        pg: 'MIIiasTest',
        merchant_uid: 'merchant_' + new Date().getTime(),
        m_redirect_url: "http://localhost:8182/editinfo"
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
              self.phone = res.data.phone;
              self.phonecheck = false;
              self.$nextTick(() => {
                const secondInput = document.querySelector('.input-container input:last-child');
                if (secondInput) {
                  secondInput.value = res.data.phone;
                }
              });
            });
        }
      })
    },

    edit() {
      const self = this;

      if (self.phone.replace(/[^0-9]/g, '').length !== 11) {
        alert('전화번호는 11자리의 숫자로만 입력해야 합니다.');
        return;
      } else if (!self.phone.startsWith('010')) {
        alert('전화번호 형식이 잘 못 되었습니다');
        return;
      }

      if (this.dto.id == 0) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(self.pwd)) {
          alert('비밀번호는 대문자 1개와 특수문자 1개를 포함한 8자리 이상만 가능합니다. \n 다시 입력 해주세요');
          self.pwd = '';
          return;
        }
      }

      const data = {
        phone: self.phone.replace(/[^0-9]/g, ''),
        email: self.email,
        pwd: self.pwd,
        id: self.id,
        nickname: self.nickname,
      };

      // json형태로전달할때 JSON.stringify(data) data 를 const로 정의하고 부르면 됌 
      self.$axios.post('http://localhost:8181/members/editinfo/' + self.email, data, JSON.stringify(data))
        .then(function (res) {
          if (res.status == 200) {
            alert(res.data.message);

          } else {
            alert('에러코드: ' + res.status);
          }
        });
    },
    logout() {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('loginId')
      location.href = '/';
    },
    out() {
      const self = this;
      let token = sessionStorage.getItem('token')
      if (self.paidamount != 0) {
        alert('충전금이 있어 탈퇴가 불가능합니다')
      }
      else if (confirm("정말 탈퇴 하시겠습니까?")) {
        if (this.dto.id == 0) {
          const existingPwd = prompt("비밀번호를 입력하세요");
          if (existingPwd === self.dto.pwd) {
            self.$axios.delete('http://localhost:8181/members/' + self.email, { headers: { 'token': token } })
              .then(function (res) {
                if (res.status == 200) {
                  if (res.data.flag) {
                    alert('탈퇴완료')
                    self.logout()
                    location.href = '/'
                  } else if (res.data.message) {
                    alert(res.data.message);
                  }
                } else {
                  alert('에러')
                }
              });
          }
        }
        else {
          alert('간편 로그인 탈퇴를 진행 합니다');
          self.$axios.delete('http://localhost:8181/members/' + self.email, { headers: { 'token': token } })
            .then(function (res) {
              if (res.status == 200) {
                if (res.data.id) {
                  if (res.data.id == 1) { //카카오톡이라면 
                    self.$axios.delete('http://localhost:8181/tokensave/deltoken/' + self.email)
                      .then(function (res) {
                        if (res.status == 200) {
                          alert('탈퇴완료')
                          self.logout()
                          location.href = '/'
                        } else {
                          alert('에러')
                        }
                      });
                  }
                  else { //네이버라면 
                    self.$axios.delete('http://localhost:8181/members/' + self.email, { headers: { 'token': token } })
                      .then(function (res) {
                        if (res.status == 200) {
                          if (res.data.flag) {
                            alert('탈퇴완료')
                            self.logout()
                            location.href = '/'
                          } else if (res.data.message) {
                            alert(res.data.message);
                          }
                        } else {
                          alert('에러')
                        }
                      });
                  }
                }
              }
            });
        }
      }
    }
  }
}
</script>

<style scoped>
.fontchange {
  font-family: 'Pretendard-Regular';
  font-weight: 400;
  font-size: 16px;
}

.out {
  float: right;
  margin-top: 10px;
  color: gray;
  cursor: pointer;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-wrapper {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.button-wrapper button,
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

.button-wrapper .custom-link::before,
.button-wrapper button::before {
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

.button-wrapper button:hover::before,
.button-wrapper .custom-link:hover::before {
  visibility: visible;
  background-color: #7AC6FF;
  transform: scaleX(1);
}

.button-wrapper .custom-link:hover,
.button-wrapper button:hover {
  color: #7AC6FF;
}


.info {
  position: relative;
  padding-left: 20px;
  padding-right: 20px;
  flex-direction: row;
  align-items: center;
  font-family: 'Pretendard-Regular';
  font-weight: 600;
  font-size: 30px;
  background: linear-gradient(to top, #c0e8f8 40%, transparent 40%);
}

.container {
  width: 450px;
  height: 600px;
  border: 2px solid #7AC6FF;
  margin: 50px 20px;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 3%;
}

div.middle {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
}


.filebox label {
  display: inline-block;
  padding: 5px 10px;
  color: black;
  vertical-align: middle;
  background-color: white;
  border-radius: 20px;
  border: 2px solid #696969;
  cursor: pointer;
  height: 40px;
  margin-left: 10px;
}

.filebox label:hover {
  background: #7AC6FF;
  color: white;
}

.filebox input[type="file"] {
  position: absolute;
  width: 0;
  height: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
}


input[type="file"] {
  width: 150px;
  height: 30px;
  background: white;
  border: 1px solid rgb(77, 77, 77);
  border-radius: 10px;
  cursor: pointer;
}




.input-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-container label {
  margin-right: 10px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #7AC6FF;
  width: 100px;
  height: 40px;
}

.input-container input {
  margin-right: 10px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #7AC6FF;
  width: 180px;
  height: 40px;
}


.fullcontainer {
  padding-left: 8%;
}
</style>