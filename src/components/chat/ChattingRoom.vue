<template>
    <v-container>
        <v-btn @click="$router.go(-1)">
            <v-icon icon="mdi-keyboard-backspace" /> 
        </v-btn>
        <h1>채팅</h1>
         <v-card class="mt-2" id="messages" ref="box">
            <v-card-text>
                <v-container>
                    <div class="mt-12" v-for="(item, idx) in recvList" v-bind:key="idx">
                        <v-card class="mt-2 mb-2" max-width="400" :class="[item.member.email === id ? 'ml-auto' : 'mr-auto']">
                            <v-card-text>
                                <div v-on:click="remove(item, idx)">
                                    ID : {{ item.member.email }}
                                </div>
                                <div v-on:click="remove(item, idx)">
                                    NICKNAME : {{ item.member.nickname }}
                                </div>
                                <div>MESSAGE : {{ item.message }}</div>
                                <div>
                                    Time : {{ item.sendTime }}
                                </div>
                            </v-card-text>
                        </v-card>
                    </div>
                </v-container>
            </v-card-text>
        </v-card>
        <v-container class="mt-12" style="background-color: #7AC6FF;">
            <v-text-field label="id" variant="solo" v-model="id"/>
            <v-text-field v-model="message" label="message" append-icon="mdi-send" 
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
            id :'',
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
                console.log(date)
                obj.sendTime = date.getMonth() + "월 " 
                + date.getDay() + "일 " + date.getHours() + "시 " 
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
                        this.recvList.push(JSON.parse(res.body))
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
        goBack() {
           alert("goBack") 
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