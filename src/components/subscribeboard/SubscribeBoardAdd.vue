<template lang="">
    <div>
        <h1> 글 등록 </h1>
        <input type="text" name="email" v-model="email" placeholder="이메일">
        <input type="text" name="title" v-model="title" placeholder="제목">
        <input type="text" name="site" v-model="site" placeholder="site">
        <input type="number" name="total_point" v-model="total_point" placeholder="total_point">
        <input type="number" name="total_people" v-model="total_people" placeholder="total_people">
        <!-- register date 는 sysdate -->
        <!-- <input type="date" name="register_date" v-model="register_date" placeholder="register_date"> -->
        <!-- <input type="date" name="recruit_endperiod" v-model="recruit_endperiod" placeholder="recruit_endperiod"> -->
        <input type="date" name="payment_date" v-model="payment_date" placeholder="payment_date">
        <!-- <input type="date" name="subscribe_startdate" v-model="subscribe_startdate" placeholder="subscribe_startdate"> -->
        <!-- <input type="date" name="subscribe_enddate" v-model="subscribe_enddate" placeholder="subscribe_enddate"> -->
        <button v-on:click="add">글 등록하기 </button> 
    </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
    
    name: 'SubscribeBoardAdd',

    component(){
        dayjs
    },
    data() {
        return {
            email: 'qwer', //sessionStorage.getItem('loginId')
            title: '',
            site: '',
            total_point: 0,
            total_people: 0,
            // register_date: null,
            // recruit_endperiod: null,
            payment_date: dayjs().format("YYYY/MM/DD"),
            // subscribe_startdate: null,
            // subscribe_enddate: null
        }
    },
    methods: {
        add() {
            const self = this;
            let formdata = new FormData();
            formdata.append('email', self.email)
            formdata.append('title', self.title)
            formdata.append('site', self.site)
            formdata.append('total_point', self.total_point)
            formdata.append('total_people', self.total_people)
            // formdata.append('register_date',self.register_date)
            // formdata.append('recruit_endperiod',self.recruit_endperiod)
            formdata.append('payment_date', self.payment_date)
        // formdata.append('subscribe_startdate',self.subscribe_startdate)
        // formdata.append('subscribe_startdate',self.subscribe_startdate)
        // formdata.append('subscribe_enddate',self.subscribe_enddate)

        self.$axios.post('http://localhost:8181/subscribeboard', formdata)
            .then(function (res) {
                if (res.status == 200) {
                    let dto = res.data.dto2
                    alert(dto.id + " 글이 등록되었습니다.")
                } else {
                    alert('에러코드:' + res.status)
                }
            })
    
        }
    }
}

</script>
<style lang="">
    
</style>