<template lang="">
        <div class="container text-center">
       
            <div class="grid text-center">
                <h1> 구독 공유 시작하기 </h1>
            </div>
            <div class="row"> 
                <div class="col" v-on:click="search('all')">전체보기</div>
                <div class="col" v-on:click="search('넷플릭스')">넷플릭스</div>
                <div class="col" v-on:click="search('왓챠')">왓챠</div>
                <div class="col" v-on:click="search('티빙')">티빙</div>
                <div class="col" v-on:click="search('웨이브')">웨이브</div>
                <div class="col-2" v-on:click="search('디즈니플러스')">디즈니플러스</div>
                <div class="col-2" v-on:click="search('아마존프라임비디오')">프라임 비디오</div>
            </div>
        </div>  
        <div class="container text-right">
            <button>
                <router-link to="/SubscribeBoardAdd">
                    <button class="btn">글 등록</button>
                </router-link>
            </button>
            <button>
                <router-link to="/SubscribeBoardMyList">
                    <button class="btn">내 구독 목록</button>
                </router-link>
            </button>
        </div>
        <div class="">
            <div class="row">
                <div class="col">
                    글 번호
                </div>
                <div class="col">
                    사이트
                </div>
                <div class="col">
                    이름
                </div>
                
                <div class="col">
                    작성자
                </div>
                <div class="col">
                    모집 마감일
                </div>
                <div class="col">
                    모집 현황
                </div>
                <div class="col">
                    진행 여부
                </div>
            </div>
            
            
                <div class="row" v-for="order in list" :key="order.subscribe_num" v-on:click="detail(order.subscribe_num)">
                    <div class="col">
                        {{order.subscribe_num}}
                    </div>
                    <div class="col">
                        {{order.site}}
                    </div>
                    <div class="col">
                        {{order.title}}
                    </div>
                    <div class="col">
                        {{order.email.email}}
                    </div>
                    <div class="col">
                        {{order.recruit_endperiod}}
                    </div>
                    
                    <div class="col">
                        {{order.recruitpeople}} / {{order.total_people}} 
                    </div>
                    <div class="col">
                        <p class="care-text recruit" v-if="order.start_check==0">모집 중</p>
                        <p class="care-text ing" v-if="order.start_check==1">진행 중</p>
                        <p class="care-text end" v-if="order.start_check==2">종료</p>
                    </div>
                    
            </div>
        </div>
            
</template>
<script>
import dayjs from 'dayjs';
export default {

    name: 'SubscribeBoardList',
    components: {
    },
    data() {
        return {
            list: [],
            currentDate: null,
            flag: 0,
        }
    },

    mounted() {
        // this.currentDate = new Date().toLocaleDateString();
        // const currentDateFormatted = dayjs(this.currentDate, 'YYYY. MM. DD.').format('YYYY-MM-DD');
        // this.currentDate = currentDateFormatted;
        this.currentDate = dayjs().format('YYYY-MM-DD');

    },
    created: function () { //한번 실행
        const self = this;
        let loginId = sessionStorage.getItem('loginId')
        self.$axios.get('http://localhost:8181/subscribeboard') //비동기 요청

            .then(function (res) {
                if (res.status == 200) {
                    self.list = res.data.list
                    self.checkmember();
                } else {
                    alert('에러코드:' + res.status)
                }
            })



    },
    methods: {
        detail(subscribe_num) {
            this.$router.push({ name: 'SubscribeBoardDetail', query: { subscribe_num: subscribe_num } })
        },
        mylist(email) {
            this.$router.push({ name: 'SubscribeBoardMyList', query: { email: email.email } })
        },
        search(site) {
            const self = this;
            if (site == 'all') {
                self.list = self.searchedList;
            } else {
                self.$axios.get('http://localhost:8181/subscribeboard/site/' + site)
                    .then(function (res) {
                        if (res.status === 200) {
                            // self.list = res.data.list
                            // self.checkmember();
                            self.searchedList = res.data.list;
                            self.list = self.searchedList;
                            self.checkmember();
                        }
                    })
            }
        },
        checkmember() {
            const self = this;
            const promises = [];

            self.list.forEach(function (order) {
                const promise = self.$axios.get('http://localhost:8181/subscribeparty/party/' + order.subscribe_num)
                    .then(function (res) {
                        if (res.status === 200) {
                            order.recruitpeople = self.countRecruitPeople(res.data.list);
                            const item = res.data.list[0]; // 첫 번째 항목 선택
                            order.start_check = item.start_check; // start_check 값 확인
                            console.log(order.start_check); // start_check 값 출력
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
                .then(function () {
                    console.log('모든 비동기 요청 완료');
                    self.list.forEach(function (order) {
                        console.log(self.list);
                        const recruitEndPeriodFormatted = dayjs(order.recruit_endperiod).format('YYYY-MM-DD');
                        order.recruit_endperiod = recruitEndPeriodFormatted;
                        if (order.recruitpeople === order.total_people && self.currentDate > order.recruit_endperiod) {
                            order.flag = 1;
                        } else if (order.recruitpeople !== order.total_people && self.currentDate > order.recruit_endperiod) {
                            order.flag = 2;
                        } else {
                            order.flag = 0;
                        }
                        self.$axios.patch('http://localhost:8181/subscribeparty/' + order.subscribe_num + '/' + order.flag)
                            .then(function (res) {
                                // alert(res.data);
                                console.log(order.start_check);
                            })
                            .catch(function (error) {
                                alert('에러코드:' + error.response.status);
                            });

                    });
                })
                .catch(function (error) {
                    console.log('에러 발생:', error);
                });




        },

        countRecruitPeople(emailList) {
            let count = 0;
            emailList.forEach(function (email) {
                if (email.email) {
                    count++;
                }
            });
            return count;
        }
    }
}

</script>
 
<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>

