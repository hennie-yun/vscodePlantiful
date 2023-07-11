<template>
    <div>

        <!-- 출금로직 -->
        <div class="black-bg" v-if="openModal == true">
            <div class="white-bg">
                <p style="font-size: 25px; border-bottom: 1px solid #7AC6FF; padding-bottom: 5px;"> 포인트 충전 </p>

                <div class="inputbox">
                    <input class="numberform" type="text" :placeholder="isPlaceholderVisible ? '충전 할 금액을 입력해 주세요' : ''"
                        v-model="formattedPrice" @focus="isPlaceholderVisible = false" @blur="handleBlur"
                        @input="formatPrice">
                </div>
                <br /><span v-if="contractformcheck == false" @click="requestcontractform" style="cursor: pointer;">이용약관 동의</span><br />
                <div class="button-wrapper">
                    <button @click="KGpay">충전</button>
                    <button @click="close">닫기</button>
                </div>
            </div>
        </div>


        <!-- 출금 이용약관 -->
        <!-- <div class ="black-bg"></div> -->
        <div class="contract" v-if="contractform == true">
            <h3>결제 서비스 이용 약관 </h3>
            <div class="text">
                가. 개인정보의 수집 및 이용 목적<br />

                국가공간정보포털은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에
                따라
                별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.<br />

                나. 정보주체와 법정대리인의 권리ㆍ의무 및 행사방법<br />
                ① 정보주체(만 14세 미만인 경우에는 법정대리인을 말함)는 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
                ② 제1항에 따른 권리 행사는 개인정보보호법 시행규칙 별지 제8호 서식에 따라 작성 후 서면, 전자우편 등을 통하여 하실 수 있으며, 기관은 이에 대해 지체 없이 조치하겠습니다.
                ③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 개인정보 보호법 시행규칙 별지 제11호 서식에 따른 위임장을 제출하셔야
                합니다.
                ④ 개인정보 열람 및 처리정지 요구는 개인정보 보호법 제35조 제5항, 제37조 제2항에 의하여 정보주체의 권리가 제한 될 수 있습니다.
                ⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.
                ⑥ 정보주체 권리에 따른 열람의 요구, 정정ㆍ삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.
                <br />
                다. 수집하는 개인정보의 항목<br />
                국가공간정보포털 회원정보(필수): 이름, 이메일(아이디), 비밀번호
                <br />
                라. 개인정보의 보유 및 이용기간<br />
                국가공간정보포털은 법령에 따른 개인정보 보유ㆍ이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유ㆍ이용기간 내에서 개인정보를 처리ㆍ보유합니다.
                - 수집근거: 정보주체의 동의
                - 보존기간: 회원 탈퇴 요청 전까지(1년 경과 시 재동의)
                - 보존근거: 정보주체의 동의
                <br />
                마. 동의 거부 권리 및 동의 거부에 따른 불이익<br />
                위 개인정보의 수집 및 이용에 대한 동의를 거부할 수 있으나, 동의를 거부할 경우 회원 가입이 제한됩니다.
            </div>
            <div>
                <div class="button-wrapper">
                    <p><button class="box" @click="agree">동의</button></p>
                    <p><button class="box" @click="reject">거부</button></p>
                </div>
            </div>
        </div>

        <!-- 인출로직 -->
        <div class="black-bg" v-if="refundModal == true">
            <div class="refund-bg">
                <p style="font-size: 25px; border-bottom: 1px solid #7AC6FF; padding-bottom: 5px;"> 포인트 인출 </p>

                <div class="withdrawout"
                    style=" display: flex; align-items: center; justify-content: center; margin-bottom:-10px;">
                    <span class="cashout"> {{ paydto.paidamount }} 포인트 </span>
                </div>

                <div class="inputbox">

                    <input class="numberform" type="text" :placeholder="isPlaceholderVisible ? '인출 할 금액을 입력해 주세요' : ''"
                        v-model="formattedPrice" @focus="isPlaceholderVisible = false" @blur="handleBlur"
                        @input="formatPrice">
                </div>

                <div class="bankselect">
                    <select class="form-select" id="bankselect" v-model="bankname" aria-label="Default select example">
                        <option value="">은행선택</option>
                        <option value="1">국민은행</option>
                        <option value="2">우리은행</option>
                        <option value="3">신한은행</option>
                        <option value="4">기업은행</option>
                        <option value="5">하나은행</option>
                        <option value="6">농협은행</option>
                        <option value="7">외환은행</option>
                        <option value="8">카카오뱅크</option>
                        <option value="9">부산은행</option>
                        <option value="10">우체국</option>
                        <option value="11">대구은행</option>
                        <option value="12">전북은행</option>
                        <option value="13">제주은행</option>
                        <option value="14">수협은행</option>
                        <option value="15">씨티은행</option>
                        <option value="16">경남은행</option>
                    </select>
                    <input class="inputname" id="accountname" type="text" v-model="name" placeholder="예금주명">
                    <br />
                </div>
                <br />
                <div class="account">
                    <input class="inputaccount" id="accountnum"  maxlength="14" :value="accountnum" @input="handleInput" placeholder="계좌번호">
                </div>

                <br /><span v-if="outcontractformcheck == false" @click="outcontractform">이용약관 동의</span><br />

                <div class="button-wrapper">
                    <button @click="checkmyinfo">인출</button>
                    <button @click="close">닫기</button>
                </div>
            </div>
        </div>

        <!-- 인출 이용약관 -->
        <div class="contract" v-if="withdrawcontractform == true">
            <h3>계좌 개인정보 서비스 이용 약관 </h3>
            <div class="text">

                제1조(목적) 이 약관은 〇〇은행(이하 “은행”이라 합니다.)과 이용자 사이의 전자금융거래에 관한 기본적인 사항을 정함으로써, 거래의 신속하고 효율적인 처리를 도모하고 거래당사자 상호간의
                이해관계를
                합리적으로 조정하는 것을 목적으로 합니다.
                제2조(용어의 정의)
                ① 이 약관에서 사용하는 용어의 의미는 다음 각 호와 같습니다.
                1. “전자금융거래”라 함은 은행이 전자적 장치를 통하여 제공하는 금융상품 및 서비스를 이용자가 전자적 장치를 통하여 비대면·자동화된 방식으로 직접 이용하는 거래를 말합니다.
                2. “이용자”라 함은 전자금융거래를 위하여 은행과 체결한 계약(이하 "전자금융거래계약"이라 합니다.)에 따라 전자금융거래를 이용하는 고객을 말합니다.
                3. “지급인”이라 함은 전자금융거래에 의하여 자금이 출금되는 계좌(이하 “출금계좌”라 합니다.)의 명의인을 말합니다.
                4. “수취인”이라 함은 전자금융거래에 의하여 자금이 입금되는 계좌(이하 “입금계좌”라 합니다.)의 명의인을 말합니다.
                5. “전자적 장치”라 함은 현금자동지급기, 자동입출금기, 지급용단말기, 컴퓨터, 전화기 그 밖에 전자적 방법으로 전자금융거래정보를 전송하거나 처리하는데 이용되는 장치를 말합니다.
                6. “접근매체”라 함은 전자금융거래에 있어서 거래지시를 하거나 이용자 및 거래내용의 진정성을 확보하기 위하여 사용되는 다음 각목의 어느 하나에 해당하는 수단 또는 정보를 말합니다.
                가. 은행이 제공한 전자식 카드 및 이에 준하는 전자적 정보
                나.「전자서명법」에 따른 전자서명생성정보 또는 인증서
                다. 은행에 등록된 이용자 번호
                라. 등록되어 있는 이용자의 생체정보
                마. 가목 또는 나목의 수단이나 정보를 사용하는 데 필요한 비밀번호
                7. “전자문서”라 함은 「전자문서 및 전자거래기본법」 제2조 제1호의 규정에 따라 작성·변환되거나 송신·수신 또는 저장된 정보를 말합니다.
                8. “거래지시”라 함은 이용자가 전자금융거래계약에 의하여 은행에 개별적인 전자금융거래의 처리를 지시하는 것을 말합니다.
                9. “오류”라 함은 이용자의 고의 또는 과실 없이 전자금융거래가 약관(개별약관을 포함합니다.), 전자금융거래계약 또는 이용자가 거래지시한 대로 이행되지 아니한 경우를 말합니다.
                10. “계좌송금”이라 함은 이용자가 자동입출금기를 통하여 자기 또는 타인의 계좌에 자금을 입금하는 것을 말합니다.
                11. “계좌이체”라 함은 지급인의 전자적 장치를 통한 지급지시에 따라 은행이 지급인의 출금계좌에서 자금을 출금하여 같은 은행 또는 다른 은행의 계좌에 입금하는 것을 말합니다.
                12. “예약에 의한 계좌이체”라 함은 계좌이체가 장래의 특정일자에 이루어지도록 이용자가 미리 거래지시하고 은행이 이를 해당일자에 처리하는 것을 말합니다.
                13. “추심이체”라 함은 수취인의 전자적 장치를 통한 추심지시에 따라 은행이 지급인의 출금계좌에서 자금을 출금하여 같은 은행 또는 다른 은행의 계좌에 입금하는 것을 말합니다.
                14. “예약에 의한 추심이체”라 함은 추심이체가 장래의 특정일자에 이루어지도록 이용자가 미리 거래지시하고 은행이 이를 해당일자에 처리하는 것을 말합니다.
                15. “지연이체”라 함은 이용자가 계좌이체 거래지시를 한 시점으로부터 일정시간이 경과한 후에 은행이 이를 처리하는 것을 말합니다.
                16. “영업일”이라 함은 통상 은행이 영업점에서 정상적인 영업을 하는 날을 말합니다.
                17. “단말기 지정 및 이용”이라 함은 이용자가 전자금융거래 시 계좌이체가 가능한 전자적 장치(이하 “단말기”라 합니다.)의 IP주소, MAC주소 등 기기정보를 은행에 등록하고 이용하는
                것을
                말합니다.
                18. “추가적인 보안조치”라 함은 이용자가 지정하지 않은 단말기를 이용하여 전자금융거래를 하는 경우 제6호의 접근매체 외의 휴대폰 문자 또는 2채널(서로 다른 두 가지 이상의 통신
                경로를
                이용) 등의
                수단으로 본인임을 확인하는 방법을 말합니다.
                19. “전자서명”이라 함은 「전자서명법」 제2조 제2호의 규정에 따른 전자서명을 말합니다.
                ② 이 약관에서 별도로 정하지 아니한 용어는 「전자금융거래법」 및 관계 법령 등에서 정하는 바에 따릅니다.
            </div>
            <div>
                <div class="button-wrapper">
                    <p><button class="box" @click="withdrawagree">동의</button></p>
                    <p><button class="box" @click="withdrawreject">거부</button></p>
                </div>
            </div>
        </div>


        <div class="container">
            <div>
                <img :src="'http://localhost:8181/members/plantiful/' + email" @error="replaceImg"
                    style="margin-top: -20px; margin-bottom:30px; width: 200px; border-radius: 50%; height: 200px;" />
            </div>


            <span class="info">{{ dto.nickname }}</span>
            <br />

            <div style=" display: flex; align-items: center; justify-content: center; margin-bottom:-25px;">

                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-coin"
                    viewBox="0 0 16 16">
                    <path
                        d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z" />
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />

                </svg>

                <span class="cash"> 보유 포인트 {{ paydto.paidamount }}</span>
            </div>
            <div v-show="Visible" style="margin-top: 45px; text-align: center;">
                <div class="button-wrapper1" style="display: flex; justify-content: center;">
                    <button @click="openModal = true">포인트 충전</button>
                    <button @click="[refundModal = true, Visible = false]">포인트 인출</button>
                </div>
                <br>
                <div class="button-wrapper">
                    <router-link to="/mypage" class="custom-link" style="font-weight: 300px;">돌아가기</router-link>
                </div>
            </div>


        </div>

    </div>
