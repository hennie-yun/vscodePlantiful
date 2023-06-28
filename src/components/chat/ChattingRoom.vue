<template>
    <v-container>
        <div>
            <b-button class="float-left" variant="outline-secondary" @click="$router.go(-1)">
                <v-icon icon="mdi-keyboard-backspace" /> 
            </b-button>
            <h1>asd</h1>
        </div>
        <div class="mx-auto rounded-lg elevation-3" id="messages" ref="box" style="border-radius: 1px;">
            <v-card-text>
                <v-container>
                    <div class="mt-12" v-for="(item, idx) in recvList" v-bind:key="idx">
                        <div class="col-5 rounded-lg elevation-1" max-width="400" :class="[item.member.email === id ? 'ml-auto' : 'mr-auto']">
                            <v-card-text>
                                <v-row>
                                    <v-col style="padding:0;">
                                        <div class="text-left pl-6" style="color : #737373; font-size: 16px;" v-on:click="remove(item, idx)">
                                            {{ item.member.nickname }}
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col style="padding:0;">
                                        <div class="text-left pl-6 fs-5" > {{ item.message }}</div>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col style="padding:0;">
                                        <div class="text-right pr-3" style="font-size: 14px; color:#737373"> {{ item.sendTime }} </div>
                                    </v-col>
                                </v-row>

                            </v-card-text>
                        </div>
                    </div>
                </v-container>
            </v-card-text>
        </div>
        <v-container class="pa-5 mt-12 mx-auto rounded-lg" style="background-color: #7AC6FF;">
            <!-- <v-text-field label="id" variant="solo" v-model="id"/> -->
            <v-text-field class="ma-auto" v-model="message" label="메세지 보내기" append-icon="mdi-send" 
            clear-icon="mdi-close-circle" clearable @click:clear="clearMessage"
            variant="solo" @click:append="sendMessage" v-on:keyup="sendMessage"/>

        </v-container>
    </v-container>
</template>
<script lang="js">
import Stomp from 'webstomp-client'
import SockJS from 'sockjs-client' 

export default {
    name : "ChatRoom",
    data() {
        return {
            flag: true,
            preHeight : 0,
            roomNum : this.$route.query.roomNum,
            id :sessionStorage.getItem("loginId"),
            message: '',
            recvList:[]
        }
    },
    created : function() {
        let self = this
        let list = this.recvList
        self.$axios.get('http://localhost:8181/chat/joinroom', {params:{roomNum : this.roomNum}})
        .then(function(ret) {
            for(let obj of ret.data.list) {
                let date = new Date(obj.sendTime)
                obj.sendTime = date.getMonth() + "월 " 
                    + date.getDay() + "일 " 
                    + date.getHours() + "시 " 
                    + date.getSeconds() + "분" 
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
                        obj.sendTime = date.getMonth() + "월 " 
                        + date.getDay() + "일 " 
                        + date.getHours() + "시 " 
                        + date.getSeconds() + "분" 
                        this.recvList.push(obj)
                        // this.scrollToBottom()
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
        remove(item, idx) {
            alert(item)
            alert(idx)
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
<style>
    .ml-auto {  
        background-color: #7AC6FF;
    }

    .mr-auto {
        background-color: blanchedalmond;
    }

    #messages {
        overflow-x: hidden; 
        overflow-y: auto; 
        width: 100%; 
        height: 450px; 
        padding: 10px;
    }
</style>