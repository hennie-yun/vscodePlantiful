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
                (모집된 인원)/{{ dto.total_people }}
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
        <div>
            <button v-on:click="addparty" class="btn btn-primary">참여하기</button>
        </div>
    </div>

    <!-- 삭제하기 버튼 -->
    <div v-else-if="dto.email && dto.email.email === loginId">
        <div>
            <button v-on:click="delete" class="btn btn-danger">삭제하기</button>
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'

export default {
    name: 'SubscribeBoardDetailR',
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
            loginId: sessionStorage.getItem('loginId')
        }
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

        }

    },
    created: function () {
        this.loginId = sessionStorage.getItem('loginId')
        this
        const self = this;
        self.$axios.get('http://localhost:8181/subscribeboard/' + self.subscribe_num)
            .then(function (res) {
                if (res.status == 200) {
                    self.dto = res.data.dto;
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
            this.addparty();
            alert('등록이 완료되었습니다.')
        }
    
}
</script>
<style lang="">
    
</style>