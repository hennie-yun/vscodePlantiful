<!-- 내가 참여한 구독 목록. 내 구독 리스트 -> subscribeparty detail로 들어가기-->
<template lang="">
    <div class="body">
        <h2> {{loginId}} 님의 구독 목록</h2>

        <div class="row row-cols-1 row-cols-md-3 g-4 cardblock">
            <div class="row" v-for="order in list" :key="order.party" v-on:click="detail(order.subscribe_num.subscribeNum)" >
                <div class="col mylistbody">
                    <!-- 팀원 -->
                    <div class="card card border-light h-100 " v-if="order.start_check == 0 || order.start_check == 1" >
                        <img :src="getSiteLogo(order.subscribe_num.site)" class="card-img-top" alt="..." />
                        <div class="card-body ingcardlist">
                            <h5 class="card-title">{{order.subscribe_num.title}}</h5>
                            <p class="card-text"> 
                                <div class="row">
                                    <div class="col">
                                        구독 글 번호 
                                    </div>
                                    <div class="col">
                                        {{order.subscribe_num.subscribeNum}} 
                                    </div>
                                </div>
                            </p>
                            <p class="card-text">
                                <div class="row">
                                    <div class="col">
                                        남은 포인트
                                    </div>
                                    <div class="col">
                                        {{order.point_basket}}
                                    </div>
                                </div>
                            </p>
                            <p class="card-text">
                                <div class="row">
                                    <div class="col">
                                        구독 종료일
                                    </div>
                                    <div class="col">
                                        {{subenddate}}
                                    </div>
                                </div>
                            </p>
                            
                            <p class="care-text recruit" v-if="order.start_check==0">모집 중</p>
                            <p class="care-text ing" v-if="order.start_check==1">진행 중</p>
                        </div>
                    </div>

                    <div class="card card border-light h-100 " v-if="order.start_check == 2" >
                        <img :src="getSiteLogo(order.subscribe_num.site)" class="card-img-top" alt="..." />
                        <div class="card-body endcardlist">
                            <h5 class="card-title">{{order.subscribe_num.title}}</h5>
                            <p class="card-text"> {{order.email.email}} (모집자)</p>
                            <p class="card-text"> 남은 포인트 {{order.point_basket}}</p>
                            <p class="card-text"> 종료일 {{subenddate}}</p>
                    
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
            list: [],
            subscribe_num: 0,
        }
    },
    methods: {
        detail(subscribe_num) {
            this.$router.push({ name: 'SubscribePartyDetail', query: { subscribe_num: subscribe_num } });
        },
        getSiteLogo(site) {
            if (site === '넷플릭스') {
                return 'https://www.edigitalagency.com.au/wp-content/uploads/Netflix-logo-red-black-png.png';
            } else if (site === '왓챠') {
                return 'https://oopy.lazyrockets.com/api/v2/notion/image?src=https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fd05ded51-54bf-4174-8b7e-e021c6eb6b5a%2FWATCHA_LOGO.svg&blockId=400d70c6-5698-4877-9ddf-83be123fb341';
            } else if (site === '티빙') {
                return 'https://blog.kakaocdn.net/dn/ejB6gz/btrbljBlAK9/cKb8PmW2fgRMmGJI4WTykk/img.jpg';
            } else if (site === '웨이브') {
                return 'https://img.pooq.co.kr/service30/profile/wavve2022.png';
            } else if (site === '디즈니플러스') {
                return 'https://cdn.getnews.co.kr/news/photo/202103/519560_206621_2732.png';
            } else if (site === '아마존프라임비디오') {
                return 'https://logos-world.net/wp-content/uploads/2021/02/Amazon-Prime-Video-Emblem.png';
            } else {
                return '';
            }
        },
        

    },
    created: function () {
        const self = this;
        this.loginId = sessionStorage.getItem('loginId')
        self.$axios.post('http://localhost:8181/subscribeparty/' + this.loginId)
            .then(function (res) {
                if (res.status == 200) {
                    self.list = res.data.list
                    console.log(self.list)
                    // self.list의 각 요소에서 subscribe_num을 추출하고 작업을 수행합니다.
                    // self.list.forEach(function (item) {
                    //     self.subscribe_num = item.subscribe_num.subscribeNum;
                    //     console.log(subscribeNum);
                    //     // 여기에서 subscribe_num을 사용하여 필요한 작업을 수행합니다.
                    // });

                    
                    // self.checkmember();
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
    margin-left: 8%;
    margin-right: 8%;
    margin-bottom: 8%;
    margin-top: 7%
}

.body h2 {
    margin: 50px;
    font-weight: 600;
    /* color: #7ac5ff; */
    color: black;
}

.cardblock {
    display: flex;
    justify-content: center;
}

.mylistbody {
    padding-top: 20% !important;
    padding: 20px;
}

.card-img-top {
    max-height: 130px;
}

/* 카드 내부 CSS */


.recruit {
    padding: 3px;
    border: 3px double #7ac5ff;
    border-radius: 10px;
}

.ing {
    padding: 3px;
    border: 2.5px double rgb(104, 104, 104);
    border-radius: 10px;
}

.ingcardlist .card-title {
    color: #4fb3ff;
    font-weight: bold;
    font-size: 28px;
    padding: 20px;
}

.ingcardlist .card-text {
    padding: 3px;
    background-color: rgb(246, 246, 246);
    border-radius: 10px;
}

.ingcardlist .recruit {
    padding: 3px;
    background-color: white;
    border-radius: 10px;
}

.ingcardlist {
    border: dashed 2px #7ac5ff;
}

.ingcardlist:hover {
    background-color: #9ed5ff64;
}

.endcardlist {
    background-color: #e4e4e4;
}

.endcardlist:hover {
    background-color: #bfc0c0;
}

.endcardlist .card-title {
    color: rgb(65, 65, 65);
    font-weight: bold;
    font-size: 28px;
    padding: 20px;
}
</style>