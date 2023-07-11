<template>
    <div class="body">
        <div class="container text-center">

            <div class="grid text-center">
                <h2 class="sbtitle"> 구독 공유 시작하기 </h2>
            </div>
            <div class="row alllistsite">
                <div class="col" v-on:click="search('all')"><img
                        src="https://img.shields.io/badge/전체보기-black?style=for-the-badge&logo=headlessui&logoColor=white" />
                </div>
                <div class="col" v-on:click="search('넷플릭스')"><img
                        src="https://img.shields.io/badge/NETFLIX-black?style=for-the-badge&logo=netflix&logoColor=E50914" />
                </div>
                <div class="col" v-on:click="search('왓챠')"><img
                        src="https://img.shields.io/badge/WATCHA-black?style=for-the-badge&logo=wattpad&logoColor=FF4F8B" />
                </div>
                <div class="col" v-on:click="search('티빙')"><img
                        src="https://img.shields.io/badge/TVING-black?style=for-the-badge&logo=tvtime&logoColor=DD1100" />
                </div>
                <div class="col" v-on:click="search('웨이브')"><img
                        src="https://img.shields.io/badge/WAVE-004DB4?style=for-the-badge&logo=wish&logoColor=white" />
                </div>
                <div class="col-2" v-on:click="search('디즈니플러스')"><img
                        src="https://img.shields.io/badge/DISNEY+-1B365D?style=for-the-badge&logo=disroot&logoColor=white" />
                </div>
                <div class="col-2" v-on:click="search('아마존프라임비디오')"><img
                        src="https://img.shields.io/badge/AMAZON-01A4FF?style=for-the-badge&logo=amazon&logoColor=black" />
                </div>
            </div>
        </div>
        <div class="text-right">
            <router-link to="/SubscribeBoardAdd">
                <button class="btn custom-button" style="background-color: #7AC6FF; color:white;">글 등록</button>
            </router-link>
            <router-link to="/SubscribeBoardMyList">
                <button class="btn custom-button" style="background-color: #7AC6FF; color: white;">내 구독 목록</button>
            </router-link>
        </div>
        <div class="bodylist">
            <div class="row listtitle">
                <div class="col">
                    글 번호
                </div>
                <div class="col">
                    사이트
                </div>
                <div class="col">
                    이름
                </div>

                <div class="col-3">
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

            <div v-if="list != null && list.length > 0">
                <div v-for="order in list" :key="order.subscribe_num">
                    <div class="row beforelist" v-if="order.start_check === 0" v-on:click="detail(order.subscribe_num)">
                        <div class="col">
                            {{ order.subscribe_num }}
                        </div>
                        <div class="col">
                            {{ order.site }}
                        </div>
                        <div class="col">
                            {{ order.title }}
                        </div>
                        <div class="col-3">
                            {{ order.email.email }}
                        </div>
                        <div class="col">
                            {{ order.recruit_endperiod }}
                        </div>

                        <div class="col">
                            {{ order.recruitpeople }} / {{ order.total_people }}
                        </div>
                        <div class="col">
                            <p class="care-text recruit" v-if="order.start_check == 0">모집 중</p>
                            <p class="care-text ing" v-if="order.start_check == 1">진행 중</p>
                            <p class="care-text end" v-if="order.start_check == 2">종료</p>
                        </div>
                    </div>
                </div>

                <div v-for="order in list" :key="order.subscribe_num">
                    <div class="row inglist" v-if="order.start_check === 1" v-on:click="detail(order.subscribe_num)">
                        <div class="col">
                            {{ order.subscribe_num }}
                        </div>
                        <div class="col">
                            {{ order.site }}
                        </div>
                        <div class="col">
                            {{ order.title }}
                        </div>
                        <div class="col-3">
                            {{ order.email.email }}
                        </div>
                        <div class="col">
                            {{ order.recruit_endperiod }}
                        </div>

                        <div class="col">
                            {{ order.recruitpeople }} / {{ order.total_people }}
                        </div>
                        <div class="col">
                            <p class="care-text recruit" v-if="order.start_check == 0">모집 중</p>
                            <p class="care-text ing" v-if="order.start_check == 1">진행 중</p>
                            <p class="care-text end" v-if="order.start_check == 2">종료</p>
                        </div>
                    </div>

                </div>
                <div v-for="order in list" :key="order.subscribe_num">
                    <div class="row endlist" v-if="order.start_check === 2" v-on:click="detail(order.subscribe_num)">
                        <div class="col">
                            {{ order.subscribe_num }}
                        </div>
                        <div class="col">
                            {{ order.site }}
                        </div>
                        <div class="col">
                            {{ order.title }}
                        </div>
                        <div class="col-3">
                            {{ order.email.email }}
                        </div>
                        <div class="col">
                            {{ order.recruit_endperiod }}
                        </div>

                        <div class="col">
                            {{ order.recruitpeople }} / {{ order.total_people }}
                        </div>
                        <div class="col">
                            <p class="care-text recruit" v-if="order.start_check == 0">모집 중</p>
                            <p class="care-text ing" v-if="order.start_check == 1">진행 중</p>
                            <p class="care-text end" v-if="order.start_check == 2">종료</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="norecruit">
                모집이 없습니다.
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
            partylist: [],
            email: sessionStorage.getItem('loginId'),
            subscribe_enddate: null,
            // recruit_endperiod: null,
            recruitpeople: 0,
            total_people: 0,
            subscribe_num: 0,
            point_basket: 0,
            AllPointbasket: 0,
        }
    },

    mounted() {
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
            }.bind(this))

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
                self.$axios.get('http://localhost:8181/subscribeboard') //비동기 요청
                    .then(function (res) {
                        if (res.status == 200) {
                            self.list = res.data.list
                            self.checkmember();

                            if (self.list == null) {
                                alert('모집이 없습니다.')
                            }
                        } else {
                            alert('에러코드:' + res.status)
                        }
                    })
                // self.list = self.searchedList;
            } else {
                self.$axios.get('http://localhost:8181/subscribeboard/site/' + site)
                    .then(function (res) {
                        if (res.status === 200) {
                            // self.list = res.data.list
                            // self.checkmember();
                            self.searchedList = res.data.list;
                            self.list = self.searchedList;
                            self.checkmember();
                            if (self.list == null) {
                                alert('모집이 없습니다.')
                            }
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

                        // alert(self.currentDate + '오늘날짜 ')
                        if (order.recruitpeople === order.total_people && (self.currentDate > order.recruit_endperiod && self.currentDate === order.recruit_endperiod) && (self.currentDate < self.subscribe_enddate)) {
                            // 인원수 같음 & 모집일 지남
                            // alert('오늘 flag 1 '+ self.currentDate)
                            // alert('모집 마감일 flag 1 '+ order.recruit_endperiod + order.subscribe_num)
                            console.log(order.recruit_endperiod + order.subscribe_num)
                            order.flag = 1;

                        } else if (order.recruitpeople !== order.total_people && (self.currentDate > order.recruit_endperiod) && (self.currentDate !== order.recruit_endperiod)) {
                            alert('2 '+order.subscribe_num+self.currentDate + order.recruit_endperiod)
                            // alert('모집 마감일 flag2 '+ order.recruit_endperiod + order.subscribe_num)
                            console.log('2'+order.recruit_endperiod + order.subscribe_num)
                            // 인원수 다름 & 모집일 지남
                            order.flag = 2;
                            //한구독의 전체금액 
                            // point basket & cash 관리 
                            // 취소된 사항 ( 모두의 예치금 전부 빼고, 각자에게 돈 돌아가기 )
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

                        } else if (self.recruitpeople === self.total_people && self.currentDate > self.subscribe_enddate) {
                            // 구독 종료일 지남 (모두의 예치금 전부 빼기, 모집자에게 돈 이동)
                            order.flag = 2;
                            if (currentTotalPointBasket != 0) {
                                const self = this;
                                const price = order.total_point;
                                console.log('구독 종료일 지남:' + price);
                                console.log('구독 종료일 지남:' + self.email);
                                const form = new FormData();
                                form.append('email', self.email);
                                form.append('paidamount', price);
                                self.$axios.post('http://localhost:8181/payment/' + self.email, form)
                                    .then(function (res) {
                                        if (res.status == 200) {
                                            alert('구독 끝 - 모집자에게 돈 돌아감 ')
                                            self.$axios
                                                .post('http://localhost:8181/subscribeparty/money/' + order.subscribe_num)
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
                                console.log('subscribenum:' + order.subscribe_num + ', start_check:' + order.start_check + '모집마감일: '+order.recruit_endperiod);
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

/* #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
} */




.body {
    /* margin-left:7%;
    margin-right:7%;
    margin-bottom:7%; */
    text-align: center;
    margin-left: 10%;
    margin-right: 10%;
    margin-bottom: 30px;
    margin-top: 3%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.col {
    text-align: center;
}

.custom-button {
    margin-top: 20px;
    margin-bottom: 30px;
    margin-right: 10px;
}

/* .btn:hover{
    background-color: aliceblue;
} */
.sbtitle {
    margin: 50px;
    font-weight: 600;
    /* color: #7ac5ff; */
    color: black;
}

.beforelist {
    /* background-color: aliceblue; */
    padding-top: 10px;
    /* border-bottom: 1px solid rgba(82, 82, 82, 0.224); */
    border: 2px dashed #7ac5ff;
    margin-top: 5px;
    margin-bottom: 5px;
    /* 마우스 커서 */

    cursor: pointer;
}

.inglist {
    padding-top: 10px;
    border-bottom: 1px solid rgba(82, 82, 82, 0.224);
    border: 1px dashed black;
    /* background: linear-gradient(#7ac5ff71 50%, rgb(255, 255, 255) 50%);
    background-size: 100% 10px; */
    margin-top: 5px;
    margin-bottom: 5px;
    /* 마우스 커서 */
    cursor: pointer;
}

.endlist {
    background-color: rgb(237, 237, 237);
    padding-top: 10px;
    border-bottom: 1px solid rgba(82, 82, 82, 0.224);
    /* 마우스 커서 */
    cursor: pointer;
}

.bodylist {
    margin-bottom: 100px;
}

.alllistsite {
    padding: 5px;
    /* margin: -158px; */
}

img {
    border-style: none;
    margin: 5px;
    max-height: 30px;
}

.listtitle {
    /* background-color: aliceblue; */
    border-bottom: 1px solid;
    padding: 10px;
    background-color: #67bbfb;
    color: white;
    font-weight: 300;
}

.container {
    padding-left: 30px;
}

.norecruit{
    margin: 30px;
}
</style>

