<template lang="">
    <div>
        
    </div>
</template>
<script>
export default {
    name: 'kakao',
    data(){
        return{
        code: this.$route.query.code
        }
    },
    mounted(){
      console.log(this.code)
      this.$axios.get("http://localhost:8181/api/kakao/token", {headers:{"authorization_code":this.code}})
      .then(function(res){
        console.log(res.data)
      })

      
    
  }
  
}
</script>
<style lang="">
    
</style>