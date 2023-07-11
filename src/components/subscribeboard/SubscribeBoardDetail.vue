<template>
    <div class="body">
        <div class="container text-center">
            <div class="gird">
                <div class="row bigtitle">
                    <div class="col imgdiv">
                        <!-- 티빙 -->
                        <img v-if="dto.site == '티빙'" src="https://buts.co.kr/thema/Buts/colorset/category/1050.jpg" alt="">
                        <!-- 넷플릭스 -->
                        <img v-if="dto.site == '넷플릭스'" src="https://buts.co.kr/thema/Buts/colorset/category/1010.jpg"
                            alt="">
                        <!-- 웨이브 -->
                        <img v-if="dto.site == '웨이브'" src="https://buts.co.kr/thema/Buts/colorset/category/1040.jpg" alt="">
                        <!-- 디즈니플러스 -->
                        <img v-if="dto.site == '디즈니플러스'" src="https://buts.co.kr/thema/Buts/colorset/category/1080.jpg"
                            alt="">
                        <!-- 왓챠 -->
                        <img v-if="dto.site == '왓챠'" src="https://buts.co.kr/thema/Buts/colorset/category/1020.jpg" alt="">
                        <!-- 프라임비디오 -->
                        <img v-if="dto.site == '아마존프라임비디오'" src="https://buts.co.kr/thema/Buts/colorset/category/1070.jpg"
                            alt="">
                    </div>
                    <div class="col sbgroup">
                        <div class="row sbsmalltitle">
                            {{ dto.site }}
                        </div>
                        <div class="row sbtitle">
                            {{ dto.title }}
                        </div>
                    </div>
                    <div class="col">
                        <div class="row sbsmalltitle2">
                            모집종료까지
                        </div>

                        <div class="row sbtitle2">
                            D - {{ diff_day }}
                        </div>

                    </div>
                </div>
            </div>
            <div class="row leftday">
                파티 가입하고 <span class="stress">{{ left_day / 30 }}</span>개월동안 <span class="stress">{{ dto.site }}</span>를
                <span class="stress">{{ divisionResult }}</span>원에 이용해보세요.
            </div>
            <div class="row point">
                <div class="col">
                    모여야하는 전체 포인트
                </div>

                <div class="col">
                    {{ dto.total_point }} ₩
                </div>
            </div>
            <div class="row point">
                <div class="col">
                    인당 지불할 포인트
                </div>

                <div class="col">
                    {{ divisionResult }} ₩
                </div>
            </div>
            <div class="row point">
                <div class="col">
                    구독 날짜
                </div>

                <div class="col">
                    {{ startDate }} ~ {{ endDate }}

                </div>
            </div>

            <div class="row point">
                <div class="col">
                    멤버 모집 현황
                </div>
                <div class="col">
                    {{ count }} (모집된 인원) /{{ dto.total_people }} (총 모집인원)
                </div>

            </div>

        </div>
        <!-- {{ dto.email && dto.email.email }} dto.email 객체 존재 여부를 확인하고 email 속성이 있으면 뽑아오기 -->

        <!-- 참여하기 버튼 -->
        <div v-if="dto.email && dto.email.email !== loginId" class="btn">
            <div v-if="this.currentDate < this.dto.recruit_endperiod">
                <div class="warn">
                    참여 후 취소 및 환불이 불가능합니다.
                </div>
                <button v-on:click="checkcash" class="btn btn-primary">참여하기</button>
            </div>
            <div v-else-if="this.currentDate == this.dto.recruit_endperiod">
                <div class="warn">
                    참여 후 취소 및 환불이 불가능합니다.
                </div>
                <button v-on:click="checkcash" class="btn btn-primary">참여하기</button>
            </div>
            <div v-else="this.currentDate > this.dto.recruit_endperiod">
                모집이 종료되었습니다.<div class=""></div>
            </div>
        </div>

        <!-- 삭제하기 버튼 -->
        <div v-else-if="dto.email && dto.email.email === loginId && (this.currentDate < this.dto.recruit_endperiod)"
            class="btn">
            <div>
                <button v-on:click="deleteBoard" class="btn btn-danger">삭제하기</button>
            </div>
        </div>
        <!-- 
        <div>
            <router-link to="/SubscribeBoardList" class="nav-link"><button>목록으로 돌아가기</button> </router-link>
        </div> -->
    </div>
</template>
<script>
import dayjs from 'dayjs'

