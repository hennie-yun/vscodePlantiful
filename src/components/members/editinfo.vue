<template>
  <div id="mypage" style="display: flex; flex-direction: column; align-items: center;">
      <br />
      <br />
      <div>
          <div v-if="changeimg">
              <img :src="changeimg" @click="imgedit" style="max-width: 300px; border-radius: 50%; max-height: 300px;" />
          </div>
          <div v-else>
              <img :src="'http://localhost:8181/members/plantiful/' + dto.email" @error="replaceImg" @click="imgedit"
                  style="width: 300px; border-radius: 50%; height: 300px;" />
          </div>
          <br />

          <div v-show="isVisible" class="button-container">
              <input type="file" id="img" @change="previewImage" accept="image/*">

              <div class="button-wrapper">
                  <button @click="editimg">수정</button>
                  <button @click="delimg">삭제</button>
                  <button @click="cancelEdit">취소</button>
              </div>
          </div>
      </div>


    <div>
      email: <input type="text" v-model="email" readonly><br />
      pwd: <input type="password" v-model="pwd"><br />
      new pwd: <input type="password"><br />
      nickname: <input type="text" v-model="nickname"><br />
      phone: <input type="text" v-model="phone"><br />
      <button @click="edit">수정</button>
    </div>

    <button v-on:click="out">탈퇴</button>
  </div>

</template>

<script>
import img from '@/assets/image/user (2).png';

export default {
  name: 'editinfo',
  data() {
    return {
      email: this.$route.query.email,
      dto: {
        nickname: '',
        phone: '',
        email: '',
      },
      isVisible: false,
      changeimg: null,
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
          self.cash = self.dto.cash;
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
  },
  methods: {
    cancelEdit() {
            this.isVisible = false;
        },
        editimg() {
            const self = this;
            const fileInput = document.getElementById('img');
            if (fileInput.files.length > 0) {
                const form = new FormData();
                const file = fileInput.files.item(0);
                form.append('file', file);
                self.$axios.post('http://localhost:8181/members/' + self.email + '/updateImg', form, { headers: { "Content-Type": "multipart/form-data" } })
                    .then(function (res) {
                        if (res.status == 200) {
                            alert(res.data.message);
                            window.location.reload(true);
                        }
                        self.isVisible = false;
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            } else {
                // Handle the case where no file is selected
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
    
    edit() {
      const self = this;
      const data = {
        email: self.email,
        pwd: self.pwd,
        nickname: self.nickname,
        phone: self.phone
      };
      // json형태로전달할때 JSON.stringify(data) data 를 const로 정의하고 부르면 됌 
      self.$axios.post('http://localhost:8181/members/editinfo/' + self.email, data, JSON.stringify(data))
        .then(function (res) {
          if (res.status == 200) {
            alert(res.data.message);
            location.href = "/mypage";
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
      console.log(token)
      self.$axios.delete('http://localhost:8181/members/' + self.email, { headers: { 'token': token } })
        .then(function (res) {
          if (res.status == 200) {
            if (res.data.flag) {
              alert('탈퇴완료')
              self.logout()
              location.href = '/'
            }
          } else {
            alert('에러')
          }
        });
    },
  }
}
</script>

<style scoped>
.button-container {
     display: flex;
     flex-direction: column;
     align-items: center;
 }

 .button-wrapper {
     display: flex;
     gap: 10px;
 }
 input[type="file"]::-webkit-file-upload-button {
     width: 150px;
     height: 30px;
     background: white;
     border: 1px solid rgb(77, 77, 77);
     border-radius: 10px;
     cursor: pointer;
 }

 input[type="file"]::-webkit-file-upload-button:hover {
     background: #7AC6FF;
     color: white;
 }
</style>