</template>
  
<script>
import img from '@/assets/image/user (2).png';


const { IMP } = window;

export default {
    name: 'payment',
    data() {
        return {
            email: this.$route.query.email,
            accountnum: '',
            name: '',
            accountnum: '',
            bankname: '',
            dto: {
                nickname: '',
                phone: '',
                email: ''
            },
            paydto: {
                paidamount: 0
            },
            openModal: false,
            refundModal: false,
            contractform: false, // 충전 이용약관 폼 
            contractformcheck: false, // 충전 이용약관 폼 보시겠어요? 동의 후에는 true임
            withdrawcontractform: false, //인출 이용약관 폼
            Visible: true,
            price: 0,
            formattedPrice: '',
            isPlaceholderVisible: true,
            outcontractformcheck: false
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
            }),
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
        replaceImg(e) {
      e.target.src = img;
    },
        formatPrice() {
            const numericValue = this.formattedPrice.replace(/[^0-9]/g, '');
            const formattedValue = this.addCommas(numericValue);

            this.price = numericValue !== '' ? parseInt(numericValue) : 0;
            this.formattedPrice = formattedValue;
        },
        addCommas(value) {
            return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        handleBlur() {
            if (this.formattedPrice === '') {
                this.isPlaceholderVisible = true;
            }
        },

        KGpay() {
            const self = this;
            if (self.price == null || self.price == '') {
                alert('금액을 입력하세요')
            } else if (self.contractformcheck == false) {
                alert('이용약관에 동의 해주세요')
            } else {
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
                        // var msg = '결제가 완료되었습니다.';
                        // msg += '고유ID : ' + rsp.imp_uid;
                        // msg += '상점 거래ID : ' + rsp.merchant_uid;
                        // msg += '결제 금액 : ' + rsp.paid_amount;
                        // msg += '카드 승인번호 : ' + rsp.apply_num;
                        result = '0';
                        const form = new FormData();
                        // form.append('impuid', rsp.imp_uid)
                        // form.append('merchantuid', rsp.merchant_uid)
                        form.append('paidamount', rsp.paid_amount)
                        // form.append('applynum', rsp.apply_num)
                        form.append('email', self.email)
                        console.log(form)
                        self.$axios.post('http://localhost:8181/payment/' + self.email, form)
                            .then(function (res) {
                                if (res.status == 200) {
                                    console.log(res)
                                    self.close();
                                    window.location.reload(true);
                                }
                            });
                    } else {
                        var msg = '결제에 실패하였습니다.';
                        result = '1';
                        self.contractformcheck = false;
                        self.formattedPrice = '';
                        self.price = 0;
                        self.isPlaceholderVisible = true;
                    }
                    if (result == '0') {
                        alert('성공')
                    }
                    // alert(msg);
                    self.contractformcheck = false
                });
            }
        },
        handleInput(event) {
      if (event.target.value.length > event.target.maxLength) {
        this.accountnum = event.target.value.slice(0, event.target.maxLength);
      } else {
        this.accountnum = event.target.value;
      }
    },
        checkmyinfo() {
            const self = this;
            const bankselect = document.getElementById('bankselect');
            const accountname = document.getElementById('accountname');
            const accountnum = document.getElementById('accountnum');

            if (bankselect.value == '' || accountname.value == '' || accountnum.value == '') {
                alert('입력 양식이 모두 채워지지 않았습니다.\n 모두 채운 후 다시 이용해 주세요.');
            } else if (self.price > self.paydto.paidamount) {
                alert('인출액이 보유 포인트보다 많아 거래가 불가능합니다')
                self.formattedPrice = '';
                self.isPlaceholderVisible = true;
            } else if (self.price == null || self.price == ' ') {
                alert('금액이 입력 되지 않았습니다')
            } else if (self.outcontractformcheck == false) {
                alert('이용약관에 동의 해주세요')
            } else {
                IMP.init("imp66001065");
                IMP.certification({
                    pg: 'MIIiasTest',
                    merchant_uid: 'merchant_' + new Date().getTime(),
                    m_redirect_url: "http://localhost:8181/members/checkmyinfo"
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
                                if (res.status == 200) {
                                    console.log('데이터임' + res.data)
                                    console.log('이름만빼옴' + res.data.name);
                                    console.log('입력한 이름' + self.name)
                                    if (res.data.flag == false || res.data.name != self.name) {
                                        alert('plantiful에 등록 된 예금주 성함 및 전화번호가 본인인증 결과와 일치하지 않습니다.')
                                        self.outcontractformcheck = false;
                                        self.name = '';
                                        self.bankname = '';
                                        self.accountnum = '';
                                    } else {
                                        console.log(self.price)
                                        const form = new FormData();
                                        form.append("email", self.email);
                                        form.append("paidamount", self.price);
                                        self.$axios.post("http://localhost:8181/payment/withdraw/" + self.email, form)
                                            .then(function (res) {
                                                if (res.status == 200) {
                                                    alert('인출이 성공적으로 이루어졌습니다')
                                                    self.refundModal = false;
                                                    window.location.reload(true);
                                                } else {
                                                    alert(res.data.message)
                                                    self.refundModal = false;
                                                    window.location.reload(true);
                                                }
                                            });
                                    }
                                }
                            });

                    } else {
                        // 인증취소 또는 인증실패
                        var msg = '인증에 실패하였습니다.';
                        msg += '에러내용 : ' + rsp.error_msg;
                        alert(msg);
                        self.accountnum = '';
                        self.name = '';
                        self.bankname = '';
                        self.outcontractformcheck = false;
                    }
                });
            }
        },
        close() {
            this.openModal = false;
            this.refundModal = false;
            this.contractformcheck = false;
            this.price = '';
            this.Visible = true;
            this.isPlaceholderVisible = true;
            this.formattedPrice = '';
            this.outcontractformcheck = false;
            this.accountnum = '';
            this.name = '';
            this.bankname = '';
        },
        requestcontractform() {
            this.openModal = false; //띄웠던 모달창을 닫고 
            this.contractform = true; //약관폼을 보여줘             
        },
        agree() { //동의한다면 
            this.contractform = false; //약관폼을 안보이게하고 
            this.contractformcheck = true; //약관동의하라는 문구도 안보이게해 
            this.openModal = true;// 그리고 모달창을 다시 띄워 
        },
        reject() { //거절한다면 
            this.contractformcheck = false; //약관동의하라는 문구 보여주고 
            this.contractform = false; //약관폼은 안보이게 
            this.openModal = true; //모달창은 띄어 
        },
        outcontractform() { //인출이용약관보겠어? 
            this.refundModal = false; //띄웠던 모달창을 닫고 
            this.withdrawcontractform = true; //약관폼을 보여줘             
        },
        withdrawagree() { //인출에 동의한다면 
            this.withdrawcontractform = false; //약관폼을 안보이게하고 
            this.outcontractformcheck = true; //약관동의하라는 문구도 안보이게해 
            this.refundModal = true;// 그리고 모달창을 다시 띄워 
        },
        withdrawreject() { //인출에 거절한다면 
            this.outcontractformcheck = false; //약관동의하라는 문구 보여주고 
            this.withdrawcontractform = false; //약관폼은 안보이게 
            this.refundModal = true; //모달창은 띄어 
        }

    }
}
</script>