export default {
    name: 'SubscribeBoardDetail',
    component() {
        dayjs
    },
    data() {
        return {
            subscribe_num: this.$route.query.subscribe_num,
            email: sessionStorage.getItem('loginId'),
            dto: {},
            dif_day: 0,
            diff_day: null,
            divisionResult: 0,
            paymentDate: '',
            startDate: '',
            endDate: '',
            loginId: sessionStorage.getItem('loginId'),
            count: 0,
            currentDate: null,
            paydto: {
                paidamount: 0
            },
            fflag: false,
            checkjoined: false,
            flag: false,
            refundprice: 0,
            refundemail: null,
            left_day: 0,

        }
    },
    mounted() {
        this.currentDate = dayjs().format('YYYY-MM-DD');

    },
    methods: {
        addparty() {
            const self = this;
            let formdata = new FormData();

            formdata.append('subscribe_num', self.subscribe_num)
            formdata.append('email', sessionStorage.getItem('loginId'))
            formdata.append('point_basket', self.divisionResult)
            formdata.append('enddate', dayjs(self.enddate))
            formdata.append('start_check', 0)
            formdata.append('schedule_num', 0)
            // 이미 추가된건지 아닌지 확인해야함 
            if (self.count < self.dto.total_people) {
                self.$axios.post('http://localhost:8181/subscribeparty', formdata)
                    .then(function (res) {
                        if (res.status == 200) {
                            let dto = res.data.dto
                            if (dto == null) {
                                alert('이미 가입한 파티입니다')
                                self.checkjoined = false;
                            } else {
                                alert('파티에 추가되었습니다.')
                                self.checkjoined = true;
                                // alert('add: ' + self.checkjoined)
                            }
                            self.handleCheckJoined();
                        } else {
                            alert('에러코드:' + res.status)

                        }
                    })
            } else {
                alert('참여가 불가능한 모집입니다.')
                self.checkjoined = false;
            }

        },
        handleCheckJoined() {
            const self = this;
            // alert('checkjoined: ' + this.checkjoined);
            if (this.checkjoined) {
                // `checkjoined`가 true일 때 실행되는 코드
                let form = new FormData();
                let divisionnum = parseInt(self.divisionResult)
                form.append('paidamount', divisionnum)
                form.append('email', self.email)

                self.$axios.post('http://localhost:8181/payment/withdraw/' + self.email, form)
                    .then(function (res) {
                        if (res.status == 200) {
                            alert(res.data.message)
                        } else {
                            alert(res.data.message)
                        }
                    })
            } else {
                // `checkjoined`가 false일 때 실행되는 코드
            }
        },

        checkcash() {
            const self = this;
            if (confirm('정말로 참여하시겠습니까?\n참여 후 취소 및 환불은 불가능합니다.')) {
                self.$axios.get('http://localhost:8181/payment/getcash/' + this.email)
                    .then(function (res) {
                        console.log(res)
                        if (res.status == 200) {
                            if (res.data.paydto != null) {

                                // self.paidamount = self.paydto.paidamount;


                                self.addparty();

                                // let form = new FormData();
                                // let divisionnum = parseInt(self.divisionResult)
                                // form.append('paidamount', divisionnum)
                                // form.append('email', self.email)
                                // self.$nextTick(function () {
                                //     alert('checkedjoined: ' + self.checkjoined)

                                //     if (self.checkjoined == true) {
                                //         self.$axios.post('http://localhost:8181/payment/withdraw/' + self.email, form)
                                //             .then(function (res) {
                                //                 if (res.status == 200) {
                                //                     alert(res.data.message)
                                //                 } else {
                                //                     alert(res.data.message)
                                //                 }
                                //             })
                                //     } else {

                                //     }
                                // })
                            } else {
                                alert(res.data.message);
                            }
                        } else if (res.status == 500) {
                            alert('현금없음');
                        }
                    })
            }

        },

        deleteBoard() {

            const self = this;
            // 파티에 몇명 있는지 검색 (1명이면 삭제 가능)
            self.$axios.get('http://localhost:8181/subscribeparty/party/' + self.subscribe_num)
                .then(function (res) {
                    if (res.status == 200) {
                        self.flag = res.data.flag
                        let partylist = res.data.list
                        //환불 금액 & 환불받을 사람
                        self.refundprice = partylist[0].subscribe_num.total_point / partylist[0].subscribe_num.total_people
                        self.refundemail = partylist[0].email.email
                        if (self.flag) {
                            // 파티에 1명이면 삭제 진행
                            self.$axios.delete('http://localhost:8181/subscribeboard/' + self.subscribe_num)
                                .then(function (res) {
                                    if (res.status == 200) {
                                        alert('글이 삭제되었습니다.')
                                        //돈 환불 진행
                                        console.log(self.refundprice);
                                        console.log(self.refundemail);
                                        const delform = new FormData();
                                        delform.append('email', self.refundemail);
                                        delform.append('paidamount', self.refundprice);
                                        self.$axios.post('http://localhost:8181/payment/' + self.refundemail, delform)
                                            .then(function (res) {
                                                if (res.status == 200) {
                                                    alert('구독 삭제, 작성자에게 환불됨 ')
                                                    location.href = "/SubscribeBoardList"
                                                } else {
                                                    alert('구독 삭제 오류')
                                                }
                                            })
                                    }
                                })
                        } else {
                            alert('참여자가 있어 삭제가 불가능한 모집 글입니다.')
                        }
                    }

                })
        },
        checkmember() {
            const self = this;
            self.$axios.get('http://localhost:8181/subscribeparty/party/' + self.subscribe_num)
                .then(function (res) {
                    if (res.status == 200) {
                        const partyData = res.data.list; // 검색 결과 데이터
                        self.count = partyData.length; // 검색된 결과의 개수

                        // count를 사용하여 필요한 로직 수행
                        // 예시) 결과 개수를 출력
                        // console.log('검색된 결과 개수:', count);
                    }
                })
                .catch(function (error) {
                    // 에러 처리
                    console.error('에러 발생:', error);
                });
        },



    },
    created: function () {
        this.loginId = sessionStorage.getItem('loginId')
        const self = this;
        let flag = false;
        self.$axios.get('http://localhost:8181/subscribeboard/' + self.subscribe_num)
            .then(function (res) {
                if (res.status == 200) {
                    self.dto = res.data.dto;

                    self.checkmember();
                    // 출금일 날짜 변환
                    self.paymentDate = dayjs(self.dto.payment_date).format('YYYY-MM-DD');

                    // 구독 시작날짜와 구독 끝 날짜 변환
                    self.startDate = dayjs(self.dto.subscribe_startdate).format('YYYY-MM-DD');
                    self.endDate = dayjs(self.dto.subscribe_enddate).format('YYYY-MM-DD');

                    //구독 개월 계산 
                    const stdate = dayjs(self.startDate)
                    const eddate = dayjs(self.endDate)
                    self.left_day = eddate.diff(stdate, 'day');

                    //인당 금액
                    // 특정 값 두 개 가져오기
                    const value1 = self.dto.total_point;
                    const value2 = self.dto.total_people;
                    // 값 나누기
                    self.divisionResult = value1 / value2;

                    // 날짜 차이 계산
                    // const registerDate = dayjs(self.dto.register_date);
                    const recruitEndDate = dayjs(self.dto.recruit_endperiod);
                    self.dif_day = recruitEndDate.diff(self.currentDate, 'day', true); // 'true'를 추가하여 시간까지 고려한 차이 계산
                    console.log(self.currentDate)
                    console.log(recruitEndDate)
                    console.log(self.dif_day)
                    if (self.dif_day > 0) {
                        self.diff_day = self.dif_day
                    } else if (self.dif_day === 0) {
                        self.diff_day = '오늘 마감'
                    } else {
                        self.diff_day = '종료'
                    }
                } else {
                    alert('에러코드:' + res.status)

                }
            })

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
}

.sbsmalltitle2 {
    display: flex;
    justify-content: flex-end;
}

.sbtitle2 {
    font-weight: 600;
    /* color: #7ac5ff; */
    font-size: 35px;
    display: flex;
    justify-content: flex-end;
}

.sbtitle {
    /* margin: 50px; */
    font-weight: 600;
    /* color: #7ac5ff; */
    font-size: 35px;

}

.row.sbsmalltitle,
.row.sbtitle {
    align-self: flex-end;
    /* 수직 축 정렬은 아래로 */
}

.warn {
    color: red;
}

.bigtitle {
    position: relative;
    padding: 15px 0;
    margin-top: 50px;
    padding-left: 20px;
    padding-right: 30px;
    border-bottom: 5px double #7ac5ff;
    display: flex;
    flex-direction: row;
    margin-left: 30px;
    margin-right: 30px;
    align-items: center;
}


.imgdiv {
    max-width: 130px;
}

img {
    max-width: 80px;
    margin: 10px;
    border-radius: 12px;
}

.point {
    background-color: rgb(246, 246, 246);
    /* border: 4px dotted #7ac5ff; */
    border-radius: 15px;
    padding: 15px;
    margin: 20px 30px 0px 30px
        /* margin-left: 30px;
    margin-right: 30px;
    margin-top: 10px;
    margin-bottom: 2px; */
    ;
}

.leftday {
    display: inline-block;
    font-size: 20px;
    font-weight: 700;
    /* margin: 0px 50px; */
    margin: 30px 50px 30px;
    justify-content: center;

}

.stress {
    color: red;
}

.btn {
    padding: 10px;
    color: white;
    margin: 20px;
    border: none;
}
</style>