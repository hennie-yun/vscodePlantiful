<template>
    <section class="test">
        {{ dto.email }}
        전화번호 : {{ dto.phone }}
        {{ dto.nickname }} 님
        <input type="number" placeholder="금액 입력" v-model="price">
        <!-- <div @click="Paybtn">카카오페이 가상 결제</div> -->
        <div @click="KGpay">이니시스 진짜로 결제</div>

        <button @click="checkmyinfo">본인인증</button>
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
        // Paybtn() {
        //     const self = this;
        //     const data = {
        //         email: self.email,
        //         pwd: self.pwd,
        //         nickname: self.nickname,
        //         phone: self.phone,
        //         cash: self.price
        //     };
        //     console.log(data)

        //     IMP.init("imp66001065");
        //     IMP.request_pay({
        //         pg: 'kakaopay',
        //         merchant_uid: this.email + '_' + new Date().getTime(),
        //         name: '람보르기니',
        //         amount: this.price,
        //         buyer_email: this.email,
        //         buyer_name: this.nickname,
        //         buyer_tel: this.phone,
        //         buyer_addr: '경기도 성남대로34',
        //         buyer_postcode: '257'
        //     }, rsp => {
        //         console.log(rsp);
        //         if (rsp.success) {
        //             console.log("결제 성공");
        //             self.$axios.post('http://localhost:8181/payment' + self.email, data, JSON.stringify(data))
        //                 .then(function (res) {
        //                     if (res.status == 200) {
        //                         alert('여기까지DB들어갔니? ');
        //                     } else {
        //                         alert('에러코드: ' + res.status);
        //                     }
        //                 });
        //         } else {
        //             console.log("결제 실패");
        //         }
        //     });

        // },
        KGpay() {
            const self = this;
            IMP.init("imp66001065");
            IMP.request_pay({
                pg: 'html5_inicis',
                pay_method: 'card',
                merchant_uid: this.email + '_' + new Date().getTime(),
                name: 'Plantiful Point',
                amount: 100,
                buyer_email: this.email,
                buyer_name: this.email,
                buyer_tel: this.phone,
                buyer_addr: '경기도 성남대로34',
                buyer_postcode: '257'
            }, function (rsp) {
                var result = '';
                if (rsp.success) {
                    var msg = '결제가 완료되었습니다.';
                    msg += '고유ID : ' + rsp.imp_uid;
                    msg += '상점 거래ID : ' + rsp.merchant_uid;
                    msg += '결제 금액 : ' + rsp.paid_amount;
                    msg += '카드 승인번호 : ' + rsp.apply_num;
                    result = '0';
                    const form = new FormData();
                    form.append('impuid', rsp.imp_uid)
                    form.append('merchantuid', rsp.merchant_uid)
                    form.append('paidamount', rsp.paid_amount)
                    form.append('applynum', rsp.apply_num)
                    form.append('email', self.email)
                    console.log(form)
                    self.$axios.post('http://localhost:8181/payment/' +self.email, form)
                        .then(function (res) {
                            if (res == 200) {
                                console.log(res)
                            }
                        });
                } else {
                    var msg = '결제에 실패하였습니다.';
                    msg += '에러내용 : ' + rsp.error_msg;
                    result = '1';
                }
                if (result == '0') {
                    alert('성공')
                }
                alert(msg);
            });
        },
        checkmyinfo() {
            IMP.init("imp66001065");
            const self = this;
            IMP.certification({
                pg: 'MIIiasTest',
                merchant_uid: 'merchant_' + new Date().getTime(),
                m_redirect_url: "http://localhost:8181/members/checkmyinfo"
            }, function (rsp) {
                if (rsp.success) {
                    // 인증성공D
                    console.log(rsp.imp_uid);
                    console.log(rsp.merchant_uid);
                    const data = {
                        imp_uid: rsp.imp_uid,
                        email : self.email
                    };
                    self.$axios.get("http://localhost:8181/members/certifications/redirect", {
                        params: data})
                        .then(function (res) {
                            console.log(res.data)
                            if(res.data == false){
                                alert('등록 된 전화번호와 본인인증 전화번호가 일치하지 않습니다')
                                // 뭐 돈 안빠져나가게 하는 로직 어쩌고~
                            } else {
                             alert('인출이 완료 되었습니다')
                             location.href ="/mypage"
                            }
                        });

                } else {
                    // 인증취소 또는 인증실패
                    var msg = '인증에 실패하였습니다.';
                    msg += '에러내용 : ' + rsp.error_msg;

                    alert(msg);
                }
            });

        }
    }
}
</script>
