<template lang="">
    <div>
        <h1> 글 등록 </h1>
        <input type="text" name="email" v-model="email">
        <input type="text" name="title" v-model="title">
        <input type="text" name="site" v-model="site">
        <input type="text" name="total_point" v-model="total_point">
        <input type="text" name="total_people" v-model="total_people">
        <!-- register date 는 sysdate -->
        <input type="text" name="recruit_endperiod" v-model="recruit_endperiod">
        <input type="text" name="payment_date" v-model="payment_date">
        <input type="text" name="subscribe_startdate" v-model="subscribe_startdate">
        <input type="text" name="subscribe_enddate" v-model="subscribe_enddate">
        
    </div>
</template>
<script>
export default {
    name: 'SubscribeBoardAdd',
    data(){
        return {
            email: 'qwer',
            title: '',
            site: '',
            total_point: 0,
            total_people: 0,
            register_date: null,
            recruit_endperiod: null,
            payment_date: null,
            subscribe_startdate: null,
            subscribe_enddate: null
        }
    }
}
</script>
<style lang="">
    
</style>