<!-- 내가 참여한 구독 목록. 내 구독 리스트 -> subscribeparty detail로 들어가기-->
<template lang="">
    <div class="body">
        <h2> {{loginId}} 님의 구독 목록</h2>

        <!-- <div v-for="order in list" :key="order.party" v-on:click="detail(order.subscribe_num.subscribeNum)">
            {{order.subscribe_num.subscribe_num}}
            {{order.subscribe_num.site}}
        </div> -->

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
                            <p class="care-text end" v-if="order.start_check==2">종료</p>
                        </div>
                    </div>

                    <div class="card card border-light h-100 " v-if="order.start_check == 2" >
                        <img :src="getSiteLogo(order.subscribe_num.site)" class="card-img-top" alt="..." />
                        <div class="card-body endcardlist">
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


        checkmember() {
            const self = this;
            const promises = [];

            self.list.forEach(function (order) {
                const promise = self.$axios.get('http://localhost:8181/subscribeparty/party/' + order.subscribe_num)
                    .then(function (res) {
                        if (res.status === 200) {
                            self.partylist = res.data.list
                            order.recruitpeople = self.countRecruitPeople(res.data.list);
                            const item = res.data.list[0]; // 첫 번째 항목 선택
                            order.start_check = item.start_check; // start_check 값 확인
                            // console.log(order.start_check); // start_check 값 출력
                            // let AllPointbasket = 0;
                            // self.partylist.forEach(function (item) {
                            order.point_basket = item.point_basket;
                            // });
                            // self.AllPointbasket = AllPointbasket;
                            // self.partylist.forEach(function (item) {
                            //     self.point_basket = item.point_basket
                            // });
                            const recruitEndPeriodFormatted = dayjs(order.recruit_endperiod).format('YYYY-MM-DD');
                            self.recruit_endperiod = recruitEndPeriodFormatted;
                            order.recruit_endperiod = recruitEndPeriodFormatted;

                        } else {
                            alert('에러코드:' + res.status);
                        }
                    })
                    .catch(function (error) {
                        alert('에러코드:' + error.response.status);
                    });

                promises.push(promise);
            });

            Promise.all(promises)
                .then(() => {
                    this.list.forEach((order) => {
                        const self = this;
                        // // console.log('모든 비동기 요청 완료');
                        const currentTotalPointBasket = order.point_basket;

                        // self.list.forEach(function (order) {
                        // console.log(self.list);

                        const subEnddateFormatted = dayjs(order.subscribe_enddate).format('YYYY-MM-DD');
                        self.subscribe_enddate = subEnddateFormatted;
                        self.recruitpeople = order.recruitpeople
                        self.total_people = order.total_people
                        self.total_point = order.total_point

                        if (order.recruitpeople === order.total_people && self.currentDate > self.recruit_endperiod) {
                            // 인원수 같음 & 모집일 지남
                            order.flag = 1;

                        } else if (order.recruitpeople !== order.total_people && self.currentDate > self.recruit_endperiod) {
                            // 인원수 다름 & 모집일 지남
                            order.flag = 2;
                            //한구독의 전체금액 
                            // point basket & cash 관리 
                            // 취소된 사항 ( 모두의 예치금 전부 빼고, 각자에게 돈 돌아가기 )
                            // alert('num:' + order.subscribe_num + ' pb;' + currentTotalPointBasket)
                            if (currentTotalPointBasket != 0) {
                                const price = order.total_point / self.total_people
                                console.log('subscribenum:' + order.subscribe_num + ' price:' + price + ' id:' + self.email + ' pb:' + self.point_basket)
                                const form = new FormData();
                                form.append('paidamount', price)
                                form.append('email', self.email)
                                self.$axios.post('http://localhost:8181/payment/' + self.email, form)
                                    .then(function (res) {
                                        if (res.status == 200) {
                                            console.log(order.subscribe_num + ' 모집 종료로 금액 반환 되었음 ' + price)
                                            if (currentTotalPointBasket != 0) {
                                                self.$axios.post('http://localhost:8181/subscribeparty/money/' + order.subscribe_num)
                                                    .then(function (res) {
                                                        if (res.status === 200) {
                                                            console.log('취소돼서 0으로 만들고 돌아감');
                                                        }
                                                    })
                                                    .catch(function (error) {
                                                        // 에러 처리
                                                        console.error('에러 발생:', error);
                                                    });
                                            }
                                        } else {
                                            alert('오류')
                                        }
                                    });
                            } else {
                                console.log('이미 실행됨');
                            }

                        } else if (self.recruitpeople == self.total_people && self.currentDate > self.subscribe_enddate) {
                            // 구독 종료일 지남 (모두의 예치금 전부 빼기, 모집자에게 돈 이동)
                            order.flag = 2;
                            if (currentTotalPointBasket != 0) {
                                const self = this;
                                const price = order.subscribe_num.total_point;
                                console.log('구독 종료일 지남:' + price);
                                const email = order.subscribe_num.email.email(모집자);
                                console.log('구독 종료일 지남:' + email);
                                const form = new FormData();
                                form.append('email', email);
                                form.append('paidamount', price);
                                self.$axios.post('http://localhost:8181/payment/' + self.subscribe_num.email.email, form)
                                    .then(function (res) {
                                        if (res.status == 200) {
                                            alert('구독 끝 - 모집자에게 돈 돌아감 ')
                                            self.$axios
                                                .patch('http://localhost:8181/subscribeparty/money/' + order.subscribe_num)
                                                .then(function (res) {
                                                    if (res.status === 200) {
                                                        console.log('구독 종료일 지나서 0으로 만들고 돌아감');
                                                    } else {
                                                        alert(res.status + 'money 오류')
                                                    }
                                                })
                                                .catch(function (error) {
                                                    // 에러 처리
                                                    console.error('에러 발생:', error);
                                                });
                                        } else {
                                            console.log('실패 ; ')
                                        }
                                    })
                                    .catch(function (error) {
                                        alert('에러코드:' + error.response.status);
                                    });
                            } else {
                                console.log('이미 실행됨');
                            }
                        } else {
                            order.flag = 0;
                            // alert('빠져나옴 !! 다 해당안돼' + order.subscribe_num)
                        }
                        self.$axios.patch('http://localhost:8181/subscribeparty/' + order.subscribe_num + '/' + order.flag)
                            .then(function (res) {
                                // alert(res.data);
                                console.log('subscribenum:' + order.subscribe_num + ', start_check:' + order.start_check);
                            })
                            .catch(function (error) {
                                alert('에러코드:' + error.response.status);
                            });
                    });


                })
                // .then(function () {
                //     console.log('모든 비동기 요청 완료');
                //     self.checkEnd(); // 다른 메소드 호출
                // })
                .catch(function (error) {
                    console.log('에러 발생:', error);
                });
        },

        
    },
    created: function () {
        const self = this;
        this.loginId = sessionStorage.getItem('loginId')
        self.$axios.post('http://localhost:8181/subscribeparty/' + this.loginId)
            .then(function (res) {
                if (res.status == 200) {
                    self.list = res.data.list
                    self.checkmember();
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
    margin-top: 3%
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
}</style>