<template>
    <div id="mypage">
        <h3>mypage</h3>
        <img :src="'C:/plantiful/' + dto.email">
        <img v-bind:src="'C:/plantiful/' + dto.email" />

        {{ dto.nickname }}
        {{ dto.phone }}
        {{ dto.email }}
        <button v-on:click="out">탈퇴</button>
    </div>
   
</template>
  
<script>
export default {
    name: 'mypage',
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
    methods: {
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
                            location.href ='/'
                            
                        }
                    } else {
                        alert('에러')
                    }
                });
        }
    }
}
</script>