<template lang="">
        <div class="container text-center">
       
            <div class="grid text-center">
                <h1> 구독 공유 시작하기 </h1>
            </div>
            <div class="row"> 
                <div class="col">전체보기</div>
                <div class="col">넷플릭스</div>
                <div class="col">왓챠</div>
                <div class="col">티빙</div>
                <div class="col">웨이브</div>
                <div class="col-2">디즈니플러스</div>
                <div class="col-2">프라임 비디오</div>
            </div>
        </div>  
        <div class="container text-right">
            <button>
                <router-link to="/SubscribeBoardAdd">
                    <button class="btn">글 등록</button>
                </router-link>
            </button>
            <button>
                <router-link to="/SubscribeBoardMyList">
                    <button class="btn">내 구독 목록</button>
                </router-link>
            </button>
        </div>
        <div class="">
            <div class="row">
                <div class="col">
                    글 번호
                </div>
                <div class="col">
                    사이트
                </div>
                <div class="col">
                    이름
                </div>
                <div class="col">
                    작성자
                </div>
                <div class="col">
                    모집 현황
                </div>
            </div>
            
            
                <div class="row" v-for="order in list" :key="order.subscribe_num" v-on:click="detail(order.subscribe_num)">
                    <div class="col">
                        {{order.subscribe_num}}
                    </div>
                    <div class="col">
                        {{order.site}}
                    </div>
                    <div class="col">
                        {{order.title}}
                    </div>
                    <div class="col">
                        {{order.email.email}}
                    </div>
                    <div class="col">
                        (모집된 인원) / {{order.total_people}}
                    </div>
            </div>
        </div>
            
</template>
<script>
export default {
    name: 'SubscribeBoardList',
    components: {
    },
    data() {
        return {
            list: []
        }
    },
    created: function () { //한번 실행
        const self = this;
        let loginId = sessionStorage.getItem('loginId')
        self.$axios.get('http://localhost:8181/subscribeboard') //비동기 요청

            .then(function (res) {
                if (res.status == 200) {
                    self.list = res.data.list
                } else {
                    alert('에러코드:' + res.status)
                }
            })
    },
    methods: {
        detail(subscribe_num) {
            this.$router.push({ name: 'SubscribeBoardDetail', query: { subscribe_num: subscribe_num } })
        },
        mylist(email){
            this.$router.push({ name: 'SubscribeBoardMyList', query: { email: email.email } })
        }
    }
}

</script>
 
<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>