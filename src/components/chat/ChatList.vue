<template>
    <v-container>
        <h1>채팅</h1>
         <v-card class="mt-2" id="messages" ref="box">
            <v-card-text>
                <v-container>
                    <div class="mt-12" v-for="(item, idx) in roomList" v-bind:key="idx">
                        <v-card class="mt-2 mb-2" max-width="100%" @click="goRoom(item.num)">
                            <v-card-text>
                                <div>
                                    {{ item.num }}
                                </div>
                                <div>
                                    {{ item.lastMsg }}
                                </div>
                            </v-card-text>
                        </v-card>
                    </div>
                </v-container>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
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
        }
    }, created : function() {
        let self = this
        let list = this.roomList
        self.$axios.get("http://localhost:8181/chat/roomlist", {params : {email : this.loginId}})
        .then((ret) => {
            for(let obj of ret.data.list) {
                list.push(obj)
            }
        }).catch((error) => {
            console.log("error : " +error)
        })
    }
}
</script>
<style>

</style>