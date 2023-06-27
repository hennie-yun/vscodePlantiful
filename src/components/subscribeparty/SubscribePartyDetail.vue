<!-- 구독 그룹별 파티 인원 -->
<template lang="">
    <div>
        <div v-for="(order, index) in list" :key="order.party">
            <div v-if="index === 0" class="row subscribeboardform">
                <!-- <div class="row">
                    {{order.subscribe_num}}
                </div> -->
                <div class="row">
                    <h2>{{order.subscribe_num.title}}</h2>
                </div>
                <div class="row">
                    <div class="col subboardtitle">
                        구독 게시글 번호
                    </div>
                        <div class="col subboardcontent">
                            {{ order.subscribe_num.subscribeNum }}
                        </div>
                    <div class="col subboardtitle">
                        구독 파티 모집자
                    </div>
                        <div class="col subboardcontent">
                            {{ order.subscribe_num.email.email }}
                        </div>
                </div>

                <div class="row">
                    <div class="col subboardtitle">
                        진행 상황
                    </div>
                    <div class="col">
                       
                        <h6 class="recruit" v-if="order.start_check==0">모집 중</h6>
                        <h6 class="ing" v-if="order.start_check==1">진행 중</h6>
                        <h6 class="end" v-if="order.start_check==2">종료</h6>
                    </div>
                    <div class="col subboardtitle">
                        구독 사이트
                    </div>
                        <div class="col subboardcontent">
                            {{ order.subscribe_num.site }}
                        </div>
                </div>
                       
                <div class="row">
                    <div class="col subboardtitle">
                        전체 인원
                    </div>
                    <div class="col subboardcontent">
                            {{ order.subscribe_num.total_people }}
                    </div>
                    <div class="col subboardtitle">
                        포인트 지불일
                    </div>
                        <div class="col subboardcontent">
                            {{ order.subscribe_num.payment_date }}
                        </div>
                </div>
                <div class="row">
                    <div class="col subboardtitle">
                        구독 시작일
                    </div>
                        <div class="col subboardcontent">
                            {{ order.subscribe_num.subscribe_startdate }}
                        </div>
                    
                    <div class="col subboardtitle">
                        구독 종료일
                    </div>
                        <div class="col subboardcontent">
                            {{  order.subscribe_num.subscribe_enddate }}
                        </div>
                </div>
            </div>
            

            <div v-if="index === 0" class="row">
                <h3>참여자 정보 </h3>
            </div>
            <div class="row">
                <div class="col">
                    참여 번호
                </div>
                <div class="col ">
                    {{ order.party }}
                </div>
                <div class="col">
                    참여자 아이디
                </div>
                <div class="col">
                    {{ order.email.email }}
                </div>
                <div class="col">
                    남은 포인트
                </div>
                <div class="col" v-if="order.email.email === loginId">
                    {{ order.point_basket }}
                </div>
                <div class="col" v-if="order.email.email !== loginId">
                    비공개 
                </div>
            </div>
        </div>       
    </div>
</template>
<script>
import dayjs from 'dayjs';
export default {
    name: 'SubscribePartyDetail',
    component() {
        dayjs
    },
    data() {
        return {
            list: [],
            loginId: null,
        }
    },
    created: function () {
        this.loginId = sessionStorage.getItem('loginId')
        this.subscribe_num = this.$route.query.subscribe_num;
        const self = this;
        // subnum에 속한 party 전체 검색
        self.$axios.get('http://localhost:8181/subscribeparty/party/' + self.subscribe_num) //비동기 요청
            .then(function (res) {
                if (res.status == 200) {
                    self.list = res.data.list
                    self.list.forEach(order => {
                        order.subscribe_num.payment_date = dayjs(order.subscribe_num.payment_date).format('YYYY-MM-DD');
                        order.subscribe_num.subscribe_startdate = dayjs(order.subscribe_num.subscribe_startdate).format('YYYY-MM-DD');
                        order.subscribe_num.subscribe_enddate = dayjs(order.subscribe_num.subscribe_enddate).format('YYYY-MM-DD');
                    });
                } else {
                    alert('에러코드:' + res.status)
                }
            })
    }
}
</script>
<style lang="css">
.subscribeboardform {
    border: 1px solid;
    padding: 3%;
    margin: 3%;
}

.subboardtitle {
    background-color: skyblue;
    padding: 0.4%;
}

.subboardcontent {
    padding: 0.4%;
}
</style>