<style scoped>
.cash {
    font-family: 'Pretendard-Regular';
    font-weight: 300;
    font-size: 20px;
    margin-left: 10px;
}

/* 인출할때 폼에서 필요한 css  */
.cashout {
    font-family: 'Pretendard-Regular';
    font-weight: 300;
    font-size: 20px;
    border-radius: 15px;
    border: 2px solid #7AC6FF;
    width: 35%;
}

.withdrawout {
    margin-top: 10%;
}

.inputname {
    display: block;
    width: 40%;
    padding: 0.375rem 0.25rem 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px 12px;
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
}

.inputaccount {
    display: block;
    width: 100%;
    padding: 0.375rem 0.25rem 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px 12px;
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
}

.account {
    display: inline-block;
    text-align: center;
    margin-bottom: 10%;
}

.form-select {
    width: 30%;
    height: 10%;
    margin-right: 4%;
}

.bankselect {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5%;
}

/* 입력폼값 */
.numberform {
    border-bottom: 2px solid #7AC6FF;
    margin-top: 5px;
    width: 200px;
    height: 20px;
    font-size: 15px;
}

.inputbox {
    margin-top: 5%;
    display: flex;
    justify-content: center;
    /* margin-left: 19%; */
}

.inputbox input.numberform::placeholder {
    color: black;
}


