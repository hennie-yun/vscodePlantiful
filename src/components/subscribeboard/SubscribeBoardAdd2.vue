<template lang="">
    <div class="subboardadd needs-validation body">

        <!-- site 선택 -->
        <h2> 모집 글 추가하기 </h2>
        <div class="text-center radiocheck">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" v-model="site" name="inlineRadioOptions" id="inlineRadio1" value="넷플릭스" required> 
                <label class="form-check-label" for="inlineRadio1"><img src="https://img.shields.io/badge/NETFLIX-black?style=for-the-badge&logo=netflix&logoColor=E50914"/></label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" v-model="site" name="inlineRadioOptions" id="inlineRadio2" value="왓챠" required>
                <label class="form-check-label" for="inlineRadio2"><img src="https://img.shields.io/badge/WATCHA-black?style=for-the-badge&logo=wattpad&logoColor=FF4F8B"/></label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" v-model="site" name="inlineRadioOptions" id="inlineRadio3" value="티빙" required>
                <label class="form-check-label" for="inlineRadio3"><img src="https://img.shields.io/badge/TVING-black?style=for-the-badge&logo=tvtime&logoColor=DD1100"/></label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" v-model="site" name="inlineRadioOptions" id="inlineRadio4" value="웨이브" required>
                <label class="form-check-label" for="inlineRadio4"><img src="https://img.shields.io/badge/WAVE-004DB4?style=for-the-badge&logo=wish&logoColor=white"/></label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" v-model="site" name="inlineRadioOptions" id="inlineRadio5" value="디즈니플러스" required>
                <label class="form-check-label" for="inlineRadio5"><img src="https://img.shields.io/badge/DISNEY+-1B365D?style=for-the-badge&logo=disroot&logoColor=white"/></label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" v-model="site" name="inlineRadioOptions" id="inlineRadio6" value="아마존프라임비디오" required>
                <label class="form-check-label" for="inlineRadio6"><img src="https://img.shields.io/badge/AMAZON-01A4FF?style=for-the-badge&logo=amazon&logoColor=black"/></label>
            </div>
        </div>

        <!-- 구독 글 올리는 폼 -->
        <div class="row bodycontent">
            <div class="col">
                <label for="title"  class="form-label text-start">제목</label>
                <input type="text" class="form-control" id="title" v-model="title" placeholder="제목을 입력해주세요." required>
            </div>
        </div>
        <div class="row bodycontent">
            <div class="col">
                <label for="recruit_endperiod" class="form-label">모집 마감일</label>
                <input type="date" class="form-control" id="recruit_endperiod" v-model="recruit_endperiod" required :min="minDate">
            </div>
            
        </div>
        <div class="row align-items-center">
            <div class="col">
                <label for="total_point" class="form-label">전체 금액 입력</label>
                <input type="number" class="form-control" id="total_point" v-model="total_point" required>
            </div>
            <div class="col">
                <label for="total_people" class="form-label">전체 모집 인원 입력</label>
                <input type="number" class="form-control" id="total_people" v-model="total_people" required>
            </div>
        </div>
        <div class="col warnmsg">
            지불한 총 금액, 본인을 포함한 인원을 입력해주세요.
        </div>
        <div class="row align-items-center ">
            <div class="col">
                <label for="subscribe_startdate" class="form-label">구독 시작일</label>
                <input type="date" class="form-control" id="subscribe_startdate" v-model="subscribe_startdate" required :min="minStartDate">
            </div>
            <div class="col">
                <label for="subscriptionPeriod">구독 기간</label><br/>
                <select class="form-select" id="subscriptionPeriod" v-model="subscriptionPeriod">
                    <option value="1" selected>1개월</option>
                    <option value="2">2개월</option>
                    <option value="3">3개월</option>
                    <option value="4">4개월</option>
                    <option value="6">6개월</option>
                    <option value="12">12개월</option>
                </select>
            </div>
        </div>

        <!-- 글 등록 버튼 -->
        <div class="row">
            <button class="btn custom-button" v-on:click="checkcash" style="background-color: #7AC6FF; color:white;">글 등록하기 </button>
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
    name: 'SubscribeBoardAdd',
    computed: {
        // 모집 마감일 최소 날짜 선택 
        minDate() {
            return dayjs().add(2, 'day').format('YYYY-MM-DD')
            // return dayjs().subtract(2, 'day').format('YYYY-MM-DD')
        },
        minStartDate() {
            return dayjs(this.recruit_endperiod).add(1, 'day').format('YYYY-MM-DD');
        },
    },
    component() {
        dayjs
    },
    data() {
        return {
            formValidated: false,
            email: sessionStorage.getItem('loginId'),
            title: '',
            site: '넷플릭스',
            total_point: 0,
            total_people: 0,
            register_date: dayjs().format("YYYY/MM/DD"),
            recruit_endperiod: dayjs().format("YYYY/MM/DD"),
            // payment_date: dayjs().format("YYYY/MM/DD"),
            subscribe_startdate: dayjs().format("YYYY/MM/DD"),
            subscriptionPeriod: '1', // 초기 기본 값은 1개월
            paydto: {
                paidamount: 0
            },
            fflag: false,
        }
    },
    watch: {
        subscribe_startdate(value) {
            this.formValidated = !!value;
            this.checkStartDate();
        },
        site(value) {
            this.formValidated = !!value;
        },
        title(value) {
            this.formValidated = !!value;
        },
        total_point(value) {
            this.formValidated = !!value;
        },
        total_people(value) {
            this.formValidated = !!value;
        },
        recruit_endperiod(value) {
            this.formValidated = !!value;
        },
        subscribe_startdate(value) {
            this.formValidated = !!value;
        },

    },
    methods: {


        checkStartDate() {
            if (dayjs(this.subscribe_startdate).isSameOrBefore(this.recruit_endperiod)) {
                alert('구독 시작일은 모집 마감일 이후여야 합니다.');
            }
        },
        calculateEndDate(startDate) {
            const period = parseInt(this.subscriptionPeriod);
            const endDate = startDate.add(period, 'month').subtract(1, 'day');
            return endDate.format('YYYY/MM/DD');
        },
        validateDate(date) {
            const regex = /^\d{4}-\d{2}-\d{2}$/; // 날짜 형식 (YYYY-MM-DD)
            return regex.test(date);
        },
        checkcash() {
            const self = this;
            if (confirm('[자동취소 및 진행상태 변경안내] \n 모집일까지 인원이 모집되지 않을 경우, 자동취소됩니다. 인원이 충족될 경우 모집일이 지나야 진행 상태로 변경됩니다.\n\n [모집자 입금 안내] \n 전체 금액은 구독 종료일에 모집자에게 포인트로 입금됩니다.\n\n [취소 및 환불 안내] \n 모집글 삭제는 참여자가 없을 경우에만 가능합니다. 참여자가 있을 경우 취소 및 환불은 불가능합니다. 모집글 삭제는 모집 마감일 전날까지만 가능합니다.\n\n 위 내용에 동의하신다면 확인을 클릭해주세요.\n')) {
                self.$axios.get('http://localhost:8181/payment/getcash/' + this.email)
                    .then(function (res) {
                        if (res.status == 200) {
                            if (res.data.paydto != null) {
                                let dto = res.data.paydto
                                if (dto != null) {

                                    //돈 있음
                                    // alert("true : " + self.fflag)
                                    self.add();
                                } else {
                                    // alert("false : " + self.fflag)
                                }
                                if (self.fflag == true) {
                                    self.paidamount = self.paydto.paidamount;
                                    let form = new FormData();
                                    form.append('paidamount', self.total_point / self.total_people)
                                    self.$axios.post('http://localhost:8181/payment/withdraw/' + self.email, form)
                                        .then(function (res) {
                                            if (res.status == 200) {

                                                alert(res.data.message)

                                            } else {
                                                alert(res.data.message)
                                            }
                                        })
                                } else {
                                    alert('등록이 취소되었습니다.')
                                }

                            } else {
                                alert(res.data.message);
                            }
                        } else if (res.status == 500) {
                            alert('현금없음');
                        }
                    })
                }

        },
        add() {
            const self = this;
            this.formValidated = true;

            if (!this.site || !this.title || !this.total_point || !this.total_people || !this.recruit_endperiod || !this.subscribe_startdate) {
                alert('필수 항목을 전부 입력해주세요.')
                self.fflag = false;
                return;
            }

            if (!this.validateDate(this.recruit_endperiod) || !this.validateDate(this.subscribe_startdate)) {
                alert('유효한 날짜를 입력해주세요.')
                self.fflag = false;
                return;
            }


            if (!this.validateDate(this.subscribe_startdate)) {
                alert('유효한 시작 날짜를 입력해주세요.');
                self.fflag = false;
                return;
            }
            self.fflag = true;

            const startDate = dayjs(this.subscribe_startdate);
            const subscribe_enddate = this.calculateEndDate(startDate);
            let formdata = new FormData();
            formdata.append('email', sessionStorage.getItem('loginId'))
            formdata.append('title', self.title)
            formdata.append('site', self.site)
            formdata.append('total_point', self.total_point)
            formdata.append('total_people', self.total_people)
            formdata.append('register_date', dayjs(self.register_date))
            formdata.append('recruit_endperiod', dayjs(self.recruit_endperiod))
            formdata.append('payment_date', dayjs(subscribe_enddate))
            formdata.append('subscribe_startdate', dayjs(self.subscribe_startdate))
            formdata.append('subscribe_enddate', dayjs(subscribe_enddate));

            self.$axios.post('http://localhost:8181/subscribeboard', formdata)
                .then(function (res) {
                    if (res.status == 200) {
                        let dto = res.data.dto2;
                        let subscribe_num = dto.subscribe_num;
                        let data = new FormData();
                        data.append('subscribe_num', subscribe_num)
                        self.$router.push({ name: 'SubscribeBoardDetailR', query: { subscribe_num: subscribe_num } })
                    } else {
                        alert('에러코드:' + res.status)
                    }
                })


        }
    }
}
</script>
<style scoped>
@font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}

* {
    font-family: 'Pretendard-Regular';
}

.body {
    text-align: center;
    margin-left: 15%;
    margin-right: 15%;
    margin-bottom: 5%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.body h2 {
    margin: 50px;
    font-weight: 600;
    /* color: #7ac5ff; */
    color: black;
}

.bodycontent {}

img {
    max-height: 30px;
    margin-right: 11px;
}

.warnmsg {
    color: red;
}


.radiocheck {
    margin-left: 27px;
    margin-bottom: 2%;
}

.subboardadd {
    padding: 30px;
    /* margin: 30px; */
}

.subboardadd div {
    padding: 1%;
}

#subscriptionPeriod {
    margin: 10px;
    padding-left: 5px;
    /* border: 1.8px solid #7AC6FF; */
    border-radius: 7px;
}

.custom-button {
    margin-top: 23px !important;
    margin-bottom: 30px;
    margin-right: 10px;
}

.checkbox {
    margin-left: 50px;
}
</style>