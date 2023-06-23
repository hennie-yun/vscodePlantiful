<template>
    <div id="mypage">
        <h3>mypage</h3>
        <div>
            이미지:
            <div v-if="changeimg">
                <img :src="changeimg" @click="imgedit" style="max-width: 200px; max-height: 200px;" />
            </div>
            <div v-else>
                <img :src="'http://localhost:8181/members/plantiful/' + dto.email" @click="imgedit"
                    style="max-width: 200px; max-height: 200px;" />
            </div>

            <div v-show="isVisible">
                <input type="file" id="img" @change="previewImage" accept="image/*">
                <button @click="editimg">수정</button>
                <button @click="delimg">삭제</button>
            </div>
        </div>

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
            },
            isVisible: false,
            changeimg: null
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
                        if (self.dto.img) {
                            self.img = 'http://localhost:8181/members/plantiful/' + self.dto.email;
                        }
                    } else {
                        alert('없는 아이디 혹은 만료된 세션 아이디입니다')
                    }
                } else {
                    alert('에러코드')
                }
            })
    },
    methods: {
        editimg() {
            const self = this;
            const form = new FormData();
            const file = document.getElementById('img').files.item(0);
            form.append('file', file);
            self.$axios.post('http://localhost:8181/members/' + self.email + '/updateImg', form, { headers: { "Content-Type": "multipart/form-data" } })
                .then(function (res) {
                    if (res.status == 200) {                     
                        alert(res.data.message); // 수정: response 객체의 message 사용
                        window.location.reload(true); //새로고침해야 사진이 떠서 자동으로 페이지 reload 시켜줌              
                    }
                    self.isVisible=false;
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        delimg(){
            const self = this; 
            const form = new FormData()
            form.append('email',self.email)
            self.$axios.post('http://localhost:8181/members/delprofile' ,form)
            .then(function (res) {                
                    if (res.status == 200) {
                        alert('이미지가 삭제 되었습니다')
                        window.location.reload(true); 
                    }
                });
                self.isVisible=false;
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
        }
    }
}
</script>
  