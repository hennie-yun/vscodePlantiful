<template lang="">
    <div>
        <div class="container text-center">
       
            <div class="grid text-center">
                <h1> 구독 공유 시작하기 </h1>
            </div>
            <div class="row"> 
                <div class="col">넷플릭스</div>
                <div class="col">왓챠</div>
                <div class="col">티빙</div>
                <div class="col">웨이브</div>
                <div class="col-2">디즈니플러스</div>
                <div class="col-2">프라임 비디오</div>
            </div>
        </div>  
        <h3><router-link to="/SubscribeBoardAdd">글 등록</router-link>  </h3>
    </div>
    
</template>
<script>
export default {
    name: 'App',
    components: {
    },
    filters:{
        yyyyMMdd: function(value){
            if(value == '') return '';

            var js_date = new Date(value);

            var year = js_date.getFullYear();
            var month = js_date.getMonth()+1;
            var day = js_date.getDate();

            if (month <10){
                month = '0' + month;
            }
            if (day <10){
                day = '0' + day;
            }

            return year + '-' + month + '-' + day;
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