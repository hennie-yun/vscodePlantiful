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

    <!-- 참여하기 버튼 -->
    <div v-if="dto.email.email != loginId">
        <div>
            <button v-on:click="addparty">참여하기</button>
        </div>
        
    </div>
    <!-- 삭제하기 버튼 -->
    <div v-else="dto.email.email == loginId">
        <div>
            <button v-on:click="delete">삭제하기</button>

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
            dto: {},
            dif_day: 0,
            divisionResult: 0,
            paymentDate: '',
            startDate: '',
            endDate: '',

            loginId: null
        }
    },
    methods :{
        addparty(){
            const self = this;
            let formdata = new FormData();
            formdata.append('subscribe_num', self.subscribe_num)
            formdata.append('email',self.loginId)
            formdata.append('point_basket', self.divisionResult)
            formdata.append('enddate',self.subscribe_enddate)
            formdata.append('start_check', 0)
            formdata.append('schedule_num',0)
            self.$axios.get('http://localhost:8181/subscribeparty', formdata)
            .then(function(res){
                if(res.status == 200){
                    let dto = res.data.dto
                    alert(dto.email)
                } else {
                    alert('에러코드:' + res.status)
                }
            })
        },
        delete(){

        }

    },
    created: function () {
        this.loginId = sessionStorage.getItem('loginId')
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
    }
}
</script>
<style lang="">
    
</style>