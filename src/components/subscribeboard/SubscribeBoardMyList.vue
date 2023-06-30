<!-- 내가 참여한 구독 목록. 내 구독 리스트 -> subscribeparty detail로 들어가기-->
<template lang="">
    <div>
        <h1> {{loginId}} 님의 구독 목록</h1>

        <!-- <div v-for="order in list" :key="order.party" v-on:click="detail(order.subscribe_num.subscribeNum)">
            {{order.subscribe_num.subscribe_num}}
            {{order.subscribe_num.site}}
        </div> -->

        <div class="row row-cols-1 row-cols-md-4 g-4">
            <div class="row" v-for="order in list" :key="order.party" v-on:click="detail(order.subscribe_num.subscribeNum)" >
                <div class="col mylistbody">
                    <!-- 팀원 -->
                    <div class="card h-100 ingcardlist" v-if="order.start_check == 0 || order.start_check == 1" >
                        <img :src="getSiteLogo(order.subscribe_num.site)" class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title">{{order.subscribe_num.title}}</h5>
                            <p class="card-text"> {{order.email.email}} (참여자) {{order.subscribe_num.subscribeNum}}</p>
                            <p class="card-text"> 남은 포인트 {{order.point_basket}}</p>
                            <p class="card-text"> 종료일 {{subenddate}}</p>
                            
                            <p class="care-text recruit" v-if="order.start_check==0">모집 중</p>
                            <p class="care-text ing" v-if="order.start_check==1">진행 중</p>
                            <p class="care-text end" v-if="order.start_check==2">종료</p>
                        </div>
                    </div>

                    <div class="card h-100 endcardlist" v-if="order.start_check == 2" >
                        <img :src="getSiteLogo(order.subscribe_num.site)" class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title">{{order.subscribe_num.title}}</h5>
                            <p class="card-text"> {{order.email.email}} (모집자)</p>
                            <p class="card-text"> 남은 포인트 {{order.point_basket}}</p>
                            <p class="card-text"> 종료일 {{subenddate}}</p>
                            
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
        },
        getSiteLogo(site) {
            if (site === '넷플릭스') {
                return 'https://img.shields.io/badge/NETFLIX-black?style=for-the-badge&logo=netflix';
            } else if (site === '왓챠') {
                return 'https://img.shields.io/badge/WATCHA-black?style=for-the-badge&logo=wattpad&logoColor=FF4F8B';
            } else if (site === '티빙') {
                return 'https://img.shields.io/badge/TVING-black?style=for-the-badge&logo=tvtime&logoColor=DD1100';
            } else if (site === '웨이브') {
                return 'https://img.shields.io/badge/WAVE-004DB4?style=for-the-badge&logo=wish&logoColor=white';
            } else if (site === '디즈니플러스') {
                return 'https://img.shields.io/badge/DISNEY+-1B365D?style=for-the-badge&logo=disroot&logoColor=white';
            } else if (site === '아마존프라임비디오') {
                return 'https://img.shields.io/badge/AMAZON_PRIME-01A4FF?style=for-the-badge&logo=amazon&logoColor=black';
            } else {
                return '';
            }
        },
        // getStartCheckText(start_check) {
        //     if (start_check === '1') {
        //         return '서비스 시작';
        //     } else if (start_check === '0') {
        //         return '서비스 미시작';
        //     } else if (start_check === '2') {
        //         return '서비스 종료';
        //     } else {
        //         return '';
        //     }
        // },
    },
    created: function () {
        const self = this;
        this.loginId = sessionStorage.getItem('loginId')
        self.$axios.post('http://localhost:8181/subscribeparty/' + this.loginId)
            .then(function (res) {
                if (res.status == 200) {
                    self.list = res.data.list

                    // self.list.forEach((order) => {
                    //     const subscribestartdate = dayjs(order.subscribe_startdate);
                    //     const subscribeenddate = dayjs(order.subscribe_enddate);
                    //     order.left_day = subscribeenddate.diff(subscribestartdate, 'day');
                    // });
                    self.subenddate = dayjs(self.list.subscribe_enddate).format('YYYY-MM-DD');

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