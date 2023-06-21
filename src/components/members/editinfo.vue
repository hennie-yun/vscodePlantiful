<template>
  <div>
    <div>
      이미지:
      <img :src="'http://localhost:8181/members/plantiful/' + dto.email">
      </div>
    <div>
      email: <input type="text" v-model="email" readonly><br />
      pwd: <input type="password" v-model="pwd"><br />
      new pwd: <input type="password"><br />
      nickname: <input type="text" v-model="nickname" ><br />
      phone: <input type="text" v-model="phone" ><br />
      <button @click="edit">수정</button>
    </div>
  </div>
</template>

<script>
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
    imgedit() {
      this.isVisible = true;
    },
    previewImage(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.img = e.target.result;
      };
      reader.readAsDataURL(file);
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
}
}
}
</script>