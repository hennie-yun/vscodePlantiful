<template>
    <div id="app">
        <div class="title">
            <h4>{{concert.name}}</h4>
        </div>
        <div class="container_box">
            <div class="poster">
                <p>
                    <img :src="concert.poster">
                </p>
            </div>
            <div class="infobox">
                <ul style="" class="boxlist">
                    <li class="list">
                        <div class="row">
                            <div class="col-2 headbox">공연 기간</div> 
                            <div class="col-10 descbox">
                                {{ concert.startDate }} ~ {{ concert.endDate }}
                            </div>
                        </div>
                    </li>
                    <li class="list">
                        <div class="row">
                            <div class="col-2 headbox">공연 장소</div> 
                            <div class="col-10 descbox">
                                {{ concert.loc }}
                            </div>
                        </div>
                    </li>
                    <li class="list">
                        <div class="row">
                            <div class="col-2 headbox">공연 날짜</div> 
                            <div class="col-10 descbox">
                                {{ concert.concertTime }}
                            </div>
                        </div>
                    </li>
                    <li class="list">
                        <div class="row">
                            <div class="col-2 headbox">공연 시간</div> 
                            <div class="col-10 descbox">
                                {{ concert.runTime }}
                            </div>
                        </div>
                    </li>
                    <li class="list">
                        <div class="row">
                            <div class="col-2 headbox">관람연령</div> 
                            <div class="col-10 descbox">
                                {{ concert.age }}
                            </div>
                        </div>
                    </li>
                    <li class="list">
                        <div class="row">
                            <div class="col-2 headbox">티켓 가격</div> 
                            <div class="col-10 descbox">
                                {{ concert.price }}
                            </div>
                        </div>
                    </li>
                    <li class="list">
                        <div class="row">
                            <div class="col-2 headbox">출연진</div> 
                            <div class="col-10 descbox">
                                {{ concert.cast }}
                            </div>
                        </div>
                    </li>
                    <li class="list">
                        <div class="row">
                            <div class="col-2 headbox">공연 상태</div> 
                            <div class="col-10 descbox">
                                {{ concert.state }}
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="text-center">
                    <div class="col-6" style="float:left">
                        <b-button class="b-btn" block @click="$router.go(-1)">
                            목록으로 돌아가기
                        </b-button>
                    </div>
                    <div class="col-6" style="float:right" @click="addToSchedule">
                        <b-button class="b-btn" block>
                            스케쥴에 공연 일정 추가하기
                        </b-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="present-box">
            <b-tabs card fill="true" 
                active-nav-item-class="bg-blue-lighten-2 font-weight-bold text-white "
                style="font-family: 'TheJamsil5Bold';">
                <b-tab title="소개">
                    <div class="present-box">
                        <img 
                            v-for="(styurl, index) in concert.styurls" 
                            :key="index" :src="styurl"
                        >
                    </div>
                </b-tab>
                <b-tab title="공연 장소" @click="relay">
                    <div class="present-box">
                        <KakaoMap v-bind:propsdata="loc" ref="kakaomap"></KakaoMap>
                    </div>
                </b-tab>
            </b-tabs>
        </div>
        <div>
            <h3 class="source">
                출처: (재)예술경영지원센터 공연예술통합전산망(www.kopis.or.kr)
            </h3>
        </div>
    </div>
</template>
<script>
    import KakaoMap from "@/components/concert/KakaoMap"
import { formatDate } from '@fullcalendar/core'

    export default {
        components: {
            'KakaoMap' : KakaoMap
        },
        name: 'concertdetail',
        data() {
            return {
                id : '',
                concert : {},
                loc : ''
            }
        }, 

        methods : {
            addToSchedule() {
                let sDate = this.concert.startDate.replaceAll('.', '-')
                let eDate = this.concert.endDate.replaceAll('.', '-')
                console.log(sDate)
                console.log(eDate)
                const self = this
                const formData = new FormData()
                formData.append('email', sessionStorage.getItem('loginId'));
                formData.append('title', this.concert.name);
                formData.append('start', sDate);
                formData.append('end', eDate);
                formData.append('info', this.concert.genre);
                formData.append('isLoop', 1);
                self.$axios.post("http://localhost:8181/concert", formData)
                    .then((result) => {
                        console.log(result)
                        if(result.data.isJoin == true) {
                            alert("이미 추가하신 일정입니다!")
                        } else {
                            self.$router.push('calendar')
                        }
                    }).catch((err) => {
                        console.log("error : "+err)
                    });
            },

            relay() {
                this.$refs.kakaomap.relay()
            }
        },
        
        created () {
            this.id = this.$route.query.id
            const self = this
            self.$axios('http://localhost:8181/concert/detail/'+this.id)
            .then((result) => {
                console.log(result.data.concert)
                this.concert = result.data.concert
                self.$axios('http://localhost:8181/concert/getAdrs/'+ this.concert.locId)
                .then((result) => {
                    this.loc = result.data.adres
                }).catch((err) => {
                    console.log("error : "+err)
                });
            }).catch((err) => {
                console.log("error : "+err)    
            });
        }
    }
</script>
<style scoped>
    #app {
        width : 65%;
        margin: 0 auto;
    }

    .title {
        border-bottom: 1px solid #000;
        margin-top : 80px;
        padding-bottom: 15px;
        overflow: hidden;
    }

    .container_box {
        display: table;
        width: 100%;
        table-layout: fixed;
        word-wrap: break-word;
        margin: 35px 0 50px;

    }

    .poster {
        display: table-cell;
        vertical-align: top;
        width: 258px;
    }
    
    .poster img {
        max-width: 100%;
    }

    .infobox {
        display: table-cell;
        vertical-align: top;
        padding-left: 2px;
    }

    .boxlist{
        margin-top:0;
        /* border: 1px solid #e0e0e0; */
        border-right: 1px solid #e0e0e0 ;
        border-bottom: none;
        list-style-type: none;
        table-layout: fixed; 
        word-wrap:break-word;
        display: table;
        width: 100%;
        height: 100%;
    }

    .list {
        padding: 0;
        border-top: 1px solid #e0e0e0;
        border-left : 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;    
    }

    .headbox{
        font-weight: bold;
        padding: 1rem;
        padding-left: 2rem;
        /* margin : 0 auto; */
        /* border-left: 1px solid #e0e0e0; */
        border-right: 1px solid #e0e0e0;
    }

    .descbox {
        text-align: left;
        padding: 1rem;
        font-weight: 500;
    }

    .b-btn {
        font:Pretendard-Regular;
        padding-right : 0px;
        padding-left : 0px;
        font-weight: 600; 
        background-color: #7AC6FF;
        color:white;
        width: 90%;
    }

    .atab {
       background-color: #7AC6FF !important;
    }

    .present-box {
        width: 100%;
        padding : 36px;
        text-align: center;
        border:1px solid #e0e0e0;
    }

    .present-box img {
        max-width: 100%;
    }

    .source {
        padding:36px;
        font-family: Arial, 
        Helvetica, sans-serif; 
        font-weight: 600;
        text-align: center;
    }
</style>