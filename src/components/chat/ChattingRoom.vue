<template>
    <v-container class="" style="width:50%">
        <div style="padding:12px;">
            <b-button class="float-left" variant="outline-secondary" @click="$router.go(-1)">
                <v-icon icon="mdi-keyboard-backspace" /> 
            </b-button>
            <h2 style="margin-left: 60px; font-family: 'Pretendard-Regular'; font-weight: 600;"> {{ roomOwner }}님의 구독 채팅방 </h2>
        </div>
        <div class="mx-auto rounded-lg overflow-y-auto overflow-x-hidden" 
            id="messages" ref="box" style="">
            <v-card-text>
                <v-container>
                    <div class="pt-2" v-for="(item, idx) in recvList" v-bind:key="idx">
                        <div class="v-col-7 rounded-lg pa-3" 
                            :class="[item.member.email === id ? 'ml-auto' : 'mr-auto']">
                            <v-card-text>
                                <v-row @click="remove(item, idx, $event)">
                                    <v-col cols="2" style="padding:0;">
                                        <div class="pl-3 pt-3" 
                                            style="color : #737373; font-size: 16px;" >
                                            <div>
                                                <div class="rounded-circle imgDiv">
                                                    <img class="rounded-circle" :src="'http://localhost:8181/chat/' + item.member.email"
                                                    @error="replaceProfile" style="width:30px; height: 30px;"/>
                                                </div>
                                            </div>
                                        </div>
                                    </v-col>
                                    <v-col align-self="center" cols="auto" style="padding: 0px">
                                        {{ item.member.nickname }}
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col class="py-1 my-1" >
                                        <div class="pl-6" 
                                            style="font-size: 16px; font-family: Pretendard-Regular;"> 
                                            {{ item.message }}
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </div>
                        <div class="v-col-7 pa-3" 
                            :class="[item.member.email === id ? 'ml-auto' : 'mr-auto']">
                            <v-row style="background-color: white;">
                                <v-col>
                                    <div class="text-right" 
                                        style="font-size: 14px; color:#737373"> 
                                        {{ item.sendTime }} 
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </v-container>
            </v-card-text>
        </div>
        <div class="py-5 mt-5 mx-auto rounded-lg">
            <!-- <v-text-field label="id" variant="solo" v-model="id"/> -->
            <v-text-field class="ma-auto" v-model="message" label="메세지 보내기" append-icon="mdi-send" 
            clear-icon="mdi-close-circle" clearable @click:clear="clearMessage"
            variant="outlined" @click:append="sendMessage" v-on:keyup="sendMessage"/>
        </div>
    </v-container>
</template>
<script lang="js">
import Stomp from 'webstomp-client'
import SockJS from 'sockjs-client' 
import img from '@/assets/image/profile.png'

window.addEventListener("contextmenu", e => e.preventDefault())

export default {
    name : "ChatRoom",
    data() {
        return {
            flag: true,
            preHeight : 0,
            roomNum : this.$route.query.roomNum,
            id :sessionStorage.getItem("loginId"),
            message: '',
            recvList:[],
            roomOwner : ''
        }
    },
    created : function() {
        let self = this
        let list = this.recvList
        self.$axios.get('http://localhost:8181/chat/joinroom', {params:{ roomNum : this.roomNum}})
        .then(function(ret) {
            self.roomOwner = ret.data.list[0].room.subscribeNum.email.nickname
            console.log(ret.data.list[0])
            for(let obj of ret.data.list) {
                let date = new Date(obj.sendTime)
                obj.sendTime = (date.getMonth() + 1) + "월 " 
                    + date.getDate()+ "일 "
                    + date.getHours() + "시 " 
                    + date.getMinutes() + "분" 
                list.push(obj)
            }
        })
        this.connect()
        
        
    }, methods: {
        sendMessage(e) {
            if(e.keyCode === 13 && this.id != '' && this.message !== '') {
                this.send()
                this.message = ''
            } else if(e.button === 0 && this.id != '' & this.message !== '') {
                this.send()
                this.message = ''
            }
        },
        send() {
            if(this.stompClient && this.stompClient.connected) {
                const msg = {
                    room : {
                        num : this.roomNum
                    },
                    member : { 
                        email : this.id
                    },
                    message : this.message,
                    sendTime : Date.now(),
                    isRequest:false
                }                

                this.stompClient.send("/receive", JSON.stringify(msg), {})
            }
        },
        connect() {
            const serverURL = "http://localhost:8181"
            let socket = new SockJS(serverURL)
            this.stompClient = Stomp.over(socket)
            console.log("소켓 연결을 시도합니다 서버 주소 : "+serverURL)
            this.stompClient.connect(
                {},
                frame => {
                    this.connected = true
                    console.log("소켓 연결 성공", frame)
                    this.stompClient.subscribe("/sub", res => {
                        console.log("구독 메세지 ", res.body)
                        let obj = JSON.parse(res.body)
                        let date = new Date(obj.sendTime)
                        obj.sendTime = (date.getMonth() + 1) + "월 " 
                            + date.getDate()+ "일 "
                            + date.getHours() + ":" 
                            + date.getMinutes() + " " 
                        // this.scrollToBottom()
                        this.recvList.push(obj)
                    })
                }, 
                error => {
                    console.log("소켓 연결 실패", error)
                    this.connected = false
                }
            )
        },
        clearMessage() {
            this.message = ''
        },

        replaceProfile(e) {
            e.target.src = img
        },
        
        remove(item, idx, e) {
            console.log(item)
            console.log(idx)
            console.log(e)
            console.log(item.member.email == this.id ? true : false)
        },  
    },
    watch : {
        recvList : {
            handler : function() {
                this.$nextTick(() => {
                    let div = document.querySelector("#messages")
                    div.scrollTop = div.scrollHeight
                })
                
            },
            deep : true
        }
    }, computed : {
        getTime : function(time){
            console.log(time)
            return time
        }
    }
}
</script>
<style scoped>
.send_message{
    width : 50%;
    
}

    .ml-auto {  
        background-color: #7AC6FF;
    }

    .mr-auto {
        background-color: #eaeaea;
    }

    #messages {
        width: 100%; 
        height: 450px; 
        padding: 10px;
        border: 1px solid #e8e8e8;
    }

    img {
        width : 54px;
        height : 54px;
        border-radius: 16px;
    }

    .imgDiv {
        background-color: white; 
        width:36px; 
        height: 36px; 
        display: flex; 
        align-items: center; 
        justify-content: center;
    }
</style>