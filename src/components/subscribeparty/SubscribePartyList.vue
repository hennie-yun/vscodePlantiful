<!-- 그룹별 파티 인원 -->
<template lang="">
    <div>
        
    </div>
</template>
<script>

export default {
    name: 'SubscribePartyList',
    created: function(){
        const self = this;
        let loginId = sessionStorage.getItem('loginId')
        self.$axios.get('http://localhost:8181/subscribeparty/party/'+self.subscribe_num) //비동기 요청

            .then(function (res) {
                if (res.status == 200) {
                    self.list = res.data.list
                } else {
                    alert('에러코드:' + res.status)
                }
            })
    },
    data() {

    }
}
</script>
<style lang="">
    
</style>