<template>
    <v-app>
        <div class="elevation-1 h-100 text-center" style="width: 65%; margin: 0 auto;">
            <!-- <div class="text-left" style="height: 10%; background-color: #7AC6FF;">
            </div> -->
            <v-container class="rounded-xl" id="messages" ref="box">
                <!-- <div class="rounded elevation-10" style="height: 100%;"> -->
                    <div class="wrapper" v-if="roomList.length == 0">
                        <h2 style="font-family:'TheJamsil5Bold';">아직 참여한 구독 파티가 없습니다</h2>
                    </div>
                    <div class="msg-box rounded-3" v-for="(item, idx) in roomList" v-bind:key="idx" style="margin:25px">
                        <div class="img-info-box" style="width:100%;" @click="goRoom(item.num)">
                            <div class="img-box rounded-circle h-50">
                                <img :src="'http://localhost:8181/chat/' + item.lastSender.email"
                                @error="replaceProfile" class="rounded-circle" style="margin:0 auto; width:48px; height: 48px;"/>
                            </div>
                            <div class="info-box text-left">
                                <p class="last-msg" style="">
                                    {{ item.subscribeNum.email.nickname }} 님의 
                                    {{ item.subscribeNum.site }} 구독 채팅방
                                </p>

                                <p class="last-msg">{{ item.lastSender.nickname }}</p>
                                <p class="last-msg" style="font-size: 24px;">{{ item.lastMsg }}</p>
                            </div>
                            <div>
                                
                            </div>
                        </div>
                    </div>
                <!-- </div> -->
            </v-container>
        </div>
    </v-app>
</template>
<script>
import img from '@/assets/image/profile.png'

export default {
    name : 'ChatList',
    data() {
        return {
            loginId : sessionStorage.getItem("loginId"),
            roomList : []
        }
    }, methods : {
        goRoom(roomNum) {
            this.$router.push({name : 'chat', query : {'roomNum' : roomNum}})
        },

        replaceProfile(e) {
            e.target.src = img
        }
    }, created : function() {
        let self = this
        let list = this.roomList
        self.$axios.get("http://localhost:8181/chat/roomlist", {params : {email : this.loginId}})
        .then((ret) => {
            if(ret.data.list !== null) {
                for(let obj of ret.data.list) {
                    list.push(obj)
                }

                list = list.sort((a, b) => {
                    if(b.lastSendTime > a.lastSendTime) return 1
                    if(b.lastSendTime < a.lastSendTime) return -1
                    return 0
                })
            } else {
                list = null
            }
        }).catch((error) => {
            console.log("error : " +error)
        })
    }
}
</script>
<style scoped>
    #messages {
        overflow-x: hidden;
        overflow-y: auto;
        height : 100%;
    }

    .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
    }

    .msg-box {
        background-color: #e0e0e0;
        display : flex;
        margin-left: 24px;
        margin-right: 24px;
        margin-top : 32px;
        height: 88px;
        justify-content: space-between;
    }

    .img-info-box {
        display: flex;
    }

    .last-msg{
        font-size :14px;
        margin: 0;
        color : #737373;
    }

    .img-box {
        display: flexbox;
        background-color:white ;
        justify-content: center;
        align-items: center;
        position: relative;
        margin-right : 12px;
    }

    .info-box {
        display: flex;
        flex-direction: column;
        justify-content: space-around ;
        width : 50vw;
    }

    .site-name{
        font-size : 16px;
        font-weight: 700;
    }


    .img-box img {
        width : 54px;
        height : 54px;
        border-radius: 16px;
    }

    .im-on{
        position: absolute;
        width: 8px;
        height: 8px;
        top: 0;
        right: 0;
        background-color: #00B286 ;
        border: 1.5px solid #F8F8FA;
        border-radius: 100%;
    }

    p {
        margin : 0px;
    }
</style>