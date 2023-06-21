<template >
    <div>
        이미지 : <img :src="'C:/plantiful/' + dto.email" ><br/>
    email:<input type="text" v-model="email" readonly><br />
    pwd:<input type="password" v-model="pwd"><br />
    new pwd:<input type="password" ><br />
    nickname:<input type="text" v-model="nickname" :placeholder="dto.nickname"><br />
    phone:<input type="text" v-model="phone" :placeholder="dto.phone"><br />
    <button v-on:click="edit"> 수정</button>
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
                email: ''
            }
        }
    },
    created: function () {
        let token = sessionStorage.getItem('token')
        this.email = sessionStorage.getItem('loginId')
        console.log(this.email);
        const self = this;
        self.$axios.get('http://localhost:8181/members/getmember/' + self.email, { headers: { 'token': token } })
            .then(function (res) {
                if (res.status == 200) {
                    self.dto = res.data.dto
                    if (self.dto != null) {
                        self.email = self.dto.email
                        self.pwd = self.dto.pwd
                        self.nickname = self.dto.nickname
                        self.phone = self.dto.phone
                        self.cash = self.dto.cash
                        self.img = self.dto.img
                    } else {
                        alert('없는 아이디 혹은 만료 된 세션 아이디 입니다')
                    }
                } else {
                    alert('에러코드')
                }
            })
    },
    methods : {
        edit(){
      const self = this;
      let form = new FormData();
      form.append('email', self.email)
      form.append('pwd', self.pwd)
      form.append('nickname', self.nickname)
      form.append('phone', self.phone)
      const file = document.getElementById('img').files.item(0);
      form.append('f', file);
      self.$axios.post('http://localhost:8181/members', form)
        .then(function (res) {
          if (res.status == 200) {
            let dto = res.data.dto
            console.log(dto)
            location.href="/mypage" 
          } else {
            alert('에러코드 :' + res.status)
          }
        });
    }
    }  
}
</script>
<style lang="">
    
</style>