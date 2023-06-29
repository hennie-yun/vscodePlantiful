<template>
    <v-app>
        <div class="elevation-12 h-100 text-center" style="width: 75%; margin: 0 auto;">
            <div class="text-left" style="height: 10%; background-color: blueviolet;">
                <button class="" style="vertical-align: center;">asd</button>
            </div>
            <v-container class="rounded-xl" id="messages" ref="box">
                <!-- <div class="rounded elevation-10" style="height: 100%;"> -->
                    <div class="msg-box" v-for="(item, idx) in roomList" v-bind:key="idx" style="margin:25px">
                        <div class="img-info-box elevation-1" style="width:100%;" @click="goRoom(item.num)">
                            <div class="img-box">
                                <img :src="'http://localhost:8181/chat/' + item.lastSender.email"
                                @error="replaceProfile" style="width:84px; height: 84px;"/>
                            </div>
                            <div class="info-box text-left">
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
            for(let obj of ret.data.list) {
                console.log(obj)
                list.push(obj)
            }
        }).catch((error) => {
            console.log("error : " +error)
        })
    }
}
</script>
<style>
    .msg-box {
        display : flex;
        margin-left: 24px;
        margin-right: 24px;
        margin-top : 32px;
        height: 88px;
        justify-content: space-between;
        .img-info-box {
            display: flex;
            .img-box {
                img {
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
                position: relative;
                margin-right : 12px;
                }
                .info-box {
                display: flex;
                flex-direction: column;
                justify-content: space-around ;
                width : 50vw;
                .site-name{
                    font-size : 16px;
                    font-weight: 700;
                }
                .last-msg{
                    font-size :14px;
                    margin: 0;
                    color : #737373;
                }
            }
        }

        p {
            margin : 0px;
        }
    }
</style>