<template>
    <div class="container text-center">
        <div class="row">
            <h1>{{ dto.site }}</h1>
        </div>
        <div class="row" style="text-align: center;">
            <div class="col">
                <h3>{{ dto.title }}</h3>
                남은 모집 기간
                {{ dif_day }}
            </div>
        </div>

        <div class="row">
            <div class="col">
                {{ dto.total_point }}
            </div>
            <div class="col">
                {{ count }}/{{ dto.total_people }}
            </div>
            <div class="col">
                인당 금액
                {{ divisionResult }}
            </div>
        </div>
        <div class="row">
            <div class="col">
                출금일
                {{ paymentDate }}
            </div>
            <div class="col">
                구독 시작날짜
                {{ startDate }}
            </div>
            <div class="col">
                구독 끝 날짜
                {{ endDate }}
            </div>
        </div>
    </div>
    <!-- {{ dto.email && dto.email.email }} dto.email 객체 존재 여부를 확인하고 email 속성이 있으면 뽑아오기 -->

    <!-- 참여하기 버튼 -->
    <div v-if="dto.email && dto.email.email !== loginId">
        <div v-if="this.currentDate <= this.dto.recruit_endperiod">
            <button v-on:click="addparty" class="btn btn-primary">참여하기</button>
        </div>
        <div v-if="this.currentDate > this.dto.recruit_endperiod">
            모집이 종료되었습니다.<div class=""></div>
        </div>
    </div>

    <!-- 삭제하기 버튼 -->
    <div v-else-if="dto.email && dto.email.email === loginId">
        <div>
            <button v-on:click="deleteBoard" class="btn btn-danger">삭제하기</button>
        </div>
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
            paydto: {
                paidamount: 0
            },
            fflag: false,
        }
    },
    mounted() {
        this.currentDate = dayjs().format('YYYY-MM-DD');

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
                            form.append('paidamount', self.divisionResult)
                            form.append('email', self.email)
                            self.$axios.post('http://localhost:8181/payment/withdraw/' + this.email, form)
                             .then(function (res) { 
                                if(res.status ==200){
                                    alert(res.data.message)
                                    let dto = res.data.dto
                                    if(dto != null){
                                        //돈 있음
                                        self.fflag = true;
                                    }else{
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
        addparty() {
            const self = this;
            let formdata = new FormData();
            this.checkcash();
            if(self.fflag == true){
                
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
                                } else {
                                    alert('파티에 추가되었습니다.')

                                }

                            } else {
                                alert('에러코드:' + res.status)

                            }
                        })
                } else {
                    alert('참여가 불가능한 모집입니다.')
                }
            }else {
                alert('캐시가 부족합니다.')
                location.href="/payment"
            }
        },
        deleteBoard() {

            const self = this;
            self.$axios.get('http://localhost:8181/subscribeparty/party/' + self.subscribe_num)
                .then(function (res) {
                    if (res.status == 200) {
                        self.flag = res.data.flag

                        if (self.flag) {
                            self.$axios.delete('http://localhost:8181/subscribeboard/' + self.subscribe_num)
                                .then(function (res) {
                                    if (res.status == 200) {
                                        alert('글이 삭제되었습니다.')
                                        location.href = "/SubscribeBoardList"
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
            } else {
                alert('에러코드:' + res.status)
            }
        })

}
}
</script>
<style lang="">
    
</style>