<template lang="">
    <div class="subboardadd needs-validation">
        <!-- site 선택 -->
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
            <label class="form-check-label" for="inlineRadio6"><img src="https://img.shields.io/badge/AMAZON_PRIME-01A4FF?style=for-the-badge&logo=amazon&logoColor=black"/></label>
        </div>
        <div class="row align-items-center">

            <div class="col-8 form-floating">
                <input type="text" class="form-control" id="floatingInput" v-model="title" placeholder="제목을 입력해주세요." required>
                <label for="floatingInput"> 글 제목</label>

            </div>
            <div class="col-4 form-floating">
                <input type="text" class="form-control" id="floatingInputValue" name="email" v-model="email" required readonly>
                <label for="floatingInputValue" class="form-label">작성자</label>
            </div>
            
            <div class="col ">
                <label for="floatingInputValue" class="form-label">모집 마감일</label>
                <input type="date" class="form-control" v-model="recruit_endperiod" required>
            </div>
        </div>

        <div class="row align-items-center">
            <div class="col">
                <label for="floatingInputValue" class="form-label">전체 금액 입력</label>
                <input type="number" class="form-control" v-model="total_point" required>
            </div>
            <div class="col">
                <label for="floatingInputValue" class="form-label">전체 모집 인원 입력</label>
                <input type="number" class="form-control" v-model="total_people" required>
            </div>
        </div>
        <!-- <div class="col">
                <label for="floatingInputValue" class="form-label">포인트 지불일</label>
                <input type="date" class="form-control" v-model="payment_date" required>
        </div> -->
        <div class="col">
            지불한 총 금액, 본인을 포함한 인원을 입력해주세요.
        </div>

        <div class="row align-items-center">
            <div class="col">
                <label for="floatingInputValue" class="form-label">구독 시작일</label>
                <input type="date" class="form-control" v-model="subscribe_startdate" required>
            </div>
            <div class="col">
            매달 구독 시작일에 한달 분 금액이 자동으로 차감됩니다.
            </div>
            <div>
                <label for="subscriptionPeriod">구독 기간</label>
                <select id="subscriptionPeriod" v-model="subscriptionPeriod">
                    <option value="1" selected>1개월</option>
                    <option value="2">2개월</option>
                    <option value="3">3개월</option>
                    <option value="4">4개월</option>
                    <option value="6">6개월</option>
                    <option value="12">12개월</option>
                </select>
            </div>
            <!-- ~
            <div class="col">
                <label for="floatingInputValue" class="form-label">구독 마감일</label>
                <input type="date" class="form-control" v-model="subscribe_enddate" required>
            </div> -->
        </div>
        <div class="row">
            <button v-on:click="add">글 등록하기 </button>
        </div>

    </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
    name: 'SubscribeBoardAdd',
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
        // payment_date(value) {
        //     this.formValidated = !!value;
        // },
        subscribe_startdate(value) {
            this.formValidated = !!value;
        },

    },
    methods: {

        checkcash() {
            const self = this;
            self.$axios.get('http://localhost:8181/payment/getcash/' + this.email)
                .then(function (res) {
                    console.log(res)
                    if (res.status == 200) {
                        if (res.data.paydto != null) {
                            self.paidamount = self.paydto.paidamount;

                            let form = new FormData();
                            formdata.append('paidamount', self.divisionResult)
                            self.$axios.post('http://localhost:8181/payment/withdraw/' + email, form)
                                .then(function (res) {
                                    if (res.status == 200) {
                                        alert(res.data.message)
                                        let dto = res.data.dto
                                        if (dto != null) {
                                            //돈 있음
                                            self.fflag = true;
                                        } else {
                                            self.fflag = false;
                                        }
                                    } else {
                                        alert(res.data.message)
                                    }
                                })
                        } else {
                            alert(res.data.message);
                        }
                    } else if (res.status == 500) {
                        alert('현금없음');
                    }
                })

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
        add() {
            this.formValidated = true;

            if (!this.site || !this.title || !this.total_point || !this.total_people || !this.recruit_endperiod || !this.subscribe_startdate) {
                alert('필수 항목을 전부 입력해주세요.')
                return;
            }

            if (!this.validateDate(this.recruit_endperiod) || !this.validateDate(this.subscribe_startdate)) {
                alert('유효한 날짜를 입력해주세요.')
                return;
            }


            if (!this.validateDate(this.subscribe_startdate)) {
                alert('유효한 시작 날짜를 입력해주세요.');
                return;
            }

            const startDate = dayjs(this.subscribe_startdate);
            const subscribe_enddate = this.calculateEndDate(startDate);

            if (self.fflag == true) {
                const self = this;
                let formdata = new FormData();
                formdata.append('email', sessionStorage.getItem('loginId'))
                formdata.append('title', self.title)
                formdata.append('site', self.site)
                formdata.append('total_point', self.total_point)
                formdata.append('total_people', self.total_people)
                formdata.append('register_date', dayjs(self.register_date))
                formdata.append('recruit_endperiod', dayjs(self.recruit_endperiod))
                formdata.append('payment_date', dayjs(self.subscribe_startdate))
                formdata.append('subscribe_startdate', dayjs(self.subscribe_startdate))
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
            }else {
                alert('캐시가 부족합니다.')
                location.href="/payment"
            }
        }
    }
}
</script>
<style>
.subboardadd {
    padding: 30px;
    margin: 30px;
}

.subboardadd div {
    padding: 1%;
}

#subscriptionPeriod {
    margin: 10px;
    padding-left: 5px;
    border: 1.8px solid #7AC6FF;
    border-radius: 7px;
}
</style>