input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}


/* 인풋박스 테두리 */
input:focus {
    outline: none;
}

/* 타이핑글씨정리 */
p {
    font-family: 'Pretendard-Regular';
    font-weight: 400;
}

/* 시작하자마자 css */
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 85vh;
}

.info {
    /* position: relative; */
    padding-left: 20px;
    padding-right: 20px;
    /* border-bottom: 5px double #7ac5ff; */
    flex-direction: row;
    align-items: center;
    font-family: 'Pretendard-Regular';
    font-weight: 600;
    font-size: 30px;
    background: linear-gradient(to top, #c0e8f8 40%, transparent 40%);
}

/* 포인트&환불 버튼 wrapper */
.button-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 4%;
    gap: 6%;

}

.button-wrapper button{
    font-weight: bold;
}

.button-wrapper button,
.button-wrapper .custom-link {
    border: none;
    background-color: transparent;
    padding: 5px 10px;
    color: #000;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    width: 100px;
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
    transition: all 0.2s ease-in-out;
}

.button-wrapper .custom-link:hover::before,
.button-wrapper button:hover::before {
    visibility: visible;
    background-color: #7AC6FF;
    transform: scaleX(1);
}

.button-wrapper .custom-link:hover,
.button-wrapper button:hover {
    color: #7AC6FF;
}

