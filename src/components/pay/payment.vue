<template>
    <section class="test">
        {{ dto.email }}
        전화번호 : {{ dto.phone }}
        {{ dto.nickname }} 님


        <input type="number" placeholder="금액 입력" v-model="price">
        <div @click="Paybtn">카카오페이 가상 결제</div>
        <div @click="KGpay">이니시스 진짜로 결제</div>



        남은 금액 : {{ paydto.paidamount }} <br/>

       계좌 번호 입력 하세요~~ <input type="number" placeholder="인출 입력" v-model="withdraw">
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
            withdraw : 0,
            email: this.$route.query.email,
            dto: {
                nickname: '',
                phone: '',
                email: ''
            },
            paydto:{
                paidamount : 0 
            }
        };
    },
    created() {
        let token = sessionStorage.getItem('token');
        this.email = sessionStorage.getItem('loginId');
        console.log(this.email);
        const self = this;

        self.$axios.get('http://localhost:8181/members/getmember/' + self.email, { headers: { 'token': token } })
            .then(function (res) {
                if (res.status === 200) {
                    self.dto = res.data.dto;
                    if (self.dto != null) {
                        self.email = self.dto.email;
                        self.nickname = self.dto.nickname;
                        self.phone = self.dto.phone;
                        if (self.dto.img) {
                            self.img = 'http://localhost:8181/members/plantiful/' + self.dto.email;
                        }
                    } else {
                        alert('없는 아이디 혹은 만료된 세션 아이디입니다');
                    }
                } else {
                    alert('에러코드');
                }
            })
            .catch(function (error) {
                console.error(error);
                alert('에러가 발생했습니다');
            });

        self.$axios.get('http://localhost:8181/payment/getcash/' + this.email)
        .then(function (res) {
                if (res.status === 200) {
                    console.log(res.data.paydto);
                    self.paydto = res.data.paydto;
                    console.log(self.paydto.paidamount);
                    if (self.paydto != null) {
                        self.paidamount = self.paydto.paidamount;
                    } else {
                        alert('에러1');
                    }
                } else {
                    alert('에러2');
                }
            })
            .catch((error) => {
                console.error(error);
                alert('에러가 발생했습니다');
            });
    },
    methods: {
       
        KGpay() {
            const self = this;
            IMP.init("imp66001065");
            IMP.request_pay({
                pg: 'html5_inicis',
                pay_method: 'card',
                merchant_uid: this.email + '_' + new Date().getTime(),
                name: 'Plantiful Point',
                amount: this.price,
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
                    console.log('폼데이터에 뭐있냐면' + form)
                    self.$axios.post('http://localhost:8181/payment', form)
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
            const form = new FormData();
            const withdraw = self.withdraw;
            const email = self.email;
            form.append("paidamount", withdraw)
            form.append ("email", email)
            IMP.certification({
                pg: 'MIIiasTest',
                merchant_uid: 'merchant_' + new Date().getTime(),
                m_redirect_url: "http://localhost:8181"
            }, function (rsp) {
                if (rsp.success) {
                    // 인증성공
                    const data = {
                        imp_uid: rsp.imp_uid,
                        email: self.email
                    };
                    self.$axios.get("http://localhost:8181/members/certifications/redirect", { params: data })
                        .then(function (res) {
                            console.log(res.data);
                            console.log(res.data.flag);
                            if (res.data.flag === false) {
                                alert('등록된 전화번호와 본인인증 전화번호가 일치하지 않습니다');

                                // 돈 안빠져나가게 하는 로직 추가
                            } else {
                                alert('인출이 완료되었습니다');
                             self.$axios.post('http://localhost:8181/payment/withdraw/' + email, form)
                             .then(function (res) { 
                                if(res.status ==200){
                                    alert(res.data.message)
                                } else {
                                    alert(res.data.message)
                                }
                             }); 
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
