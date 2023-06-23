<!-- 내가 참여한 구독 목록. 내 구독 리스트 -> subscribeparty detail로 들어가기-->
<template lang="">
    <div>
        <h1> {{loginId}} 님의 구독 목록</h1>

        <div v-for="order in list" :key="order.party" v-on:click="detail(order.subscribe_num.subscribeNum)">
            {{order.subscribe_num.subscribe_num}}
            {{order.subscribe_num.site}}
        </div>

        <div class="row row-cols-1 row-cols-md-3 g-4">
            <div class="row" v-for="order in list" :key="order.party" v-on:click="detail(order.subscribe_num.subscribeNum)">
                
                <div class="col mylistbody">
                    <!-- 팀원 -->
                    <div class="card h-100" v-if="order.subscribe_num.email != order.email.email" >
                        <div v-if="order.subscribe_num.site =='넷플릭스'"><img src="https://img.shields.io/badge/NETFLIX-black?style=for-the-badge&logo=netflix&logoColor=E50914" class="card-img-top" alt="..." /></div>
                        <div v-else-if="order.subscribe_num.site =='왓챠'"><img src="https://img.shields.io/badge/WATCHA-black?style=for-the-badge&logo=wattpad&logoColor=FF4F8B" class="card-img-top" alt="..."/></div>
                        <div v-else-if="order.subscribe_num.site =='티빙'"><img src="https://img.shields.io/badge/TVING-black?style=for-the-badge&logo=tvtime&logoColor=DD1100" class="card-img-top" alt="..."/></div>
                        <div v-else-if="order.subscribe_num.site =='웨이브'"><img src="https://img.shields.io/badge/WATCHA-004DB4?style=for-the-badge&logo=wish&logoColor=white" class="card-img-top" alt="..."/></div>
                        <div v-else-if="order.subscribe_num.site =='디즈니플러스'"><img src="https://img.shields.io/badge/DISNEY+-1B365D?style=for-the-badge&logo=disroot&logoColor=white" class="card-img-top" alt="..."/></div>
                        <div v-else-if="order.subscribe_num.site =='아마존프라임비디오'"><img src="https://img.shields.io/badge/AMAZON_PRIME-01A4FF?style=for-the-badge&logo=amazon&logoColor=black" class="card-img-top" alt="..."/></div>
                        
                        <div class="card-body">
                            <h5 class="card-title">{{order.subscribe_num.title}}</h5>
                            <p class="card-text"> {{order.email.email}} (참여자) {{order.subscribe_num.subscribeNum}}</p>
                            <p class="card-text"> 남은 포인트 {{order.point_basket}}</p>
                            <p class="card-text"> 남은 날짜 {{left_day}}</p>
                            
                            <p class="care-text recruit" v-if="order.start_check==0">모집 중</p>
                            <p class="care-text ing" v-if="order.start_check==1">진행 중</p>
                            <p class="care-text end" v-if="order.start_check==2">종료</p>
                        </div>
                    </div>
                    <div class="card h-100" v-if="order.subscribe_num.email == order.email.email" >
                        <div v-if="order.subscribe_num.site =='넷플릭스'"><img src="https://img.shields.io/badge/NETFLIX-black?style=for-the-badge&logo=netflix&logoColor=E50914" class="card-img-top" alt="..." /></div>
                        <div v-else-if="order.subscribe_num.site =='왓챠'"><img src="https://img.shields.io/badge/WATCHA-black?style=for-the-badge&logo=wattpad&logoColor=FF4F8B" class="card-img-top" alt="..."/></div>
                        <div v-else-if="order.subscribe_num.site =='티빙'"><img src="https://img.shields.io/badge/TVING-black?style=for-the-badge&logo=tvtime&logoColor=DD1100" class="card-img-top" alt="..."/></div>
                        <div v-else-if="order.subscribe_num.site =='웨이브'"><img src="https://img.shields.io/badge/WATCHA-004DB4?style=for-the-badge&logo=wish&logoColor=white" class="card-img-top" alt="..."/></div>
                        <div v-else-if="order.subscribe_num.site =='디즈니플러스'"><img src="https://img.shields.io/badge/DISNEY+-1B365D?style=for-the-badge&logo=disroot&logoColor=white" class="card-img-top" alt="..."/></div>
                        <div v-else-if="order.subscribe_num.site =='아마존프라임비디오'"><img src="https://img.shields.io/badge/AMAZON_PRIME-01A4FF?style=for-the-badge&logo=amazon&logoColor=black" class="card-img-top" alt="..."/></div>
                        
                        <div class="card-body">
                            <h5 class="card-title">{{order.subscribe_num.title}}</h5>
                            <p class="card-text"> {{order.email.email}} (참여자)</p>
                            <p class="card-text"> 지급될 총 포인트 {{order.subscribe_num.total_point}}</p>
                            <p class="card-text"> 남은 날짜 {{left_day}}</p>
                            
                            <p class="care-text recruit" v-if="order.start_check==0">모집 중</p>
                            <p class="care-text ing" v-if="order.start_check==1">진행 중</p>
                            <p class="care-text end" v-if="order.start_check==2">종료</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
        

   
</template>
<script>
import dayjs from 'dayjs'
export default {
    name: 'SubscribeBoardMyList',
    component() {
        dayjs
    },
    data() {
        return {
            list: []
        }
    },
    methods: {
        detail(subscribe_num) {
            this.$router.push({ name: 'SubscribePartyDetail', query: { subscribe_num: subscribe_num } });
        }
    },
    created: function () {
        const self = this;
        this.loginId = sessionStorage.getItem('loginId')
        self.$axios.post('http://localhost:8181/subscribeparty/' + this.loginId)
            .then(function (res) {
                if (res.status == 200) {
                    self.list = res.data.list

                    // 남은 날짜 
                    const subscribestartdate = dayjs(self.list.subscribe_startdate);
                    const subscribeenddate = dayjs(self.list.subscribe_enddate);
                    self.left_day = subscribeenddate.diff(subscribestartdate, 'day');



                } else {
                    alert('에러코드:' + res.status)
                }
            })
    }
}
</script>
<style>
.mylistbody {
    padding-top: 20%;
    margin-left: 18%;
}
</style>