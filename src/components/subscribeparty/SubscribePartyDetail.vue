<!-- 구독 그룹별 파티 인원 -->
<template lang="">
    <div class="body">
        <div v-for="(order, index) in list" :key="order.party">
            <div v-if="index === 0" class="row subscribeboardform">
                <div class="row bigtitle">
                    <div class="col imgdiv">
                        <!-- 티빙 -->
                        <img v-if="order.subscribe_num.site == '티빙'" src="https://buts.co.kr/thema/Buts/colorset/category/1050.jpg" alt="">
                        <!-- 넷플릭스 -->
                        <img v-if="order.subscribe_num.site == '넷플릭스'" src="https://buts.co.kr/thema/Buts/colorset/category/1010.jpg"
                            alt="">
                        <!-- 웨이브 -->
                        <img v-if="order.subscribe_num.site == '웨이브'" src="https://buts.co.kr/thema/Buts/colorset/category/1040.jpg" alt="">
                        <!-- 디즈니플러스 -->
                        <img v-if="order.subscribe_num.site == '디즈니플러스'" src="https://buts.co.kr/thema/Buts/colorset/category/1080.jpg"
                            alt="">
                        <!-- 왓챠 -->
                        <img v-if="order.subscribe_num.site == '왓챠'" src="https://buts.co.kr/thema/Buts/colorset/category/1020.jpg" alt="">
                        <!-- 프라임비디오 -->
                        <img v-if="order.subscribe_num.site == '아마존프라임비디오'" src="https://buts.co.kr/thema/Buts/colorset/category/1070.jpg"
                            alt="">
                    </div>
                    <div class="col sbgroup">
                        <div class="row sbsmalltitle">
                            {{ order.subscribe_num.site }}
                        </div>
                        <div class="row sbtitle">
                            {{order.subscribe_num.title}}
                        </div>
                    </div>
                    <div class="col">
                        <div class="row sbsmalltitle2">
                            구독종료일
                        </div>

                        <div class="row sbtitle2">
                            {{  order.subscribe_num.subscribe_enddate }} 
                        </div>

                    </div>
                </div>
                
                <div v-if="order.start_check==1" class="row">
                    <button v-on:click="addSchedule">캘린더에 일정 추가하기</button>
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
                    <div class="recruit subboardcontent col" v-if="order.start_check==0">모집 중</div>
                    <div class="ing subboardcontent col" v-if="order.start_check==1">진행 중</div>
                    <div class="end subboardcontent col" v-if="order.start_check==2">종료</div>
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
                <div class="row">
                    <div class="col subboardtitle">
                        총 금액
                    </div>
                        <div class="col subboardcontent">
                            {{ order.subscribe_num.total_point }}
                        </div>
                    
                    <div class="col subboardtitle">
                        인당 금액
                    </div>
                        <div class="col subboardcontent">
                            {{  order.subscribe_num.total_point/order.subscribe_num.total_people }}  
                        </div>
                </div>
            </div>
            <div v-if="index === 0" class="row">
                    <div class="border">
                    </div>
                    <div class="col ">
                        <h3 class="title">참여자 정보 </h3>
                    </div>
                </div>
            <div class="partyinfo">
                <div class="row content">
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
                        지불한 포인트
                    </div>
                    <div class="col">
                        {{ order.point_basket }}
                    </div>
                    <!-- <div class="col" v-if="order.email.email === loginId">
                        {{ order.point_basket }}
                    </div>
                    <div class="col" v-if="order.email.email !== loginId">
                        비공개 
                    </div> -->
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
            calendarOptions: {  // calendarOptions 객체 생성
                events: []
            }
        }
    },
    methods: {
        addSchedule() {
            const self = this;
            const createEvent = (title, start, end) => {
                const form = new FormData();
                form.append('email', sessionStorage.getItem('loginId'));
                form.append('title', title);
                form.append('start', start);
                form.append('end', end);
                form.append('info', '구독글 제목: ' + this.list[0].subscribe_num.title);
                form.append('day', null);

                self.$axios.post("http://localhost:8181/schedules", form)
                    .then(response => {
                        const savedEvent = response.data.dto;
                        self.calendarOptions.events.push({
                            title: savedEvent.title,
                            start: savedEvent.start,
                            end: dayjs(savedEvent.end).format('YYYY-MM-DD'),
                            daysOfWeek: savedEvent.day,
                            display: 'block',
                        });
                        alert('일정이 추가되었습니다.');
                    });
            };

            createEvent(
                this.list[0].subscribe_num.site + '구독 시작일',
                this.list[0].subscribe_num.subscribe_startdate,
                this.list[0].subscribe_num.subscribe_startdate
            );

            createEvent(
                this.list[0].subscribe_num.site + '구독 종료일',
                this.list[0].subscribe_num.subscribe_enddate,
                this.list[0].subscribe_num.subscribe_enddate
            );
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
    margin-left: 15%;
    margin-right: 15%;
    margin-bottom: 8%;
}

.bigtitle {
    position: relative;
    padding: 15px 0;
    padding-left: 20px;
    padding-right: 42px;
    border-bottom: 5px double #7ac5ff;
    display: flex;
    flex-direction: row;
    /* margin-top: 50px; */
    /* margin-left: 30px;
    margin-right: 30px; */
    margin-bottom: 30px;
    align-items: center;
    
}

.imgdiv {
    max-width: 130px;
}

img {
    max-width: 80px;
    margin: 10px;
    border-radius: 12px;
}
.subscribeboardform {
    /* border: 1px solid; */
    padding: 3%;
    margin: 3%;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    
}

.border{
    border-style: dashed !important;
    border-color: #7ac5ff !important;
    margin-bottom: 30px;
    margin-top: 18px;
}

.sbsmalltitle2 {
    display: flex;
    justify-content: flex-end;
}
.row.sbsmalltitle,
.row.sbtitle {
    align-self: flex-end;
    /* 수직 축 정렬은 아래로 */
}
.subboardtitle {
    background-color: rgb(246, 246, 246);
    border-radius: 8px;
    margin: 5px;
    padding: 7px;
    padding-left: 14px;
    padding-right: 14px;
}

.subboardcontent {
    padding: 0.4%;
    margin: 5px;
    padding: 7px;
}

.sbtitle2 {
    font-weight: 600;
    /* color: #7ac5ff; */
    font-size: 35px;
    display: flex;
    justify-content: flex-end;
}

.sbtitle {
    /* margin: 50px; */
    font-weight: 600;
    /* color: #7ac5ff; */
    font-size: 35px;

}

.partyinfo{
    padding: 7px;
    margin: 4px;
    background-color: #7ac5ffa3;   
    color: black;
    /* background-color: #7ac5ff;   
    color: white; */
    border-radius: 10px;
    
    /* font-weight: 600; */
}
.title{
    margin: 10px;
    margin-bottom: 29px;
    /* font-weight: 600; */
}
.partyinfo .content{

}
</style>