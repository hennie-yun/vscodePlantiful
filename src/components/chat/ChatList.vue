<template>
    <v-app>
        <div class="rounded-3" style="width: 50%; margin:12px auto; height: 85%;">
            <div class="text-center rounded-t-lg head-title">
                구독 파티 채팅방
            </div>
            <div id="messages" ref="box">
                <div class="wrapper" v-if="roomList.length == 0">
                    <h2 style="font-family:'TheJamsil5Bold';">아직 참여한 구독 파티가 없습니다</h2>
                </div>
                <div class="msg-box rounded-3" v-for="(item, idx) in roomList" v-bind:key="idx" style="margin:25px">
                    <div class="img-info-box" style="width:100%; padding-left: 15px;" @click="goRoom(item.num)">
                        <div class="img-box rounded-circle">
                            <img :src="'http://localhost:8181/chat/' + item.lastSender.email"
                            @error="replaceProfile" class="rounded-circle" style="margin:0 auto; width:36px; height: 36px;"/>
                        </div>
                        <div class="info-box text-left">
                            <p class="last-msg" style="font-size: 14px;">
                                {{ item.subscribeNum.email.nickname }} 님의 
                                {{ item.subscribeNum.site }} 구독 채팅방
                            </p>
                            <p class="last-msg" style="">{{ item.lastMsg }}</p>
                        </div>
                        <div>
                            
                        </div>
                    </div>
                </div>
            </div>
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
                    console.log(obj)
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
    #app {}

    #messages {
        overflow-x: hidden;
        overflow-y: auto;
        height : 100%;
        border-right: 1px solid #e0e0e0;
        border-left : 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
    }

    .head-title {
        display: flex;
        justify-content: center;
        align-items: center; 
        font-size: 30px;
        margin: 0 auto;
        color: white;
        height: 12%;
        background-color: #7AC6FF;
    }

    .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
    }

    .msg-box {
        background-color: #7AC6FF;
        display : flex;
        margin-left: 24px;
        margin-right: 24px;
        margin-top : 32px;
        height: 88px;
        justify-content: space-between;
    }

    .img-info-box {
        align-items: center;
        display: flex;
    }

    .last-msg{
        font-size :20px;
        margin: 0;
        color : white;
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