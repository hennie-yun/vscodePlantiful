<template>
    <section class="test">
        {{ dto.email }} 
        전화번호 : {{ dto.phone }}
        {{ dto.nickname }} 님 
        <input type="number" placeholder="금액 입력" v-model="price">
        <div @click="Paybtn">결제</div>
    </section>
</template>
  
<script>

const { IMP } = window;

export default {
    name: 'payment',
    data() {
        return {
            price: 0,
            email: this.$route.query.email,
            dto: {
                nickname: '',
                phone: '',
                email: ''
            },
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
                        self.nickname = self.dto.nickname
                        self.phone = self.dto.phone
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
        Paybtn() {
            IMP.init("imp66001065");
            IMP.request_pay({
                pg: 'kakaopay',
                merchant_uid: "order_no_0002", //자동 할당 되게 바꿔야하고 
                name: '결제테스트',
                amount: this.price,
                buyer_email: this.email,
                buyer_name: this.nickname,
                buyer_tel: this.phone,
                buyer_addr: '경기도 성남대로34',
                buyer_postcode: '123-456'
            }, rsp => {  
                console.log(rsp);
                if (rsp.success) {
                    // $axios 로 데이터베이스에 금액 집ㅇ ㅓ넣는거 해야댐 
                    console.log("결제 성공");
                } else {
                    console.log("결제 실패");
                }
            });

        }
    }
}
</script>
