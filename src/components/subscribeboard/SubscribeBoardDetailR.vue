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
                    
                </div>
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
            divisionResult: 0,
            paymentDate: '',
            startDate: '',
            endDate: '',
            loginId: sessionStorage.getItem('loginId'),
            count: 0,
            currentDate: null,
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


                    //인당 금액
                    // 특정 값 두 개 가져오기
                    const value1 = self.dto.total_point;
                    const value2 = self.dto.total_people;
                    // 값 나누기
                    self.divisionResult = value1 / value2;

                    // 날짜 차이 계산
                    const registerDate = dayjs(self.dto.register_date);
                    const recruitEndDate = dayjs(self.dto.recruit_endperiod);
                    self.dif_day = recruitEndDate.diff(registerDate, 'day');

                    // addparty 호출
                    self.checkcash();
                    alert('등록이 완료되었습니다.');
                } else {
                    alert('에러코드:' + res.status)
                }
            })
        // this.addparty();
        // alert('등록이 완료되었습니다.')
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
}
</style>