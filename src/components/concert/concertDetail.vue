<template lang="">
    <div>
        concertDetail 입니다
    </div>
</template>
<script>
export default {
    name: 'concertdetail',
    data() {
        return {
            id : ''
        }
    }, 
    
    created () {
        this.id = this.$route.query.id
        const self = this
        self.$axios('http://localhost:8181/concert/detail/'+this.id)
        .then((result) => {
            console.log(result.data)
        }).catch((err) => {
            console.log("error : "+err)    
        });
    }
}
</script>
<style lang="">
    
</style>