/* 첫페이지의 버튼들  */
.button-wrapper1 {
    display: flex;
    justify-content: center;
    margin-top: 4%;
    gap: 6%;

}

.button-wrapper1 button{
    border: none;
    background-color: transparent;
    padding: 5px 10px;
    color: #000;
    font-weight: bold;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    width: 150px;
}


.button-wrapper1 button::before {
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

.button-wrapper1 button:hover::before {
    visibility: visible;
    background-color: #7AC6FF;
    transform: scaleX(1);
}


.button-wrapper1 button:hover {
    color: #7AC6FF;
}



/* 포인트 충전 & 환불 모달창 배경 */

.black-bg {
    width: 100%;
    height: 100%;
    position: fixed;
}

.black-bg.hide {
    animation: modalPopOut 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* 포인트충전 배경 */
.white-bg {
    width: 30%;
    height: 35%;
    margin: 80% auto;
    background: white;
    border: 2px solid #7AC6FF;
    color: black;
    border-radius: 5px;
    padding: 20px 0;
    margin-top: 2%;
    text-align: center;
    animation: modalPopIn-4720d382 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);

}

/* 환불 배경 */
.refund-bg {
    width: 30%;
    height: 65%;
    margin: 80% auto;
    background: white;
    border: 2px solid #7AC6FF;
    color: black;
    border-radius: 5px;
    padding: 20px 0;
    margin-top: 5%;
    text-align: center;
    animation: modalPopIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}



.contract {
    width: 700px;
    margin: 50px auto 80px;
    padding: 30px 40px 50px;
    border-radius: 30px;
    background-color: white;
    border: 2px solid #7AC6FF;
}

.contract h3 {
    text-align: center;
    font-family: 'Pretendard-Regular';
    font-weight: 400;
    margin-bottom: 25px;
}

.contract .text {
    height: 300px;
    border: 1px solid dimgrey;
    background-color: white;
    white-space: pre-line;
    overflow-y: scroll;
    margin: 0 auto 20px;
    font-family: 'Pretendard-Regular';
    font-weight: 400;
}

.contract p {
    text-align: right;
    font-family: 'Pretendard-Regular';
    font-weight: 400;
}

.contract .box {
    width: 100px;
    height: 40px;
    padding: 8px;
    margin: 0 3px;
}

@keyframes modalPopIn {
    0% {
        opacity: 0;
        transform: scale(0.6);
    }

    30% {
        transform: scale(1.2);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes modalPopOut {
    0% {
        opacity: 1;
        transform: scale(1);
    }

    30% {
        transform: scale(0.8);
    }

    100% {
        opacity: 0;
        transform: scale(1.2);
    }
}
</style>
