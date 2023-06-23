<!-- 구독 그룹별 파티 인원 -->
<template lang="">
    <div>
        <div v-for="order in list" :key="order.party">
            <div class="col">
            {{ order.party }}
            </div>
            <!-- {{ order.email.email }}
            {{ order.subscribe_num.subscribeNum }} -->
        </div>

    </div>
</template>
<script>

export default {
    name: 'SubscribePartyDetail',
    data() {
        return {
            list: []
        }
    },
    created: function () {
        this.subscribe_num = this.$route.query.subscribe_num;
        const self = this;
        alert('partynum' + self.subscribe_num)
        // subnum에 속한 party 전체 검색
        self.$axios.get('http://localhost:8181/subscribeparty/party/' + self.subscribe_num) //비동기 요청
            .then(function (res) {
                if (res.status == 200) {
                    self.list = res.data.list
                    console.log(self.list)
                } else {
                    alert('에러코드:' + res.status)
                }
            })
    }
}
</script>
<style lang="">
    
</style>